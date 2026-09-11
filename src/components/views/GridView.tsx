import React, { useState } from 'react';
import {
  ExternalLink,
  Star,
  MoreVertical,
  Edit3,
  Trash2,
  Tag,
  Link2,
  FolderInput,
} from 'lucide-react';
import { Website, Category, Network } from '../../types';
import { CATEGORY_COLORS } from '../../services/catalog';

interface GridViewProps {
  websites: Website[];
  networks: Network[];
  onOpenWebsite: (website: Website) => void;
  onSelectWebsite: (website: Website) => void;
  onToggleFavorite: (id: string) => void;
  onEditWebsite: (website: Website) => void;
  onDeleteWebsite: (id: string) => void;
}

export const GridView: React.FC<GridViewProps> = ({
  websites,
  networks,
  onOpenWebsite,
  onSelectWebsite,
  onToggleFavorite,
  onEditWebsite,
  onDeleteWebsite,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  if (websites.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0e]">
        <div className="w-16 h-16 rounded-2xl bg-[#14141d] border border-[#232332] flex items-center justify-center text-zinc-600 mb-4">
          <FolderInput className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-white">No websites in this view</h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          Add websites or switch networks from the top header to populate this grid.
        </p>
      </div>
    );
  }

  return (
    <div
      id="grid-view-container"
      className="flex-1 p-6 overflow-y-auto bg-[#0a0a0e]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {websites.map((site) => {
          const categoryColor = CATEGORY_COLORS[site.category] || '#ef4444';
          const networkName =
            networks.find((n) => n.id === site.networkId)?.name || 'Default';

          return (
            <div
              key={site.id}
              className="bg-[#121219] hover:bg-[#161622] border border-[#232332] hover:border-[#35354a] rounded-xl p-4.5 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-xl relative"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={site.favicon}
                      alt=""
                      className="w-8 h-8 rounded-lg bg-[#1a1a24] p-1 border border-[#2a2a3a] object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="min-w-0">
                      <h3
                        onClick={() => onSelectWebsite(site)}
                        className="text-sm font-semibold text-white group-hover:text-red-400 truncate cursor-pointer transition-colors"
                      >
                        {site.name}
                      </h3>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 block truncate"
                      >
                        {site.domain}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleFavorite(site.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        site.isFavorite
                          ? 'text-amber-400'
                          : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                      title={site.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          site.isFavorite ? 'fill-amber-400' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === site.id ? null : site.id)
                      }
                      className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-[#20202e] transition-colors"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {activeMenuId === site.id && (
                  <div className="absolute right-3 top-12 z-20 w-36 bg-[#161622] border border-[#2b2b3d] rounded-xl shadow-2xl py-1 animate-in fade-in duration-100 text-xs">
                    <button
                      onClick={() => {
                        onEditWebsite(site);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left text-zinc-300 hover:bg-[#232336] flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        onDeleteWebsite(site.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-zinc-400 line-clamp-2 mt-3 mb-3 leading-relaxed">
                  {site.description || 'No description provided.'}
                </p>
              </div>

              {/* Card Footer */}
              <div className="space-y-3 pt-3 border-t border-[#1f1f2c]">
                {/* Category & Network Badges */}
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span
                    className="px-2 py-0.5 rounded text-white font-medium"
                    style={{ backgroundColor: `${categoryColor}33`, border: `1px solid ${categoryColor}66` }}
                  >
                    {site.category}
                  </span>
                  <span className="text-zinc-500 truncate max-w-[120px]">
                    {networkName}
                  </span>
                </div>

                {/* Tags */}
                {site.tags && site.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {site.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-[#181824] text-zinc-400 px-1.5 py-0.5 rounded border border-[#252535] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                    {site.tags.length > 3 && (
                      <span className="text-[10px] text-zinc-600 font-mono self-center">
                        +{site.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* 1-Click Launch Button */}
                <button
                  onClick={() => onOpenWebsite(site)}
                  className="w-full bg-[#1a1a26] hover:bg-red-600 hover:text-white text-zinc-300 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-[#2b2b3d] hover:border-red-500 transition-all group"
                >
                  <span>Open Website</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
