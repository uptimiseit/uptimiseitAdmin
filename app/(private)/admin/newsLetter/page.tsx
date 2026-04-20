import React from "react";
import { Mail, Search, Download, Trash2, UserCheck, Clock } from "lucide-react";
import { getSubscribers } from "@/lib/actions/newsletter.actions";
// import DeleteSubscriberButton from "@/components/admin/newsletter/DeleteSubscriberButton";

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const response = await getSubscribers();
  const emails = response.data || [];

  return (
    <div className="p-10 space-y-8 pb-20">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Mail className="text-emerald-600" /> Newsletter Subscribers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your audience and export email lists for campaigns.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-all shadow-sm">
          <Download size={16} /> Export CSV
        </button>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
            <UserCheck size={20} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Audience</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{emails.length}</h3>
        </div>
        {/* You can add more stats like "Joined this month" here */}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search subscribers..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase text-slate-500 font-black tracking-widest">
              <tr>
                <th className="px-6 py-4">Subscriber Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {emails.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No active subscribers found in the database.
                  </td>
                </tr>
              ) : (
                emails.map((item: { id: React.Key | null | undefined; email: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; createdAt: string | number | Date; }) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">{item.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                      <Clock size={14} className="text-slate-300" />
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    {/* <td className="px-6 py-4 text-right">
                      <DeleteSubscriberButton id={item.id} />
                    </td> */}
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