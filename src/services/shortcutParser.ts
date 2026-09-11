/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cleanUrl, extractDomain } from './catalog';

export interface ParsedShortcut {
  url: string;
  name?: string;
  sourceType: 'browser-padlock' | 'bookmark-link' | 'shortcut-file' | 'plain-text';
  fileName?: string;
}

/**
 * Parses files (.url, .webloc, .desktop, .html, .txt) dropped from Desktop or File Manager
 */
export async function parseDroppedFile(file: File): Promise<ParsedShortcut | null> {
  const fileName = file.name.toLowerCase();

  try {
    const content = await file.text();

    // 1. Windows Internet Shortcut (.url)
    if (fileName.endsWith('.url')) {
      const urlMatch = content.match(/URL=(https?:\/\/[^\r\n]+)/i) || content.match(/URL=([^\r\n]+)/i);
      if (urlMatch && urlMatch[1]) {
        const rawUrl = urlMatch[1].trim();
        const baseName = file.name.replace(/\.url$/i, '');
        return {
          url: cleanUrl(rawUrl),
          name: baseName,
          sourceType: 'shortcut-file',
          fileName: file.name,
        };
      }
    }

    // 2. macOS Web Bookmark (.webloc)
    if (fileName.endsWith('.webloc')) {
      // Typically XML plist: <string>https://...</string>
      const plistMatch = content.match(/<string>(https?:\/\/[^<]+)<\/string>/i);
      if (plistMatch && plistMatch[1]) {
        const baseName = file.name.replace(/\.webloc$/i, '');
        return {
          url: cleanUrl(plistMatch[1].trim()),
          name: baseName,
          sourceType: 'shortcut-file',
          fileName: file.name,
        };
      }
    }

    // 3. Linux Desktop Entry (.desktop)
    if (fileName.endsWith('.desktop')) {
      const urlMatch = content.match(/URL=(https?:\/\/[^\r\n]+)/i) || content.match(/URL=([^\r\n]+)/i);
      const nameMatch = content.match(/Name=([^\r\n]+)/i);
      if (urlMatch && urlMatch[1]) {
        return {
          url: cleanUrl(urlMatch[1].trim()),
          name: nameMatch ? nameMatch[1].trim() : file.name.replace(/\.desktop$/i, ''),
          sourceType: 'shortcut-file',
          fileName: file.name,
        };
      }
    }

    // 4. HTML Bookmark or Webpage (.html / .htm)
    if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const firstLink = doc.querySelector('a[href^="http"]');
      if (firstLink) {
        const href = firstLink.getAttribute('href');
        if (href) {
          return {
            url: cleanUrl(href),
            name: firstLink.textContent?.trim() || doc.title || file.name.replace(/\.html?$/i, ''),
            sourceType: 'shortcut-file',
            fileName: file.name,
          };
        }
      }
    }

    // 5. Plain text or raw file containing a URL
    const urlRegex = /(https?:\/\/[^\s"'<>\\]+)/i;
    const generalMatch = content.match(urlRegex);
    if (generalMatch && generalMatch[1]) {
      return {
        url: cleanUrl(generalMatch[1]),
        name: file.name.replace(/\.[^/.]+$/, ''),
        sourceType: 'shortcut-file',
        fileName: file.name,
      };
    }
  } catch (err) {
    console.warn('Error reading dropped file:', err);
  }

  return null;
}

/**
 * Parses drag dataTransfer items (browser padlock icon, bookmarks bar link, or highlighted link)
 */
export async function parseDroppedData(dataTransfer: DataTransfer): Promise<ParsedShortcut | null> {
  // A. Check for dropped Files first (e.g. dragging .url or .webloc from desktop/folders)
  if (dataTransfer.files && dataTransfer.files.length > 0) {
    const file = dataTransfer.files[0];
    const parsedFile = await parseDroppedFile(file);
    if (parsedFile) return parsedFile;
  }

  // B. Check for HTML link (dragging from Bookmarks bar or webpage link usually has text/html with <a href="...">)
  const htmlData = dataTransfer.getData('text/html');
  if (htmlData) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, 'text/html');
      const link = doc.querySelector('a');
      if (link) {
        const href = link.getAttribute('href');
        const text = link.textContent?.trim() || link.getAttribute('title')?.trim();
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
          return {
            url: cleanUrl(href),
            name: text || extractDomain(href),
            sourceType: 'bookmark-link',
          };
        }
      }
    } catch {
      // Fallback to plain URL extraction
    }
  }

  // C. Check text/uri-list (standard RFC format for URL drag & drop in browsers)
  const uriList = dataTransfer.getData('text/uri-list');
  if (uriList) {
    const lines = uriList.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && (trimmed.startsWith('http://') || trimmed.startsWith('https://'))) {
        return {
          url: cleanUrl(trimmed),
          sourceType: 'browser-padlock',
        };
      }
    }
  }

  // D. Check text/plain (direct address bar text or dragged link text)
  const plainText = dataTransfer.getData('text/plain') || dataTransfer.getData('Text');
  if (plainText) {
    const trimmed = plainText.trim();
    // Check if it looks like a URL
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('www.') ||
      /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)
    ) {
      return {
        url: cleanUrl(trimmed),
        sourceType: 'plain-text',
      };
    }

    // Try finding any URL inside the text
    const urlMatch = trimmed.match(/(https?:\/\/[^\s"'<>\\]+)/i);
    if (urlMatch && urlMatch[1]) {
      return {
        url: cleanUrl(urlMatch[1]),
        sourceType: 'plain-text',
      };
    }
  }

  return null;
}
