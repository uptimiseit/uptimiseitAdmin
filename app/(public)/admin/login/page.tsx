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

  // UX Detail: Autofocus email on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // --- 3. SUBMISSION HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Enter key naturally submits the form
    setIsLoading(true);
    setGlobalError(null);
    setFieldErrors({});

    const cleanEmail = email.trim().toLowerCase();
    let hasErrors = false;
    const newFieldErrors: { email?: string; password?: string } = {};

    // Frontend Validation
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
    } else if (password.length < 8) {
      newFieldErrors.password = "Password must be at least 8 characters.";
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      setIsLoading(false);
      return;
    }

    // --- SIMULATED BACKEND AUTH FLOW ---
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (cleanEmail === "admin@uptimise.com" && password === "12345678") {
        // Redirect to dashboard on success
        router.push("/admin/dashboard"); 
      } else {
        // Generic error message to prevent data leakage
        throw new Error("Invalid email or password.");
      }
    } catch (err: any) {
      setGlobalError(err.message || "An unexpected error occurred.");
      // UX Detail: Preserve email, clear password on failure
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-blue-100">
      
      {/* =========================================================
          LEFT SIDE: BRAND / POSITIONING PANEL
          ========================================================= */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 max-w-[800px] bg-[#0A0A0A] relative overflow-hidden p-12 lg:p-16 border-r border-slate-800">
        
        {/* Subtle Visual Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/">
            <Image src="/white-logo.png" alt="Uptimise IT" width={140} height={42} priority className="opacity-90 hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Middle: Brand Statement */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-2">
            <ShieldCheck size={14} /> Admin Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
            Manage content, leads, SEO, and digital operations from one place.
          </h1>
        </div>

        {/* Bottom: One-line message */}
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium">
            Secure access to the Uptimise control center.
          </p>
        </div>
      </div>

      {/* =========================================================
          RIGHT SIDE: LOGIN FORM PANEL
          ========================================================= */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-white">
        
        <div className="w-full max-w-[380px] flex flex-col justify-center">
          
          {/* Section A — Logo / Identity (Mobile Only, or Form Top) */}
          <div className="mb-10">
            <Link href="/" className="lg:hidden block mb-8">
              <Image src="/logo-dark.png" alt="Uptimise IT" width={130} height={39} priority />
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Sign in to access the Uptimise IT admin panel and manage content, leads, SEO, and operations.
            </p>
          </div>

          {/* Error Alert Area */}
          <AnimatePresence>
            {globalError && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-800">{globalError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section B — Login Form */}
          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="admin@uptimise.com"
                className={`w-full px-3.5 py-2.5 bg-white border ${fieldErrors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'} rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all disabled:bg-slate-50 disabled:text-slate-500 shadow-sm`}
              />
              {fieldErrors.email && (
                <p className="text-xs font-medium text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link href="/admin/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors" tabIndex={-1}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-white border ${fieldErrors.password ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'} rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all disabled:bg-slate-50 disabled:text-slate-500 shadow-sm`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs font-medium text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1 pb-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 border-slate-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-600 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

        </div>

        {/* =========================================================
            SECTION C & D: SECURITY NOTE AND SUPPORT
            ========================================================= */}
        <div className="absolute bottom-0 -left-96 w-full px-6 flex flex-col items-center">
          <div className="w-full max-w-[380px] bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-3">
            
            {/* Section C - Security Note */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-500">
              <p className="flex items-center gap-1.5 font-medium text-slate-700">
                <ShieldCheck size={14} className="text-emerald-600" /> Protected by secure authentication
              </p>
              <p className="flex items-center gap-1.5">
                <Activity size={14} className="text-slate-400" /> All login activity is monitored
              </p>
              <p className="pl-5">Authorized users only.</p>
            </div>

            <div className="h-px w-full bg-slate-200"></div>

            {/* Section D - Support Help */}
            <p className="text-xs text-slate-500">
              Need access?{" "}
              <Link href="/support" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                Contact system administrator.
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}