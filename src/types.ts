export type Category =
  | 'Development'
  | 'Programming'
  | 'Cybersecurity'
  | 'AI'
  | 'Design'
  | 'Productivity'
  | 'Education'
  | 'Finance'
  | 'Business'
  | 'Social Media'
  | 'Cloud'
  | 'Documentation'
  | 'Tools'
  | 'News'
  | 'Entertainment'
  | 'Shopping'
  | 'Other';

export interface Website {
  id: string;
  name: string;
  url: string;
  domain: string;
  favicon: string;
  description: string;
  category: Category;
  subcategory: string;
  tags: string[];
  networkId: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  lastVisited?: string;
  positionX?: number;
  positionY?: number;
  customConnections?: string[]; // IDs of websites directly linked
  color?: string;
}

export interface Network {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  color: string;
  icon?: string;
}

export interface Connection {
  id: string;
  sourceNode: string;
  targetNode: string;
  relationshipType: 'category' | 'related' | 'tag' | 'custom';
}

export interface GraphNode {
  id: string;
  type: 'website' | 'category';
  label: string;
  subLabel?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  data: Website | { category: Category; count: number };
  pinned?: boolean;
  highlighted?: boolean;
  faded?: boolean;
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  type: 'category' | 'related' | 'custom' | 'tag';
  strength?: number;
}

export type ViewMode = 'graph' | 'grid' | 'list' | 'split';
export type LayoutMode = 'force' | 'radial' | 'hierarchical';

export interface GraphSettings {
  nodeSize: number;
  connectionThickness: number;
  forceDensity: number;
  showLabels: boolean;
  showCategories: boolean;
  physicsEnabled: boolean;
  spiderWebParticles: boolean;
  openInNewTab: boolean;
  autoCategorization: boolean;
  autoConnections: boolean;
  defaultLayout: LayoutMode;
}

export interface HistoryItem {
  id: string;
  websiteId: string;
  websiteName: string;
  url: string;
  category: Category;
  timestamp: string;
}
