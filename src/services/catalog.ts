import { Category, Website } from '../types';

export interface WebsiteAnalysisResult {
  name: string;
  domain: string;
  url: string;
  favicon: string;
  category: Category;
  subcategory: string;
  description: string;
  tags: string[];
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Development: '#ef4444', // Cyber Red
  Programming: '#f43f5e',
  Cybersecurity: '#dc2626',
  AI: '#fb7185',
  Design: '#f97316',
  Productivity: '#06b6d4',
  Education: '#3b82f6',
  Finance: '#10b981',
  Business: '#84cc16',
  'Social Media': '#ec4899',
  Cloud: '#8b5cf6',
  Documentation: '#a855f7',
  Tools: '#6366f1',
  News: '#eab308',
  Entertainment: '#d946ef',
  Shopping: '#14b8a6',
  Other: '#94a3b8',
};

export const ALL_CATEGORIES: Category[] = [
  'Development',
  'Programming',
  'Cybersecurity',
  'AI',
  'Design',
  'Productivity',
  'Education',
  'Finance',
  'Business',
  'Social Media',
  'Cloud',
  'Documentation',
  'Tools',
  'News',
  'Entertainment',
  'Shopping',
  'Other',
];

interface KnownSiteEntry {
  domainRegex: RegExp;
  name: string;
  category: Category;
  subcategory: string;
  description: string;
  tags: string[];
}

const KNOWN_SITES: KnownSiteEntry[] = [
  // Development & Code
  {
    domainRegex: /(?:^|\.)github\.com$/i,
    name: 'GitHub',
    category: 'Development',
    subcategory: 'Code Hosting & Collaboration',
    description: 'The world’s leading platform for software development and version control with Git.',
    tags: ['Git', 'Code', 'Open Source', 'DevOps', 'Repository'],
  },
  {
    domainRegex: /(?:^|\.)gitlab\.com$/i,
    name: 'GitLab',
    category: 'Development',
    subcategory: 'DevOps & CI/CD',
    description: 'Complete DevOps platform delivered as a single application with integrated CI/CD.',
    tags: ['Git', 'DevOps', 'CI/CD', 'Repository'],
  },
  {
    domainRegex: /(?:^|\.)stackoverflow\.com$/i,
    name: 'Stack Overflow',
    category: 'Development',
    subcategory: 'Developer Community',
    description: 'The largest community of developers sharing knowledge, debugging code, and solving problems.',
    tags: ['Community', 'Debugging', 'Q&A', 'Programming'],
  },
  {
    domainRegex: /(?:^|\.)flutter\.dev$/i,
    name: 'Flutter',
    category: 'Development',
    subcategory: 'Cross-Platform Framework',
    description: 'Google’s UI toolkit for building beautiful, natively compiled cross-platform apps.',
    tags: ['Dart', 'Mobile', 'UI Toolkit', 'Cross-Platform', 'Google'],
  },
  {
    domainRegex: /(?:^|\.)dart\.dev$/i,
    name: 'Dart',
    category: 'Development',
    subcategory: 'Programming Language',
    description: 'Client-optimized programming language for fast apps on any platform.',
    tags: ['Dart', 'Language', 'Flutter', 'Frontend'],
  },
  {
    domainRegex: /(?:^|\.)react\.dev$/i,
    name: 'React',
    category: 'Development',
    subcategory: 'UI Library',
    description: 'The library for web and native user interfaces maintained by Meta.',
    tags: ['JavaScript', 'Frontend', 'Components', 'Web'],
  },
  {
    domainRegex: /(?:^|\.)vuejs\.org$/i,
    name: 'Vue.js',
    category: 'Development',
    subcategory: 'Frontend Framework',
    description: 'The progressive, approachable, performant, and versatile JavaScript framework.',
    tags: ['JavaScript', 'Frontend', 'Vue', 'SPA'],
  },
  {
    domainRegex: /(?:^|\.)nextjs\.org$/i,
    name: 'Next.js',
    category: 'Development',
    subcategory: 'React Full-Stack Framework',
    description: 'The React framework for the web enabling server-side rendering and static sites.',
    tags: ['React', 'Full-Stack', 'SSR', 'Vercel'],
  },
  {
    domainRegex: /(?:^|\.)tailwindcss\.com$/i,
    name: 'Tailwind CSS',
    category: 'Development',
    subcategory: 'CSS Framework',
    description: 'A utility-first CSS framework packed with classes to build modern web designs rapidly.',
    tags: ['CSS', 'Styling', 'Frontend', 'UI'],
  },
  {
    domainRegex: /(?:^|\.)typescriptlang\.org$/i,
    name: 'TypeScript',
    category: 'Programming',
    subcategory: 'Type-Safe JavaScript',
    description: 'Typed JavaScript at any scale with static type definitions and compiler tools.',
    tags: ['TypeScript', 'JavaScript', 'Types', 'Compiler'],
  },

  // Cybersecurity
  {
    domainRegex: /(?:^|\.)owasp\.org$/i,
    name: 'OWASP',
    category: 'Cybersecurity',
    subcategory: 'Application Security Standard',
    description: 'Open Worldwide Application Security Project setting standards and security guidelines.',
    tags: ['AppSec', 'Security', 'Vulnerabilities', 'Standards', 'Top10'],
  },
  {
    domainRegex: /(?:^|\.)portswigger\.net$/i,
    name: 'PortSwigger / Burp Suite',
    category: 'Cybersecurity',
    subcategory: 'Web Security Testing',
    description: 'Leading web security tools including Burp Suite and the Web Security Academy.',
    tags: ['Burp Suite', 'WebSec', 'PenTesting', 'Academy', 'Exploits'],
  },
  {
    domainRegex: /(?:^|\.)tryhackme\.com$/i,
    name: 'TryHackMe',
    category: 'Cybersecurity',
    subcategory: 'Hands-on Security Training',
    description: 'Hands-on cybersecurity training platform with gamified vulnerable machines.',
    tags: ['Cybersecurity', 'CTF', 'Labs', 'Ethical Hacking', 'Training'],
  },
  {
    domainRegex: /(?:^|\.)hackthebox\.com$/i,
    name: 'Hack The Box',
    category: 'Cybersecurity',
    subcategory: 'Offensive & Defensive Labs',
    description: 'Advanced cybersecurity training platform and simulated corporate lab networks.',
    tags: ['Penetration Testing', 'Labs', 'CTF', 'Infosec'],
  },
  {
    domainRegex: /(?:^|\.)virustotal\.com$/i,
    name: 'VirusTotal',
    category: 'Cybersecurity',
    subcategory: 'Threat Intelligence',
    description: 'Analyze suspicious files, domains, IPs, and URLs to detect malware and breaches.',
    tags: ['Malware', 'Threat Intel', 'Analysis', 'Antivirus'],
  },
  {
    domainRegex: /(?:^|\.)shodan\.io$/i,
    name: 'Shodan',
    category: 'Cybersecurity',
    subcategory: 'Internet Device Search',
    description: 'Search engine for Internet-connected devices, industrial systems, and servers.',
    tags: ['OSINT', 'Recon', 'IoT', 'Scanner'],
  },

  // AI & ML
  {
    domainRegex: /(?:^|\.)openai\.com$/i,
    name: 'OpenAI',
    category: 'AI',
    subcategory: 'Frontier AI Research',
    description: 'Creators of ChatGPT, GPT-4, and pioneers in generative artificial intelligence.',
    tags: ['LLM', 'ChatGPT', 'Generative AI', 'API'],
  },
  {
    domainRegex: /(?:^|\.)huggingface\.co$/i,
    name: 'Hugging Face',
    category: 'AI',
    subcategory: 'Open ML Community & Models',
    description: 'The AI community building the future of open models, datasets, and ML spaces.',
    tags: ['Open Source', 'Models', 'PyTorch', 'Transformers', 'Datasets'],
  },
  {
    domainRegex: /(?:^|\.)claude\.ai$/i,
    name: 'Claude AI',
    category: 'AI',
    subcategory: 'Anthropic Assistant',
    description: 'Next-generation AI assistant built by Anthropic with deep reasoning capabilities.',
    tags: ['AI', 'Anthropic', 'Reasoning', 'Assistant'],
  },
  {
    domainRegex: /(?:^|\.)deepseek\.com$/i,
    name: 'DeepSeek',
    category: 'AI',
    subcategory: 'Open Reasoning Models',
    description: 'High-performance open weights reasoning and coding models.',
    tags: ['AI', 'LLM', 'Coding', 'Open Weights'],
  },

  // Cloud & Infrastructure
  {
    domainRegex: /(?:^|\.)vercel\.com$/i,
    name: 'Vercel',
    category: 'Cloud',
    subcategory: 'Frontend Cloud & Edge',
    description: 'Frontend cloud platform providing speed and reliability for modern web frameworks.',
    tags: ['Deployment', 'Edge', 'Serverless', 'Next.js'],
  },
  {
    domainRegex: /(?:^|\.)supabase\.com$/i,
    name: 'Supabase',
    category: 'Cloud',
    subcategory: 'Open Source Firebase Alternative',
    description: 'Backend-as-a-service providing PostgreSQL, Auth, Realtime APIs, and Storage.',
    tags: ['PostgreSQL', 'Database', 'Auth', 'Backend'],
  },
  {
    domainRegex: /(?:^|\.)docker\.com$/i,
    name: 'Docker',
    category: 'Cloud',
    subcategory: 'Containerization',
    description: 'Platform for developing, shipping, and running applications in containers.',
    tags: ['Containers', 'DevOps', 'Virtualization', 'Images'],
  },

  // Design
  {
    domainRegex: /(?:^|\.)figma\.com$/i,
    name: 'Figma',
    category: 'Design',
    subcategory: 'Collaborative Interface Design',
    description: 'The collaborative interface design tool connecting teams from concept to code.',
    tags: ['UI/UX', 'Design', 'Prototyping', 'Vector'],
  },
  {
    domainRegex: /(?:^|\.)dribbble\.com$/i,
    name: 'Dribbble',
    category: 'Design',
    subcategory: 'Design Showcase & Portfolio',
    description: 'Inspiration and portfolio community for digital designers and illustrators.',
    tags: ['Showcase', 'Inspiration', 'Graphic Design'],
  },

  // Productivity
  {
    domainRegex: /(?:^|\.)notion\.so$/i,
    name: 'Notion',
    category: 'Productivity',
    subcategory: 'Connected Workspace & Docs',
    description: 'All-in-one workspace for notes, documentation, project management, and databases.',
    tags: ['Notes', 'Workspace', 'Docs', 'Tasks'],
  },
  {
    domainRegex: /(?:^|\.)obsidian\.md$/i,
    name: 'Obsidian',
    category: 'Productivity',
    subcategory: 'Knowledge Base & Graph',
    description: 'Extensible markdown knowledge base on local plain-text files with graph view.',
    tags: ['Markdown', 'PKM', 'Second Brain', 'Graph View'],
  },
];

export function cleanUrl(raw: string): string {
  let cleaned = raw.trim();
  if (!cleaned) return '';
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned;
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(cleanUrl(url));
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  }
}

export function getFaviconUrl(domain: string): string {
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

export function autoAnalyzeWebsite(rawUrl: string, customName?: string): WebsiteAnalysisResult {
  const url = cleanUrl(rawUrl);
  const domain = extractDomain(url);
  const favicon = getFaviconUrl(domain);

  // Check in known catalog
  for (const entry of KNOWN_SITES) {
    if (entry.domainRegex.test(domain)) {
      return {
        name: customName?.trim() || entry.name,
        domain,
        url,
        favicon,
        category: entry.category,
        subcategory: entry.subcategory,
        description: entry.description,
        tags: [...entry.tags],
      };
    }
  }

  // Heuristic rule-based detection
  const lowerUrl = url.toLowerCase();
  const domainParts = domain.split('.');
  const primaryName = domainParts[0] || 'Website';
  const formattedName =
    customName?.trim() ||
    primaryName.charAt(0).toUpperCase() + primaryName.slice(1);

  let category: Category = 'Other';
  let subcategory = 'Web Application';
  let description = `Online workspace and resource at ${domain}.`;
  const tags: string[] = [primaryName];

  if (
    lowerUrl.includes('security') ||
    lowerUrl.includes('cyber') ||
    lowerUrl.includes('hack') ||
    lowerUrl.includes('pentest') ||
    lowerUrl.includes('cve') ||
    lowerUrl.includes('exploit') ||
    lowerUrl.includes('ctf')
  ) {
    category = 'Cybersecurity';
    subcategory = 'Security Tool / Platform';
    description = `Cybersecurity research, testing, or training platform on ${domain}.`;
    tags.push('Security', 'Infosec', 'Analysis');
  } else if (
    lowerUrl.includes('github') ||
    lowerUrl.includes('git') ||
    lowerUrl.includes('code') ||
    lowerUrl.includes('dev') ||
    lowerUrl.includes('stack') ||
    lowerUrl.includes('compile') ||
    domain.endsWith('.dev')
  ) {
    category = 'Development';
    subcategory = 'Developer Toolkit';
    description = `Development resource, code tool, or platform for engineers.`;
    tags.push('Development', 'Code', 'Tools');
  } else if (
    lowerUrl.includes('ai') ||
    lowerUrl.includes('gpt') ||
    lowerUrl.includes('llm') ||
    lowerUrl.includes('neural') ||
    lowerUrl.includes('model') ||
    domain.endsWith('.ai')
  ) {
    category = 'AI';
    subcategory = 'Artificial Intelligence';
    description = `Machine learning tool, model interface, or AI-powered service.`;
    tags.push('AI', 'Machine Learning', 'Automation');
  } else if (
    lowerUrl.includes('design') ||
    lowerUrl.includes('ui') ||
    lowerUrl.includes('ux') ||
    lowerUrl.includes('art') ||
    lowerUrl.includes('vector') ||
    lowerUrl.includes('font')
  ) {
    category = 'Design';
    subcategory = 'Creative & UI Asset';
    description = `Digital design asset, vector tool, or UI reference on ${domain}.`;
    tags.push('Design', 'UI/UX', 'Assets');
  } else if (
    lowerUrl.includes('cloud') ||
    lowerUrl.includes('host') ||
    lowerUrl.includes('db') ||
    lowerUrl.includes('server') ||
    lowerUrl.includes('api')
  ) {
    category = 'Cloud';
    subcategory = 'Infrastructure & API';
    description = `Cloud infrastructure, hosting, or database service.`;
    tags.push('Cloud', 'Hosting', 'Backend');
  } else if (
    lowerUrl.includes('doc') ||
    lowerUrl.includes('wiki') ||
    lowerUrl.includes('learn') ||
    lowerUrl.includes('edu') ||
    domain.endsWith('.edu')
  ) {
    category = 'Documentation';
    subcategory = 'Technical Reference';
    description = `Documentation, tutorials, or educational reference material.`;
    tags.push('Documentation', 'Learning', 'Reference');
  } else if (
    lowerUrl.includes('task') ||
    lowerUrl.includes('note') ||
    lowerUrl.includes('plan') ||
    lowerUrl.includes('work') ||
    lowerUrl.includes('calendar')
  ) {
    category = 'Productivity';
    subcategory = 'Productivity Utility';
    description = `Personal workflow and organization utility at ${domain}.`;
    tags.push('Productivity', 'Workflow', 'Organizer');
  } else if (
    lowerUrl.includes('news') ||
    lowerUrl.includes('blog') ||
    lowerUrl.includes('medium') ||
    lowerUrl.includes('times')
  ) {
    category = 'News';
    subcategory = 'Tech News & Publications';
    description = `News publication and industry updates on ${domain}.`;
    tags.push('News', 'Articles');
  } else if (
    lowerUrl.includes('finance') ||
    lowerUrl.includes('bank') ||
    lowerUrl.includes('crypto') ||
    lowerUrl.includes('stock')
  ) {
    category = 'Finance';
    subcategory = 'Financial Service';
    description = `Financial tracking, banking, or crypto utility on ${domain}.`;
    tags.push('Finance', 'Portfolio');
  } else {
    category = 'Tools';
    subcategory = 'Web Utility';
    description = `Essential web utility and service at ${domain}.`;
    tags.push('Utility', 'Web');
  }

  return {
    name: formattedName,
    domain,
    url,
    favicon,
    category,
    subcategory,
    description,
    tags: Array.from(new Set(tags)),
  };
}
