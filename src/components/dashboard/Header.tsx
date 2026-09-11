import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Network as NetIcon,
  LayoutGrid,
  Share2,
  List,
  Columns,
  Bell,
  Sparkles,
  Command,
  ChevronDown,
  ExternalLink,
  Star,
  Check,
  FolderDown,
  Cloud,
  Trash2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Network, ViewMode, Website } from '../../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddModal: () => void;
  onOpenDragGuide?: () => void;
  onOpenWipeModal?: () => void;
  networks: Network[];
  activeNetworkId: string;
  onSelectNetwork: (networkId: string) => void;
  onOpenNetworkModal?: () => void;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  websites: Website[];
  onOpenWebsite: (website: Website) => void;
  onSelectWebsite: (website: Website) => void;
  currentUser?: User | null;
  syncStatus?: 'synced' | 'syncing' | 'error' | 'offline';
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenDragGuide,
  onOpenWipeModal,
  networks,
  activeNetworkId,
  onSelectNetwork,
  onOpenNetworkModal,
  viewMode,
  onSelectViewMode,
  websites,
  onOpenWebsite,
  onSelectWebsite,
  currentUser = null,
  syncStatus = 'offline',
  onOpenAuthModal,
}) => {
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const networkMenuRef = useRef<HTMLDivElement>(null);

  const activeNetwork =
    networks.find((n) => n.id === activeNetworkId) || networks[0];

  // Close popovers on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        networkMenuRef.current &&
        !networkMenuRef.current.contains(e.target as Node)
      ) {
        setNetworkDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  // Filtered preview for search dropdown
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return websites
      .filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.domain.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.subcategory.toLowerCase().includes(q) ||
          w.tags.some((t) => t.toLowerCase().includes(q)) ||
          w.description.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchQuery, websites]);

  return (
    <header
      id="main-app-header"
      className="h-16 border-b border-[#232330] bg-[#0c0c10]/95 backdrop-blur-md px-6 flex items-center justify-between gap-4 z-30 shrink-0 sticky top-0"
    >
      {/* Title & Network Switcher */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0 hidden sm:block">
          <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 truncate">
            <span>My Digital Network</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </h1>
          <p className="text-[11px] text-zinc-400 truncate">
            Organize your web into one intelligent visual workspace.
          </p>
        </div>

        {/* Network Selector Dropdown */}
        <div className="relative" ref={networkMenuRef}>
          <button
            id="network-selector-btn"
            onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#15151f] hover:bg-[#1d1d2b] border border-[#272738] text-xs font-medium text-zinc-200 transition-all shadow-sm"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activeNetwork.color || '#ef4444' }}
            />
            <span className="max-w-[120px] truncate">{activeNetwork.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          {networkDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-[#151520] border border-[#2c2c3e] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-zinc-500 border-b border-[#232332]">
                Switch Active Network
              </div>
              {networks.map((net) => {
                const isAll = net.id === 'net-all';
                const count = isAll
                  ? websites.length
                  : websites.filter((w) => w.networkId === net.id).length;

                return (
                  <button
                    key={net.id}
                    onClick={() => {
                      onSelectNetwork(net.id);
                      setNetworkDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-[#1f1f2e] transition-colors ${
                      activeNetworkId === net.id
                        ? 'text-red-400 font-semibold'
                        : 'text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: net.color || '#ef4444' }}
                      />
                      <span className="truncate">{net.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-zinc-500 font-mono bg-[#111118] px-1 rounded">
                        {count}
                      </span>
                      {activeNetworkId === net.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}

              {onOpenNetworkModal && (
                <div className="border-t border-[#232332] p-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setNetworkDropdownOpen(false);
                      onOpenNetworkModal();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-[#1f1f2e] rounded-lg transition-colors font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ إدارة وتصنيف شبكاتي</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center Search Bar */}
      <div
        ref={searchContainerRef}
        className="relative flex-1 max-w-md mx-2 hidden md:block"
      >
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search websites, domains, categories, tags..."
            className="w-full bg-[#15151f] border border-[#272738] focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl pl-10 pr-16 py-2 text-xs text-zinc-200 outline-none transition-all placeholder:text-zinc-500"
          />
          <div className="absolute right-2.5 flex items-center gap-1 text-[10px] font-mono text-zinc-500 bg-[#1e1e2c] px-1.5 py-0.5 rounded border border-[#2e2e42] pointer-events-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Instant Search Results Dropdown */}
        {searchFocused && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#14141e] border border-[#2a2a3d] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-100 max-h-80 overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="p-1 space-y-0.5">
                <div className="px-3 py-1.5 text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-between">
                  <span>Matches ({searchResults.length})</span>
                  <span className="text-zinc-600">Click to focus node</span>
                </div>
                {searchResults.map((site) => (
                  <div
                    key={site.id}
                    onClick={() => {
                      onSelectWebsite(site);
                      setSearchFocused(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1f1f2e] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={site.favicon}
                        alt=""
                        className="w-4 h-4 rounded-sm object-contain shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white font-medium truncate group-hover:text-red-400">
                            {site.name}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {site.domain}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {site.category} • {site.tags.join(', ')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenWebsite(site);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-[#2c2c40] shrink-0"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-zinc-500 font-mono">
                No matching nodes found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center bg-[#15151f] p-1 rounded-xl border border-[#272738]">
          <button
            onClick={() => onSelectViewMode('graph')}
            title="Obsidian Spider Web Graph View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'graph'
                ? 'bg-red-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectViewMode('grid')}
            title="Grid Cards View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-red-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectViewMode('list')}
            title="Compact List View"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-red-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectViewMode('split')}
            title="Split Dual View (Graph + Cards)"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'split'
                ? 'bg-red-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Drag & Drop Quick Guide Button */}
        {onOpenDragGuide && (
          <button
            onClick={onOpenDragGuide}
            title="دليل الإمساك والإفلات السريع (Drag & Drop Guide)"
            className="bg-[#191925] hover:bg-[#232334] text-zinc-300 hover:text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border border-[#2d2d42] transition-colors"
          >
            <FolderDown className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">سحب وإفلات</span>
          </button>
        )}

        {/* Cloud Persistence & Account Button */}
        {onOpenAuthModal && (
          <button
            id="cloud-sync-user-btn"
            onClick={onOpenAuthModal}
            title={
              currentUser
                ? `مسجل كـ: ${currentUser.email} (انقر لإدارة الحساب والحفظ السحابي)`
                : 'تسجيل الدخول للحفظ السحابي الدائم عبر Google أو البريد'
            }
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-xs cursor-pointer ${
              currentUser
                ? 'bg-[#161624] border-[#2e2e44] hover:border-red-500/50 text-zinc-200'
                : 'bg-red-950/30 border-red-800/60 hover:bg-red-900/40 text-red-200'
            }`}
          >
            {currentUser ? (
              <>
                <div className="relative flex items-center justify-center">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || ''}
                      className="w-5 h-5 rounded-full object-cover border border-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-[10px] border border-red-500/30">
                      {currentUser.displayName?.[0]?.toUpperCase() ||
                        currentUser.email?.[0]?.toUpperCase() ||
                        'U'}
                    </div>
                  )}
                  {/* Pulsing Sync indicator */}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#161624] ${
                      syncStatus === 'syncing'
                        ? 'bg-amber-400 animate-spin'
                        : syncStatus === 'error'
                        ? 'bg-red-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <span className="max-w-[110px] truncate hidden md:inline font-medium">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span className="hidden sm:inline font-medium">حفظ سحابي</span>
              </>
            )}
          </button>
        )}

        {/* Wipe / Reset Data Button */}
        {onOpenWipeModal && (
          <button
            id="header-wipe-data-btn"
            onClick={onOpenWipeModal}
            title="حذف كل البيانات والبدء من جديد (Wipe & Fresh Start)"
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/25 border border-[#272738] hover:border-red-900/50 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Primary Add Website Button */}
        <button
          id="header-add-website-btn"
          onClick={onOpenAddModal}
          className="bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-red-950/40 hover:shadow-red-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Website</span>
        </button>
      </div>
    </header>
  );
};
