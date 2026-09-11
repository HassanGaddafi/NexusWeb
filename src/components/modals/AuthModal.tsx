/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  LogOut,
  Mail,
  Lock,
  User as UserIcon,
  Cloud,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Database,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
} from '../../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  syncStatus: 'synced' | 'syncing' | 'error' | 'offline';
  lastSyncedAt: string | null;
  onManualSync: () => void;
  totalWebsites: number;
  totalNetworks: number;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  syncStatus,
  lastSyncedAt,
  onManualSync,
  totalWebsites,
  totalNetworks,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      setSuccessMsg('تم تسجيل الدخول بنجاح عبر حساب Google ومزامنة بياناتك سحابياً ✨');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'فشل تسجيل الدخول بحساب Google. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        setSuccessMsg('تم تسجيل الدخول بنجاح ومزامنة شبكاتك سحابياً ✨');
      } else {
        if (password.length < 6) {
          setErrorMsg('كلمة المرور يجب ألا تقل عن 6 خانات.');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName);
        setSuccessMsg('تم إنشاء الحساب بنجاح ومزامنة كافة بياناتك الحالية سحابياً ✨');
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'حدث خطأ أثناء المصادقة.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'كلمة المرور ضعيفة جداً، يرجى استخدام 6 أحرف على الأقل.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setSuccessMsg('تم تسجيل الخروج بنجاح. بياناتك محفوظة محلياً وسحابياً.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'فشل تسجيل الخروج');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-[#121218] border border-[#272736] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#252535] flex items-center justify-between bg-[#151520]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {currentUser ? 'الحساب والمزامنة السحابية' : 'حفظ واسترجاع شبكاتك السحابية'}
              </h2>
              <p className="text-xs text-zinc-400">
                {currentUser ? 'مزامنة بياناتك عبر أجهزتك' : 'سجل الدخول ليحفظ التطبيق كل شيء'}
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
        <div className="p-6 overflow-y-auto space-y-5 text-right" dir="rtl">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 bg-red-950/30 border border-red-600/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-600/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {currentUser ? (
            /* Logged-In User Profile & Sync Dashboard */
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="bg-[#171724] border border-[#2a2a3e] rounded-xl p-4 flex items-center gap-3.5">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || ''}
                    className="w-12 h-12 rounded-full border border-red-500/40 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-lg">
                    {currentUser.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : currentUser.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {currentUser.displayName || 'مستخدم NexusWeb'}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate" dir="ltr">
                    {currentUser.email}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل بحساب سحابي موثق
                  </span>
                </div>
              </div>

              {/* Stats & Sync Status */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-[#171724] border border-[#252535] rounded-xl p-3">
                  <span className="text-xs text-zinc-400 block mb-1">المواقع المحفوظة</span>
                  <span className="text-lg font-mono font-bold text-white">{totalWebsites}</span>
                </div>
                <div className="bg-[#171724] border border-[#252535] rounded-xl p-3">
                  <span className="text-xs text-zinc-400 block mb-1">الشبكات النشطة</span>
                  <span className="text-lg font-mono font-bold text-white">{totalNetworks}</span>
                </div>
              </div>

              {/* Cloud Sync State Details */}
              <div className="bg-[#171724] border border-[#272738] rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      syncStatus === 'synced'
                        ? 'bg-emerald-500 animate-pulse'
                        : syncStatus === 'syncing'
                        ? 'bg-amber-400 animate-spin'
                        : 'bg-zinc-500'
                    }`}
                  />
                  <span className="text-zinc-300">
                    {syncStatus === 'synced'
                      ? 'جميع العقد والشبكات متزامنة سحابياً'
                      : syncStatus === 'syncing'
                      ? 'جاري حفظ التغييرات إلى السحابة...'
                      : 'في وضع الاتصال المحلي'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onManualSync}
                  disabled={loading}
                  className="px-2.5 py-1 bg-[#222234] hover:bg-[#2c2c40] text-zinc-300 hover:text-white rounded-lg text-[11px] font-medium flex items-center gap-1 border border-[#323246] transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-red-400" />
                  <span>مزامنة فورية</span>
                </button>
              </div>

              {lastSyncedAt && (
                <p className="text-[11px] text-zinc-500 text-center font-mono">
                  آخر حفظ سحابي ناجح: {new Date(lastSyncedAt).toLocaleTimeString('ar-SA')}
                </p>
              )}

              {/* Log out action */}
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#1d1d28] hover:bg-red-600/20 text-zinc-300 hover:text-red-300 border border-[#2d2d40] hover:border-red-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                <span>تسجيل الخروج من هذا الحساب</span>
              </button>
            </div>
          ) : (
            /* Auth Form (Google & Email) */
            <div className="space-y-4">
              {/* Feature highlight */}
              <div className="bg-gradient-to-r from-red-950/30 via-[#1b151e] to-[#121218] border border-red-900/40 rounded-xl p-3.5 text-xs text-zinc-300 leading-relaxed flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block mb-0.5">
                    حفظ سحابي دائم 100%:
                  </span>
                  سجل الدخول بحساب Google أو بريدك الإلكتروني، وعند إغلاق المتصفح أو فتحه على أي
                  جهاز آخر ستجد جميع شبكاتك ومواقعك وعقدك محفوظة بالكامل كما تركتها!
                </div>
              </div>

              {/* 1-Click Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-white/5 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>المتابعة باستخدام حساب Google (بنقرة واحدة)</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="h-[1px] bg-[#272736] flex-1" />
                <span className="text-[11px] text-zinc-500 font-mono uppercase">أو بالبريد الإلكتروني</span>
                <div className="h-[1px] bg-[#272736] flex-1" />
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-zinc-300">الاسم (اختياري)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="اسم المستخدم"
                        className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl pl-3 pr-9 py-2 text-xs outline-none transition-all"
                      />
                      <UserIcon className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-2.5" />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-300">البريد الإلكتروني</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl pl-3 pr-9 py-2 text-xs outline-none transition-all font-mono"
                      dir="ltr"
                    />
                    <Mail className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-zinc-300">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#171722] border border-[#2d2d3f] focus:border-red-500 text-white rounded-xl pl-3 pr-9 py-2 text-xs outline-none transition-all font-mono"
                      dir="ltr"
                    />
                    <Lock className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-all cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mode === 'signin' ? (
                    <LogIn className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  <span>{mode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</span>
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="text-center pt-2 border-t border-[#252535]">
                {mode === 'signin' ? (
                  <p className="text-xs text-zinc-400">
                    ليس لديك حساب بعد؟{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMsg('');
                      }}
                      className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-4 ml-1 cursor-pointer"
                    >
                      إنشاء حساب سحابي مجاني
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400">
                    لديك حساب بالفعل؟{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMsg('');
                      }}
                      className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-4 ml-1 cursor-pointer"
                    >
                      تسجيل الدخول
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#252535] bg-[#151520] flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Firebase Firestore Encrypted Sync
          </span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
