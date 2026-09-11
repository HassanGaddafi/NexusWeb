import React from 'react';
import {
  ExternalLink,
  Star,
  Trash2,
  Edit3,
  X,
  Calendar,
  Clock,
  Tag,
  FolderGit2,
  Link as LinkIcon,
  Globe,
  Share2,
} from 'lucide-react';
import { GraphNode, Website } from '../../types';
import { CATEGORY_COLORS } from '../../services/catalog';

interface NodeInspectorProps {
  node: GraphNode | null;
  websites: Website[];
  onClose: () => void;
  onOpenWebsite: (website: Website) => void;
  onToggleFavorite: (websiteId: string) => void;
  onEditWebsite: (website: Website) => void;
  onDeleteWebsite: (websiteId: string) => void;
  onSelectNodeById: (id: string) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  websites,
  onClose,
  onOpenWebsite,
  onToggleFavorite,
  onEditWebsite,
  onDeleteWebsite,
  onSelectNodeById,
}) => {
  if (!node) return null;

  const isCategory = node.type === 'category';
  const site = !isCategory ? (node.data as Website) : null;
  const categoryName = isCategory ? (node.data as any).category : site?.category;
  const categoryColor = CATEGORY_COLORS[categoryName] || '#ef4444';

  // Connected websites
  const connectedWebsites = React.useMemo(() => {
    if (isCategory) {
      return websites.filter((w) => w.category === categoryName);
    }
    if (!site) return [];
    return websites.filter(
      (w) =>
        site.customConnections?.includes(w.id) ||
        (w.category === site.category && w.id !== site.id)
    );
  }, [isCategory, categoryName, site, websites]);

  return (
    <div
      id="node-inspector-panel"
      className="w-80 md:w-96 h-full bg-[#111116] border-l border-[#272732] flex flex-col shadow-2xl z-20 overflow-y-auto animate-in slide-in-from-right duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#272732] flex items-center justify-between bg-[#14141c]">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shadow-sm"
            style={{ backgroundColor: categoryColor }}
          />
          <span className="text-xs font-mono font-medium tracking-wider text-zinc-300 uppercase">
            {isCategory ? 'Category Hub' : 'Visual Node'}
          </span>
        </div>
        <button
          id="close-inspector-btn"
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#20202c] rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5 flex-1">
        {/* Node Identity Banner */}
        <div className="flex items-start gap-3.5">
          {site?.favicon ? (
            <img
              src={site.favicon}
              alt={site.name}
              className="w-12 h-12 rounded-xl bg-[#1c1c26] p-1.5 border border-[#2e2e3d] shrink-0 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shrink-0 border border-[#2e2e3d]"
              style={{ backgroundColor: `${categoryColor}33` }}
            >
              {node.label.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-white tracking-tight truncate">
              {node.label}
            </h2>
            {site?.domain && (
              <a
                href={site.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-zinc-400 hover:text-red-400 flex items-center gap-1 mt-0.5 group"
              >
                <Globe className="w-3 h-3 text-zinc-500 group-hover:text-red-400" />
                <span className="truncate">{site.domain}</span>
              </a>
            )}
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-md text-white font-medium"
                style={{ backgroundColor: `${categoryColor}44`, border: `1px solid ${categoryColor}88` }}
              >
                {categoryName}
              </span>
              {site?.subcategory && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#1d1d28] text-zinc-300 border border-[#2d2d3d]">
                  {site.subcategory}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Primary 1-Click Open Website Action */}
        {site && (
          <div className="flex gap-2">
            <button
              id="inspector-open-btn"
              onClick={() => onOpenWebsite(site)}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 hover:shadow-red-600/30 transition-all text-sm group"
            >
              <span>Open Website</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
              id="inspector-fav-btn"
              onClick={() => onToggleFavorite(site.id)}
              title={site.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-2.5 rounded-xl border transition-all ${
                site.isFavorite
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-[#181822] border-[#292938] text-zinc-400 hover:text-white'
              }`}
            >
              <Star className={`w-4 h-4 ${site.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        )}

        {/* Description */}
        <div className="bg-[#15151e] p-3.5 rounded-xl border border-[#252533] space-y-1.5">
          <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
            Description
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {site?.description ||
              (isCategory
                ? `Hub organizing ${connectedWebsites.length} resources in the ${categoryName} knowledge network.`
                : 'No description provided.')}
          </p>
        </div>

        {/* Tags */}
        {site?.tags && site.tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Tag className="w-3.5 h-3.5 text-zinc-500" />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {site.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[#191924] hover:bg-[#232332] text-zinc-300 px-2 py-1 rounded-md border border-[#2b2b3b] font-mono transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Timestamps */}
        {site && (
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-[#14141c] p-2.5 rounded-lg border border-[#222230]">
              <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Added
              </span>
              <span className="text-zinc-300">
                {new Date(site.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="bg-[#14141c] p-2.5 rounded-lg border border-[#222230]">
              <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Last Visited
              </span>
              <span className="text-zinc-300 truncate block">
                {site.lastVisited ? new Date(site.lastVisited).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        )}

        {/* Connected Nodes in Web */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-red-400" />
              <span className="font-medium text-white">Network Connections</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              {connectedWebsites.length} linked
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {connectedWebsites.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectNodeById(c.id)}
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-[#15151f] hover:bg-[#1f1f2d] border border-[#242432] transition-colors text-left group"
              >
                <img
                  src={c.favicon}
                  alt=""
                  className="w-4 h-4 rounded-sm object-contain shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-xs text-zinc-200 font-medium truncate flex-1 group-hover:text-red-400">
                  {c.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {c.domain}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer for Website Nodes */}
      {site && (
        <div className="p-4 border-t border-[#272732] bg-[#14141c] flex items-center justify-between gap-2">
          <button
            id="inspector-edit-btn"
            onClick={() => onEditWebsite(site)}
            className="flex-1 py-2 px-3 rounded-lg bg-[#1d1d28] hover:bg-[#282838] text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-[#2f2f40] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Node</span>
          </button>
          <button
            id="inspector-delete-btn"
            onClick={() => onDeleteWebsite(site.id)}
            className="py-2 px-3 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs font-medium flex items-center justify-center gap-1.5 border border-red-900/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
