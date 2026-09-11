import React, { useState } from 'react';
import {
  Share2,
  Globe,
  Network as NetIcon,
  Layers,
  Star,
  Clock,
  History,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Compass,
  Zap,
  User,
  Shield,
  Trash2,
} from 'lucide-react';
import { Network, Website } from '../../types';

export type SidebarTab =
  | 'dashboard'
  | 'graph'
  | 'all'
  | 'networks'
  | 'categories'
  | 'favorites'
  | 'recent-added'
  | 'recent-visited';

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  websites: Website[];
  networks: Network[];
  onOpenSettings: () => void;
  onOpenAddNetwork: () => void;
  onOpenWipeModal?: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  websites,
  networks,
  onOpenSettings,
  onOpenAddNetwork,
  onOpenWipeModal,
  collapsed,
  onToggleCollapse,
  selectedCategory,
  onSelectCategory,
}) => {
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  const favoriteCount = websites.filter((w) => w.isFavorite).length;
  const categoriesList = Array.from(new Set(websites.map((w) => w.category)));

  const navItems: { id: SidebarTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'graph', label: 'Visual Network', icon: Share2 },
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'all', label: 'All Websites', icon: Globe, badge: websites.length },
    { id: 'networks', label: 'My Networks', icon: NetIcon, badge: networks.length - 1 },
    { id: 'favorites', label: 'Favorites', icon: Star, badge: favoriteCount },
    { id: 'recent-added', label: 'Recently Added', icon: Clock },
    { id: 'recent-visited', label: 'Recently Visited', icon: History },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`h-screen bg-[#0d0d12] border-r border-[#22222f] flex flex-col justify-between transition-all duration-300 z-40 shrink-0 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 border-b border-[#20202c] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-white shadow-lg shadow-red-900/40 shrink-0">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-bold text-sm tracking-wider text-white font-mono block">
                  NEXUS<span className="text-red-500">WEB</span>
                </span>
                <span className="text-[9px] font-mono text-zinc-500 tracking-widest block uppercase">
                  Obsidian Graph
                </span>
              </div>
            )}
          </div>

          <button
            id="toggle-sidebar-btn"
            onClick={onToggleCollapse}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#1a1a24] rounded-lg transition-colors hidden md:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (item.id !== 'categories') onSelectCategory(null);
                }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-red-600/15 text-red-400 border border-red-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#151520]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="text-[10px] font-mono bg-[#1c1c28] text-zinc-400 px-1.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Categories expandable toggle */}
          <button
            onClick={() => {
              setCategoriesExpanded(!categoriesExpanded);
              onSelectTab('categories');
            }}
            title={collapsed ? 'Categories' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
              activeTab === 'categories'
                ? 'bg-red-600/15 text-red-400 border border-red-500/30'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#151520]'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0 text-zinc-500 group-hover:text-zinc-300" />
            {!collapsed && <span className="flex-1 text-left">Categories</span>}
            {!collapsed && (
              <span className="text-[10px] font-mono bg-[#1c1c28] text-zinc-400 px-1.5 py-0.5 rounded-md">
                {categoriesList.length}
              </span>
            )}
          </button>

          {/* Subcategories list if expanded */}
          {!collapsed && categoriesExpanded && (
            <div className="pl-6 pr-2 py-1 space-y-1 max-h-36 overflow-y-auto">
              <button
                onClick={() => onSelectCategory(null)}
                className={`w-full text-left text-[11px] font-mono py-1 px-2 rounded hover:bg-[#1a1a24] ${
                  selectedCategory === null ? 'text-red-400 font-bold' : 'text-zinc-400'
                }`}
              >
                • All Categories
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`w-full text-left text-[11px] font-mono py-1 px-2 rounded hover:bg-[#1a1a24] truncate ${
                    selectedCategory === cat ? 'text-red-400 font-bold' : 'text-zinc-400'
                  }`}
                >
                  • {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Profile & Settings */}
      <div className="p-3 border-t border-[#20202c] space-y-1.5 bg-[#0b0b10]">
        {onOpenWipeModal && (
          <button
            id="sidebar-wipe-data-btn"
            onClick={onOpenWipeModal}
            title={collapsed ? 'حذف كل البيانات والبدء من جديد' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-red-400 hover:bg-red-950/25 transition-colors group cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
            {!collapsed && <span>حذف البيانات والبدء من جديد</span>}
          </button>
        )}

        <button
          onClick={onOpenSettings}
          title={collapsed ? 'Settings' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-[#171722] transition-colors cursor-pointer"
        >
          <SettingsIcon className="w-4 h-4 text-zinc-500" />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* User profile card */}
        <div className="pt-2 border-t border-[#1a1a26] flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 text-xs font-bold shrink-0">
            H
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-zinc-200 truncate">Hassan Al-Kzafy</p>
              <p className="text-[10px] font-mono text-zinc-400 truncate">Cyber / Developer Workspace</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
