import React from "react";
import Link from "next/link";
import { 
  Plus, Search, Users, Mail, Phone, 
  Filter, Building2, TrendingUp, DollarSign,
  AlertCircle, CheckCircle2, XCircle, Clock
} from "lucide-react";
import { getLeads } from "@/lib/actions/lead.actions";

export const dynamic = "force-dynamic";

export default async function LeadsListingPage() {
  const response = await getLeads();
  const allLeads = response.data || [];

  // Calculate Pipeline Metrics
  const totalLeads = allLeads.length;
  const newLeads = allLeads.filter(l => l.status === "NEW").length;
  const qualifiedLeads = allLeads.filter(l => l.status === "QUALIFIED").length;
  const proposalsSent = allLeads.filter(l => l.status === "PROPOSAL").length;
  const closedWon = allLeads.filter(l => l.status === "WON").length;
  
  // Calculate total revenue from closed deals
  const pipelineRevenue = allLeads
    .filter(l => l.status === "WON")
    .reduce((sum, lead) => sum + (lead.dealValue || 0), 0);

  // Status Badge Helper
  const getStatusBadge = (status: string | null) => {
    switch(status) {
      case 'NEW': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-max"><AlertCircle size={12}/> New</span>;
      case 'CONTACTED': return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-max"><Clock size={12}/> Contacted</span>;
      case 'QUALIFIED': return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-max"><CheckCircle2 size={12}/> Qualified</span>;
      case 'PROPOSAL': return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-max"><TrendingUp size={12}/> Proposal Sent</span>;
      case 'WON': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-max"><DollarSign size={12}/> Closed Won</span>;
      case 'LOST': return <span className="px-2.5 py-1 bg-slate-200 text-slate-600 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-max"><XCircle size={12}/> Closed Lost</span>;
      default: return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-md w-max">Unknown</span>;
    }
  };

  // Priority Dot Helper
  const getPriorityDot = (priority: string | null) => {
    switch(priority) {
      case 'HIGH': return <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" title="High Priority"></div>;
      case 'MEDIUM': return <div className="w-2 h-2 rounded-full bg-amber-400" title="Medium Priority"></div>;
      case 'LOW': return <div className="w-2 h-2 rounded-full bg-slate-300" title="Low Priority"></div>;
      default: return <div className="w-2 h-2 rounded-full bg-slate-300"></div>;
    }
  };

  return (
    <div className="p-10 space-y-8 pb-20">
      
      {/* SECTION A: Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-indigo-600" /> Sales Pipeline & Leads
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage inbound inquiries, track follow-ups, and close deals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={16} /> Filters
          </button>
          <Link href="/admin/leads/create" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
            <Plus size={18} /> Add Manual Lead
          </Link>
        </div>
      </header>

      {/* SECTION B: Pipeline Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "Total Leads", count: totalLeads, color: "text-slate-900" },
          { label: "New (Unread)", count: newLeads, color: "text-blue-600" },
          { label: "Qualified", count: qualifiedLeads, color: "text-purple-600" },
          { label: "Proposals", count: proposalsSent, color: "text-indigo-600" },
          { label: "Closed Won", count: closedWon, color: "text-emerald-600" },
          { label: "Revenue", count: `$${pipelineRevenue.toLocaleString()}`, color: "text-emerald-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.count}</h3>
          </div>
        ))}
      </div>

      {/* SECTION C: The CRM Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search leads by name, email, or company..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase text-slate-500 font-black tracking-wider">
              <tr>
                <th className="px-6 py-4 w-10">Pri</th>
                <th className="px-6 py-4">Lead Details</th>
                <th className="px-6 py-4">Project / Interest</th>
                <th className="px-6 py-4">Status & Next Step</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {allLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <Users size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="font-bold text-slate-600">Your pipeline is empty.</p>
                    <p className="text-sm mt-1">When users fill out forms on your site, they will appear here.</p>
                  </td>
                </tr>
              )}

              {allLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  
                  {/* Priority Indicator */}
                  <td className="px-6 py-4">
                    {getPriorityDot(lead.priority)}
                  </td>

                  {/* Name, Email, Company */}
                  <td className="px-6 py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="block">
                      <p className="font-bold text-slate-900 mb-0.5 group-hover:text-indigo-600 transition-colors">
                        {lead.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        {lead.company && <span className="flex items-center gap-1"><Building2 size={12}/> {lead.company}</span>}
                        <span className="flex items-center gap-1"><Mail size={12}/> {lead.email}</span>
                      </div>
                    </Link>
                  </td>

                  {/* Service Interest & Budget */}
                  <td className="px-6 py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="block">
                      <p className="font-bold text-slate-700 text-xs">{lead.serviceInterest || "General Inquiry"}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{lead.budget || "Budget Not Set"}</p>
                    </Link>
                  </td>

                  {/* Pipeline Status */}
                  <td className="px-6 py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="block">
                      <div className="mb-1">{getStatusBadge(lead.status)}</div>
                      {lead.assignedTo ? (
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide">Rep: {lead.assignedTo}</p>
                      ) : (
                        <p className="text-[10px] text-amber-500 uppercase font-bold tracking-wide">Unassigned</p>
                      )}
                    </Link>
                  </td>

                  {/* Source Tracking */}
                  <td className="px-6 py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="block">
                      <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {lead.sourceType || "Organic"}
                      </span>
                    </Link>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <Link href={`/admin/leads/${lead.id}`} className="block">
                      {new Date(lead.createdAt || "").toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </Link>
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