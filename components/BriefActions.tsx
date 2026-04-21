"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MoreHorizontal, Download, Eye, 
  Trash2, X, Mail, Phone, Calendar, 
  User, MessageSquare, Globe 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";

export default function BriefActions({ brief }: { brief: any }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    if (!brief.documentUrl) return;
    const link = document.createElement("a");
    link.href = brief.documentUrl.startsWith('http') ? brief.documentUrl : `/${brief.documentUrl}`;
    link.setAttribute("download", `${brief.name}_doc`);
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
              <Eye size={16} className="text-blue-500" /> View Full Details
            </button>
            <button
              onClick={handleDownload}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Download size={16} className="text-emerald-500" /> Download Attached
            </button>
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
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
            >
              {/* Modal Header */}
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Transmission Detail</h2>
                  <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-1">ID: #{brief.id}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <DetailItem icon={<User />} label="Sender" value={brief.name} />
                  <DetailItem icon={<Mail />} label="Email" value={brief.email} />
                  <DetailItem icon={<Phone />} label="Contact" value={`${brief.countryCode} ${brief.mobileNumber}`} />
                  <DetailItem icon={<Globe />} label="Department" value={brief.department} />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <MessageSquare size={14} /> Intelligence Brief
                  </label>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed font-medium">
                    {brief.message}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-slate-400 text-xs">
                  <span className="flex items-center gap-2"><Calendar size={14}/> {format(new Date(brief.createdAt), "PPP p")}</span>
                  {brief.documentUrl && (
                    <button onClick={handleDownload} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                      <Download size={14}/> Download Attachment
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

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
        <span className="text-slate-300">{icon}</span> {label}
      </p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}