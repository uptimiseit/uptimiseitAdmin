"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MoreHorizontal, Download, Eye, 
  Trash2, X, Mail, Phone, Calendar, 
  User, MessageSquare, Building2, Linkedin, ExternalLink,
  Zap
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";

export default function IntakeActions({ log }: { log: any }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleDownload = () => {
    if (!log.documentUrl) return;
    const link = document.createElement("a");
    link.href = log.documentUrl; // AWS CloudFront URL
    link.setAttribute("download", `${log.fullName}_specs`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowMenu(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className={`p-2 rounded-xl transition-all relative z-30 ${
          showMenu ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-100"
        }`}
      >
        <MoreHorizontal size={20} />
      </button>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[9999] p-2"
          >
            <button 
              onClick={() => { setIsModalOpen(true); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Eye size={16} className="text-blue-500" /> View Analysis
            </button>

            {log.documentUrl ? (
              <button
                onClick={handleDownload}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Download size={16} /> Download Specs
              </button>
            ) : (
              <div className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-300 cursor-not-allowed">
                <X size={16} /> No File Attached
              </div>
            )}
            
            <div className="border-t border-slate-50 mt-1 pt-1">
               <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 size={16} /> Delete Record
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL DETAILS MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 bg-slate-950 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Project Intake Log</h2>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Audit_Node_Ready</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DetailItem icon={<User size={14}/>} label="Identity" value={log.fullName} />
                  <DetailItem icon={<Mail size={14}/>} label="Email Node" value={log.workEmail} />
                  <DetailItem icon={<Building2 size={14}/>} label="Organization" value={log.companyName || "N/A"} />
                  <DetailItem icon={<Zap size={14}/>} label="Growth Stage" value={log.companyStage} />
                  <DetailItem icon={<Phone size={14}/>} label="Contact" value={`${log.countryCode} ${log.mobileNumber}`} />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">LinkedIn Access</p>
                    {log.linkedinUrl ? (
                      <a href={log.linkedinUrl} target="_blank" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline">
                        View Profile <ExternalLink size={12} />
                      </a>
                    ) : <p className="text-sm font-bold text-slate-300">Not Provided</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <MessageSquare size={14} className="text-blue-500" /> Technical Context
                  </label>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-slate-700 leading-relaxed font-medium text-sm">
                    {log.projectContext}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase font-mono">
                    <Calendar size={14}/> {format(new Date(log.createdAt), "PPP p")}
                  </span>
                  {log.documentUrl && (
                    <button onClick={handleDownload} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10">
                      <Download size={14}/> Download Analysis Specs
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
        <span className="text-blue-500/50">{icon}</span> {label}
      </p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}