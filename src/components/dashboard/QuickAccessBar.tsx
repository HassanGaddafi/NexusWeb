import React from 'react';
import { Star, ExternalLink, ChevronRight, Zap } from 'lucide-react';
import { Website } from '../../types';

interface QuickAccessBarProps {
  websites: Website[];
  onOpenWebsite: (website: Website) => void;
  onSelectWebsite: (website: Website) => void;
}

export const QuickAccessBar: React.FC<QuickAccessBarProps> = ({
  websites,
  onOpenWebsite,
  onSelectWebsite,
}) => {
  const favoriteSites = websites.filter((w) => w.isFavorite).slice(0, 10);

  if (favoriteSites.length === 0) return null;

  return (
    <div
      id="quick-access-bar"
      className="bg-[#0e0e14] border-b border-[#20202c] px-6 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar shrink-0"
    >
      <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono shrink-0">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-semibold text-zinc-300">QUICK ACCESS:</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {favoriteSites.map((site) => (
          <button
            key={site.id}
            onClick={() => onOpenWebsite(site)}
            title={`Launch ${site.name} (${site.domain}) in 1-click`}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#161622] hover:bg-[#202030] border border-[#272738] hover:border-red-500/40 text-xs text-zinc-300 hover:text-white transition-all group shrink-0"
          >
            <img
              src={site.favicon}
              alt=""
              className="w-3.5 h-3.5 rounded-sm object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-medium text-[11px] truncate max-w-[100px]">
              {site.name}
            </span>
            <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
};
