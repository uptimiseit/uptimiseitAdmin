import React from "react";
import Link from "next/link";
import { Plus, Layout } from "lucide-react";
// import { getPages } from "@/lib/actions/page.actions";
// import PagesTable from "@/components/admin/pages/PagesTable";

export default async function PagesListingRoute() {
  // 1. Fetch data on the server
  // const pages = await getPages(); 
  const pages = []; // Mocked for now

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layout className="text-indigo-600" /> Pages
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage core website pages, landing pages, and publishing status.
          </p>
        </div>
        <Link 
          href="/admin/pages/new" 
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus size={16} /> Create New Page
        </Link>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Pages</p>
          <h3 className="text-2xl font-black text-slate-900">24</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Published</p>
          <h3 className="text-2xl font-black text-emerald-600">18</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Drafts</p>
          <h3 className="text-2xl font-black text-amber-600">6</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm">
          <p className="text-xs font-bold text-red-500 uppercase">SEO Issues</p>
          <h3 className="text-2xl font-black text-red-600">2</h3>
        </div>
      </div>

      {/* The Interactive Client-Side Table */}
      {/* <PagesTable initialData={pages} /> */}
    </div>
  );
}