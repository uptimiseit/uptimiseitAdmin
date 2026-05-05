'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Edit, Trash2, Globe, 
  Search, Loader2, Database
} from 'lucide-react';
import { getSolutionsMenu, deleteSolution } from "@/lib/actions/solution.actions";
import { toast } from "sonner";

export default function SolutionsListingPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadSolutions = async () => {
    setLoading(true);
    const res = await getSolutionsMenu();
    if (res.success) {
      setItems(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSolutions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to terminate this solution node?")) return;
    
    const res = await deleteSolution(id);
    if (res.success) {
      toast.success("Node terminated successfully");
      loadSolutions();
    } else {
      toast.error("Failed to delete node");
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pt-32 pb-20 px-6 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600">
                <Database size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Admin_Registry</span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              Solution_Ledger
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 font-mono">
              // Sync_Status: Online // Active_Nodes: {items.length}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search_Registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            <Link 
              href="/admin/solutions/create" 
              className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
            >
              <Plus size={16} /> Initialize_Node
            </Link>
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-blue-600" size={40} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono animate-pulse">Fetching_Data_Packets...</span>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Node_Identity</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Virtual_Path</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Node_Context</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Operations</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-blue-50/30 transition-all">
                        <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:shadow-lg group-hover:shadow-blue-100 transition-all">
                            <Globe size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-slate-900 uppercase text-sm tracking-tight">{item.title}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {item.id.toString().padStart(3, '0')}</span>
                            </div>
                        </div>
                        </td>
                        <td className="px-10 py-8 hidden md:table-cell">
                        <code className="text-[11px] font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                            /{item.slug}
                        </code>
                        </td>
                        <td className="px-10 py-8">
                        <p className="text-xs text-slate-500 max-w-xs line-clamp-2 leading-relaxed font-medium">
                            {item.description}
                        </p>
                        </td>
                        <td className="px-10 py-8">
                        <div className="flex items-center justify-end gap-3">
                            <Link 
                            href={`/admin/solutions/edit/${item.id}`}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"
                            title="Edit Node"
                            >
                            <Edit size={16} />
                            </Link>
                            <button 
                            onClick={() => handleDelete(item.id)}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-200 hover:shadow-md transition-all"
                            title="Terminate Node"
                            >
                            <Trash2 size={16} />
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            
            {filteredItems.length === 0 && (
              <div className="py-32 text-center bg-slate-50/50">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-slate-200 text-slate-300">
                    <Search size={24} />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">No_Nodes_Found_In_Registry</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}