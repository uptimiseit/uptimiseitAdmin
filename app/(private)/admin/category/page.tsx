"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit2, Trash2, Search, 
  Loader2, X, LayoutGrid, ArrowRight 
} from "lucide-react";
// Import all FontAwesome icons
import * as FaIcons from "react-icons/fa";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
}

// Optimized Icon Renderer
const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
  const IconComponent = (FaIcons as any)[iconName];
  // Fallback to a folder icon if the name is invalid
  return IconComponent ? <IconComponent className={className} /> : <FaIcons.FaFolder className={className} />;
};

const CategoryAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", icon: "FaFolder" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Icon Search State
  const [iconSearch, setIconSearch] = useState("");
  
  // Memoize the list of icon names to avoid recalculating on every render
  const allIconNames = useMemo(() => Object.keys(FaIcons), []);

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    const search = iconSearch.toLowerCase().trim();
    if (!search) return allIconNames.slice(0, 50); // Show default set when empty
    return allIconNames
      .filter(name => name.toLowerCase().includes(search))
      .slice(0, 50); // Limit results for high performance
  }, [iconSearch, allIconNames]);

  // --- 1. Fetch Categories ---
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // --- 2. Auto-generate Slug ---
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    setFormData({ ...formData, name, slug });
  };

  // --- 3. Create or Update ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchCategories();
        closeModal();
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. Delete Category ---
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This may affect linked blogs.")) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setFormData({ 
        name: category.name, 
        slug: category.slug, 
        description: category.description,
        icon: category.icon || "FaFolder" 
      });
      setEditingId(category.id);
    } else {
      setFormData({ name: "", slug: "", description: "", icon: "FaFolder" });
      setEditingId(null);
    }
    setIconSearch("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", slug: "", description: "", icon: "FaFolder" });
    setEditingId(null);
    setIconSearch("");
  };

  return (
    <main className="min-h-screen bg-[#FDFDFF] p-8 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
              <LayoutGrid size={14} />
              <span>Engine_Taxonomy::v1</span>
            </div>
            <h1 className="text-4xl font-black text-slate-950 tracking-tighter uppercase">
              Blog <span className="text-blue-600 italic">Categories.</span>
            </h1>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-950 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/10"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category Name</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Slug Identifier</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-600" size={32} />
                  </td>
                </tr>
              ) : categories.map((cat) => (
                <tr key={cat.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <IconRenderer iconName={cat.icon} className="text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 uppercase text-sm">{cat.name}</p>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">{cat.description || "No description provided."}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <code className="text-[11px] font-mono bg-slate-100 px-2 py-1 rounded text-blue-600">{cat.slug}</code>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button onClick={() => openModal(cat)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CRUD MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal} className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header - Sticky Top */}
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
                <h3 className="font-black text-slate-950 uppercase tracking-tighter text-xl">
                  {editingId ? "Modify_Entity" : "Initialize_Entity"}
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category Name</label>
                  <input required value={formData.name} onChange={handleNameChange} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none" placeholder="e.g. AI Engineering" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Slug (Auto-generated)</label>
                  <input required value={formData.slug} readOnly className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm font-mono text-slate-500 cursor-not-allowed outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 transition-all outline-none resize-none" placeholder="Brief technical scope..." />
                </div>

                {/* ADVANCED ICON PICKER SECTION */}
                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Search Icon Library</label>
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-mono text-[9px] font-bold uppercase tracking-widest">
                      Active: {formData.icon}
                    </div>
                  </div>

                  {/* Icon Search Input */}
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="e.g. Brain, Robot, Code..." 
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  {/* Scrollable Icon Grid */}
                  <div className="grid grid-cols-5 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 max-h-[220px] overflow-y-auto custom-scrollbar">
                    {filteredIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        title={icon}
                        className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                          formData.icon === icon 
                          ? "bg-blue-600 text-white shadow-lg scale-105" 
                          : "bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-50"
                        }`}
                      >
                        <IconRenderer iconName={icon} className="text-xl" />
                      </button>
                    ))}
                    {filteredIcons.length === 0 && (
                      <div className="col-span-5 py-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        No icons found for "{iconSearch}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button - Sticky Bottom inside form */}
                <button 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : editingId ? "Commit Changes" : "Create Node"}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </main>
  );
};

export default CategoryAdmin;