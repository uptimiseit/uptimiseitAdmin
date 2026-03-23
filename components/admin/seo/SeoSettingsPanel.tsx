"use client";

import React, { useState } from "react";
import { Search, Share2, Settings, Code, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";

// 1. Export the State Interface so parent forms know exactly what data to hold
export interface SeoDataState {
  pageTitle: string;
  metaTitle: string;
  metaDesc: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDesc: string;
  ogImage: string;
  ogType: string;
  isIndexable: boolean;
  followLinks: boolean;
  schemaType: string;
  schemaMarkup: string;
  focusKeyword: string;
}

// 2. Define the Props the component accepts
interface SeoSettingsPanelProps {
  seoData: SeoDataState;
  onSeoChange: (field: keyof SeoDataState, value: any) => void;
  previewUrlBase?: string; // e.g., "uptimiseit.com/blog/"
  currentSlug?: string;
}

export default function SeoSettingsPanel({ 
  seoData, 
  onSeoChange, 
  previewUrlBase = "uptimiseit.com/", 
  currentSlug = "" 
}: SeoSettingsPanelProps) {
  
  // Accordion State
  const [openSection, setOpenSection] = useState<string>("core");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  // Live SERP Preview Logic
  const serpTitle = seoData.metaTitle || seoData.pageTitle || "Page Title | Uptimise IT";
  const serpUrl = `${previewUrlBase}${currentSlug || "your-page-slug"}`;
  const serpDesc = seoData.metaDesc || "Provide a meta description to see how this page will appear in Google search results. It should be compelling and contain your focus keyword.";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      
      {/* HEADER & LIVE SCORE */}
      <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Search size={20} className="text-indigo-600" /> Enterprise SEO Engine
          </h3>
          <p className="text-sm text-slate-500 mt-1">Manage metadata, social cards, and technical rules.</p>
        </div>
        
        {/* Simple SEO Score Indicator */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">SEO Score</p>
            <p className={`text-lg font-black transition-colors ${seoData.metaTitle && seoData.metaDesc ? 'text-emerald-600' : 'text-amber-500'}`}>
              {seoData.metaTitle && seoData.metaDesc ? '85/100' : 'Needs Work'}
            </p>
          </div>
        </div>
      </div>

      {/* ACCORDION 1: CORE META (Expanded by default) */}
      <div className="border-b border-slate-100">
        <button type="button" onClick={() => toggleSection("core")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <Search size={16} className="text-slate-400"/> Core Metadata
          </span>
          {openSection === "core" ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>
        
        {openSection === "core" && (
          <div className="p-6 pt-0 space-y-6 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* GOOGLE SERP PREVIEW */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl mb-6">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Live Google Preview</p>
              <div className="max-w-[600px]">
                <p className="text-sm text-slate-800 flex items-center gap-2 truncate">
                  <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold">U</span>
                  {serpUrl}
                </p>
                <h4 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer truncate mt-1 leading-tight">{serpTitle}</h4>
                <p className="text-sm text-[#4d5156] mt-1 line-clamp-2 leading-snug">{serpDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-800">Meta Title *</label>
                  <span className={`text-[10px] font-mono ${seoData.metaTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{seoData.metaTitle.length}/60</span>
                </div>
                <input 
                  type="text" 
                  value={seoData.metaTitle} 
                  onChange={(e) => onSeoChange("metaTitle", e.target.value)} 
                  placeholder="e.g. AI Product Development | Uptimise IT" 
                  className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all" 
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Focus Keyword</label>
                <input 
                  type="text" 
                  value={seoData.focusKeyword} 
                  onChange={(e) => onSeoChange("focusKeyword", e.target.value)} 
                  placeholder="e.g. SaaS Architecture" 
                  className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-slate-800">Meta Description *</label>
                <span className={`text-[10px] font-mono ${seoData.metaDesc.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{seoData.metaDesc.length}/160</span>
              </div>
              <textarea 
                rows={3} 
                value={seoData.metaDesc} 
                onChange={(e) => onSeoChange("metaDesc", e.target.value)} 
                placeholder="A compelling summary of the page content to boost CTR..." 
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-lg resize-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
              ></textarea>
            </div>
          </div>
        )}
      </div>

      {/* ACCORDION 2: OPENGRAPH / SOCIAL */}
      <div className="border-b border-slate-100">
        <button type="button" onClick={() => toggleSection("social")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <Share2 size={16} className="text-slate-400"/> Social Media (OpenGraph)
          </span>
          {openSection === "social" ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>
        {openSection === "social" && (
          <div className="p-6 pt-0 space-y-5 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-800">If left blank, Social platforms will automatically use your Core Meta Title, Meta Description, and the page's Featured Image.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">OG Title Override</label>
                <input 
                  type="text" 
                  value={seoData.ogTitle} 
                  onChange={(e) => onSeoChange("ogTitle", e.target.value)} 
                  placeholder="Leave blank to use Meta Title" 
                  className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">OG Type</label>
                <select 
                  value={seoData.ogType} 
                  onChange={(e) => onSeoChange("ogType", e.target.value)} 
                  className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                >
                  <option value="website">Website</option>
                  <option value="article">Article / Blog Post</option>
                  <option value="product">Product / Service</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5 border-t border-slate-100 pt-5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon size={14} className="text-slate-400" /> Custom OG Image URL
              </label>
              <input 
                type="text" 
                value={seoData.ogImage} 
                onChange={(e) => onSeoChange("ogImage", e.target.value)} 
                placeholder="https://uptimiseit.com/custom-share-image.jpg" 
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all" 
              />
            </div>
          </div>
        )}
      </div>

      {/* ACCORDION 3: TECHNICAL SEO */}
      <div className="border-b border-slate-100">
        <button type="button" onClick={() => toggleSection("tech")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <Settings size={16} className="text-slate-400"/> Technical Rules
          </span>
          {openSection === "tech" ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>
        {openSection === "tech" && (
          <div className="p-6 pt-0 space-y-6 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col sm:flex-row gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={seoData.isIndexable} 
                  onChange={(e) => onSeoChange("isIndexable", e.target.checked)} 
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" 
                />
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Indexable</p>
                  <p className="text-xs text-slate-500">Allow search engines to show this page.</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={seoData.followLinks} 
                  onChange={(e) => onSeoChange("followLinks", e.target.checked)} 
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" 
                />
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Follow Links</p>
                  <p className="text-xs text-slate-500">Allow bots to crawl links on this page.</p>
                </div>
              </label>
            </div>
            
            <div className="space-y-1.5 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800">Canonical URL Override</label>
              <input 
                type="text" 
                value={seoData.canonicalUrl} 
                onChange={(e) => onSeoChange("canonicalUrl", e.target.value)} 
                placeholder="e.g. https://uptimiseit.com/original-post (Leave blank if this is the original source)" 
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-amber-100 focus:border-amber-500 transition-all" 
              />
            </div>
          </div>
        )}
      </div>

      {/* ACCORDION 4: SCHEMA / STRUCTURED DATA */}
      <div>
        <button type="button" onClick={() => toggleSection("schema")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <Code size={16} className="text-slate-400"/> Structured Data (Schema)
          </span>
          {openSection === "schema" ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>
        {openSection === "schema" && (
          <div className="p-6 pt-0 space-y-5 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Schema Type</label>
              <select 
                value={seoData.schemaType} 
                onChange={(e) => onSeoChange("schemaType", e.target.value)} 
                className="w-full md:w-1/2 px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value="">None (Auto-generate default)</option>
                <option value="Article">Article / BlogPosting</option>
                <option value="Service">Service</option>
                <option value="Product">Software Product</option>
                <option value="FAQPage">FAQ Page</option>
              </select>
            </div>
            
            <div className="space-y-1.5 border-t border-slate-100 pt-5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                Custom JSON-LD Markup 
                <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Advanced</span>
              </label>
              <textarea 
                rows={6} 
                value={seoData.schemaMarkup} 
                onChange={(e) => onSeoChange("schemaMarkup", e.target.value)} 
                placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Article"\n}`} 
                className="w-full px-4 py-3 text-sm bg-slate-900 text-emerald-400 font-mono border border-slate-800 rounded-lg resize-y outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner leading-relaxed"
              ></textarea>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}