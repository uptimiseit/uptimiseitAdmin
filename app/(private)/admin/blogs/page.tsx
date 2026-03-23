// import React from "react";
// import Link from "next/link";
// import { 
//   Plus, FileText, Search, Filter, MoreVertical, 
//   CheckCircle2, Clock, AlertCircle, Image as ImageIcon
// } from "lucide-react";

// // Mock Data based on your specification
// const mockBlogs = [
//   { id: 1, title: "The AI Software Factory Engine Explained", slug: "ai-software-factory", category: "AI & Automation", status: "PUBLISHED", seo: "Complete", date: "Oct 24, 2026", author: "Saurabh S." },
//   { id: 2, title: "Building Scalable SaaS Platforms", slug: "scalable-saas", category: "Software Development", status: "DRAFT", seo: "Missing Meta", date: "-", author: "Admin" },
//   { id: 3, title: "Next.js vs Traditional Web Frameworks", slug: "nextjs-vs-traditional", category: "Performance", status: "SCHEDULED", seo: "Complete", date: "Nov 01, 2026", author: "Saurabh S." },
// ];

// export default function BlogsListingPage() {
//   return (
//     <div className="px-10 space-y-8 py-10">
      
//       {/* SECTION A: Header */}
//       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
//         <div>
//           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
//             <FileText className="text-indigo-600" /> Blogs
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Manage blog articles, publishing workflow, categories, and SEO.
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Link href="/admin/blog-categories" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
//             Categories & Tags
//           </Link>
//           <Link href="/admin/blogs/new" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
//             <Plus size={16} /> Create New Blog
//           </Link>
//         </div>
//       </header>

//       {/* SECTION B: Summary Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         {[
//           { label: "Total Posts", count: "48", color: "text-slate-900" },
//           { label: "Published", count: "32", color: "text-emerald-600" },
//           { label: "Drafts", count: "12", color: "text-amber-600" },
//           { label: "Scheduled", count: "4", color: "text-blue-600" },
//           { label: "SEO Issues", count: "3", color: "text-red-600" },
//         ].map((stat, i) => (
//           <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
//             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
//             <h3 className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.count}</h3>
//           </div>
//         ))}
//       </div>

//       {/* SECTION C & D: Filters and Data Table */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
//         {/* Toolbar */}
//         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
//           <div className="relative w-full sm:w-96">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//             <input 
//               type="text" 
//               placeholder="Search articles..." 
//               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
//             />
//           </div>
//           <div className="flex items-center gap-2 w-full sm:w-auto">
//             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">
//               <Filter size={14} /> Status
//             </button>
//             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">
//               <Filter size={14} /> Category
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
//               <tr>
//                 <th className="px-6 py-4">Title</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">SEO</th>
//                 <th className="px-6 py-4">Category</th>
//                 <th className="px-6 py-4">Date</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {mockBlogs.map((blog) => (
//                 <tr key={blog.id} className="hover:bg-slate-50 transition-colors group">
//                   <td className="px-6 py-4">
//                     <p className="font-bold text-slate-900 mb-0.5">{blog.title}</p>
//                     <p className="text-xs text-slate-500 font-mono">/{blog.slug}</p>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
//                       blog.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
//                       blog.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
//                       'bg-blue-100 text-blue-800'
//                     }`}>
//                       {blog.status === 'PUBLISHED' && <CheckCircle2 size={12}/>}
//                       {blog.status === 'DRAFT' && <FileText size={12}/>}
//                       {blog.status === 'SCHEDULED' && <Clock size={12}/>}
//                       {blog.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     {blog.seo === "Complete" ? (
//                       <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={14}/> 100%</span>
//                     ) : (
//                       <span className="text-red-600 text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> {blog.seo}</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 text-slate-600 font-medium">{blog.category}</td>
//                   <td className="px-6 py-4 text-slate-500 text-xs">{blog.date}</td>
//                   <td className="px-6 py-4 text-right">
//                     <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
//                       <MoreVertical size={18} />
//                     </button>
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
import Link from "next/link";
import { 
  Plus, FileText, Search, Filter, MoreVertical, 
  CheckCircle2, Clock, AlertCircle,
  Edit
} from "lucide-react";
import { getBlogs } from "@/lib/actions/blog.actions";
import DeleteBlogButton from "@/components/admin/blogs/DeleteBlogButton";



export const dynamic = "force-dynamic";



export default async function BlogsListingPage() {
  // 2. Fetch the real data directly on the server
  const response = await getBlogs();
  const realBlogs = response.data || [];

  // Calculate some quick stats for your cards
  const publishedCount = realBlogs.filter((b) => b.status === "PUBLISHED").length;
  const draftCount = realBlogs.filter((b) => b.status === "DRAFT").length;
  const missingSeoCount = realBlogs.filter((b) => !b.seoTitle || !b.seoDesc).length;

  return (
    <div className="p-10 space-y-8 pb-20">
      
      {/* SECTION A: Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="text-indigo-600" /> Blogs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage blog articles, publishing workflow, categories, and SEO.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/blog-categories" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            Categories & Tags
          </Link>
          <Link href="/admin/blogs/new" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
            <Plus size={16} /> Create New Blog
          </Link>
        </div>
      </header>

      {/* SECTION B: Dynamic Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Posts", count: realBlogs.length, color: "text-slate-900" },
          { label: "Published", count: publishedCount, color: "text-emerald-600" },
          { label: "Drafts", count: draftCount, color: "text-amber-600" },
          { label: "SEO Issues", count: missingSeoCount, color: "text-red-600" },
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
              placeholder="Search articles..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">SEO</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 ">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Handle Empty State */}
              {realBlogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No blog posts found. Click "Create New Blog" to get started!
                  </td>
                </tr>
              )}

              {/* Map over REAL Database Blogs */}
              {realBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 mb-0.5">{blog.title}</p>
                    <p className="text-xs text-slate-500 font-mono">/{blog.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      blog.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                      blog.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {blog.status === 'PUBLISHED' && <CheckCircle2 size={12}/>}
                      {blog.status === 'DRAFT' && <FileText size={12}/>}
                      {blog.status === 'SCHEDULED' && <Clock size={12}/>}
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {blog.seoTitle && blog.seoDesc ? (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={14}/> Complete</span>
                    ) : (
                      <span className="text-red-600 text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> Needs Work</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{blog.category || "Uncategorized"}</td>
                  
                  {/* Format the PostgreSQL Timestamp nicely */}
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    }) : "N/A"}
                  </td>

                  <td className="px-6 py-4 flex items-end gap-3 text-end">
                    <Link href={`/admin/blogs/${blog.id}`} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-block">
                      <Edit size={18} />
                    </Link>

  <DeleteBlogButton id={blog.id} title={blog.title} />

                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
  {/* The Edit Link */}
  {/* <Link 
    href={`/admin/blogs/${blog.id}`} 
    title="Edit Post"
    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-block"
  >
    <MoreVertical size={18} />
  </Link> */}

  {/* The Delete Button Component */}
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