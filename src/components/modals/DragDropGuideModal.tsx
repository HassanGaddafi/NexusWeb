/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  ShieldCheck,
  Bookmark,
  FileText,
  MousePointerClick,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  FolderDown,
  ExternalLink,
  Laptop,
  Zap,
} from 'lucide-react';
import { parseDroppedData, ParsedShortcut } from '../../services/shortcutParser';

interface DragDropGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAddWithUrl?: (url: string, name?: string) => void;
}

export const DragDropGuideModal: React.FC<DragDropGuideModalProps> = ({
  isOpen,
  onClose,
  onStartAddWithUrl,
}) => {
  const [testResult, setTestResult] = useState<ParsedShortcut | null>(null);
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);

  if (!isOpen) return null;

  const handleTestDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHoveringDrop(false);
    const parsed = await parseDroppedData(e.dataTransfer);
    if (parsed) {
      setTestResult(parsed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="drag-drop-guide-modal"
        className="w-full max-w-2xl bg-[#121218] border border-[#272736] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#252535] flex items-center justify-between bg-[#151520]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">دليل خاصية الإمساك والإفلات السريع (Drag &amp; Drop)</h2>
              <p className="text-xs text-zinc-400">
                كيفية إضافة المواقع فورياً عبر سحب الأيقونات والروابط دون نسخ ولصق يدوي.
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-right" dir="rtl">
          {/* Intro highlight */}
          <div className="bg-gradient-to-r from-red-950/30 via-[#1a141d] to-[#121218] border border-red-900/40 rounded-xl p-4 text-xs text-zinc-300 leading-relaxed flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block mb-1">
                خاصية السحب والإفلات (Drag and Drop):
              </span>
              تتيح لك إلقاء أي موقع أو ملف اختصار مباشرة فوق شاشة التطبيق. يقوم النظام بتحليل كائن البيانات
              (DataTransfer)، واستخراج عنوان الرابط (URL) واسم الموقع، وجلب الأيقونة الأصلية، وتصنيفه ذكيًا
              وإدراجه في شبكة الويب المرئية بثانية واحدة.
            </div>
          </div>

          {/* 3 Main Methods Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              طرق السحب والإفلات المدعومة (3 طرق رئيسية):
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Method 1 */}
              <div className="bg-[#171722] border border-[#2c2c3e] hover:border-red-500/50 rounded-xl p-4 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1.5">
                    1. أيقونة القفل من شريط العنوان
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    في أي صفحة إنترنت مفتوحة في متصفحك (Chrome، Edge، Firefox، Safari)، انقر مع السحب على أيقونة القفل 🔒
                    أو الضبط يسار شريط العنوان، وأفلتها داخل NexusWeb.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 mt-3 block border-t border-[#252535] pt-2">
                  Browser Address Bar Padlock
                </span>
              </div>

              {/* Method 2 */}
              <div className="bg-[#171722] border border-[#2c2c3e] hover:border-blue-500/50 rounded-xl p-4 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1.5">
                    2. شريط الإشارات المرجعية
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    اسحب أي موقع محفوظ في شريط المفضلة (Bookmarks Bar) مباشرة إلى شاشة NexusWeb. يستخرج النظام الاسم
                    والرابط المباشر بدقة تامة.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 mt-3 block border-t border-[#252535] pt-2">
                  Bookmarks &amp; Hyperlinks
                </span>
              </div>

              {/* Method 3 */}
              <div className="bg-[#171722] border border-[#2c2c3e] hover:border-purple-500/50 rounded-xl p-4 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1.5">
                    3. ملفات الاختصار من سطح المكتب
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    إذا كان لديك اختصار موقع على سطح المكتب أو مجلداتك بصيغة <code className="text-red-400">.url</code> (ويندوز) أو{' '}
                    <code className="text-red-400">.webloc</code> (ماك) أو <code className="text-red-400">.desktop</code> (لينكس)،
                    اسحب الملف وأفلته مباشرة.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 mt-3 block border-t border-[#252535] pt-2">
                  OS Desktop Shortcut Files
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Test Drop Area */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>جرب الآن: منطقة اختبار تفاعلية للإفلات</span>
              <span className="text-[11px] text-red-400 font-sans">Interactive Drop Zone</span>
            </h3>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsHoveringDrop(true);
              }}
              onDragLeave={() => setIsHoveringDrop(false)}
              onDrop={handleTestDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center ${
                isHoveringDrop
                  ? 'border-red-500 bg-red-950/20 scale-[1.01]'
                  : 'border-[#333347] bg-[#151520]/60 hover:border-zinc-500'
              }`}
            >
              <FolderDown
                className={`w-8 h-8 mb-2 transition-transform ${
                  isHoveringDrop ? 'text-red-400 scale-125 animate-bounce' : 'text-zinc-500'
                }`}
              />
              <p className="text-xs font-semibold text-zinc-200">
                {isHoveringDrop ? 'أفلت الرابط الآن!' : 'اسحب أيقونة أو رابط أو ملف اختصار وأفلته هنا للتجربة'}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                يدعم السحب من شريط المتصفح، أو المفضلة، أو سطح المكتب
              </p>

              {testResult && (
                <div className="mt-4 p-3 bg-[#1c1c28] border border-emerald-500/40 rounded-xl w-full text-right flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> تم التقاط الرابط بنجاح!
                    </span>
                    <p className="text-xs text-white font-mono truncate mt-0.5" dir="ltr">
                      {testResult.url}
                    </p>
                    {testResult.name && (
                      <p className="text-[11px] text-zinc-400 truncate">الاسم: {testResult.name}</p>
                    )}
                  </div>
                  {onStartAddWithUrl && (
                    <button
                      onClick={() => {
                        onClose();
                        onStartAddWithUrl(testResult.url, testResult.name);
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                    >
                      إضافة للشبكة
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="border-t border-[#252535] pt-4 space-y-2">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              ماذا يحدث فور الإفلات؟ (Workflow)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-[#171722] p-2.5 rounded-lg border border-[#272738]">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 inline-flex items-center justify-center font-bold text-[11px] mb-1">
                  1
                </span>
                <p className="font-medium text-white text-[11px]">التقاط الرابط</p>
                <p className="text-[10px] text-zinc-500">استخراج الـ URL والاسم</p>
              </div>
              <div className="bg-[#171722] p-2.5 rounded-lg border border-[#272738]">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 inline-flex items-center justify-center font-bold text-[11px] mb-1">
                  2
                </span>
                <p className="font-medium text-white text-[11px]">الأيقونة الأصلية</p>
                <p className="text-[10px] text-zinc-500">جلب الـ Favicon فورًا</p>
              </div>
              <div className="bg-[#171722] p-2.5 rounded-lg border border-[#272738]">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 inline-flex items-center justify-center font-bold text-[11px] mb-1">
                  3
                </span>
                <p className="font-medium text-white text-[11px]">تصنيف ذكي</p>
                <p className="text-[10px] text-zinc-500">تحديد الفئة والوسوم</p>
              </div>
              <div className="bg-[#171722] p-2.5 rounded-lg border border-[#272738]">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 inline-flex items-center justify-center font-bold text-[11px] mb-1">
                  4
                </span>
                <p className="font-medium text-white text-[11px]">عقدة الشبكة</p>
                <p className="text-[10px] text-zinc-500">ربط مرئي في Graph</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#252535] bg-[#151520] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono">
            NexusWeb Intelligent Drag &amp; Drop Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
          >
            فهمت، حسناً
          </button>
        </div>
      </div>
    </div>
  );
};
