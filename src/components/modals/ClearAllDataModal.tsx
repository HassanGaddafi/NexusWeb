import React, { useState } from 'react';
import {
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  X,
  Globe,
  Network as NetworkIcon,
  Clock,
  Cloud,
  CheckCircle2,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface ClearAllDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWipeAllData: () => void;
  onResetToDefaults: () => void;
  websiteCount: number;
  networkCount: number;
  historyCount: number;
  currentUser?: User | null;
}

export const ClearAllDataModal: React.FC<ClearAllDataModalProps> = ({
  isOpen,
  onClose,
  onWipeAllData,
  onResetToDefaults,
  websiteCount,
  networkCount,
  historyCount,
  currentUser,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleWipeBlank = () => {
    onWipeAllData();
    setActionDone('تم مسح جميع البيانات بنجاح وبدء لوحة جديدة فارغة.');
    setTimeout(() => {
      setActionDone(null);
      setConfirmed(false);
      onClose();
    }, 1500);
  };

  const handleResetSample = () => {
    onResetToDefaults();
    setActionDone('تم استعادة العينات الافتراضية بنجاح.');
    setTimeout(() => {
      setActionDone(null);
      setConfirmed(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="clear-data-modal"
        className="w-full max-w-lg bg-[#121219] border border-red-900/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-red-900/30 bg-[#171217] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500 shadow-md shadow-red-900/30">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                حذف كل البيانات والبدء من جديد
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Wipe Local &amp; Cloud Data • Fresh Start
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#252535] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {actionDone ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-600 flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-emerald-300">{actionDone}</p>
            </div>
          ) : (
            <>
              {/* Warning Notice */}
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-red-300 block mb-0.5">
                    تنبيه أمان للبيانات:
                  </span>
                  هذا الإجراء سيقوم بتصفير مساحة العمل الحالية. اختر ما إذا كنت تريد البدء بصفحة بيضاء فارغة تماماً (0 مواقع) لبناء شبكتك بنفسك، أو استعادة العينات التوضيحية الافتراضية.
                </div>
              </div>

              {/* Data Summary Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-[#171723] border border-[#262638] text-center">
                  <div className="flex items-center justify-center gap-1 text-zinc-400 text-[11px] mb-1">
                    <Globe className="w-3.5 h-3.5 text-red-400" />
                    <span>المواقع</span>
                  </div>
                  <span className="text-lg font-bold text-white font-mono">{websiteCount}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#171723] border border-[#262638] text-center">
                  <div className="flex items-center justify-center gap-1 text-zinc-400 text-[11px] mb-1">
                    <NetworkIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>الشبكات</span>
                  </div>
                  <span className="text-lg font-bold text-white font-mono">{networkCount}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#171723] border border-[#262638] text-center">
                  <div className="flex items-center justify-center gap-1 text-zinc-400 text-[11px] mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>السجل</span>
                  </div>
                  <span className="text-lg font-bold text-white font-mono">{historyCount}</span>
                </div>
              </div>

              {/* Cloud Account Status Notice */}
              {currentUser && (
                <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-900/30 flex items-center gap-2.5 text-xs text-blue-300">
                  <Cloud className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    متصل بحسابك ({currentUser.email}): سيتم تصفير النسخة السحابية أيضاً حتى لا تسترجع البيانات القديمة عند التحديث.
                  </span>
                </div>
              )}

              {/* Confirmation Checkbox */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#151520] border border-[#29293c] cursor-pointer hover:border-zinc-500 transition-colors">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#1c1c2b] border-[#38384f] text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <span className="text-xs text-zinc-200 select-none font-medium">
                  أؤكد رغبتي في مسح البيانات الحالية والمتابعة
                </span>
              </label>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  disabled={!confirmed}
                  onClick={handleWipeBlank}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    confirmed
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/50'
                      : 'bg-[#1e171b] text-zinc-500 border border-red-950 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>تفريغ كامل وبدء صفحة فارغة من الصفر (0 مواقع)</span>
                </button>

                <button
                  disabled={!confirmed}
                  onClick={handleResetSample}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    confirmed
                      ? 'bg-[#1d1d2b] hover:bg-[#28283d] text-zinc-200 border border-[#35354d]'
                      : 'bg-[#15151f] text-zinc-600 border border-[#212130] cursor-not-allowed'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                  <span>استعادة شبكة المطورين الافتراضية (40 موقعاً توضيحياً)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#20202e] bg-[#14141e] flex justify-between items-center text-xs">
          <span className="text-zinc-500 text-[11px]">يمكنك حفظ نسخة احتياطية أولاً من الإعدادات</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#20202e] transition-colors cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
