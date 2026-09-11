import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Globe,
  Tag,
  FolderPlus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Link2,
  FolderDown,
  UploadCloud,
  FileCode,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Category, Network, Website } from '../../types';
import {
  ALL_CATEGORIES,
  autoAnalyzeWebsite,
  CATEGORY_COLORS,
  cleanUrl,
  extractDomain,
} from '../../services/catalog';
import { parseDroppedData, parseDroppedFile } from '../../services/shortcutParser';

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWebsite: (website: Website) => void;
  networks: Network[];
  activeNetworkId: string;
  initialUrl?: string;
  initialName?: string;
  initialNetworkId?: string;
  onAddNetwork?: (network: Network) => void;
}

export const AddWebsiteModal: React.FC<AddWebsiteModalProps> = ({
  isOpen,
  onClose,
  onAddWebsite,
  networks,
  activeNetworkId,
  initialUrl = '',
  initialName = '',
  initialNetworkId,
  onAddNetwork,
}) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Development');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [networkId, setNetworkId] = useState(
    initialNetworkId || (activeNetworkId === 'net-all' ? 'net-dev' : activeNetworkId)
  );
  const [isFavorite, setIsFavorite] = useState(false);

  // Quick Inline Network Creation
  const [isCreatingInlineNet, setIsCreatingInlineNet] = useState(false);
  const [inlineNetName, setInlineNetName] = useState('');
  const [inlineNetColor, setInlineNetColor] = useState('#ef4444');

  // Status & Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOverZone, setDragOverZone] = useState(false);
  const [shortcutSourceNotice, setShortcutSourceNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset and sync with initialUrl/initialName when opened
  useEffect(() => {
    if (isOpen) {
      const targetNet =
        initialNetworkId ||
        (activeNetworkId !== 'net-all'
          ? activeNetworkId
          : networks.find((n) => n.id !== 'net-all')?.id || 'net-dev');
      setNetworkId(targetNet);
      setIsCreatingInlineNet(false);
      setInlineNetName('');

      if (initialUrl) {
        setUrl(initialUrl);
        if (initialName) setName(initialName);
        setShortcutSourceNotice('تم جلب الموقع من الاختصار المسحوب تلقائياً ✨');
        const analyzed = autoAnalyzeWebsite(initialUrl, initialName);
        if (!initialName) setName(analyzed.name);
        setCategory(analyzed.category);
        setSubcategory(analyzed.subcategory);
        setDescription(analyzed.description);
        setTags(analyzed.tags);
        setAnalyzedSuccess(true);
      } else {
        setShortcutSourceNotice(null);
      }
    } else {
      setErrorMsg('');
      setDragOverZone(false);
    }
  }, [isOpen, initialUrl, initialName, initialNetworkId, activeNetworkId, networks]);

  // Auto-analyze as user types with debounce
  useEffect(() => {
    if (!url.trim() || url.trim().length < 4) {
      return;
    }

    const timer = setTimeout(() => {
      const result = autoAnalyzeWebsite(url, name);
      if (!name) setName(result.name);
      setCategory(result.category);
      setSubcategory(result.subcategory);
      if (!description) setDescription(result.description);
      if (tags.length === 0) setTags(result.tags);
      setAnalyzedSuccess(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [url]);

  // Deep AI Analyze (calls `/api/analyze-website` with fallback)
  const handleDeepAiAnalyze = async () => {
    if (!url.trim()) {
      setErrorMsg('Please enter a website URL first');
      return;
    }
    setIsAnalyzing(true);
    setErrorMsg('');

    try {
      const cleaned = cleanUrl(url);
      const res = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleaned }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        if (d.name) setName(d.name);
        if (d.category) setCategory(d.category);
        if (d.subcategory) setSubcategory(d.subcategory);
        if (d.description) setDescription(d.description);
        if (d.tags && Array.isArray(d.tags)) setTags(d.tags);
        setAnalyzedSuccess(true);
      } else {
        // Use rich client-side analysis
        const clientResult = autoAnalyzeWebsite(url, name);
        setName(clientResult.name);
        setCategory(clientResult.category);
        setSubcategory(clientResult.subcategory);
        setDescription(clientResult.description);
        setTags(clientResult.tags);
        setAnalyzedSuccess(true);
      }
    } catch {
      const clientResult = autoAnalyzeWebsite(url, name);
      setName(clientResult.name);
      setCategory(clientResult.category);
      setSubcategory(clientResult.subcategory);
      setDescription(clientResult.description);
      setTags(clientResult.tags);
      setAnalyzedSuccess(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle in-modal drop
  const handleDropOnModal = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverZone(false);
    const parsed = await parseDroppedData(e.dataTransfer);
    if (parsed && parsed.url) {
      setUrl(parsed.url);
      if (parsed.name) setName(parsed.name);
      setShortcutSourceNotice('تم استيراد الرابط من الاختصار بنجاح! ✨');
      const analyzed = autoAnalyzeWebsite(parsed.url, parsed.name);
      if (!parsed.name) setName(analyzed.name);
      setCategory(analyzed.category);
      setSubcategory(analyzed.subcategory);
      setDescription(analyzed.description);
      setTags(analyzed.tags);
      setAnalyzedSuccess(true);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const parsed = await parseDroppedFile(file);
      if (parsed && parsed.url) {
        setUrl(parsed.url);
        if (parsed.name) setName(parsed.name);
        setShortcutSourceNotice(`تم استخراج الرابط من ملف ${file.name} ✨`);
        const analyzed = autoAnalyzeWebsite(parsed.url, parsed.name);
        if (!parsed.name) setName(analyzed.name);
        setCategory(analyzed.category);
        setSubcategory(analyzed.subcategory);
        setDescription(analyzed.description);
        setTags(analyzed.tags);
        setAnalyzedSuccess(true);
      }
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMsg('URL is required');
      return;
    }

    const cleaned = cleanUrl(url);
    const domain = extractDomain(cleaned);
    const finalName = name.trim() || domain;

    const newWebsite: Website = {
      id: 'w-' + Date.now(),
      name: finalName,
      url: cleaned,
      domain,
      favicon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
      description: description.trim() || `Resource on ${domain}`,
      category,
      subcategory: subcategory.trim() || 'General',
      tags: tags.length > 0 ? tags : [domain.split('.')[0]],
      networkId: networkId || 'net-dev',
      isFavorite,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customConnections: [],
    };

    onAddWebsite(newWebsite);

    // Confetti effect!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#dc2626', '#ffffff'],
    });

    // Reset Form
    setUrl('');
    setName('');
    setDescription('');
    setTags([]);
    setAnalyzedSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  const currentDomain = url ? extractDomain(url) : '';
  const currentFavicon = currentDomain
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(currentDomain)}&sz=64`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="add-website-modal"
        className="w-full max-w-2xl bg-[#121218] border border-[#272736] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#252535] flex items-center justify-between bg-[#151520]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Add Website to Network</h2>
              <p className="text-xs text-zinc-400">
                Automated URL intelligence, categorization, and visual node insertion.
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Shortcut / Drop notification badge */}
          {shortcutSourceNotice && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-700/50 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{shortcutSourceNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setShortcutSourceNotice(null)}
                className="text-emerald-400/60 hover:text-emerald-200 text-[11px]"
              >
                إخفاء
              </button>
            </div>
          )}

          {/* Quick Drag & Drop Shortcut Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverZone(true);
            }}
            onDragLeave={() => setDragOverZone(false)}
            onDrop={handleDropOnModal}
            className={`border border-dashed rounded-xl p-3.5 transition-all flex items-center justify-between gap-3 ${
              dragOverZone
                ? 'border-red-500 bg-red-950/30 shadow-lg shadow-red-950/50 scale-[1.01]'
                : 'border-[#2d2d40] bg-[#161622]/70 hover:border-zinc-500/80 hover:bg-[#181826]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <FolderDown className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-semibold text-white truncate">
                  إمساك وإفلات سريع (Drag &amp; Drop)
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  أفلت قفل شريط العنوان، أو الرابط، أو ملف الاختصار (.url / .webloc)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept=".url,.webloc,.desktop,.html,.htm,.txt"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-[#222234] hover:bg-[#2c2c40] text-zinc-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 border border-[#323248] transition-colors"
                title="اختر ملف اختصار من جهازك"
              >
                <UploadCloud className="w-3.5 h-3.5 text-red-400" />
                <span>ملف اختصار</span>
              </button>
            </div>
          </div>

          {/* URL Input with AI Analyze Button */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-300 flex items-center justify-between">
              <span>WEBSITE URL *</span>
              <span className="text-[11px] text-zinc-500 font-sans">e.g. https://portswigger.net</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-zinc-500">
                <Globe className="w-4 h-4" />
              </div>
              <input
                id="add-url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="github.com or https://tryhackme.com"
                required
                autoFocus
                className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white rounded-xl pl-10 pr-28 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-600 font-mono"
              />
              <button
                type="button"
                onClick={handleDeepAiAnalyze}
                disabled={isAnalyzing || !url.trim()}
                className="absolute right-2 bg-[#232334] hover:bg-red-600 hover:text-white text-zinc-300 disabled:opacity-40 disabled:hover:bg-[#232334] px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                )}
                <span>AI Analyze</span>
              </button>
            </div>
          </div>

          {/* Live Node Preview Card */}
          {url.trim() && (
            <div className="bg-[#171724] border border-[#2a2a3c] rounded-xl p-4 flex items-center gap-4 transition-all">
              {currentFavicon ? (
                <img
                  src={currentFavicon}
                  alt=""
                  className="w-10 h-10 rounded-xl bg-[#20202e] p-1.5 border border-[#323246] object-contain shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center font-bold text-red-400 text-base">
                  {name ? name.charAt(0).toUpperCase() : 'W'}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate">
                    {name || currentDomain || 'New Node'}
                  </span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: `${CATEGORY_COLORS[category]}44` }}
                  >
                    {category}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {description || `Auto-connecting node to ${category} network`}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
            </div>
          )}

          {/* Website Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                NAME / LABEL
              </label>
              <input
                id="add-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. GitHub"
                className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                CATEGORY
              </label>
              <select
                id="add-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subcategory & Target Network */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                SUBCATEGORY
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Code Hosting & CI/CD"
                className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  ASSIGN TO NETWORK
                </label>
                {onAddNetwork && !isCreatingInlineNet && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingInlineNet(true)}
                    className="text-[11px] text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ شبكة جديدة</span>
                  </button>
                )}
              </div>

              {isCreatingInlineNet ? (
                <div className="p-3 bg-[#151522] border border-red-500/40 rounded-xl space-y-2.5 animate-in fade-in duration-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-300 font-bold">إنشاء شبكة جديدة:</span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingInlineNet(false)}
                      className="text-zinc-500 hover:text-white text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                  <input
                    type="text"
                    value={inlineNetName}
                    onChange={(e) => setInlineNetName(e.target.value)}
                    placeholder="اسم الشبكة الجديدة (مثال: مشاريع العمل)"
                    className="w-full bg-[#0e0e14] border border-[#2d2d3f] text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-red-500"
                    autoFocus
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {['#ef4444', '#3b82f6', '#10b981', '#a855f7', '#f97316', '#06b6d4'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setInlineNetColor(c)}
                          className={`w-4 h-4 rounded-full border ${
                            inlineNetColor === c ? 'scale-125 border-white' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={!inlineNetName.trim()}
                      onClick={() => {
                        if (!inlineNetName.trim()) return;
                        const newNet: Network = {
                          id: 'net-' + Date.now(),
                          name: inlineNetName.trim(),
                          description: 'شبكة مخصصة مضافة حديثاً',
                          color: inlineNetColor,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        onAddNetwork?.(newNet);
                        setNetworkId(newNet.id);
                        setIsCreatingInlineNet(false);
                      }}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                    >
                      إنشاء وتعيين
                    </button>
                  </div>
                </div>
              ) : (
                <select
                  value={networkId}
                  onChange={(e) => setNetworkId(e.target.value)}
                  className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
                >
                  {networks
                    .filter((n) => n.id !== 'net-all')
                    .map((net) => (
                      <option key={net.id} value={net.id}>
                        {net.name}
                      </option>
                    ))}
                </select>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-300">
              SHORT DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this tool or site valuable in your workflow?"
              rows={2}
              className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl p-3 text-xs outline-none transition-all placeholder:text-zinc-600 resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-medium text-zinc-300 flex items-center justify-between">
              <span>TAGS FOR GRAPH CLUSTERING</span>
              <span className="text-[11px] text-zinc-500 font-sans">Press Enter to add</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="e.g. Git, PenTesting, LLM"
                className="flex-1 bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3.5 py-2 text-xs outline-none transition-all placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-[#232332] hover:bg-[#2c2c3e] text-zinc-200 px-3 py-2 rounded-xl text-xs font-medium"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-[#1a1a26] text-zinc-300 px-2 py-1 rounded-md text-xs border border-[#2c2c3f]"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-zinc-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="favorite-toggle"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 rounded bg-[#171722] border-[#2d2d3f] text-red-600 focus:ring-red-500"
            />
            <label htmlFor="favorite-toggle" className="text-xs text-zinc-300 cursor-pointer">
              Add to Quick Access Favorites
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#252535] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1c1c28] hover:bg-[#252534] text-zinc-400 hover:text-white text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-add-website-btn"
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-950/50 hover:shadow-red-600/30 transition-all"
            >
              <span>Analyze &amp; Insert Node</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
