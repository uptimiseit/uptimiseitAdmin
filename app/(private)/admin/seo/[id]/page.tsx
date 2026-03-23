"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Link as LinkIcon, Loader2, Lock } from "lucide-react";

// Server Actions & Component
import { getSeoRecordById, upsertSeoData } from "@/lib/actions/seo.actions";
import SeoSettingsPanel, { SeoDataState } from "@/components/admin/seo/SeoSettingsPanel";

export default function EditSeoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap the Next.js 15+ dynamic params Promise
  const resolvedParams = use(params);
  const recordId = Number(resolvedParams.id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- ENTITY LINKER STATE (Read-Only on Edit) ---
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState<number | "">(""); 

  // --- SEO STATE ---
  const [seoData, setSeoData] = useState<SeoDataState>({
    pageTitle: "", metaTitle: "", metaDesc: "", canonicalUrl: "",
    ogTitle: "", ogDesc: "", ogImage: "", ogType: "website",
    isIndexable: true, followLinks: true, schemaType: "", schemaMarkup: "", focusKeyword: "",
  });

  // Load Data on Mount
  useEffect(() => {
    fetchRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId]);

  const fetchRecord = async () => {
    setIsLoading(true);
    const res = await getSeoRecordById(recordId);
    
    if (res.success && res.data) {
      setEntityType(res.data.entityType);
      setEntityId(res.data.entityId);
      
      // Handle the schemaMarkup just in case Postgres returns it as a JSON object instead of a string
      const rawSchema = res.data.schemaMarkup;
      const parsedSchema = rawSchema ? (typeof rawSchema === 'string' ? rawSchema : JSON.stringify(rawSchema, null, 2)) : "";

      setSeoData({
        pageTitle: res.data.pageTitle || "",
        metaTitle: res.data.metaTitle || "",
        metaDesc: res.data.metaDesc || "",
        canonicalUrl: res.data.canonicalUrl || "",
        ogTitle: res.data.ogTitle || "",
        ogDesc: res.data.ogDesc || "",
        ogImage: res.data.ogImage || "",
        ogType: res.data.ogType || "website",
        isIndexable: res.data.isIndexable ?? true,
        followLinks: res.data.followLinks ?? true,
        schemaType: res.data.schemaType || "",
        schemaMarkup: parsedSchema,
        focusKeyword: res.data.focusKeyword || "",
      });
    } else {
      alert("SEO Record not found!");
      router.push("/admin/seo");
    }
    
    setIsLoading(false);
  };

  const handleSeoChange = (field: keyof SeoDataState, value: any) => {
    setSeoData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // We use upsert! Because the entityType and entityId haven't changed, 
      // the backend will perfectly find the existing record and update it.
      const res = await upsertSeoData(entityType, Number(entityId), seoData);

      if (res.success) {
        alert("SEO Record updated successfully!");
        router.push("/admin/seo"); 
      } else {
        alert("Failed to update the SEO record.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-slate-400">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
        <p className="font-bold">Loading SEO Record...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10  space-y-8 pb-24">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/seo" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <LinkIcon className="text-indigo-600" size={24} /> Edit Custom SEO Record
            </h1>
            <p className="text-sm text-slate-500 mt-1">Update metadata and technical rules for this specific entity.</p>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Updating..." : "Update SEO Record"}
        </button>
      </div>

      <div className="space-y-6">
        
        {/* THE ENTITY LINKER (Locked on Edit) */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              Entity Connection 
            </h2>
            <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-200 px-2 py-1 rounded">
              <Lock size={12} /> Locked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Entity Type</label>
              <input 
                type="text" 
                disabled 
                value={entityType} 
                className="w-full px-4 py-2.5 bg-slate-200 text-slate-600 font-bold border border-slate-300 rounded-lg outline-none cursor-not-allowed" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Entity ID (Numeric)</label>
              <input 
                type="text" 
                disabled 
                value={entityId} 
                className="w-full px-4 py-2.5 bg-slate-200 text-slate-600 font-bold font-mono border border-slate-300 rounded-lg outline-none cursor-not-allowed" 
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">To prevent broken links, you cannot change the Entity Type or ID once an SEO record is created. If you need to reassign this, delete this record and create a new one.</p>
        </div>

        {/* === OUR REUSABLE SEO ENGINE COMPONENT === */}
        <div className="shadow-sm rounded-2xl overflow-hidden border border-slate-200">
          <SeoSettingsPanel 
            seoData={seoData} 
            onSeoChange={handleSeoChange} 
            previewUrlBase="uptimiseit.com/"
            currentSlug={seoData.canonicalUrl ? "" : undefined} 
          />
        </div>

      </div>
    </div>
  );
}