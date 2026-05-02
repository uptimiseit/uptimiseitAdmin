import React from "react";
import { 
  Search, Globe, Zap, 
  Trash2, Filter, MoreHorizontal,
  Plus, CheckCircle2, Linkedin, Building2
} from "lucide-react";
import { db } from "@/lib/db";
import { projectIntake } from "@/db/schema";
import { desc } from "drizzle-orm";
import { format } from "date-fns";
import IntakeActions from "@/components/IntakeActions";

export const dynamic = "force-dynamic";

export default async function ProjectIntakeListingPage() {
  const allIntakes = await db.select().from(projectIntake).orderBy(desc(projectIntake.createdAt));

  // Dynamic Intelligence
  const totalCount = allIntakes.length;
  const seedStage = allIntakes.filter(i => i.companyStage.includes("Seed")).length;
  const enterpriseStage = allIntakes.filter(i => i.companyStage.includes("Enterprise")).length;

  return (
    <div className="p-10 space-y-8 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Globe className="text-blue-600" size={28} /> Project_Intake_v1.0
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium italic">
            Monitoring mission-critical challenges and secure engineering gateways.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
             Archive Protocol
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white font-bold text-sm rounded-xl hover:bg-blue-600 transition-all shadow-sm">
             <Plus size={18} /> Manual Intake
           </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Intakes", count: totalCount, color: "text-slate-900" },
          { label: "Seed / Pre-Revenue", count: seedStage, color: "text-blue-600" },
          { label: "Enterprise Ready", count: enterpriseStage, color: "text-orange-500" },
          { label: "Security Checks", count: totalCount, color: "text-emerald-500" },
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
            {/* <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /> */}
            <input 
              type="text" 
              placeholder="Search leads or companies..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all"
            />
          </div>
          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900 transition-colors">
            <Filter size={20} />
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase text-slate-400 font-black tracking-widest">
                <th className="px-8 py-5">Full Name</th>
                <th className="px-8 py-5">Verification</th>
                <th className="px-8 py-5">Company Context</th>
                <th className="px-8 py-5">Stage</th>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allIntakes.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/20 transition-colors group">
                  
                  {/* Name & Contact */}
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-950 text-[15px] mb-0.5">{log.fullName}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-400 font-medium">{log.workEmail}</p>
                        {log.linkedinUrl && (
                            <a href={log.linkedinUrl} target="_blank" className="text-blue-500 hover:scale-110 transition-transform">
                                <Linkedin size={12} />
                            </a>
                        )}
                    </div>
                  </td>

                  {/* Security Status */}
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                      <CheckCircle2 size={12} /> Secure
                    </span>
                  </td>

                  {/* Company Info */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                      <Building2 size={14} className="text-slate-400" /> {log.companyName || "Independent"}
                    </div>
                  </td>

                  {/* Stage Label */}
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {log.companyStage}
                    </span>
                  </td>

                  {/* Received Date */}
                  <td className="px-8 py-6 text-sm font-medium text-slate-500">
                    {log.createdAt ? format(new Date(log.createdAt), "MMM dd, yyyy") : "N/A"}
                  </td>

                  {/* Actions */}
                  {/* <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-4 text-slate-400">
                      <button className="hover:text-blue-600 transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                      <button className="hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td> */}

<td className="px-8 py-6 text-right">
  <div className="flex justify-end items-center gap-3">
    {/* Use the new Client Component here */}
    <IntakeActions log={log} />
    
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