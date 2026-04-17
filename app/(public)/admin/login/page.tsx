"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, Activity } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // --- 1. FORM STATE ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- 2. UX & VALIDATION STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // --- 3. PERSISTENCE & AUTOFOCUS ---
  useEffect(() => {
    const savedRemember = localStorage.getItem("admin_remember_me") === "true";
    const savedEmail = localStorage.getItem("admin_saved_email");

    if (savedRemember && savedEmail) {
      setRememberMe(true);
      setEmail(savedEmail);
    }

    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // --- 4. SUBMISSION HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGlobalError(null);
    setFieldErrors({});

    const cleanEmail = email.trim().toLowerCase();
    let hasErrors = false;
    const newFieldErrors: { email?: string; password?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail) {
      newFieldErrors.email = "Email is required.";
      hasErrors = true;
    } else if (!emailRegex.test(cleanEmail)) {
      newFieldErrors.email = "Please enter a valid email format.";
      hasErrors = true;
    }

    if (!password) {
      newFieldErrors.password = "Password is required.";
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (cleanEmail === "admin@uptimise.com" && password === "12345678") {
        if (rememberMe) {
          localStorage.setItem("admin_remember_me", "true");
          localStorage.setItem("admin_saved_email", cleanEmail);
        } else {
          localStorage.removeItem("admin_remember_me");
          localStorage.removeItem("admin_saved_email");
        }
        router.push("/admin/dashboard"); 
      } else {
        throw new Error("Invalid email or password.");
      }
    } catch (err: any) {
      setGlobalError(err.message || "An unexpected error occurred.");
      setPassword(""); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-blue-100">
      
      {/* LEFT SIDE: BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 max-w-[800px] bg-[#0A0A0A] relative overflow-hidden p-12 lg:p-16 border-r border-slate-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="relative z-10">
          <Link href="/">
            <Image src="/white-logo.png" alt="Uptimise IT" width={140} height={42} priority className="opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-2">
            <ShieldCheck size={14} /> Admin Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
            Manage content, leads, SEO, and digital operations from one place.
          </h1>
        </div>

        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium">Secure access to the Uptimise control center.</p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-white">
        
        <div className="w-full max-w-[380px] flex flex-col justify-center mb-24">
          <div className="mb-10">
            <Link href="/" className="lg:hidden block mb-8">
              <Image src="/logo-dark.png" alt="Uptimise IT" width={130} height={39} priority />
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h2>
            <p className="text-slate-500 text-sm leading-relaxed">Sign in to access the Uptimise IT admin panel.</p>
          </div>

          <AnimatePresence>
            {globalError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-800">{globalError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="admin@uptimise.com"
                className={`w-full px-3.5 py-2.5 bg-white border font-semibold text-slate-900 ${fieldErrors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'} rounded-lg text-sm focus:outline-none focus:ring-4 transition-all disabled:bg-slate-50 shadow-sm`}
              />
              {fieldErrors.email && <p className="text-xs font-medium text-red-600">{fieldErrors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-white border font-semibold text-slate-900 ${fieldErrors.password ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'} rounded-lg text-sm focus:outline-none focus:ring-4 transition-all disabled:bg-slate-50 shadow-sm`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs font-medium text-red-600">{fieldErrors.password}</p>}
            </div>

            <div className="flex items-center pt-1 pb-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-600 cursor-pointer">Remember me</label>
            </div>

            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all disabled:bg-slate-300 shadow-sm">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>

        {/* SECURITY & SUPPORT BOX */}
        <div className="absolute bottom-0 w-full px-6 flex flex-col items-center">
          <div className="w-full max-w-[380px] bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex flex-col gap-1.5 text-[11px] text-slate-500">
              <p className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck size={14} className="text-emerald-600" /> Secure Encryption Active
              </p>
              <p className="flex items-center gap-1.5">
                <Activity size={14} className="text-slate-400" /> Authorized Admin Session Only
              </p>
            </div>
            <div className="h-px w-full bg-slate-200"></div>
            <p className="text-[11px] text-slate-500 text-center">
              Need access? <Link href="/support" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Contact system administrator.</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}