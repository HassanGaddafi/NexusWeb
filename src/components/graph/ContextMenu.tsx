import React, { useEffect, useRef } from 'react';
import {
  ExternalLink,
  Edit3,
  Star,
  Trash2,
  Copy,
  Link2,
  FolderInput,
  Tag,
} from 'lucide-react';
import { GraphNode, Website } from '../../types';

interface ContextMenuProps {
  x: number;
  y: number;
  node: GraphNode;
  onClose: () => void;
  onOpen: (site: Website) => void;
  onEdit: (site: Website) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (site: Website) => void;
  onStartConnect: (node: GraphNode) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  node,
  onClose,
  onOpen,
  onEdit,
  onToggleFavorite,
  onDelete,
  onDuplicate,
  onStartConnect,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const isSite = node.type === 'website';
  const site = isSite ? (node.data as Website) : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust menu position so it doesn't overflow window
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 260);

  return (
    <div
      ref={menuRef}
      id="graph-context-menu"
      style={{ left: adjustedX, top: adjustedY }}
      className="fixed z-50 w-52 bg-[#14141c]/95 backdrop-blur-md border border-[#2c2c3d] rounded-xl shadow-2xl p-1.5 space-y-0.5 text-xs text-zinc-300 font-sans animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="px-2.5 py-1.5 border-b border-[#252535] mb-1">
        <p className="font-semibold text-white truncate">{node.label}</p>
        <p className="text-[10px] font-mono text-zinc-500 truncate">{node.subLabel}</p>
      </div>

      {site && (
        <button
          onClick={() => {
            onOpen(site);
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-left group"
        >
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
          <span>Open Website</span>
        </button>
      )}

      {site && (
        <button
          onClick={() => {
            onToggleFavorite(site.id);
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#20202e] text-zinc-300 hover:text-white transition-colors text-left"
        >
          <Star
            className={`w-3.5 h-3.5 ${
              site.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'
            }`}
          />
          <span>{site.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}</span>
        </button>
      )}

      <button
        onClick={() => {
          onStartConnect(node);
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#20202e] text-zinc-300 hover:text-white transition-colors text-left"
      >
        <Link2 className="w-3.5 h-3.5 text-red-400" />
        <span>Connect to Node...</span>
      </button>

      {site && (
        <button
          onClick={() => {
            onEdit(site);
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#20202e] text-zinc-300 hover:text-white transition-colors text-left"
        >
          <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
          <span>Edit Details</span>
        </button>
      )}

      {site && (
        <button
          onClick={() => {
            onDuplicate(site);
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#20202e] text-zinc-300 hover:text-white transition-colors text-left"
        >
          <Copy className="w-3.5 h-3.5 text-zinc-400" />
          <span>Duplicate Node</span>
        </button>
      )}

      <div className="border-t border-[#252535] my-1" />

      {site && (
        <button
          onClick={() => {
            onDelete(site.id);
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-red-950/60 text-red-400 hover:text-red-300 transition-colors text-left"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Node</span>
        </button>
      )}
    </div>
  );
};
