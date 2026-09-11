/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  GraphSettings,
  HistoryItem,
  Network,
  ViewMode,
  Website,
  GraphNode,
} from './types';
import { StorageService } from './services/storage';
import { Sidebar, SidebarTab } from './components/layout/Sidebar';
import { Header } from './components/dashboard/Header';
import { StatsCards } from './components/dashboard/StatsCards';
import { QuickAccessBar } from './components/dashboard/QuickAccessBar';
import { GraphCanvas } from './components/graph/GraphCanvas';
import { NodeInspector } from './components/graph/NodeInspector';
import { ContextMenu } from './components/graph/ContextMenu';
import { GridView } from './components/views/GridView';
import { ListView } from './components/views/ListView';
import { HistoryView } from './components/views/HistoryView';
import { EmptyState } from './components/views/EmptyState';
import { AddWebsiteModal } from './components/modals/AddWebsiteModal';
import { EditWebsiteModal } from './components/modals/EditWebsiteModal';
import { NetworkModal } from './components/modals/NetworkModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AuthModal } from './components/modals/AuthModal';
import { ClearAllDataModal } from './components/modals/ClearAllDataModal';
import { GlobalDropZone } from './components/dashboard/GlobalDropZone';
import { DragDropGuideModal } from './components/modals/DragDropGuideModal';
import { parseDroppedData } from './services/shortcutParser';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  fetchUserData,
  saveUserDataToCloud,
  subscribeToUserData,
} from './services/firebase';

export default function App() {
  // Core Application State
  const [websites, setWebsites] = useState<Website[]>(() =>
    StorageService.getWebsites()
  );
  const [networks, setNetworks] = useState<Network[]>(() =>
    StorageService.getNetworks()
  );
  const [settings, setSettings] = useState<GraphSettings>(() =>
    StorageService.getSettings()
  );
  const [history, setHistory] = useState<HistoryItem[]>(() =>
    StorageService.getHistory()
  );

  // Cloud Persistence & Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [syncStatus, setSyncStatus] = useState<
    'synced' | 'syncing' | 'error' | 'offline'
  >('offline');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState<boolean>(false);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<SidebarTab>('graph');
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [activeNetworkId, setActiveNetworkId] = useState<string>('net-all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Selection & Inspector State
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: GraphNode;
  } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDragGuideOpen, setIsDragGuideOpen] = useState(false);

  // Drag & Drop State
  const [isDraggingGlobal, setIsDraggingGlobal] = useState(false);
  const [droppedInitialData, setDroppedInitialData] = useState<{
    url: string;
    name?: string;
  } | null>(null);
  const dragCounter = useRef(0);

  // Global Drag & Drop Window Listeners
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current++;
      if (e.dataTransfer && e.dataTransfer.types.length > 0) {
        setIsDraggingGlobal(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDraggingGlobal(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDraggingGlobal(false);

      if (!e.dataTransfer) return;
      const parsed = await parseDroppedData(e.dataTransfer);
      if (parsed && parsed.url) {
        setDroppedInitialData({ url: parsed.url, name: parsed.name });
        setIsAddModalOpen(true);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K -> Focus Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        searchInput?.focus();
      }
      // Ctrl/Cmd + N -> Add Website
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsAddModalOpen(true);
      }
      // Esc -> Close Modals & Inspector
      if (e.key === 'Escape') {
        setSelectedNode(null);
        setContextMenu(null);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsNetworkModalOpen(false);
        setIsSettingsModalOpen(false);
      }
      // 'f' or 'F' (when not in input) -> Focus Graph
      if (
        (e.key === 'f' || e.key === 'F') &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setActiveTab('graph');
        setViewMode('graph');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cloud Synchronization Helper
  const syncToCloud = useCallback(
    (data: {
      websites?: Website[];
      networks?: Network[];
      settings?: GraphSettings;
      history?: HistoryItem[];
    }) => {
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;
      setSyncStatus('syncing');
      saveUserDataToCloud(uid, {
        websites: data.websites ?? StorageService.getWebsites(),
        networks: data.networks ?? StorageService.getNetworks(),
        settings: data.settings ?? StorageService.getSettings(),
        history: data.history ?? StorageService.getHistory(),
      }).then((ok) => {
        if (ok) {
          setSyncStatus('synced');
          setLastSyncedAt(new Date().toISOString());
        } else {
          setSyncStatus('error');
        }
      });
    },
    []
  );

  // Firebase Auth & Cloud Real-time Listener
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (user) {
        setSyncStatus('syncing');
        try {
          // Fetch existing user data from cloud
          const cloudData = await fetchUserData(user.uid);
          if (cloudData) {
            if (cloudData.websites && Array.isArray(cloudData.websites)) {
              setWebsites(cloudData.websites);
              StorageService.saveWebsites(cloudData.websites);
            }
            if (cloudData.networks && Array.isArray(cloudData.networks)) {
              setNetworks(cloudData.networks);
              StorageService.saveNetworks(cloudData.networks);
            }
            if (cloudData.settings) {
              setSettings(cloudData.settings);
              StorageService.saveSettings(cloudData.settings);
            }
            if (cloudData.history && Array.isArray(cloudData.history)) {
              setHistory(cloudData.history);
              StorageService.saveHistory(cloudData.history);
            }
            setSyncStatus('synced');
            setLastSyncedAt(cloudData.updatedAt || new Date().toISOString());
          } else {
            // New user account: sync current client data to cloud immediately!
            const currentWebsites = StorageService.getWebsites();
            const currentNetworks = StorageService.getNetworks();
            const currentSettings = StorageService.getSettings();
            const currentHistory = StorageService.getHistory();

            await saveUserDataToCloud(user.uid, {
              websites: currentWebsites,
              networks: currentNetworks,
              settings: currentSettings,
              history: currentHistory,
            });
            setSyncStatus('synced');
            setLastSyncedAt(new Date().toISOString());
          }

          // Subscribe to real-time changes
          unsubscribeSnapshot = subscribeToUserData(
            user.uid,
            (remoteData) => {
              if (remoteData) {
                if (remoteData.websites) {
                  setWebsites(remoteData.websites);
                  StorageService.saveWebsites(remoteData.websites);
                }
                if (remoteData.networks) {
                  setNetworks(remoteData.networks);
                  StorageService.saveNetworks(remoteData.networks);
                }
                if (remoteData.settings) {
                  setSettings(remoteData.settings);
                  StorageService.saveSettings(remoteData.settings);
                }
                if (remoteData.history) {
                  setHistory(remoteData.history);
                  StorageService.saveHistory(remoteData.history);
                }
                setSyncStatus('synced');
                setLastSyncedAt(remoteData.updatedAt || new Date().toISOString());
              }
            },
            (err) => {
              console.warn('Realtime sync subscription error:', err);
              setSyncStatus('error');
            }
          );
        } catch (err) {
          console.error('Firebase sync initialization error:', err);
          setSyncStatus('error');
        }
      } else {
        setSyncStatus('offline');
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // Manual Trigger Sync Now
  const handleManualSyncNow = async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setSyncStatus('syncing');
    const ok = await saveUserDataToCloud(currentUser.uid, {
      websites,
      networks,
      settings,
      history,
    });
    if (ok) {
      setSyncStatus('synced');
      setLastSyncedAt(new Date().toISOString());
    } else {
      setSyncStatus('error');
    }
  };

  // Filter websites based on active tab, network, category, and search query
  const displayedWebsites = useMemo(() => {
    return websites.filter((site) => {
      // Tab filters
      if (activeTab === 'favorites' && !site.isFavorite) return false;
      if (activeTab === 'categories' && selectedCategory && site.category !== selectedCategory) {
        return false;
      }

      // Network filter
      if (activeNetworkId !== 'net-all' && site.networkId !== activeNetworkId) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = site.name.toLowerCase().includes(q);
        const matchDomain = site.domain.toLowerCase().includes(q);
        const matchCategory = site.category.toLowerCase().includes(q);
        const matchSub = site.subcategory?.toLowerCase().includes(q);
        const matchDesc = site.description?.toLowerCase().includes(q);
        const matchTags = site.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchDomain && !matchCategory && !matchSub && !matchDesc && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [websites, activeTab, selectedCategory, activeNetworkId, searchQuery]);

  // 1-Click Launch Website Action
  const handleOpenWebsite = useCallback(
    (website: Website) => {
      // Update last visited in state & persistence
      const now = new Date().toISOString();
      const updatedList = websites.map((w) =>
        w.id === website.id ? { ...w, lastVisited: now } : w
      );
      setWebsites(updatedList);
      StorageService.saveWebsites(updatedList);

      // Add to visited history
      StorageService.addHistory(website);
      const newHistory = StorageService.getHistory();
      setHistory(newHistory);
      syncToCloud({ websites: updatedList, history: newHistory });

      // Open in new tab or current tab
      if (settings.openInNewTab) {
        window.open(website.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = website.url;
      }
    },
    [websites, settings.openInNewTab, syncToCloud]
  );

  // Add Website Action
  const handleAddWebsite = useCallback(
    (newWebsite: Website) => {
      const updated = [newWebsite, ...websites];
      setWebsites(updated);
      StorageService.saveWebsites(updated);
      syncToCloud({ websites: updated });

      // If user selected or created a network for this website, automatically activate it so it shows immediately!
      if (newWebsite.networkId && activeNetworkId !== 'net-all' && activeNetworkId !== newWebsite.networkId) {
        setActiveNetworkId(newWebsite.networkId);
      }

      // Focus the newly created node
      setSelectedNode({
        id: newWebsite.id,
        type: 'website',
        label: newWebsite.name,
        subLabel: newWebsite.domain,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: settings.nodeSize,
        color: '#ef4444',
        data: newWebsite,
      });
    },
    [websites, settings.nodeSize, activeNetworkId, syncToCloud]
  );

  // Edit Website Action
  const handleSaveWebsite = useCallback(
    (updatedWebsite: Website) => {
      const updated = websites.map((w) =>
        w.id === updatedWebsite.id ? updatedWebsite : w
      );
      setWebsites(updated);
      StorageService.saveWebsites(updated);
      syncToCloud({ websites: updated });

      if (selectedNode && selectedNode.id === updatedWebsite.id) {
        setSelectedNode({
          ...selectedNode,
          label: updatedWebsite.name,
          subLabel: updatedWebsite.domain,
          data: updatedWebsite,
        });
      }
    },
    [websites, selectedNode, syncToCloud]
  );

  // Delete Website Action
  const handleDeleteWebsite = useCallback(
    (websiteId: string) => {
      const updated = websites
        .filter((w) => w.id !== websiteId)
        .map((w) => ({
          ...w,
          customConnections: w.customConnections?.filter((id) => id !== websiteId),
        }));

      setWebsites(updated);
      StorageService.saveWebsites(updated);
      syncToCloud({ websites: updated });

      if (selectedNode?.id === websiteId) {
        setSelectedNode(null);
      }
    },
    [websites, selectedNode, syncToCloud]
  );

  // Toggle Favorite Action
  const handleToggleFavorite = useCallback(
    (websiteId: string) => {
      const updated = websites.map((w) =>
        w.id === websiteId ? { ...w, isFavorite: !w.isFavorite } : w
      );
      setWebsites(updated);
      StorageService.saveWebsites(updated);
      syncToCloud({ websites: updated });

      if (selectedNode && selectedNode.id === websiteId) {
        const site = updated.find((w) => w.id === websiteId);
        if (site) {
          setSelectedNode({ ...selectedNode, data: site });
        }
      }
    },
    [websites, selectedNode, syncToCloud]
  );

  // Connect Two Nodes Interactively
  const handleConnectNodes = useCallback(
    (sourceId: string, targetId: string) => {
      const updated = websites.map((w) => {
        if (w.id === sourceId) {
          const current = w.customConnections || [];
          if (!current.includes(targetId)) {
            return { ...w, customConnections: [...current, targetId] };
          }
        }
        return w;
      });
      setWebsites(updated);
      StorageService.saveWebsites(updated);
      syncToCloud({ websites: updated });
    },
    [websites, syncToCloud]
  );

  // Duplicate Website Action
  const handleDuplicateWebsite = useCallback(
    (site: Website) => {
      const clone: Website = {
        ...site,
        id: 'w-' + Date.now(),
        name: `${site.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      handleAddWebsite(clone);
    },
    [handleAddWebsite]
  );

  // Network Management Actions
  const handleAddNetwork = useCallback(
    (newNet: Network) => {
      const updated = [...networks, newNet];
      setNetworks(updated);
      StorageService.saveNetworks(updated);
      syncToCloud({ networks: updated });
      // Immediately switch to the newly created network
      setActiveNetworkId(newNet.id);
    },
    [networks, syncToCloud]
  );

  const handleUpdateNetwork = useCallback(
    (updatedNet: Network) => {
      const updated = networks.map((n) =>
        n.id === updatedNet.id ? updatedNet : n
      );
      setNetworks(updated);
      StorageService.saveNetworks(updated);
      syncToCloud({ networks: updated });
    },
    [networks, syncToCloud]
  );

  const handleDeleteNetwork = useCallback(
    (netId: string) => {
      const updatedNetworks = networks.filter((n) => n.id !== netId);
      setNetworks(updatedNetworks);
      StorageService.saveNetworks(updatedNetworks);

      // Reassign orphan sites to default
      const updatedSites = websites.map((w) =>
        w.networkId === netId ? { ...w, networkId: 'net-dev' } : w
      );
      setWebsites(updatedSites);
      StorageService.saveWebsites(updatedSites);
      syncToCloud({ networks: updatedNetworks, websites: updatedSites });

      if (activeNetworkId === netId) {
        setActiveNetworkId('net-all');
      }
    },
    [networks, websites, activeNetworkId, syncToCloud]
  );

  const handleDuplicateNetwork = useCallback(
    (net: Network) => {
      const clone: Network = {
        ...net,
        id: 'net-' + Date.now(),
        name: `${net.name} Copy`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      handleAddNetwork(clone);
    },
    [handleAddNetwork]
  );

  // Settings & Data Management
  const handleUpdateSettings = useCallback((newSettings: GraphSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    syncToCloud({ settings: newSettings });
  }, [syncToCloud]);

  const handleExportData = () => {
    const jsonStr = StorageService.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusweb_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string): boolean => {
    const success = StorageService.importData(jsonStr);
    if (success) {
      const w = StorageService.getWebsites();
      const n = StorageService.getNetworks();
      const s = StorageService.getSettings();
      const h = StorageService.getHistory();
      setWebsites(w);
      setNetworks(n);
      setSettings(s);
      setHistory(h);
      syncToCloud({ websites: w, networks: n, settings: s, history: h });
    }
    return success;
  };

  const handleResetData = () => {
    StorageService.resetToDefault();
    const w = StorageService.getWebsites();
    const n = StorageService.getNetworks();
    const s = StorageService.getSettings();
    const h = StorageService.getHistory();
    setWebsites(w);
    setNetworks(n);
    setSettings(s);
    setHistory(h);
    setActiveNetworkId('net-all');
    setSelectedNode(null);
    syncToCloud({ websites: w, networks: n, settings: s, history: h });
  };

  const handleWipeAllData = () => {
    StorageService.wipeAllData();
    const w = StorageService.getWebsites();
    const n = StorageService.getNetworks();
    const s = StorageService.getSettings();
    const h = StorageService.getHistory();
    setWebsites(w);
    setNetworks(n);
    setSettings(s);
    setHistory(h);
    setActiveNetworkId('net-all');
    setSelectedNode(null);
    syncToCloud({ websites: w, networks: n, settings: s, history: h });
  };

  // Node Selection helper from site card
  const handleSelectWebsite = (site: Website) => {
    setSelectedNode({
      id: site.id,
      type: 'website',
      label: site.name,
      subLabel: site.domain,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: settings.nodeSize,
      color: '#ef4444',
      data: site,
    });
  };

  // Select node by ID from inspector
  const handleSelectNodeById = (id: string) => {
    const site = websites.find((w) => w.id === id);
    if (site) {
      handleSelectWebsite(site);
    }
  };

  // Decide current main view renderer
  const isGraphMode =
    activeTab === 'graph' ||
    (activeTab === 'dashboard' && (viewMode === 'graph' || viewMode === 'split'));

  const isHistoryMode =
    activeTab === 'recent-visited' || activeTab === 'recent-added';

  return (
    <div
      id="nexusweb-app-root"
      className="flex h-screen w-screen overflow-hidden bg-[#09090c] text-zinc-100 font-sans selection:bg-red-600 selection:text-white"
    >
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'networks') setIsNetworkModalOpen(true);
        }}
        websites={websites}
        networks={networks}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAddNetwork={() => setIsNetworkModalOpen(true)}
        onOpenWipeModal={() => setIsClearDataModalOpen(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 2. Main Workspace Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Global Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddModal={() => {
            setDroppedInitialData(null);
            setIsAddModalOpen(true);
          }}
          onOpenDragGuide={() => setIsDragGuideOpen(true)}
          onOpenWipeModal={() => setIsClearDataModalOpen(true)}
          networks={networks}
          activeNetworkId={activeNetworkId}
          onSelectNetwork={setActiveNetworkId}
          onOpenNetworkModal={() => setIsNetworkModalOpen(true)}
          viewMode={viewMode}
          onSelectViewMode={setViewMode}
          websites={websites}
          onOpenWebsite={handleOpenWebsite}
          onSelectWebsite={handleSelectWebsite}
          currentUser={currentUser}
          syncStatus={syncStatus}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Dashboard Metrics (Shown on dashboard & all websites tab) */}
        {(activeTab === 'dashboard' || activeTab === 'all') && (
          <StatsCards websites={websites} networks={networks} />
        )}

        {/* Quick Access Favorites Ribbon */}
        <QuickAccessBar
          websites={websites}
          onOpenWebsite={handleOpenWebsite}
          onSelectWebsite={handleSelectWebsite}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0 relative overflow-hidden">
          {displayedWebsites.length === 0 && activeTab !== 'recent-visited' ? (
            <EmptyState
              onAddWebsite={() => setIsAddModalOpen(true)}
              onResetSample={handleResetData}
            />
          ) : isHistoryMode ? (
            <HistoryView
              mode={activeTab as 'recent-visited' | 'recent-added'}
              history={history}
              websites={websites}
              onOpenWebsite={handleOpenWebsite}
              onClearHistory={() => {
                StorageService.clearHistory();
                setHistory([]);
              }}
              onSelectWebsite={handleSelectWebsite}
            />
          ) : viewMode === 'split' ? (
            // Split View: Obsidian Spider Web on Left, Cards on Right!
            <div className="flex-1 flex h-full min-w-0">
              <div className="flex-1 h-full min-w-0 relative">
                <GraphCanvas
                  websites={displayedWebsites}
                  activeNetworkId={activeNetworkId}
                  activeNetwork={networks.find((n) => n.id === activeNetworkId)}
                  searchQuery={searchQuery}
                  selectedNodeId={selectedNode?.id || null}
                  onSelectNode={setSelectedNode}
                  onOpenWebsite={handleOpenWebsite}
                  onContextMenu={(e, node) =>
                    setContextMenu({ x: e.clientX, y: e.clientY, node })
                  }
                  onConnectNodes={handleConnectNodes}
                  onOpenAddWebsiteInNetwork={(netId) => {
                    setActiveNetworkId(netId);
                    setIsAddModalOpen(true);
                  }}
                  settings={settings}
                />
              </div>
              <div className="w-80 lg:w-96 h-full border-l border-[#22222f] bg-[#0c0c10] overflow-y-auto hidden md:block">
                <GridView
                  websites={displayedWebsites}
                  networks={networks}
                  onOpenWebsite={handleOpenWebsite}
                  onSelectWebsite={handleSelectWebsite}
                  onToggleFavorite={handleToggleFavorite}
                  onEditWebsite={(site) => {
                    setEditingWebsite(site);
                    setIsEditModalOpen(true);
                  }}
                  onDeleteWebsite={handleDeleteWebsite}
                />
              </div>
            </div>
          ) : viewMode === 'grid' && activeTab !== 'graph' ? (
            <GridView
              websites={displayedWebsites}
              networks={networks}
              onOpenWebsite={handleOpenWebsite}
              onSelectWebsite={handleSelectWebsite}
              onToggleFavorite={handleToggleFavorite}
              onEditWebsite={(site) => {
                setEditingWebsite(site);
                setIsEditModalOpen(true);
              }}
              onDeleteWebsite={handleDeleteWebsite}
            />
          ) : viewMode === 'list' && activeTab !== 'graph' ? (
            <ListView
              websites={displayedWebsites}
              networks={networks}
              onOpenWebsite={handleOpenWebsite}
              onSelectWebsite={handleSelectWebsite}
              onToggleFavorite={handleToggleFavorite}
              onEditWebsite={(site) => {
                setEditingWebsite(site);
                setIsEditModalOpen(true);
              }}
              onDeleteWebsite={handleDeleteWebsite}
            />
          ) : (
            // Default Obsidian Spider Web Graph Canvas
            <GraphCanvas
              websites={displayedWebsites}
              activeNetworkId={activeNetworkId}
              activeNetwork={networks.find((n) => n.id === activeNetworkId)}
              searchQuery={searchQuery}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={setSelectedNode}
              onOpenWebsite={handleOpenWebsite}
              onContextMenu={(e, node) =>
                setContextMenu({ x: e.clientX, y: e.clientY, node })
              }
              onConnectNodes={handleConnectNodes}
              onOpenAddWebsiteInNetwork={(netId) => {
                setActiveNetworkId(netId);
                setIsAddModalOpen(true);
              }}
              settings={settings}
            />
          )}

          {/* Sliding Node Inspector on Right */}
          {selectedNode && (
            <NodeInspector
              node={selectedNode}
              websites={websites}
              onClose={() => setSelectedNode(null)}
              onOpenWebsite={handleOpenWebsite}
              onToggleFavorite={handleToggleFavorite}
              onEditWebsite={(site) => {
                setEditingWebsite(site);
                setIsEditModalOpen(true);
              }}
              onDeleteWebsite={handleDeleteWebsite}
              onSelectNodeById={handleSelectNodeById}
            />
          )}
        </div>
      </div>

      {/* Right Click Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onClose={() => setContextMenu(null)}
          onOpen={handleOpenWebsite}
          onEdit={(site) => {
            setEditingWebsite(site);
            setIsEditModalOpen(true);
          }}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDeleteWebsite}
          onDuplicate={handleDuplicateWebsite}
          onStartConnect={(node) => {
            setSelectedNode(node);
          }}
        />
      )}

      {/* Global Drag & Drop Overlay */}
      <GlobalDropZone
        isDragging={isDraggingGlobal}
        onDrop={async (e) => {
          e.preventDefault();
          dragCounter.current = 0;
          setIsDraggingGlobal(false);
          const parsed = await parseDroppedData(e.dataTransfer);
          if (parsed && parsed.url) {
            setDroppedInitialData({ url: parsed.url, name: parsed.name });
            setIsAddModalOpen(true);
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          dragCounter.current = 0;
          setIsDraggingGlobal(false);
        }}
      />

      {/* Modals */}
      <AddWebsiteModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setDroppedInitialData(null);
        }}
        onAddWebsite={(newSite) => {
          handleAddWebsite(newSite);
          setDroppedInitialData(null);
        }}
        networks={networks}
        activeNetworkId={activeNetworkId}
        initialNetworkId={activeNetworkId !== 'net-all' ? activeNetworkId : undefined}
        onAddNetwork={handleAddNetwork}
        initialUrl={droppedInitialData?.url}
        initialName={droppedInitialData?.name}
      />

      <DragDropGuideModal
        isOpen={isDragGuideOpen}
        onClose={() => setIsDragGuideOpen(false)}
        onStartAddWithUrl={(url, name) => {
          setDroppedInitialData({ url, name });
          setIsAddModalOpen(true);
        }}
      />

      <EditWebsiteModal
        isOpen={isEditModalOpen}
        website={editingWebsite}
        allWebsites={websites}
        networks={networks}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingWebsite(null);
        }}
        onSave={handleSaveWebsite}
      />

      <NetworkModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
        networks={networks}
        websites={websites}
        activeNetworkId={activeNetworkId}
        onSelectNetwork={(id) => setActiveNetworkId(id)}
        onAddNetwork={handleAddNetwork}
        onUpdateNetwork={handleUpdateNetwork}
        onDeleteNetwork={handleDeleteNetwork}
        onDuplicateNetwork={handleDuplicateNetwork}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetData={handleResetData}
        onOpenWipeModal={() => setIsClearDataModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        syncStatus={syncStatus}
        lastSyncedAt={lastSyncedAt}
        onManualSync={handleManualSyncNow}
        totalWebsites={websites.length}
        totalNetworks={networks.length}
      />

      <ClearAllDataModal
        isOpen={isClearDataModalOpen}
        onClose={() => setIsClearDataModalOpen(false)}
        onWipeAllData={handleWipeAllData}
        onResetToDefaults={handleResetData}
        websiteCount={websites.length}
        networkCount={networks.length}
        historyCount={history.length}
        currentUser={currentUser}
      />
    </div>
  );
}
