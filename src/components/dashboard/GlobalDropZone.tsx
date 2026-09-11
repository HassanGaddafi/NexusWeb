/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, Sparkles, FolderDown, Link2, ShieldCheck, Bookmark, FileText } from 'lucide-react';

interface GlobalDropZoneProps {
  isDragging: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const GlobalDropZone: React.FC<GlobalDropZoneProps> = ({
  isDragging,
  onDrop,
  onDragLeave,
}) => {
  if (!isDragging) return null;

  return (
    <div
      id="global-drag-drop-overlay"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className="fixed inset-0 z-[100] bg-[#09090c]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 border-4 border-dashed border-red-500/80 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto select-none"
    >
      {/* Background Animated Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Futuristic Spider-Web Concentric Rings */}
      <div className="absolute w-[450px] h-[450px] rounded-full border border-red-500/20 animate-ping opacity-25 pointer-events-none" />
      <div className="absolute w-[320px] h-[320px] rounded-full border border-red-500/30 animate-pulse opacity-40 pointer-events-none" />

      {/* Main Drop Target Box */}
      <div className="relative z-10 max-w-xl w-full bg-[#121218]/95 border border-red-500/60 rounded-3xl p-8 shadow-2xl shadow-red-950/60 text-center flex flex-col items-center">
        {/* Glowing Pulsing Icon Hub */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 shadow-lg shadow-red-600/30 animate-bounce duration-1000">
            <FolderDown className="w-10 h-10" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-1 shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Primary Titles */}
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
          أفلت أيقونة الموقع أو الرابط هنا
        </h2>
        <p className="text-sm font-mono text-red-400 font-medium mb-1">
          DROP TO INSTANTLY CAPTURE &amp; ORGANIZE NODE
        </p>
        <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
          يقوم NexusWeb تلقائيًا بقراءة الرابط، وجلب الأيقونة الأصلية، وتصنيف الموقع ذكيًا داخل شبكة المعرفة المرئية.
        </p>

        {/* Supported Shortcut Badges */}
        <div className="grid grid-cols-3 gap-3 w-full text-right" dir="rtl">
          <div className="bg-[#171722] border border-[#2c2c3e] rounded-xl p-3 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">أيقونة القفل</p>
              <p className="text-[10px] text-zinc-400 truncate">شريط العنوان (URL bar)</p>
            </div>
          </div>

          <div className="bg-[#171722] border border-[#2c2c3e] rounded-xl p-3 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <Bookmark className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">شريط الإشارات</p>
              <p className="text-[10px] text-zinc-400 truncate">Bookmarks Bar</p>
            </div>
          </div>

          <div className="bg-[#171722] border border-[#2c2c3e] rounded-xl p-3 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">ملفات الاختصار</p>
              <p className="text-[10px] text-zinc-400 truncate">.url / .webloc</p>
            </div>
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="mt-6 pt-4 border-t border-[#252535] flex items-center justify-between w-full text-[11px] text-zinc-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-red-400" />
            Auto Intelligence Node Parser
          </span>
          <span>إفلات للإضافة • ESC للإلغاء</span>
        </div>
      </div>
    </div>
  );
};
