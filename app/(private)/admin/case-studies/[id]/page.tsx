"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Briefcase, Plus, Trash2, Loader2, Code2, ListOrdered, MessageSquare, Rocket } from "lucide-react";

// Server Actions
import { getCaseStudyById, updateCaseStudy } from "@/lib/actions/case-study.actions";
import { getSeoData, upsertSeoData } from "@/lib/actions/seo.actions";

// Reusable SEO Panel
import SeoSettingsPanel, { SeoDataState } from "@/components/admin/seo/SeoSettingsPanel";

export default function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params safely
  const resolvedParams = use(params);
  const studyId = Number(resolvedParams.id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- 1. CORE & SETTINGS ---
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [industry, setIndustry] = useState("");
  const [projectType, setProjectType] = useState("CLIENT"); 
  const [status, setStatus] = useState("DRAFT");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isConfidential, setIsConfidential] = useState(false);

  // --- 2. STATIC OBJECTS ---
  const [clientInfo, setClientInfo] = useState({ name: "", type: "", duration: "" });
  const [heroSection, setHeroSection] = useState({ heroTitle: "", heroDesc: "" });
  const [problemSection, setProblemSection] = useState({ title: "The Challenge", desc: "" });
  const [solutionSection, setSolutionSection] = useState({ title: "Our Solution", desc: "" });
  const [testimonial, setTestimonial] = useState({ clientName: "", designation: "", company: "", text: "" });
  const [ctaSection, setCtaSection] = useState({ title: "Ready to build your product?", buttonText: "Contact Us", buttonLink: "/contact" });

  // --- 3. DYNAMIC ARRAYS ---
  const [results, setResults] = useState([{ metricTitle: "", value: "", desc: "" }]);
  const [techStack, setTechStack] = useState([{ name: "", category: "Frontend", usage: "" }]);
  const [process, setProcess] = useState([{ title: "", desc: "" }]);

  // --- 4. SEO DATA ---
  const [seoData, setSeoData] = useState<SeoDataState>({
    pageTitle: "", metaTitle: "", metaDesc: "", canonicalUrl: "",
    ogTitle: "", ogDesc: "", ogImage: "", ogType: "article", 
    isIndexable: true, followLinks: true, schemaType: "Article", schemaMarkup: "", focusKeyword: "",
  });

  // --- LOAD DATA ON MOUNT ---
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyId]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // 1. Fetch Case Study
    const res = await getCaseStudyById(studyId);
    if (res.success && res.data) {
      const data = res.data;
      
      setTitle(data.title || "");
      setSlug(data.slug || "");
      setSummary(data.summary || "");
      setIndustry(data.industry || "");
      setProjectType(data.projectType || "CLIENT");
      setStatus(data.status || "DRAFT");
      setIsFeatured(data.isFeatured || false);
      setIsConfidential(data.isConfidential || false);

      // JSONB Fields with safe fallbacks
      setClientInfo(data.clientInfo as any || { name: "", type: "", duration: "" });
      setHeroSection(data.heroSection as any || { heroTitle: "", heroDesc: "" });
      setProblemSection(data.problemSection as any || { title: "The Challenge", desc: "" });
      setSolutionSection(data.solutionSection as any || { title: "Our Solution", desc: "" });
      setTestimonial(data.testimonial as any || { clientName: "", designation: "", company: "", text: "" });
      setCtaSection(data.ctaSection as any || { title: "Ready to build your product?", buttonText: "Contact Us", buttonLink: "/contact" });

      // Dynamic Arrays with safe fallbacks
      setResults(data.results as any || [{ metricTitle: "", value: "", desc: "" }]);
      setTechStack(data.techStack as any || [{ name: "", category: "Frontend", usage: "" }]);
      setProcess(data.developmentProcess as any || [{ title: "", desc: "" }]);
    } else {
      alert("Case Study not found!");
      router.push("/admin/case-studies");
    }

    // 2. Fetch SEO Data
    const seoRes = await getSeoData("CASE_STUDY", studyId);
    if (seoRes.success && seoRes.data) {
      setSeoData({
        pageTitle: seoRes.data.pageTitle || "",
        metaTitle: seoRes.data.metaTitle || "",
        metaDesc: seoRes.data.metaDesc || "",
        canonicalUrl: seoRes.data.canonicalUrl || "",
        ogTitle: seoRes.data.ogTitle || "",
        ogDesc: seoRes.data.ogDesc || "",
        ogImage: seoRes.data.ogImage || "",
        ogType: seoRes.data.ogType || "article",
        isIndexable: seoRes.data.isIndexable ?? true,
        followLinks: seoRes.data.followLinks ?? true,
        schemaType: seoRes.data.schemaType || "Article",
        schemaMarkup: typeof seoRes.data.schemaMarkup === 'string' ? seoRes.data.schemaMarkup : "",
        focusKeyword: seoRes.data.focusKeyword || "",
      });
    }

    setIsLoading(false);
  };

  // --- HANDLERS ---
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleSeoChange = (field: keyof SeoDataState, value: any) => setSeoData(prev => ({ ...prev, [field]: value }));

  const updateArray = (setter: any, array: any[], index: number, field: string, val: string) => {
    const newArr = [...array];
    newArr[index] = { ...newArr[index], [field]: val };
    setter(newArr);
  };
  const removeFromArray = (setter: any, array: any[], index: number) => setter(array.filter((_, i) => i !== index));

  // --- MASTER UPDATE ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return alert("Title and Slug are required.");
    setIsSaving(true);

    try {
      const payload = {
        title, slug, summary, industry, projectType, status, isFeatured, isConfidential,
        clientInfo, heroSection, problemSection, solutionSection, 
        results, techStack, developmentProcess: process, testimonial, ctaSection
      };

      const studyRes = await updateCaseStudy(studyId, payload);

      if (studyRes.success) {
        await upsertSeoData("CASE_STUDY", studyId, seoData);
        alert("Case Study updated successfully!");
        router.push("/admin/case-studies");
      } else {
        alert("Failed to update Case Study.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-slate-400">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
        <p className="font-bold">Loading Case Study Data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 pb-24">
      
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/case-studies" className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} className="text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase className="text-indigo-600" size={24} /> Edit Case Study
            </h1>
          </div>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Updating..." : "Update Case Study"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: THE MEAT OF THE CONTENT */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* 1. Core Info & Hero */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="font-bold text-slate-900 border-b border-slate-100 pb-3">1. Basics & Hero</h2>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Project Title *</label>
              <input type="text" required value={title} onChange={handleTitleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">URL Slug *</label>
                <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-100 font-mono text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">Hero Headline</label>
                <input type="text" value={heroSection.heroTitle} onChange={(e) => setHeroSection({...heroSection, heroTitle: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Short Summary</label>
              <textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 resize-none text-sm"></textarea>
            </div>
          </div>

          {/* 2. Client Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="font-bold text-slate-900 border-b border-slate-100 pb-3">2. Client Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">Client Name</label>
                <input type="text" value={clientInfo.name} onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">Industry</label>
                <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800">Timeline/Duration</label>
                <input type="text" value={clientInfo.duration} onChange={(e) => setClientInfo({...clientInfo, duration: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
            </div>
          </div>

          {/* 3. Problem & Solution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="font-bold text-slate-900 border-b border-slate-100 pb-3">3. The Narrative</h2>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">The Problem</label>
              <textarea rows={4} value={problemSection.desc} onChange={(e) => setProblemSection({...problemSection, desc: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100 resize-y"></textarea>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">The Solution</label>
              <textarea rows={4} value={solutionSection.desc} onChange={(e) => setSolutionSection({...solutionSection, desc: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-100 resize-y"></textarea>
            </div>
          </div>

          {/* 4. DYNAMIC ARRAYS (Metrics, Tech Stack, Process) */}
          
          {/* Metrics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900">Measurable Results (Metrics)</h2>
              <button type="button" onClick={() => setResults([...results, { metricTitle: "", value: "", desc: "" }])} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 flex items-center gap-1 transition-colors">
                <Plus size={14} /> Add Metric
              </button>
            </div>
            <div className="space-y-4">
              {results.map((res, index) => (
                <div key={index} className="flex gap-3 items-start p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <input type="text" value={res.metricTitle} onChange={(e) => updateArray(setResults, results, index, "metricTitle", e.target.value)} placeholder="Metric (e.g. Load Time)" className="px-3 py-2 text-sm bg-white border border-slate-200 rounded outline-none" />
                    <input type="text" value={res.value} onChange={(e) => updateArray(setResults, results, index, "value", e.target.value)} placeholder="Value (e.g. -60%)" className="px-3 py-2 text-sm font-bold text-emerald-600 bg-white border border-slate-200 rounded outline-none" />
                    <input type="text" value={res.desc} onChange={(e) => updateArray(setResults, results, index, "desc", e.target.value)} placeholder="Context..." className="col-span-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded outline-none" />
                  </div>
                  {results.length > 1 && <button type="button" onClick={() => removeFromArray(setResults, results, index)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 border-l-4 border-l-sky-500">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 flex items-center gap-2"><Code2 size={18} className="text-sky-500"/> Tech Stack Used</h2>
              <button type="button" onClick={() => setTechStack([...techStack, { name: "", category: "Frontend", usage: "" }])} className="px-3 py-1.5 bg-sky-50 text-sky-700 text-xs font-bold rounded-lg hover:bg-sky-100 flex items-center gap-1 transition-colors">
                <Plus size={14} /> Add Tech
              </button>
            </div>
            <div className="space-y-4">
              {techStack.map((tech, index) => (
                <div key={index} className="flex gap-3 items-start p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                    <input type="text" value={tech.name} onChange={(e) => updateArray(setTechStack, techStack, index, "name", e.target.value)} placeholder="Tool (e.g. Next.js)" className="px-3 py-2 text-sm bg-white border border-slate-200 rounded outline-none" />
                    <select value={tech.category} onChange={(e) => updateArray(setTechStack, techStack, index, "category", e.target.value)} className="px-3 py-2 text-sm bg-white border border-slate-200 rounded outline-none cursor-pointer">
                      <option value="Frontend">Frontend</option><option value="Backend">Backend</option><option value="Database">Database</option><option value="Cloud/DevOps">Cloud/DevOps</option>
                    </select>
                    <input type="text" value={tech.usage} onChange={(e) => updateArray(setTechStack, techStack, index, "usage", e.target.value)} placeholder="How we used it..." className="md:col-span-1 col-span-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded outline-none" />
                  </div>
                  {techStack.length > 1 && <button type="button" onClick={() => removeFromArray(setTechStack, techStack, index)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>}
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 flex items-center gap-2"><ListOrdered size={18} className="text-amber-500"/> Execution Process</h2>
              <button type="button" onClick={() => setProcess([...process, { title: "", desc: "" }])} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-100 flex items-center gap-1 transition-colors">
                <Plus size={14} /> Add Step
              </button>
            </div>
            <div className="space-y-4">
              {process.map((step, index) => (
                <div key={index} className="flex gap-3 items-start p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-8 h-8 shrink-0 bg-white border border-slate-200 text-slate-400 font-bold rounded-full flex items-center justify-center text-sm">{index + 1}</div>
                  <div className="w-full space-y-3">
                    <input type="text" value={step.title} onChange={(e) => updateArray(setProcess, process, index, "title", e.target.value)} placeholder="Step Name" className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded outline-none font-bold" />
                    <textarea rows={2} value={step.desc} onChange={(e) => updateArray(setProcess, process, index, "desc", e.target.value)} placeholder="Describe what happened..." className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded outline-none resize-none"></textarea>
                  </div>
                  {process.length > 1 && <button type="button" onClick={() => removeFromArray(setProcess, process, index)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SETTINGS, SOCIAL PROOF & SEO */}
        <div className="space-y-8">
          
          {/* Status & Toggles */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Publishing</h2>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer">
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="PUBLISHED">Published (Live)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Project Type</label>
              <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer">
                <option value="CLIENT">Client Project</option>
                <option value="INTERNAL">Internal Product</option>
                <option value="CONCEPT">Concept / Architecture</option>
              </select>
            </div>

            <div className="pt-4 space-y-4 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Featured Study</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Show on homepage</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={isConfidential} onChange={(e) => setIsConfidential(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Confidential Client</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Hide brand details</p>
                </div>
              </label>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2"><MessageSquare size={16} className="text-pink-500"/> Client Testimonial</h2>
            <textarea rows={3} value={testimonial.text} onChange={(e) => setTestimonial({...testimonial, text: e.target.value})} placeholder='"Uptimise IT completely transformed our architecture..."' className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm resize-y italic"></textarea>
            <input type="text" value={testimonial.clientName} onChange={(e) => setTestimonial({...testimonial, clientName: e.target.value})} placeholder="Client Name (e.g. John Doe)" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
            <input type="text" value={testimonial.designation} onChange={(e) => setTestimonial({...testimonial, designation: e.target.value})} placeholder="Role (e.g. CTO, Acme Corp)" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
          </div>

          {/* CTA Section */}
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-4">
            <h2 className="font-bold text-indigo-900 border-b border-indigo-200 pb-3 flex items-center gap-2"><Rocket size={16}/> Footer CTA</h2>
            <input type="text" value={ctaSection.title} onChange={(e) => setCtaSection({...ctaSection, title: e.target.value})} placeholder="Headline" className="w-full px-4 py-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={ctaSection.buttonText} onChange={(e) => setCtaSection({...ctaSection, buttonText: e.target.value})} placeholder="Button Text" className="w-full px-4 py-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none" />
              <input type="text" value={ctaSection.buttonLink} onChange={(e) => setCtaSection({...ctaSection, buttonLink: e.target.value})} placeholder="URL (/contact)" className="w-full px-4 py-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none" />
            </div>
          </div>

          {/* === SEO ENGINE INJECTED === */}
          <SeoSettingsPanel seoData={seoData} onSeoChange={handleSeoChange} previewUrlBase="uptimiseit.com/work/" currentSlug={slug} />

        </div>
      </div>
    </div>
  );
}