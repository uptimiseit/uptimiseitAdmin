"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Fingerprint, Cpu } from "lucide-react";

export default function AdminSplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Simulate a secure initialization progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.5; // Fills up over ~2 seconds
      });
    }, 50);

    // 2. Redirect to the actual login page after 2.5 seconds
    const redirectTimeout = setTimeout(() => {
      router.push("/admin/login");
    }, 2500);

    // Cleanup intervals and timeouts on unmount
    return () => {
      clearInterval(progressInterval);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Ambient Security Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>

      {/* Abstract Grid Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Core Icon Assembly */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          {/* Rotating outer dash ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-slate-700"
          ></motion.div>
          
          {/* Inner glowing ring */}
          <div className="absolute inset-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm shadow-[0_0_30px_rgba(99,102,241,0.2)]"></div>
          
          {/* Center Shield Icon */}
          <ShieldCheck className="w-12 h-12 text-cyan-400 relative z-10" strokeWidth={1.5} />
          
          {/* Ping effect */}
          <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-20"></div>
        </div>

        {/* Branding & Status */}
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3">
          Uptimise <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">OS</span>
        </h1>
        
        <div className="flex items-center gap-2 text-slate-400 text-sm font-mono mb-12 h-6">
          <Cpu size={14} className="animate-pulse text-indigo-400" />
          <motion.span
            key={progress < 40 ? "init" : progress < 80 ? "secure" : "auth"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="tracking-widest uppercase text-xs"
          >
            {progress < 40 && "Initializing Core Environment..."}
            {progress >= 40 && progress < 80 && "Establishing Secure Connection..."}
            {progress >= 80 && "Routing to Authentication..."}
          </motion.span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        {/* Security Badges */}
        <div className="flex items-center gap-6 mt-12 opacity-40">
          <div className="flex items-center gap-2 text-[10px] font-mono text-white tracking-widest uppercase">
            <Lock size={12} /> AES-256
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-white tracking-widest uppercase">
            <Fingerprint size={12} /> Zero-Trust
          </div>
        </div>

      </motion.div>
    </div>
  );
}