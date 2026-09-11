import React from 'react';
import { Globe, Network as NetIcon, Layers, Star, Clock, Sparkles } from 'lucide-react';
import { Category, Network, Website } from '../../types';

interface StatsCardsProps {
  websites: Website[];
  networks: Network[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ websites, networks }) => {
  const totalWebsites = websites.length;
  const totalNetworks = networks.filter((n) => n.id !== 'net-all').length;

  const uniqueCategories = new Set(websites.map((w) => w.category)).size;
  const favoritesCount = websites.filter((w) => w.isFavorite).length;

  // Websites added in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentlyAddedCount = websites.filter(
    (w) => new Date(w.createdAt) >= sevenDaysAgo
  ).length;

  const stats = [
    {
      label: 'TOTAL WEBSITES',
      value: totalWebsites,
      unit: 'Nodes',
      icon: Globe,
      accent: 'text-red-500',
      borderColor: 'hover:border-red-500/40',
      bgGlow: 'from-red-600/10 to-transparent',
    },
    {
      label: 'NETWORKS',
      value: totalNetworks,
      unit: 'Clusters',
      icon: NetIcon,
      accent: 'text-blue-400',
      borderColor: 'hover:border-blue-500/40',
      bgGlow: 'from-blue-600/10 to-transparent',
    },
    {
      label: 'CATEGORIES',
      value: uniqueCategories,
      unit: 'Hubs',
      icon: Layers,
      accent: 'text-purple-400',
      borderColor: 'hover:border-purple-500/40',
      bgGlow: 'from-purple-600/10 to-transparent',
    },
    {
      label: 'FAVORITES',
      value: favoritesCount,
      unit: 'Bookmarked',
      icon: Star,
      accent: 'text-amber-400',
      borderColor: 'hover:border-amber-500/40',
      bgGlow: 'from-amber-600/10 to-transparent',
    },
    {
      label: 'RECENTLY ADDED',
      value: recentlyAddedCount || websites.slice(0, 5).length,
      unit: 'This Week',
      icon: Clock,
      accent: 'text-emerald-400',
      borderColor: 'hover:border-emerald-500/40',
      bgGlow: 'from-emerald-600/10 to-transparent',
    },
  ];

  return (
    <div
      id="dashboard-stats-grid"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 px-6 bg-[#0c0c10] border-b border-[#232330]"
    >
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden bg-[#13131b] border border-[#232332] ${item.borderColor} p-3.5 rounded-xl transition-all duration-200 group flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                {item.label}
              </span>
              <Icon className={`w-3.5 h-3.5 ${item.accent} opacity-80 group-hover:opacity-100 transition-opacity`} />
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-white tracking-tight">
                {item.value}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {item.unit}
              </span>
            </div>

            {/* Subtle bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/0 group-hover:via-red-500/50 to-transparent transition-all" />
          </div>
        );
      })}
    </div>
  );
};
