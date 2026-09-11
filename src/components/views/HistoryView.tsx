import React from 'react';
import { History, Trash2, ExternalLink, Clock, Calendar, Star } from 'lucide-react';
import { HistoryItem, Website } from '../../types';
import { CATEGORY_COLORS } from '../../services/catalog';

interface HistoryViewProps {
  mode: 'recent-visited' | 'recent-added';
  history: HistoryItem[];
  websites: Website[];
  onOpenWebsite: (website: Website) => void;
  onClearHistory: () => void;
  onSelectWebsite: (website: Website) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  mode,
  history,
  websites,
  onOpenWebsite,
  onClearHistory,
  onSelectWebsite,
}) => {
  const isVisited = mode === 'recent-visited';

  // Sort websites for recently added
  const recentAddedWebsites = React.useMemo(() => {
    return [...websites].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [websites]);

  return (
    <div
      id="history-view-container"
      className="flex-1 p-6 overflow-y-auto bg-[#0a0a0e] space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#20202c]">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            {isVisited ? (
              <>
                <History className="w-4 h-4 text-red-400" />
                <span>Recently Visited Websites</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Recently Added Visual Nodes</span>
              </>
            )}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isVisited
              ? 'Websites launched directly from your NexusWeb network.'
              : 'Chronological timeline of tools and sites added to your digital graph.'}
          </p>
        </div>

        {isVisited && history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg flex items-center gap-1.5 border border-[#252535] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {isVisited ? (
        history.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-mono text-xs">
            No visited websites recorded yet. Launch any website to start tracking!
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => {
              const matchedSite = websites.find((w) => w.id === item.websiteId);
              const color = CATEGORY_COLORS[item.category] || '#ef4444';

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#121219] hover:bg-[#181822] border border-[#222230] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-red-400 truncate">
                          {item.websiteName}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 truncate">
                          {item.url}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-zinc-400">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (matchedSite) {
                        onOpenWebsite(matchedSite);
                      } else {
                        window.open(item.url, '_blank');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#1c1c28] hover:bg-red-600 hover:text-white text-zinc-300 text-xs font-medium flex items-center gap-1.5 border border-[#2c2c3e] transition-all"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-2">
          {recentAddedWebsites.map((site) => {
            const color = CATEGORY_COLORS[site.category] || '#ef4444';

            return (
              <div
                key={site.id}
                onClick={() => onSelectWebsite(site)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#121219] hover:bg-[#181822] border border-[#222230] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={site.favicon}
                    alt=""
                    className="w-6 h-6 rounded-md object-contain shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white group-hover:text-red-400 truncate">
                        {site.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {site.domain}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {site.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: `${color}33` }}
                  >
                    {site.category}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                    {new Date(site.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenWebsite(site);
                    }}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
