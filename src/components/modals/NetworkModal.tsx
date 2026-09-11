/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Network as NetIcon,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Code2,
  ShieldAlert,
  Brain,
  Palette,
  Briefcase,
  Database,
  Globe,
  Cloud,
  Sparkles,
  Terminal,
  Folder,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Network, Website } from '../../types';

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  networks: Network[];
  websites: Website[];
  activeNetworkId: string;
  onAddNetwork: (network: Network) => void;
  onUpdateNetwork: (network: Network) => void;
  onDeleteNetwork: (networkId: string) => void;
  onDuplicateNetwork: (network: Network) => void;
  onSelectNetwork?: (networkId: string) => void;
}

const NETWORK_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#a855f7', // Purple
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#eab308', // Yellow
  '#6366f1', // Indigo
];

const AVAILABLE_ICONS = [
  { id: 'Network', label: 'Network', icon: NetIcon },
  { id: 'Code2', label: 'Code', icon: Code2 },
  { id: 'ShieldAlert', label: 'Security', icon: ShieldAlert },
  { id: 'Brain', label: 'AI', icon: Brain },
  { id: 'Palette', label: 'Design', icon: Palette },
  { id: 'Briefcase', label: 'Work', icon: Briefcase },
  { id: 'Database', label: 'Data', icon: Database },
  { id: 'Globe', label: 'Web', icon: Globe },
  { id: 'Cloud', label: 'Cloud', icon: Cloud },
  { id: 'Sparkles', label: 'Magic', icon: Sparkles },
  { id: 'Terminal', label: 'CLI', icon: Terminal },
  { id: 'Zap', label: 'Fast', icon: Zap },
];

export const NetworkModal: React.FC<NetworkModalProps> = ({
  isOpen,
  onClose,
  networks,
  websites,
  activeNetworkId,
  onAddNetwork,
  onUpdateNetwork,
  onDeleteNetwork,
  onDuplicateNetwork,
  onSelectNetwork,
}) => {
  const [editingNetworkId, setEditingNetworkId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#ef4444');
  const [icon, setIcon] = useState('Network');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const startCreate = (presetName?: string, presetColor?: string, presetIcon?: string) => {
    setIsCreating(true);
    setEditingNetworkId(null);
    setName(presetName || '');
    setDescription('');
    setColor(presetColor || '#ef4444');
    setIcon(presetIcon || 'Network');
  };

  const startEdit = (net: Network) => {
    setEditingNetworkId(net.id);
    setIsCreating(false);
    setName(net.name);
    setDescription(net.description);
    setColor(net.color || '#ef4444');
    setIcon(net.icon || 'Network');
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingNetworkId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isCreating) {
      const newNet: Network = {
        id: 'net-' + Date.now(),
        name: name.trim(),
        description: description.trim(),
        color,
        icon,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddNetwork(newNet);
      if (onSelectNetwork) {
        onSelectNetwork(newNet.id);
      }
    } else if (editingNetworkId) {
      const existing = networks.find((n) => n.id === editingNetworkId);
      if (existing) {
        onUpdateNetwork({
          ...existing,
          name: name.trim(),
          description: description.trim(),
          color,
          icon,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    cancelForm();
  };

  const renderIconComponent = (iconName?: string) => {
    const item = AVAILABLE_ICONS.find((i) => i.id === iconName);
    if (!item) return <NetIcon className="w-3.5 h-3.5" />;
    const Comp = item.icon;
    return <Comp className="w-3.5 h-3.5" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="manage-networks-modal"
        className="w-full max-w-2xl bg-[#121218] border border-[#272736] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#252535] flex items-center justify-between bg-[#151520]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
              <NetIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <span>إدارة وتصنيف شبكاتي (My Networks)</span>
                <span className="text-[10px] font-mono bg-[#222232] text-zinc-400 px-2 py-0.5 rounded-full border border-[#323246]">
                  {networks.length} شبكات
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                فصل بيئات العمل والمشاريع في شبكات مرئية مستقلة تظهر وتعمل فوراً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#20202e] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Presets Bar */}
          {!isCreating && !editingNetworkId && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                قوالب شبكات سريعة بنقرة واحدة (Quick Creation):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => startCreate('AI & Research Playground', '#a855f7', 'Brain')}
                  className="p-2.5 bg-[#171724] hover:bg-[#202034] border border-[#29293e] hover:border-purple-500/50 rounded-xl text-left flex items-center gap-2 text-xs text-zinc-200 transition-all"
                >
                  <Brain className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate">AI & Research</span>
                </button>
                <button
                  type="button"
                  onClick={() => startCreate('Cybersecurity Labs', '#ef4444', 'ShieldAlert')}
                  className="p-2.5 bg-[#171724] hover:bg-[#202034] border border-[#29293e] hover:border-red-500/50 rounded-xl text-left flex items-center gap-2 text-xs text-zinc-200 transition-all"
                >
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="truncate">Cybersecurity Labs</span>
                </button>
                <button
                  type="button"
                  onClick={() => startCreate('Engineering & Repos', '#3b82f6', 'Code2')}
                  className="p-2.5 bg-[#171724] hover:bg-[#202034] border border-[#29293e] hover:border-blue-500/50 rounded-xl text-left flex items-center gap-2 text-xs text-zinc-200 transition-all"
                >
                  <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">Engineering & Repos</span>
                </button>
              </div>
            </div>
          )}

          {/* Create or Edit Form */}
          {(isCreating || editingNetworkId) && (
            <form onSubmit={handleSave} className="bg-[#171724] border border-red-500/30 rounded-xl p-4 space-y-4 shadow-xl shadow-red-950/20">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {isCreating ? 'إنشاء شبكة جديدة' : 'تعديل الشبكة'}
                </h3>
                <span className="text-[11px] text-zinc-400">ستظهر العقد فوراً بمجرد إضافة أول موقع</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300 font-mono">اسم الشبكة (NETWORK NAME)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: مشاريع العمل، أدوات الذكاء الاصطناعي..."
                    required
                    autoFocus
                    className="w-full bg-[#111116] border border-[#2c2c3e] focus:border-red-500 text-white rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-300 font-mono">أيقونة الشبكة (ICON)</label>
                  <div className="grid grid-cols-6 gap-1 bg-[#111116] p-1.5 rounded-lg border border-[#2c2c3e]">
                    {AVAILABLE_ICONS.map((i) => {
                      const IconComp = i.icon;
                      return (
                        <button
                          key={i.id}
                          type="button"
                          onClick={() => setIcon(i.id)}
                          className={`p-1.5 rounded flex items-center justify-center transition-all ${
                            icon === i.id
                              ? 'bg-red-600 text-white'
                              : 'text-zinc-400 hover:text-white hover:bg-[#20202e]'
                          }`}
                          title={i.label}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-mono">وصف توضيحي للشبكة (DESCRIPTION)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف الهدف من هذا التجمع الشبكي لتنظيم المواقع"
                  className="w-full bg-[#111116] border border-[#2c2c3e] focus:border-red-500 text-white rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-mono">لون التمييز (ACCENT COLOR)</label>
                <div className="flex items-center gap-2">
                  {NETWORK_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        color === c ? 'scale-110 border-white ring-2 ring-red-500/40' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262638]">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-lg bg-[#20202e]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg flex items-center gap-1.5 shadow-lg shadow-red-950/40"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isCreating ? 'إنشاء وتفعيل الشبكة' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Networks */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                الشبكات المسجلة في حسابك ({networks.length})
              </span>
              {!isCreating && !editingNetworkId && (
                <button
                  onClick={() => startCreate()}
                  className="px-2.5 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ شبكة جديدة</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {networks.map((net) => {
                const isAll = net.id === 'net-all';
                const isActive = activeNetworkId === net.id;
                const nodeCount = isAll
                  ? websites.length
                  : websites.filter((w) => w.networkId === net.id).length;

                return (
                  <div
                    key={net.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-[#181827] border-red-500/50 ring-1 ring-red-500/20 shadow-md'
                        : 'bg-[#161622] border-[#272738] hover:border-[#34344a]'
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      onClick={() => {
                        if (onSelectNetwork) {
                          onSelectNetwork(net.id);
                          onClose();
                        }
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${net.color || '#ef4444'}20`,
                          borderColor: `${net.color || '#ef4444'}50`,
                          color: net.color || '#ef4444',
                        }}
                      >
                        {renderIconComponent(net.icon)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white truncate">{net.name}</span>
                          <span className="text-[10px] font-mono bg-[#212130] text-zinc-300 px-1.5 py-0.5 rounded border border-[#2d2d40]">
                            {nodeCount} {nodeCount === 1 ? 'عقدة' : 'مواقع'}
                          </span>
                          {isActive && (
                            <span className="text-[10px] text-red-400 font-mono flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> نشطة حالياً
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {net.description || 'شبكة عنكبوتية رقمية مخصصة'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {onSelectNetwork && !isActive && (
                        <button
                          onClick={() => {
                            onSelectNetwork(net.id);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-[11px] text-zinc-300 hover:text-white bg-[#222234] hover:bg-[#2c2c42] rounded-lg border border-[#323246] transition-colors"
                        >
                          تفعيل
                        </button>
                      )}

                      {!isAll && (
                        <>
                          <button
                            onClick={() => onDuplicateNetwork(net)}
                            title="نسخ الشبكة"
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#222232] rounded-lg transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => startEdit(net)}
                            title="تعديل"
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#222232] rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteNetwork(net.id)}
                            title="حذف"
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
