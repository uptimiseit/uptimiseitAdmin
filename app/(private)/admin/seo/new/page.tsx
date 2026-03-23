"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Link as LinkIcon, Loader2, Info } from "lucide-react";

// Server Action & Component
import { upsertSeoData } from "@/lib/actions/seo.actions";
import SeoSettingsPanel, { SeoDataState } from "@/components/admin/seo/SeoSettingsPanel";
// import SeoSettingsPanel, { SeoDataState } from "@/components/admin/seo//SeoSettingsPanel";

export default function AddNewSeoPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // --- ENTITY LINKER STATE ---
  // This tells the database WHAT this SEO data belongs to
  const [entityType, setEntityType] = useState("STATIC_PAGE");
  const [entityId, setEntityId] = useState<number | "">(""); 

  // --- SEO STATE ---
  const [seoData, setSeoData] = useState<SeoDataState>({
    pageTitle: "",
    metaTitle: "",
    metaDesc: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDesc: "",
    ogImage: "",
    ogType: "website",
    isIndexable: true,
    followLinks: true,
    schemaType: "",
    schemaMarkup: "",
    focusKeyword: "",
  });

  const handleSeoChange = (field: keyof SeoDataState, value: any) => {
    setSeoData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entityType || entityId === "") {
      return alert("You must provide an Entity Type and a numeric Entity ID.");
    }
    
    setIsSaving(true);

    try {
      // Pass the manually entered Type and ID to our Upsert function
      const res = await upsertSeoData(entityType, Number(entityId), seoData);

      if (res.success) {
        alert("Custom SEO Record created successfully!");
        router.push("/admin/seo"); // Redirect back to the static pages list
      } else {
        alert("Failed to save the SEO record.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 pb-24">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/seo/static-pages" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <LinkIcon className="text-indigo-600" size={24} /> Add Custom SEO Record
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manually assign SEO metadata to a static route or custom entity.</p>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Saving..." : "Save SEO Record"}
        </button>
      </div>

      <div className="space-y-6">
        
        {/* THE ENTITY LINKER (Manual Override) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800">
            <Info size={20} className="shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">How manual linking works</p>
              <p>Blogs and dynamic pages automatically handle this for you. Use this form ONLY when you need to attach SEO to a hardcoded developer route. Assign an <strong>Entity Type</strong> (like STATIC_PAGE) and a unique numeric <strong>Entity ID</strong>.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Entity Type *</label>
              <select 
                value={entityType} 
                onChange={(e) => setEntityType(e.target.value)} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer transition-all"
              >
                <option value="STATIC_PAGE">STATIC_PAGE (Hardcoded Route)</option>
                <option value="CUSTOM_APP">CUSTOM_APP (Special Application)</option>
                <option value="PORTFOLIO">PORTFOLIO</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Entity ID (Numeric) *</label>
              <input 
                type="number" 
                required 
                value={entityId} 
                onChange={(e) => setEntityId(e.target.value === "" ? "" : Number(e.target.value))} 
                placeholder="e.g. 10" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all font-mono" 
              />
            </div>
          </div>
        </div>

        {/* === OUR REUSABLE SEO ENGINE COMPONENT === */}
        <div className="shadow-sm rounded-2xl overflow-hidden border border-slate-200">
          <SeoSettingsPanel 
            seoData={seoData} 
            onSeoChange={handleSeoChange} 
            previewUrlBase="uptimiseit.com/"
            currentSlug="" // Leave blank so they can define the canonical URL manually
          />
        </div>

      </div>
    </div>
  );
}