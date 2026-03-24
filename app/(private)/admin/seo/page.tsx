import React from "react";
import Link from "next/link";
import { 
  Plus, Search, Globe,
  CheckCircle2, AlertCircle, Edit,
  LayoutTemplate, Settings
} from "lucide-react";
import { db } from "@/lib/db";
import { seoMetadata } from "@/db/schema";
import { desc } from "drizzle-orm";
import DeleteBlogButton from "@/components/admin/blogs/DeleteBlogButton";
import DeleteSeoButton from "@/components/admin/seo/DeleteSeoButton";

export const dynamic = "force-dynamic";

export default async function SeoListingPage() {
  // 1. Fetch all SEO records directly on the server
  const realSeoRecords = await db.select().from(seoMetadata).orderBy(desc(seoMetadata.updatedAt));

  // 2. Calculate quick stats for your dynamic cards
  const totalRecords = realSeoRecords.length;
  const indexedCount = realSeoRecords.filter((seo) => seo.isIndexable).length;
  const noIndexCount = realSeoRecords.filter((seo) => !seo.isIndexable).length;
  const missingDescCount = realSeoRecords.filter((seo) => !seo.metaDesc || seo.metaDesc.trim() === "").length;

  return (
    <div className="p-10 space-y-8 pb-20">
      
      {/* SECTION A: Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="text-indigo-600" /> SEO Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and manage search engine optimization across all entities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/seo/new" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <LayoutTemplate size={16} /> Add New seo
          </Link>
          {/* <Link href="/admin/seo/settings" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
            <Settings size={16} /> Global Settings
          </Link> */}
        </div>
      </header>

      {/* SECTION B: Dynamic Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Entities", count: totalRecords, color: "text-slate-900" },
          { label: "Indexed", count: indexedCount, color: "text-emerald-600" },
          { label: "No-Index", count: noIndexCount, color: "text-amber-600" },
          { label: "Missing Desc", count: missingDescCount, color: "text-red-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.count}</h3>
          </div>
        ))}
      </div>

      {/* SECTION C & D: Filters and Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search meta titles or keywords..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Page / Entity</th>
                <th className="px-6 py-4">Index Status</th>
                <th className="px-6 py-4">Completeness</th>
                <th className="px-6 py-4">Keyword</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Handle Empty State */}
              {realSeoRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No SEO data found. SEO records are automatically created when you save blogs or pages!
                  </td>
                </tr>
              )}

              {/* Map over REAL Database SEO Records */}
              {realSeoRecords.map((seo) => (
                <tr key={seo.id} className="hover:bg-slate-50 transition-colors group">
                  
                  {/* Title & URL Info */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 mb-0.5 line-clamp-1">
                      {seo.metaTitle || seo.pageTitle || "Untitled"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                        {seo.entityType} #{seo.entityId}
                      </span>
                      <p className="text-xs text-slate-500 font-mono line-clamp-1">
                        {seo.canonicalUrl || `/${seo.entityType.toLowerCase()}/${seo.entityId}`}
                      </p>
                    </div>
                  </td>

                  {/* Index Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      seo.isIndexable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {seo.isIndexable ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
                      {seo.isIndexable ? 'INDEXED' : 'NO-INDEX'}
                    </span>
                  </td>

                  {/* SEO Completeness */}
                  <td className="px-6 py-4">
                    {seo.metaTitle && seo.metaDesc ? (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={14}/> Complete</span>
                    ) : (
                      <span className="text-red-600 text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> Needs Work</span>
                    )}
                  </td>

                  {/* Focus Keyword */}
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {seo.focusKeyword || <span className="text-slate-300 italic">None</span>}
                  </td>
                  
                  {/* Format the PostgreSQL Timestamp nicely */}
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {seo.updatedAt ? new Date(seo.updatedAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    }) : "N/A"}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 flex justify-end gap-2 text-end">
                    {/* Because SEO is tied to entities, clicking "Edit" should ideally take them to that entity's editor */}
                    <Link 
                      href={`/admin/seo/${seo.id}`} 
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-block"
                      title="Edit Entity"
                    >
                      <Edit size={18} />
                    </Link>

                     <DeleteSeoButton id={seo.id} title={seo.metaTitle || seo.pageTitle || "Untitled"} entityType={seo.entityType} />
                    
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