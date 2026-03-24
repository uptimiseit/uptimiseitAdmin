import React from "react";
import Link from "next/link";
import { 
  Plus, Search, Briefcase, 
  CheckCircle2, AlertCircle, Edit, 
  Star, Lock, TrendingUp
} from "lucide-react";
import { getCaseStudies } from "@/lib/actions/case-study.actions";
import DeleteSeoButton from "@/components/admin/seo/DeleteSeoButton";
import DeleteCaseButton from "@/components/admin/caseStudies/DeleteCaseButton";

export const dynamic = "force-dynamic";

export default async function CaseStudiesListingPage() {
  const response = await getCaseStudies();
  const studies = response.data || [];

  // Calculate dynamic stats
  const totalCount = studies.length;
  const publishedCount = studies.filter(s => s.status === "PUBLISHED").length;
  const featuredCount = studies.filter(s => s.isFeatured).length;
  const conceptCount = studies.filter(s => s.projectType === "CONCEPT" || s.projectType === "INTERNAL").length;

  return (
    <div className="p-10 space-y-8 pb-20">
      
      {/* SECTION A: Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="text-indigo-600" /> Case Studies
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your portfolio, client success stories, and internal concept projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/case-studies/create" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
            <Plus size={18} /> Create Case Study
          </Link>
        </div>
      </header>

      {/* SECTION B: Dynamic Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", count: totalCount, color: "text-slate-900" },
          { label: "Published", count: publishedCount, color: "text-emerald-600" },
          { label: "Featured", count: featuredCount, color: "text-amber-500" },
          { label: "Internal / Concepts", count: conceptCount, color: "text-blue-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.count}</h3>
          </div>
        ))}
      </div>

      {/* SECTION C: Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search case studies by client or title..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none cursor-pointer">
              <option>All Industries</option>
              <option>Fintech</option>
              <option>Healthcare</option>
              <option>SaaS</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase text-slate-500 font-black tracking-wider">
              <tr>
                <th className="px-6 py-4">Project Title</th>
                <th className="px-6 py-4">Type & Industry</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Highlights</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {studies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    <Briefcase size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="font-bold text-slate-600">No Case Studies Found</p>
                    <p className="text-sm mt-1">Click "Create Case Study" to build your first portfolio piece.</p>
                  </td>
                </tr>
              )}

              {studies.map((study) => (
                <tr key={study.id} className="hover:bg-slate-50 transition-colors group">

                  {/* Title & Client */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 mb-0.5 flex items-center gap-2">
                      {study.title}
                      {study.isConfidential && <Lock size={12} className="text-amber-500" />}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">/{study.slug}</p>
                  </td>

                  {/* Industry & Type */}
                  <td className="px-6 py-4">
                    <span className="block text-xs font-bold text-slate-700 mb-1">{study.industry || "General"}</span>
                    <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {study.projectType}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      study.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {study.status === 'PUBLISHED' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                      {study.status}
                    </span>
                  </td>

                  {/* Highlights / Badges */}
                  <td className="px-6 py-4 flex gap-2">
                    {study.isFeatured && (
                      <span className="text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                        <Star size={12} className="fill-amber-500" /> Featured
                      </span>
                    )}
                    {(study.results as any[])?.length > 0 && (
                      <span className="text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                        <TrendingUp size={12} /> Metrics Added
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/case-studies/${String(study.id)}`}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                      title="Edit Case Study"
                    >
                      <Edit size={18} />
                    </Link>

                                         <DeleteCaseButton id={study.id} title={study.title} entityType="caseStudy" />
                    
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}