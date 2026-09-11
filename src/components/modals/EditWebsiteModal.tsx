import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, Globe, Tag, Link2 } from 'lucide-react';
import { Category, Network, Website } from '../../types';
import { ALL_CATEGORIES, cleanUrl, extractDomain } from '../../services/catalog';

interface EditWebsiteModalProps {
  website: Website | null;
  allWebsites: Website[];
  networks: Network[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedWebsite: Website) => void;
}

export const EditWebsiteModal: React.FC<EditWebsiteModalProps> = ({
  website,
  allWebsites,
  networks,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !website) return null;

  const [name, setName] = useState(website.name);
  const [url, setUrl] = useState(website.url);
  const [category, setCategory] = useState<Category>(website.category);
  const [subcategory, setSubcategory] = useState(website.subcategory);
  const [description, setDescription] = useState(website.description);
  const [networkId, setNetworkId] = useState(website.networkId);
  const [isFavorite, setIsFavorite] = useState(website.isFavorite);
  const [tags, setTags] = useState<string[]>(website.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [customConnections, setCustomConnections] = useState<string[]>(
    website.customConnections || []
  );

  useEffect(() => {
    setName(website.name);
    setUrl(website.url);
    setCategory(website.category);
    setSubcategory(website.subcategory);
    setDescription(website.description);
    setNetworkId(website.networkId);
    setIsFavorite(website.isFavorite);
    setTags(website.tags || []);
    setCustomConnections(website.customConnections || []);
  }, [website]);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  const handleToggleConnection = (targetId: string) => {
    if (customConnections.includes(targetId)) {
      setCustomConnections(customConnections.filter((id) => id !== targetId));
    } else {
      setCustomConnections([...customConnections, targetId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanUrl(url);
    const domain = extractDomain(cleaned);

    const updated: Website = {
      ...website,
      name: name.trim() || domain,
      url: cleaned,
      domain,
      favicon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
      category,
      subcategory: subcategory.trim() || 'General',
      description: description.trim(),
      networkId,
      isFavorite,
      tags,
      customConnections,
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    onClose();
  };

  const otherWebsites = allWebsites.filter((w) => w.id !== website.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="edit-website-modal"
        className="w-full max-w-2xl bg-[#121218] border border-[#272736] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        <div className="px-6 py-4 border-b border-[#252535] flex items-center justify-between bg-[#151520]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Edit Visual Node</h2>
              <p className="text-xs text-zinc-400">Update node metadata, tags, and connections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#20202e] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">WEBSITE NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">SUBCATEGORY</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">ASSIGNED NETWORK</label>
              <select
                value={networkId}
                onChange={(e) => setNetworkId(e.target.value)}
                className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                {networks
                  .filter((n) => n.id !== 'net-all')
                  .map((net) => (
                    <option key={net.id} value={net.id}>
                      {net.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="edit-fav"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded bg-[#171722] border-[#2d2d3f] text-red-600 focus:ring-red-500"
              />
              <label htmlFor="edit-fav" className="text-xs text-zinc-300 cursor-pointer">
                Favorite (Visible in Quick Access)
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-zinc-300">DESCRIPTION</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl p-3 text-xs outline-none transition-all resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-medium text-zinc-300">TAGS</label>
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
                placeholder="Add tag and press enter"
                className="flex-1 bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl px-3 py-2 text-xs outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-[#232332] text-zinc-300 px-3 py-2 rounded-xl text-xs"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 bg-[#1a1a26] text-zinc-300 px-2 py-1 rounded-md text-xs border border-[#2c2c3f]"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Direct Graph Connections */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-medium text-zinc-300 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-red-400" />
              <span>DIRECT NODE CONNECTIONS (GRAPH EDGES)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1">
              {otherWebsites.map((target) => {
                const isLinked = customConnections.includes(target.id);
                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => handleToggleConnection(target.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-all ${
                      isLinked
                        ? 'bg-red-950/30 border-red-800/60 text-white'
                        : 'bg-[#151520] border-[#252535] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <img
                      src={target.favicon}
                      alt=""
                      className="w-3.5 h-3.5 object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="truncate flex-1">{target.name}</span>
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isLinked ? 'bg-red-500' : 'bg-zinc-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#252535] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1c1c28] hover:bg-[#252534] text-zinc-400 hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
