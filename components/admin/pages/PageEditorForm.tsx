"use client";

import React, { useState } from "react";
import { Save, Globe, ArrowLeft, Settings, Search, Layout } from "lucide-react";
import Link from "next/link";
// import SectionBuilder from "./SectionBuilder";
// import SeoPanel from "./SeoPanel";

export default function PageEditorForm({ initialData, isEditMode }: any) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save to database via Server Actions
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Sticky Header Actions */}
      <div className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-md pb-4 pt-2 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {isEditMode ? `Edit Page: ${title}` : "Create New Page"}
            </h1>
            <p className="text-xs font-mono text-slate-500">{slug ? `/${slug}` : "Unsaved Draft"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 shadow-sm flex items-center gap-2">
            <Globe size={16} /> Preview
          </button>
          <button type="submit" className="px-6 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 shadow-sm flex items-center gap-2">
            <Save size={16} /> Save & Publish
          </button>
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT: MAIN CONTENT AREA (Col span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info Block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Settings size={18} className="text-indigo-500" /> Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Page Title *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">URL Slug *</label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Page Type</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white">
                  <option>Standard Page</option>
                  <option>Landing Page</option>
                  <option>System Page (Locked)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Section Builder (The Core CMS Engine) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Layout size={18} className="text-cyan-500" /> Page Sections
            </h3>
            
            {/* Here you would render your SectionBuilder component */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-500 flex flex-col items-center">
               <Layout className="w-8 h-8 text-slate-300 mb-2" />
               <p className="font-bold">No sections added yet.</p>
               <p className="text-sm mb-4">Build your page using predefined content blocks.</p>
               <button type="button" className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-lg hover:bg-indigo-100 transition-colors">
                 + Add Section
               </button>
            </div>
          </div>

        </div>

        {/* RIGHT: SETTINGS SIDEBAR (Col span 1) */}
        <div className="space-y-6">
          
          {/* Publishing Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900">Publishing</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Published</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Visibility</span>
                <span className="font-bold text-slate-900">Public</span>
              </div>
            </div>
          </div>

          {/* SEO Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Search size={16} className="text-amber-500" /> SEO Settings
            </h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Meta Title</label>
                <input type="text" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Meta Description</label>
                <textarea rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none"></textarea>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Index Page (Allow Search)</label>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}