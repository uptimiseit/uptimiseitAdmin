"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Globe, Tag, Cpu, Upload, X } from "lucide-react";
import Link from "next/link";
import { createCaseStudy, updateCaseStudy } from "@/lib/actions/case-study.actions";

export default function CaseStudyForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image: "", // This stores the final CloudFront URL
    tag: "",
    technology: "",
    url: "",
    status: "DRAFT",
    isFeatured: false,
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  // --- 1. Handle File Selection & Auto-Upload ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // A. Get Presigned URL from your API
      const res = await fetch(`/api/upload-url?file=${encodeURIComponent(file.name)}&type=${file.type}`);
      const { signedUrl, cdnUrl } = await res.json();

      if (!signedUrl) throw new Error("Failed to get upload URL");

      // B. Upload binary to S3
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("S3 Upload Failed");

      // C. Update form state with the CDN URL
      setFormData(prev => ({ ...prev, image: cdnUrl }));

    } catch (err) {
      console.error("Upload process failed:", err);
      alert("Image upload failed. Check AWS credentials/CORS.");
    } finally {
      setUploading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setFormData({ ...formData, title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (initialData?.id) {
        res = await updateCaseStudy(initialData.id, formData);
      } else {
        res = await createCaseStudy(formData);
      }

      if (res.success) {
        router.push("/admin/case-studies");
        router.refresh();
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Link href="/admin/case-studies" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all">
          <ArrowLeft size={18} /> BACK_TO_LEDGER
        </Link>
        <button 
          onClick={handleSubmit} 
          disabled={loading || uploading}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-600/20 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {initialData?.id ? "Update_Deployment" : "Initialize_Node"}
        </button>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        
        {/* Title */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project_Title *</label>
          <input required value={formData.title} onChange={handleTitleChange} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. OMNI-CHANNEL SAAS" />
        </div>

        {/* --- IMAGE UPLOAD SECTION --- */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visual_Asset (Featured Image)</label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upload Button/Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video md:aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group overflow-hidden"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-blue-600" size={24} />
                  <span className="text-[9px] font-black text-blue-600 uppercase">Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload className="text-slate-300 group-hover:text-blue-500 transition-colors" size={32} />
                  <span className="text-[9px] font-black text-slate-400 uppercase mt-2">Select_File</span>
                </>
              )}
            </div>

            {/* Preview Section */}
            <div className="md:col-span-2 relative aspect-video bg-slate-100 rounded-[2rem] border border-slate-200 overflow-hidden flex items-center justify-center">
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md text-rose-500 rounded-full shadow-md hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <ImageIcon className="mx-auto text-slate-300" size={40} />
                  <p className="text-[10px] font-bold text-slate-300 uppercase">Preview_Empty</p>
                </div>
              )}
            </div>
          </div>
          {/* Hidden input to store URL for form submission */}
          <input type="hidden" name="image" value={formData.image} />
        </div>

        {/* Industry Tag */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sector_Tag</label>
          <div className="relative">
            <Tag size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none" placeholder="Fintech // AI" />
          </div>
        </div>

        {/* URL */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target_Protocol (URL)</label>
          <div className="relative">
            <Globe size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none" placeholder="https://..." />
          </div>
        </div>

        {/* Technology */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tech_Stack</label>
          <div className="relative">
            <Cpu size={16} className="absolute left-5 top-5 text-slate-400" />
            <textarea rows={2} value={formData.technology} onChange={(e) => setFormData({...formData, technology: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-5 text-sm font-bold outline-none resize-none" placeholder="Next.js, Tailwind, AWS..." />
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mission_Summary</label>
          <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-bold outline-none resize-y" placeholder="Summarize deployment goals and outcomes..." />
        </div>

        {/* Featured Toggle */}
        <div className="md:col-span-2 pt-4 flex items-center gap-4">
           <button 
             type="button"
             onClick={() => setFormData(prev => ({...prev, isFeatured: !prev.isFeatured}))}
             className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${formData.isFeatured ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-50 border-slate-200 text-slate-400"}`}
           >
             <div className={`w-3 h-3 rounded-full ${formData.isFeatured ? "bg-white animate-pulse" : "bg-slate-300"}`} />
             <span className="text-[10px] font-black uppercase tracking-widest">Featured_Project</span>
           </button>
        </div>
      </form>
    </div>
  );
}