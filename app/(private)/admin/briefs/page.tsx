// import React from "react";
// import { 
//   Search, Mail, Zap, 
//   Trash2, Filter, ChevronRight, 
//   Clock, CheckCircle2, MoreHorizontal,
//   Plus
// } from "lucide-react";
// import { db } from "@/lib/db";
// import { briefs } from "@/db/schema";
// import { desc } from "drizzle-orm";
// import { format } from "date-fns";
// import Link from "next/link";

// export const dynamic = "force-dynamic";

// export default async function BriefsListingPage() {
//   const allBriefs = await db.select().from(briefs).orderBy(desc(briefs.createdAt));

//   // Dynamic Stats
//   const totalCount = allBriefs.length;
//   const blockchainCount = allBriefs.filter(b => b.department.includes("Blockchain")).length;
//   const aiCount = allBriefs.filter(b => b.department.includes("AI")).length;
//   const web3Count = allBriefs.filter(b => b.department.includes("Web3")).length;

//   return (
//     <div className="p-10 space-y-8 bg-[#F8FAFC] min-h-screen font-sans">
      
//       {/* SECTION A: HEADER */}
//       <header className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
//             <Zap className="text-blue-600 fill-blue-600" size={28} /> Transmission Logs
//           </h1>
//           <p className="text-sm text-slate-500 mt-1 font-medium italic">
//             Manage incoming project requirements and engineering gateway protocols.
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
//              Categories & Depts
//            </button>
//            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white font-bold text-sm rounded-xl hover:bg-blue-600 transition-all shadow-sm">
//              <Plus size={18} /> New Transmission
//            </button>
//         </div>
//       </header>

//       {/* SECTION B: SUMMARY CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {[
//           { label: "Total Briefs", count: totalCount, color: "text-slate-900" },
//           { label: "Blockchain", count: blockchainCount, color: "text-blue-600" },
//           { label: "AI & Automation", count: aiCount, color: "text-orange-500" },
//           { label: "SEO Issues", count: 0, color: "text-red-500" },
//         ].map((stat, i) => (
//           <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//             <h3 className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.count}</h3>
//           </div>
//         ))}
//       </div>

//       {/* SECTION C: SEARCH & TABLE CONTAINER */}
//       <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        
//         {/* Search Bar */}
//         <div className="p-6 border-b border-slate-50">
//           <div className="relative max-w-md">
//             {/* <Search className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-400" size={18} /> */}
//             <input 
//               type="text" 
//               placeholder="Search transmissions..." 
//               className="w-full pl-20 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left p-6">
//             <thead>
//               <tr className="border-b p-7 border-slate-100 bg-slate-50/50 text-[17px] uppercase text-slate-400 font-black tracking-widest">
//                 <th className="px-8 py-5">Sender Identity</th>
//                 <th className="px-8 py-5">Status</th>
//                 <th className="px-8 py-5">Security</th>
//                 <th className="px-8 py-5">Department</th>
//                 <th className="px-8 py-5">Timestamp</th>
//                 <th className="px-8 py-5 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50 p-6">
//               {allBriefs.map((brief) => (
//                 <tr key={brief.id} className="hover:bg-blue-50/20 transition-colors group">
                  
//                   {/* Title & Email */}
//                   <td className="px-8 py-6">
//                     <p className="font-black text-slate-900 text-[15px] mb-0.5">{brief.name}</p>
//                     <p className="text-xs text-slate-400 font-medium">/{brief.email.split('@')[0]}</p>
//                   </td>

//                   {/* Status Badge */}
//                   <td className="px-8 py-6">
//                     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-100">
//                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
//                       Published
//                     </span>
//                   </td>

//                   {/* SEO / Security Column */}
//                   <td className="px-8 py-6">
//                     <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
//                       <CheckCircle2 size={14} /> Complete
//                     </div>
//                   </td>

//                   {/* Category / Dept */}
//                   <td className="px-8 py-6 text-sm font-bold text-slate-600">
//                     {brief.department}
//                   </td>

//                   {/* Date */}
//                   <td className="px-8 py-6 text-sm font-medium text-slate-500">
//                     {brief.createdAt ? format(new Date(brief.createdAt), "MMM dd, yyyy") : "N/A"}
//                   </td>

//                   {/* Actions */}
//                   <td className="px-8 py-6 text-right">
//                     <div className="flex justify-end items-center gap-4 text-slate-400">
//                       <button className="hover:text-blue-600 transition-colors">
//                         <MoreHorizontal size={20} />
//                       </button>
//                       <button className="hover:text-red-500 transition-colors">
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>

//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { 
  Search, Zap, Plus, 
  Trash2, CheckCircle2, FileText,
  AlertCircle,
  X
} from "lucide-react";
import { db } from "@/lib/db";
import { briefs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { format } from "date-fns";
import BriefActions from "@/components/BriefActions";
// import BriefActions from "@/components/admin/briefs/BriefActions";

export const dynamic = "force-dynamic";

export default async function BriefsListingPage() {
  const allBriefs = await db.select().from(briefs).orderBy(desc(briefs.createdAt));

  // Dynamic Stats
  const totalCount = allBriefs.length;
  const blockchainCount = allBriefs.filter(b => b.department.includes("Blockchain")).length;
  const aiCount = allBriefs.filter(b => b.department.includes("AI")).length;
  const filesCount = allBriefs.filter(b => b.documentUrl).length;

  return (
    <div className="p-10 space-y-8 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Zap className="text-blue-600 fill-blue-600" size={28} /> Transmission Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage incoming project requirements and engineering gateway protocols.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white font-bold text-sm rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-95">
             <Plus size={18} /> New Transmission
           </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Briefs", count: totalCount, color: "text-slate-900", icon: <Zap size={14}/> },
          { label: "Blockchain", count: blockchainCount, color: "text-blue-600", icon: <CheckCircle2 size={14}/> },
          { label: "AI & Automation", count: aiCount, color: "text-orange-500", icon: <Zap size={14}/> },
          { label: "Attachments", count: filesCount, color: "text-emerald-600", icon: <FileText size={14}/> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
               <span className={`${stat.color}`}>{stat.icon}</span>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
            <h3 className={`text-3xl font-black ${stat.color}`}>{stat.count}</h3>
          </div>
        ))}
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        
        {/* Search & Filters */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by sender identity or department..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] uppercase text-slate-400 font-black tracking-widest">
                <th className="px-8 py-5">Sender Identity</th>
                <th className="px-8 py-5">Security</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5">Files</th>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allBriefs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">
                    No transmissions found in the logs.
                  </td>
                </tr>
              ) : (
                allBriefs.map((brief) => (
                  <tr key={brief.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-900 text-[15px] mb-0.5">{brief.name}</p>
                      <p className="text-xs text-slate-400 font-medium">/{brief.email}</p>
                    </td>

                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase border border-emerald-100">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    </td>

                    <td className="px-8 py-6">
                       <p className="text-sm font-bold text-slate-600">{brief.department}</p>
                    </td>

                    <td className="px-8 py-6">
                      {brief.documentUrl ? (
                        <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase">
                          <FileText size={14} /> 1 Attachment
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-300 font-bold text-[10px] uppercase">
                          <X size={14} /> No Files
                        </div>
                      )}
                    </td>

                    <td className="px-8 py-6 text-sm font-medium text-slate-500">
                      {brief.createdAt ? format(new Date(brief.createdAt), "MMM dd, hh:mm a") : "---"}
                    </td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end items-center gap-3">


                        <BriefActions brief={brief} />
                        <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                           <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}