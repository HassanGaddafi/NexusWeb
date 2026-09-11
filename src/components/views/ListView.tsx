import React from 'react';
import { ExternalLink, Star, Edit3, Trash2, Globe } from 'lucide-react';
import { Website, Network } from '../../types';
import { CATEGORY_COLORS } from '../../services/catalog';

interface ListViewProps {
  websites: Website[];
  networks: Network[];
  onOpenWebsite: (website: Website) => void;
  onSelectWebsite: (website: Website) => void;
  onToggleFavorite: (id: string) => void;
  onEditWebsite: (website: Website) => void;
  onDeleteWebsite: (id: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  websites,
  networks,
  onOpenWebsite,
  onSelectWebsite,
  onToggleFavorite,
  onEditWebsite,
  onDeleteWebsite,
}) => {
  if (websites.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0e]">
        <p className="text-xs text-zinc-500 font-mono">No websites in this list</p>
      </div>
    );
  }

  return (
    <div
      id="list-view-container"
      className="flex-1 p-6 overflow-y-auto bg-[#0a0a0e]"
    >
      <div className="bg-[#121219] border border-[#232332] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#20202c] bg-[#151520] text-[10px] font-mono uppercase text-zinc-400">
              <th className="py-3 px-4 w-10">Fav</th>
              <th className="py-3 px-4">Website &amp; Domain</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 hidden md:table-cell">Network</th>
              <th className="py-3 px-4 hidden lg:table-cell">Tags</th>
              <th className="py-3 px-4 hidden sm:table-cell">Last Visited</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2a] text-xs">
            {websites.map((site) => {
              const categoryColor = CATEGORY_COLORS[site.category] || '#ef4444';
              const networkName =
                networks.find((n) => n.id === site.networkId)?.name || 'Default';

              return (
                <tr
                  key={site.id}
                  className="hover:bg-[#181824] transition-colors group cursor-pointer"
                  onClick={() => onSelectWebsite(site)}
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleFavorite(site.id)}
                      className={`p-1 rounded transition-colors ${
                        site.isFavorite
                          ? 'text-amber-400'
                          : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          site.isFavorite ? 'fill-amber-400' : ''
                        }`}
                      />
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={site.favicon}
                        alt=""
                        className="w-5 h-5 rounded object-contain shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-white group-hover:text-red-400 truncate block">
                          {site.name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 truncate block">
                          {site.domain}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded text-white font-medium"
                      style={{ backgroundColor: `${categoryColor}33` }}
                    >
                      {site.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 hidden md:table-cell text-zinc-400 text-xs font-mono">
                    {networkName}
                  </td>

                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {site.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] bg-[#1b1b28] text-zinc-400 px-1.5 py-0.5 rounded border border-[#272738] font-mono"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 hidden sm:table-cell text-[11px] font-mono text-zinc-400">
                    {site.lastVisited
                      ? new Date(site.lastVisited).toLocaleDateString()
                      : 'Never'}
                  </td>

                  <td
                    className="py-3 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onOpenWebsite(site)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
                        title="Open Website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditWebsite(site)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#252536] rounded-lg transition-colors"
                        title="Edit Node"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteWebsite(site.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete Node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
