import { Category, Connection, GraphSettings, HistoryItem, Network, Website } from '../types';

const STORAGE_KEYS = {
  WEBSITES: 'nexusweb_websites_v1',
  NETWORKS: 'nexusweb_networks_v1',
  CONNECTIONS: 'nexusweb_connections_v1',
  SETTINGS: 'nexusweb_settings_v1',
  HISTORY: 'nexusweb_history_v1',
};

export const DEFAULT_NETWORKS: Network[] = [
  {
    id: 'net-all',
    name: 'All Networks',
    description: 'Unified global visual graph encompassing all organized digital nodes.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    color: '#ef4444',
    icon: 'Network',
  },
  {
    id: 'net-dev',
    name: 'Development',
    description: 'Core software engineering, code repositories, frameworks, and tools.',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    color: '#3b82f6',
    icon: 'Code2',
  },
  {
    id: 'net-sec',
    name: 'Cybersecurity',
    description: 'Offensive security, vulnerability research, penetration testing, and labs.',
    createdAt: '2026-01-03T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
    color: '#dc2626',
    icon: 'ShieldAlert',
  },
  {
    id: 'net-ai',
    name: 'AI Tools',
    description: 'Generative AI models, neural APIs, research playgrounds, and agents.',
    createdAt: '2026-01-04T00:00:00.000Z',
    updatedAt: '2026-01-04T00:00:00.000Z',
    color: '#a855f7',
    icon: 'Brain',
  },
  {
    id: 'net-des',
    name: 'Design & UI',
    description: 'Vector prototyping, inspiration boards, palettes, and visual design assets.',
    createdAt: '2026-01-05T00:00:00.000Z',
    updatedAt: '2026-01-05T00:00:00.000Z',
    color: '#f97316',
    icon: 'Palette',
  },
];

export const INITIAL_WEBSITES: Website[] = [
  // Development
  {
    id: 'w-github',
    name: 'GitHub',
    url: 'https://github.com',
    domain: 'github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=64',
    description: 'Code hosting platform for version control and collaboration.',
    category: 'Development',
    subcategory: 'Code Hosting & Collaboration',
    tags: ['Git', 'Code', 'OpenSource', 'Repository'],
    networkId: 'net-dev',
    isFavorite: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
    lastVisited: '2026-03-11T08:15:00.000Z',
    customConnections: ['w-gitlab', 'w-stackoverflow', 'w-flutter'],
  },
  {
    id: 'w-gitlab',
    name: 'GitLab',
    url: 'https://gitlab.com',
    domain: 'gitlab.com',
    favicon: 'https://www.google.com/s2/favicons?domain=gitlab.com&sz=64',
    description: 'DevOps lifecycle tool with repository management and CI/CD pipelines.',
    category: 'Development',
    subcategory: 'DevOps & CI/CD',
    tags: ['Git', 'DevOps', 'CI/CD'],
    networkId: 'net-dev',
    isFavorite: false,
    createdAt: '2026-03-01T11:00:00.000Z',
    updatedAt: '2026-03-01T11:00:00.000Z',
    customConnections: ['w-github'],
  },
  {
    id: 'w-stackoverflow',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    domain: 'stackoverflow.com',
    favicon: 'https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=64',
    description: 'Largest community for programmers to learn, solve code problems, and share knowledge.',
    category: 'Development',
    subcategory: 'Developer Community',
    tags: ['Community', 'Debugging', 'Q&A'],
    networkId: 'net-dev',
    isFavorite: true,
    createdAt: '2026-03-02T09:00:00.000Z',
    updatedAt: '2026-03-02T09:00:00.000Z',
    lastVisited: '2026-03-10T14:30:00.000Z',
    customConnections: ['w-github'],
  },
  {
    id: 'w-flutter',
    name: 'Flutter',
    url: 'https://flutter.dev',
    domain: 'flutter.dev',
    favicon: 'https://www.google.com/s2/favicons?domain=flutter.dev&sz=64',
    description: 'Multi-platform UI framework natively compiled from a single Dart codebase.',
    category: 'Development',
    subcategory: 'Cross-Platform Framework',
    tags: ['Dart', 'Mobile', 'Google', 'UI'],
    networkId: 'net-dev',
    isFavorite: true,
    createdAt: '2026-03-02T12:00:00.000Z',
    updatedAt: '2026-03-02T12:00:00.000Z',
    customConnections: ['w-dart'],
  },
  {
    id: 'w-dart',
    name: 'Dart',
    url: 'https://dart.dev',
    domain: 'dart.dev',
    favicon: 'https://www.google.com/s2/favicons?domain=dart.dev&sz=64',
    description: 'Client-optimized language for fast apps on any platform powering Flutter.',
    category: 'Programming',
    subcategory: 'Language',
    tags: ['Language', 'Dart', 'Flutter'],
    networkId: 'net-dev',
    isFavorite: false,
    createdAt: '2026-03-02T12:30:00.000Z',
    updatedAt: '2026-03-02T12:30:00.000Z',
    customConnections: ['w-flutter'],
  },
  {
    id: 'w-react',
    name: 'React',
    url: 'https://react.dev',
    domain: 'react.dev',
    favicon: 'https://www.google.com/s2/favicons?domain=react.dev&sz=64',
    description: 'Library for building modern composable user interfaces with reactive state.',
    category: 'Development',
    subcategory: 'Frontend UI',
    tags: ['React', 'JavaScript', 'Frontend'],
    networkId: 'net-dev',
    isFavorite: true,
    createdAt: '2026-03-03T10:00:00.000Z',
    updatedAt: '2026-03-03T10:00:00.000Z',
    customConnections: ['w-nextjs', 'w-tailwind'],
  },
  {
    id: 'w-nextjs',
    name: 'Next.js',
    url: 'https://nextjs.org',
    domain: 'nextjs.org',
    favicon: 'https://www.google.com/s2/favicons?domain=nextjs.org&sz=64',
    description: 'The React Framework for high-performance server-rendered web applications.',
    category: 'Development',
    subcategory: 'Full-Stack Framework',
    tags: ['Next.js', 'React', 'SSR', 'Vercel'],
    networkId: 'net-dev',
    isFavorite: false,
    createdAt: '2026-03-03T11:00:00.000Z',
    updatedAt: '2026-03-03T11:00:00.000Z',
    customConnections: ['w-react', 'w-vercel'],
  },
  {
    id: 'w-tailwind',
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    domain: 'tailwindcss.com',
    favicon: 'https://www.google.com/s2/favicons?domain=tailwindcss.com&sz=64',
    description: 'Rapidly build modern websites without ever leaving your HTML.',
    category: 'Development',
    subcategory: 'CSS Styling',
    tags: ['CSS', 'Utility', 'Styling'],
    networkId: 'net-dev',
    isFavorite: true,
    createdAt: '2026-03-03T14:00:00.000Z',
    updatedAt: '2026-03-03T14:00:00.000Z',
    customConnections: ['w-react'],
  },

  // Cybersecurity
  {
    id: 'w-owasp',
    name: 'OWASP',
    url: 'https://owasp.org',
    domain: 'owasp.org',
    favicon: 'https://www.google.com/s2/favicons?domain=owasp.org&sz=64',
    description: 'Open Worldwide Application Security Project setting top web standards.',
    category: 'Cybersecurity',
    subcategory: 'Security Standards',
    tags: ['AppSec', 'Standards', 'Top10', 'Vulnerabilities'],
    networkId: 'net-sec',
    isFavorite: true,
    createdAt: '2026-03-04T08:00:00.000Z',
    updatedAt: '2026-03-04T08:00:00.000Z',
    lastVisited: '2026-03-11T07:45:00.000Z',
    customConnections: ['w-portswigger', 'w-tryhackme', 'w-hackthebox'],
  },
  {
    id: 'w-portswigger',
    name: 'PortSwigger',
    url: 'https://portswigger.net',
    domain: 'portswigger.net',
    favicon: 'https://www.google.com/s2/favicons?domain=portswigger.net&sz=64',
    description: 'Makers of Burp Suite and leading Web Security Academy research.',
    category: 'Cybersecurity',
    subcategory: 'Web Pentesting & Tools',
    tags: ['BurpSuite', 'WebSec', 'Exploits', 'Academy'],
    networkId: 'net-sec',
    isFavorite: true,
    createdAt: '2026-03-04T09:00:00.000Z',
    updatedAt: '2026-03-04T09:00:00.000Z',
    customConnections: ['w-owasp', 'w-tryhackme'],
  },
  {
    id: 'w-tryhackme',
    name: 'TryHackMe',
    url: 'https://tryhackme.com',
    domain: 'tryhackme.com',
    favicon: 'https://www.google.com/s2/favicons?domain=tryhackme.com&sz=64',
    description: 'Hands-on cybersecurity training through browser-based vulnerable labs.',
    category: 'Cybersecurity',
    subcategory: 'Hands-on Security Labs',
    tags: ['Cybersecurity', 'CTF', 'Labs', 'Training'],
    networkId: 'net-sec',
    isFavorite: true,
    createdAt: '2026-03-04T10:00:00.000Z',
    updatedAt: '2026-03-04T10:00:00.000Z',
    customConnections: ['w-hackthebox', 'w-portswigger'],
  },
  {
    id: 'w-hackthebox',
    name: 'Hack The Box',
    url: 'https://hackthebox.com',
    domain: 'hackthebox.com',
    favicon: 'https://www.google.com/s2/favicons?domain=hackthebox.com&sz=64',
    description: 'Gamified cybersecurity training platform and simulated enterprise environments.',
    category: 'Cybersecurity',
    subcategory: 'Offensive Labs & CTF',
    tags: ['Penetration Testing', 'Labs', 'CTF', 'Infosec'],
    networkId: 'net-sec',
    isFavorite: false,
    createdAt: '2026-03-04T11:00:00.000Z',
    updatedAt: '2026-03-04T11:00:00.000Z',
    customConnections: ['w-tryhackme', 'w-owasp'],
  },

  // AI
  {
    id: 'w-openai',
    name: 'OpenAI',
    url: 'https://openai.com',
    domain: 'openai.com',
    favicon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=64',
    description: 'AI research and deployment company behind GPT-4 and ChatGPT.',
    category: 'AI',
    subcategory: 'Frontier AI Research',
    tags: ['LLM', 'ChatGPT', 'GenerativeAI'],
    networkId: 'net-ai',
    isFavorite: true,
    createdAt: '2026-03-05T08:00:00.000Z',
    updatedAt: '2026-03-05T08:00:00.000Z',
    lastVisited: '2026-03-11T06:20:00.000Z',
    customConnections: ['w-huggingface', 'w-claude'],
  },
  {
    id: 'w-huggingface',
    name: 'Hugging Face',
    url: 'https://huggingface.co',
    domain: 'huggingface.co',
    favicon: 'https://www.google.com/s2/favicons?domain=huggingface.co&sz=64',
    description: 'The AI community building open weights models, datasets, and ML spaces.',
    category: 'AI',
    subcategory: 'Open ML Models',
    tags: ['OpenSource', 'Models', 'Transformers', 'PyTorch'],
    networkId: 'net-ai',
    isFavorite: true,
    createdAt: '2026-03-05T09:00:00.000Z',
    updatedAt: '2026-03-05T09:00:00.000Z',
    customConnections: ['w-openai'],
  },
  {
    id: 'w-claude',
    name: 'Claude AI',
    url: 'https://claude.ai',
    domain: 'claude.ai',
    favicon: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=64',
    description: 'Anthropic next-generation conversational AI assistant with deep analytical depth.',
    category: 'AI',
    subcategory: 'AI Assistant',
    tags: ['Anthropic', 'Reasoning', 'Assistant'],
    networkId: 'net-ai',
    isFavorite: false,
    createdAt: '2026-03-05T10:00:00.000Z',
    updatedAt: '2026-03-05T10:00:00.000Z',
    customConnections: ['w-openai'],
  },

  // Design & Productivity & Cloud
  {
    id: 'w-figma',
    name: 'Figma',
    url: 'https://figma.com',
    domain: 'figma.com',
    favicon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=64',
    description: 'Collaborative vector interface design tool connecting teams in real-time.',
    category: 'Design',
    subcategory: 'UI/UX Prototyping',
    tags: ['UI/UX', 'Design', 'Prototyping'],
    networkId: 'net-des',
    isFavorite: true,
    createdAt: '2026-03-06T09:00:00.000Z',
    updatedAt: '2026-03-06T09:00:00.000Z',
    lastVisited: '2026-03-10T16:00:00.000Z',
  },
  {
    id: 'w-notion',
    name: 'Notion',
    url: 'https://notion.so',
    domain: 'notion.so',
    favicon: 'https://www.google.com/s2/favicons?domain=notion.so&sz=64',
    description: 'Connected workspace for wiki documentation, project management, and databases.',
    category: 'Productivity',
    subcategory: 'All-in-One Workspace',
    tags: ['Notes', 'Workspace', 'Docs', 'PKM'],
    networkId: 'net-dev',
    isFavorite: true,
    createdAt: '2026-03-06T10:00:00.000Z',
    updatedAt: '2026-03-06T10:00:00.000Z',
    customConnections: ['w-obsidian'],
  },
  {
    id: 'w-obsidian',
    name: 'Obsidian',
    url: 'https://obsidian.md',
    domain: 'obsidian.md',
    favicon: 'https://www.google.com/s2/favicons?domain=obsidian.md&sz=64',
    description: 'A sharp, extensible knowledge base operating on a local folder of Markdown files.',
    category: 'Productivity',
    subcategory: 'Knowledge Graph',
    tags: ['Markdown', 'PKM', 'Graph', 'SecondBrain'],
    networkId: 'net-dev',
    isFavorite: true,
    createdAt: '2026-03-06T11:00:00.000Z',
    updatedAt: '2026-03-06T11:00:00.000Z',
    customConnections: ['w-notion'],
  },
  {
    id: 'w-supabase',
    name: 'Supabase',
    url: 'https://supabase.com',
    domain: 'supabase.com',
    favicon: 'https://www.google.com/s2/favicons?domain=supabase.com&sz=64',
    description: 'Open source Firebase alternative with PostgreSQL database, auth, and realtime APIs.',
    category: 'Cloud',
    subcategory: 'Database & Backend',
    tags: ['PostgreSQL', 'Auth', 'Backend', 'Database'],
    networkId: 'net-dev',
    isFavorite: true,
    createdAt: '2026-03-07T08:00:00.000Z',
    updatedAt: '2026-03-07T08:00:00.000Z',
    customConnections: ['w-vercel', 'w-react'],
  },
  {
    id: 'w-vercel',
    name: 'Vercel',
    url: 'https://vercel.com',
    domain: 'vercel.com',
    favicon: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=64',
    description: 'Platform for frontend developers, providing instantaneous global deployment.',
    category: 'Cloud',
    subcategory: 'Deployment & Edge',
    tags: ['Deployment', 'Next.js', 'Edge', 'Serverless'],
    networkId: 'net-dev',
    isFavorite: false,
    createdAt: '2026-03-07T09:00:00.000Z',
    updatedAt: '2026-03-07T09:00:00.000Z',
    customConnections: ['w-nextjs', 'w-supabase'],
  },
];

export const DEFAULT_SETTINGS: GraphSettings = {
  nodeSize: 18,
  connectionThickness: 1.2,
  forceDensity: 1.0,
  showLabels: true,
  showCategories: true,
  physicsEnabled: true,
  spiderWebParticles: true,
  openInNewTab: true,
  autoCategorization: true,
  autoConnections: true,
  defaultLayout: 'force',
};

export const StorageService = {
  getWebsites(): Website[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEBSITES);
      if (!data) {
        this.saveWebsites(INITIAL_WEBSITES);
        return INITIAL_WEBSITES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_WEBSITES;
    }
  },

  saveWebsites(websites: Website[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WEBSITES, JSON.stringify(websites));
    } catch (e) {
      console.error('Failed to persist websites to localStorage:', e);
    }
  },

  getNetworks(): Network[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NETWORKS);
      if (!data) {
        this.saveNetworks(DEFAULT_NETWORKS);
        return DEFAULT_NETWORKS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_NETWORKS;
    }
  },

  saveNetworks(networks: Network[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NETWORKS, JSON.stringify(networks));
    } catch (e) {
      console.error('Failed to persist networks to localStorage:', e);
    }
  },

  getSettings(): GraphSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: GraphSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to persist settings:', e);
    }
  },

  getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addHistory(website: Website): void {
    try {
      const current = this.getHistory();
      const newItem: HistoryItem = {
        id: 'hist-' + Date.now(),
        websiteId: website.id,
        websiteName: website.name,
        url: website.url,
        category: website.category,
        timestamp: new Date().toISOString(),
      };
      // Keep unique recent 50
      const filtered = [newItem, ...current.filter((h) => h.websiteId !== website.id)].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to log history item:', e);
    }
  },

  saveHistory(history: HistoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to persist history:', e);
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  },

  exportData(): string {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      websites: this.getWebsites(),
      networks: this.getNetworks(),
      settings: this.getSettings(),
      history: this.getHistory(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.websites)) {
        this.saveWebsites(parsed.websites);
      }
      if (Array.isArray(parsed.networks)) {
        this.saveNetworks(parsed.networks);
      }
      if (parsed.settings) {
        this.saveSettings(parsed.settings);
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  resetToDefault(): void {
    this.saveWebsites(INITIAL_WEBSITES);
    this.saveNetworks(DEFAULT_NETWORKS);
    this.saveSettings(DEFAULT_SETTINGS);
    this.clearHistory();
  },

  wipeAllData(): void {
    try {
      this.saveWebsites([]);
      const cleanNetworks: Network[] = [
        {
          id: 'net-all',
          name: 'All Networks',
          description: 'شبكة العرض الشاملة لكافة الروابط والمواقع الشخصية.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          color: '#ef4444',
          icon: 'Network',
        },
        {
          id: 'net-workspace',
          name: 'My Workspace',
          description: 'مساحة العمل الخاصة بي للبدء من الصفر.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          color: '#3b82f6',
          icon: 'Sparkles',
        },
      ];
      this.saveNetworks(cleanNetworks);
      this.saveSettings(DEFAULT_SETTINGS);
      this.clearHistory();
      try {
        localStorage.removeItem(STORAGE_KEYS.CONNECTIONS);
      } catch {
        // ignore
      }
    } catch (e) {
      console.error('Failed to wipe all data:', e);
    }
  },
};
