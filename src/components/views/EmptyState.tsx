import React from 'react';
import { Plus, Share2, Sparkles, Globe } from 'lucide-react';

interface EmptyStateProps {
  onAddWebsite: () => void;
  onResetSample: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddWebsite,
  onResetSample,
}) => {
  return (
    <div
      id="empty-network-state"
      className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#09090c] relative overflow-hidden"
    >
      {/* Background Cyber Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-red-600/5 blur-3xl pointer-events-none" />

      {/* Spider Web Radial Ring Graphic */}
      <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-dashed border-[#2b2b3d] animate-[spin_30s_linear_infinite]" />
        <div className="absolute inset-3 rounded-full border border-[#1f1f2e]" />
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white shadow-xl shadow-red-950/60 z-10">
          <Share2 className="w-7 h-7" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight">
        Build Your Digital Network
      </h2>
      <p className="text-xs text-zinc-400 max-w-md mt-2 mb-6 leading-relaxed">
        Start by adding your first website. NexusWeb will automatically detect the domain,
        categorize the resource, and insert a visual node into your interactive spider web graph.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={onAddWebsite}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-950/40 hover:shadow-red-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Your First Website</span>
        </button>
        <button
          onClick={onResetSample}
          className="bg-[#181824] hover:bg-[#222232] text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-medium border border-[#2b2b3d] transition-colors"
        >
          Load Curated Sample Stack
        </button>
      </div>
    </div>
  );
};
