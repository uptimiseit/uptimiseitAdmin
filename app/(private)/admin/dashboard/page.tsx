"use client";

import React, { useState } from "react";
import Link from "next/link";
// import AdminSidebar from "@/components/admin/AdminSidebar"; // Adjust path as needed based on your structure
import { 
  LayoutDashboard, FileText, Briefcase, Search, Settings, 
  ImageIcon, Bell, Plus, AlertCircle, CheckCircle2, Clock, 
  MoreVertical, FileEdit, Globe, MessageSquare, ShieldAlert,
  Users, Rocket,
  Activity
} from "lucide-react";

// --- MOCK DATA ---
const kpiData = [
  { title: "Published Pages", count: "42", note: "+3 this week", icon: <Globe size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Draft Content", count: "12", note: "5 pending review", icon: <FileEdit size={20} />, color: "text-amber-600", bg: "bg-amber-50" },
  { title: "Published Blogs", count: "28", note: "+2 this week", icon: <FileText size={20} />, color: "text-indigo-600", bg: "bg-indigo-50" },
  { title: "New Inquiries", count: "9", note: "2 need follow-up today", icon: <MessageSquare size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
  { title: "Pending Partners", count: "3", note: "1 high priority", icon: <Briefcase size={20} />, color: "text-purple-600", bg: "bg-purple-50" },
  { title: "Case Studies", count: "6", note: "1 in draft", icon: <Rocket size={20} />, color: "text-cyan-600", bg: "bg-cyan-50" },
  { title: "SEO Issues", count: "4", note: "Missing meta desc", icon: <Search size={20} />, color: "text-red-600", bg: "bg-red-50" },
  { title: "Team Members", count: "8", note: "All active", icon: <Users size={20} />, color: "text-slate-600", bg: "bg-slate-100" },
];

const recentLeads = [
  { id: 1, name: "Sarah Jenkins", company: "TechFlow Inc.", service: "SaaS Development", status: "New", date: "2 hours ago" },
  { id: 2, name: "David Chen", company: "Apex Logistics", service: "Enterprise ERP", status: "Contacted", date: "5 hours ago" },
  { id: 3, name: "Elena Rodriguez", company: "FinServe", service: "Cloud Migration", status: "Meeting Set", date: "Yesterday" },
  { id: 4, name: "Marcus Webb", company: "Webb Retail", service: "E-commerce", status: "New", date: "Yesterday" },
];

const recentActivity = [
  { id: 1, action: "Published Blog", title: "AI Software Factory Guide", user: "Saurabh S.", time: "1 hr ago", icon: <CheckCircle2 size={16} className="text-emerald-500"/> },
  { id: 2, action: "Updated Page", title: "Pricing Plans", user: "Admin", time: "3 hrs ago", icon: <FileEdit size={16} className="text-blue-500"/> },
  { id: 3, action: "New Inquiry", title: "SaaS Development - TechFlow", user: "System", time: "2 hrs ago", icon: <MessageSquare size={16} className="text-amber-500"/> },
  { id: 4, action: "SEO Alert", title: "Missing Meta: About Us", user: "System", time: "5 hrs ago", icon: <ShieldAlert size={16} className="text-red-500"/> },
];

const draftContent = [
  { id: 1, title: "The Future of Web3 Apps", type: "Blog", lastUpdated: "Today", status: "In Review" },
  { id: 2, title: "Healthcare Solutions", type: "Industry Page", lastUpdated: "Yesterday", status: "Draft" },
  { id: 3, title: "Acme Corp Logistics", type: "Case Study", lastUpdated: "2 days ago", status: "Draft" },
];

export default function AdminDashboardPage() {
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900 selection:bg-indigo-200">
      
  

      {/* 2. MAIN DASHBOARD CONTENT */}
      {/* Note the lg:ml-64 here. This ensures the main content avoids the fixed 64-width sidebar on desktop. */}
      <main className="flex-1  p-6 lg:p-10 overflow-y-auto">
        <div className=" space-y-8">
          
          {/* TOP HEADER & WELCOME */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, Saurabh.</h1>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <Clock size={14} /> {currentDate} • <span className="px-2 py-0.5 bg-slate-200 rounded text-xs font-bold text-slate-700">Super Admin</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                <Plus size={16} /> New Entry
              </button>
            </div>
          </header>

          {/* KPI CARDS */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-colors cursor-pointer group">
                <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} shrink-0`}>
                  {kpi.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{kpi.title}</p>
                  <h3 className="text-2xl font-black text-slate-900">{kpi.count}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">{kpi.note}</p>
                </div>
              </div>
            ))}
          </section>

          {/* QUICK ACTIONS */}
          <section>
            <p className="text-sm font-bold text-slate-900 mb-3">Quick Actions</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Create Blog", icon: <FileText size={14}/> },
                { label: "Create Page", icon: <LayoutDashboard size={14}/> },
                { label: "Review Leads", icon: <MessageSquare size={14}/> },
                { label: "Upload Media", icon: <ImageIcon size={14}/> },
                { label: "Site Settings", icon: <Settings size={14}/> }
              ].map((action, i) => (
                <button key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm">
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          </section>

          {/* DASHBOARD GRID: Left (Main) & Right (Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Deep Operational Snapshots */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* LEADS SNAPSHOT */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare size={18} className="text-emerald-500"/> Recent Inquiries
                  </h3>
                  <Link href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View All</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold">
                      <tr>
                        <th className="px-5 py-3">Lead / Company</th>
                        <th className="px-5 py-3">Interest</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-900">{lead.name}</p>
                            <p className="text-xs text-slate-500">{lead.company}</p>
                          </td>
                          <td className="px-5 py-4 font-medium text-slate-700">{lead.service}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              lead.status === 'New' ? 'bg-emerald-100 text-emerald-700' :
                              lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                              'bg-indigo-100 text-indigo-700'
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-500 text-xs">
                            <div className="flex items-center justify-between">
                              {lead.date}
                              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"><MoreVertical size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CONTENT SNAPSHOT (Drafts) */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <FileEdit size={18} className="text-amber-500"/> Draft Content
                  </h3>
                  <Link href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Manage Content</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold">
                      <tr>
                        <th className="px-5 py-3">Title</th>
                        <th className="px-5 py-3">Type</th>
                        <th className="px-5 py-3">Last Updated</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {draftContent.map((draft) => (
                        <tr key={draft.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 font-bold text-slate-900">{draft.title}</td>
                          <td className="px-5 py-4"><span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{draft.type}</span></td>
                          <td className="px-5 py-4 text-slate-500 text-xs">{draft.lastUpdated}</td>
                          <td className="px-5 py-4 text-indigo-600 text-xs font-bold hover:text-indigo-800 cursor-pointer">Edit Draft</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PARTNER SNAPSHOT (Empty State Example) */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase size={18} className="text-purple-500"/> Pending Partner Applications
                  </h3>
                </div>
                <div className="p-10 text-center flex flex-col items-center justify-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                     <Briefcase className="text-slate-300 w-8 h-8" />
                   </div>
                   <h4 className="text-slate-900 font-bold mb-1">No pending applications</h4>
                   <p className="text-slate-500 text-sm max-w-sm">When agencies or consultants apply to your partner program, their applications will appear here for review.</p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Quick Status & Feeds */}
            <div className="space-y-8">
              
              {/* RECENT ACTIVITY FEED */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity size={18} className="text-blue-500" /> Recent Activity
                </h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="relative flex items-start gap-4 z-10">
                      <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm shrink-0">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{activity.action}</p>
                        <p className="text-xs text-slate-700 mt-0.5 font-medium">{activity.title}</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                  View Full Audit Log
                </button>
              </div>

              {/* SEO SNAPSHOT */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Search size={18} className="text-indigo-500" /> SEO Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <ShieldAlert size={16} className="text-red-500" />
                      <span className="text-sm font-bold text-red-900">Missing Meta Desc.</span>
                    </div>
                    <span className="bg-red-200 text-red-800 text-xs font-black px-2 py-0.5 rounded-full">4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-900">Sitemap Status</span>
                    </div>
                    <span className="text-emerald-700 text-xs font-bold">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-slate-500" />
                      <span className="text-sm font-bold text-slate-700">Indexed Pages</span>
                    </div>
                    <span className="text-slate-700 text-xs font-bold">~42</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100">
                  Open SEO Manager
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}