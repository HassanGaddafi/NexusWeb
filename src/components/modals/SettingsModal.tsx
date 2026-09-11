import React, { useState } from 'react';
import {
  X,
  Settings as SettingsIcon,
  Sliders,
  Monitor,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  FileJson,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { GraphSettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GraphSettings;
  onUpdateSettings: (settings: GraphSettings) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onResetData: () => void;
  onOpenWipeModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onResetData,
  onOpenWipeModal,
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'behavior' | 'data'>('graph');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSliderChange = (key: keyof GraphSettings, value: number) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleToggle = (key: keyof GraphSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = onImportData(content);
        if (ok) {
          setImportStatus('Backup restored successfully!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid JSON backup format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="settings-modal"
        className="w-full max-w-xl bg-[#121218] border border-[#272736] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-[#252535] flex items-center justify-between bg-[#151520]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">System Settings</h2>
              <p className="text-xs text-zinc-400">Graph physics, interaction rules, and backups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#20202e] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#252535] bg-[#14141d] px-6">
          <button
            onClick={() => setActiveTab('graph')}
            className={`py-3 px-4 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'graph'
                ? 'border-red-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>GRAPH ENGINE</span>
          </button>
          <button
            onClick={() => setActiveTab('behavior')}
            className={`py-3 px-4 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'behavior'
                ? 'border-red-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>BEHAVIOR &amp; ACCESS</span>
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-3 px-4 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'data'
                ? 'border-red-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>DATA &amp; BACKUP</span>
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'graph' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300">NODE SIZE</span>
                  <span className="text-red-400 font-bold">{settings.nodeSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="28"
                  value={settings.nodeSize}
                  onChange={(e) => handleSliderChange('nodeSize', Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300">SPIDER FILAMENT THICKNESS</span>
                  <span className="text-red-400 font-bold">{settings.connectionThickness}px</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.2"
                  value={settings.connectionThickness}
                  onChange={(e) =>
                    handleSliderChange('connectionThickness', Number(e.target.value))
                  }
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300">REPULSION &amp; WEB SPREAD</span>
                  <span className="text-red-400 font-bold">
                    {Math.round(settings.forceDensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={settings.forceDensity}
                  onChange={(e) =>
                    handleSliderChange('forceDensity', Number(e.target.value))
                  }
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#252535] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white block">Category Hub Nodes</span>
                    <span className="text-[11px] text-zinc-500">
                      Show central category anchors in the visual graph
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showCategories}
                    onChange={() => handleToggle('showCategories')}
                    className="w-4 h-4 rounded bg-[#171722] border-[#2d2d3f] text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white block">Always Show Labels</span>
                    <span className="text-[11px] text-zinc-500">
                      Render node titles constantly (vs on hover)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showLabels}
                    onChange={() => handleToggle('showLabels')}
                    className="w-4 h-4 rounded bg-[#171722] border-[#2d2d3f] text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white block">Spider Web Particles</span>
                    <span className="text-[11px] text-zinc-500">
                      Animate energy pulses traveling along connections
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.spiderWebParticles}
                    onChange={() => handleToggle('spiderWebParticles')}
                    className="w-4 h-4 rounded bg-[#171722] border-[#2d2d3f] text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#161622] border border-[#272738]">
                <div>
                  <span className="text-xs font-medium text-white block">Open in New Tab</span>
                  <span className="text-[11px] text-zinc-400">
                    Launch websites in target=_blank without replacing dashboard
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.openInNewTab}
                  onChange={() => handleToggle('openInNewTab')}
                  className="w-4 h-4 rounded bg-[#171722] border-[#2d2d3f] text-red-600 focus:ring-red-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#161622] border border-[#272738]">
                <div>
                  <span className="text-xs font-medium text-white block">Auto Categorization</span>
                  <span className="text-[11px] text-zinc-400">
                    Automatically deduce categories and tags from URL input
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoCategorization}
                  onChange={() => handleToggle('autoCategorization')}
                  className="w-4 h-4 rounded bg-[#171722] border-[#2d2d3f] text-red-600 focus:ring-red-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#161622] border border-[#272738]">
                <div>
                  <span className="text-xs font-medium text-white block">Smart Relationship Discovery</span>
                  <span className="text-[11px] text-zinc-400">
                    Form interconnecting web links between items with shared tags
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoConnections}
                  onChange={() => handleToggle('autoConnections')}
                  className="w-4 h-4 rounded bg-[#171722] border-[#2d2d3f] text-red-600 focus:ring-red-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              {importStatus && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{importStatus}</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#161622] border border-[#272738] space-y-2">
                <div className="flex items-center gap-2 text-white font-medium text-xs">
                  <Download className="w-4 h-4 text-red-400" />
                  <span>Export Local Database</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Save all visual nodes, networks, custom connections, and settings to a JSON file.
                </p>
                <button
                  onClick={onExportData}
                  className="px-4 py-2 bg-[#212130] hover:bg-[#2c2c3e] text-zinc-200 hover:text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Download JSON Backup
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#161622] border border-[#272738] space-y-2">
                <div className="flex items-center gap-2 text-white font-medium text-xs">
                  <Upload className="w-4 h-4 text-red-400" />
                  <span>Restore from Backup</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Upload a previously exported JSON backup to recover your entire network.
                </p>
                <label className="inline-block px-4 py-2 bg-[#212130] hover:bg-[#2c2c3e] text-zinc-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer">
                  <span>Select JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-medium text-xs">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Sample Dataset</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Restores default developer knowledge network with preloaded tech, security, and AI tools.
                </p>
                <button
                  onClick={() => {
                    onResetData();
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-lg text-xs font-medium border border-red-900/40 transition-colors cursor-pointer"
                >
                  استعادة العينات الافتراضية
                </button>
              </div>

              {/* Danger Zone: Wipe All & Fresh Start */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-black/40 border border-red-600/40 space-y-2.5">
                <div className="flex items-center gap-2 text-red-400 font-semibold text-xs">
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>حذف كل البيانات والبدء من جديد (Fresh Start)</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  تفريغ شامل لكافة المواقع والشبكات المحفوظة محلياً وسحابياً، للبدء بصفحة بيضاء فارغة تماماً دون أي مواقع سابقة.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenWipeModal) {
                      onOpenWipeModal();
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-red-950/60 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>فتح خيارات حذف كل البيانات</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#252535] bg-[#151520] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
