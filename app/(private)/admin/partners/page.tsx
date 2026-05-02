import React from "react";
import { 
  Globe, Trash2, Filter, Plus, 
  CheckCircle2, Building2, UserCheck, MessageSquare 
} from "lucide-react";
import { db } from "@/lib/db";
import { partnerIntake } from "@/db/schema";
import { desc } from "drizzle-orm";
import { format } from "date-fns";
// Assuming you create a separate action component for partners
// import PartnerActions from "@/components/PartnerActions"; 

export const dynamic = "force-dynamic";

export default async function PartnerIntakeListingPage() {
  const allPartners = await db.select().from(partnerIntake).orderBy(desc(partnerIntake.createdAt));

  // Dynamic Intelligence
  const totalCount = allPartners.length;
  const agencyCount = allPartners.filter(i => i.partnerType.toLowerCase().includes("agency")).length;

  return (
    <div className="p-10 space-y-8 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <UserCheck className="text-indigo-600" size={28} /> Partner_Gate_v1.0
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium italic">
            Reviewing ecosystem collaborations and agency alliances.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
             Export Registry
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
             <Plus size={18} /> New Partner
           </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Partners", count: totalCount, color: "text-slate-900" },
          { label: "Agencies", count: agencyCount, color: "text-indigo-600" },
          { label: "Active Review", count: totalCount, color: "text-orange-500" },
          { label: "Verified Countries", count: new Set(allPartners.map(p => p.country)).size, color: "text-emerald-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.count}</h3>
          </div>
        ))}
      </div>

      {/* MAIN TABLE CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        
        {/* Search & Filter */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <div className="relative max-w-md w-full">
            <input 
              type="text" 
              placeholder="Search by company or partner name..." 
              className="w-full px-6 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase text-slate-400 font-black tracking-widest">
                <th className="px-8 py-5">Partner Name</th>
                <th className="px-8 py-5">Region</th>
                <th className="px-8 py-5">Company / Type</th>
                <th className="px-8 py-5">Brief / Notes</th>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allPartners.map((log) => (
                <tr key={log.id} className="hover:bg-indigo-50/20 transition-colors group">
                  
                  {/* Name & Contact */}
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-950 text-[15px] mb-0.5">{log.fullName}</p>
                    <p className="text-xs text-slate-400 font-medium">{log.workEmail}</p>
                  </td>

                  {/* Region */}
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      <Globe size={12} /> {log.country}
                    </span>
                  </td>

                  {/* Company Info & Type */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                      <Building2 size={14} className="text-slate-400" /> {log.companyName}
                    </div>
                    <span className="text-[9px] font-black uppercase text-indigo-500 mt-1 block tracking-tighter">
                      Type: {log.partnerType}
                    </span>
                  </td>

                  {/* Message Snippet */}
                  <td className="px-8 py-6 max-w-xs">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={14} className="text-slate-300 mt-1 shrink-0" />
                      <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                        {log.message}
                      </p>
                    </div>
                  </td>

                  {/* Received Date */}
                  <td className="px-8 py-6 text-sm font-medium text-slate-500">
                    {log.createdAt ? format(new Date(log.createdAt), "MMM dd, yyyy") : "N/A"}
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-3">
                      {/* <PartnerActions log={log} /> */}
                      <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
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