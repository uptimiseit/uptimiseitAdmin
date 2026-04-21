// import React from "react";
// import Link from "next/link";
// import { 
//   Plus, FileText, Search,
//   CheckCircle2, AlertCircle, Edit
// } from "lucide-react";
// import { getBlogs } from "@/lib/actions/blog.actions";
// import DeleteBlogButton from "@/components/admin/blogs/DeleteBlogButton";
// import HomeToggle from "@/components/admin/blogs/HomeToggle";

// export const dynamic = "force-dynamic";


// export default async function BlogsListingPage() {

//   const response = await getBlogs();
//   const realBlogs = response.data || [];
//   const publishedCount = realBlogs.filter((b) => b.status === "PUBLISHED").length;
//   const draftCount = realBlogs.filter((b) => b.status === "DRAFT").length;
//   const missingSeoCount = realBlogs.filter((b) => !b.seoTitle?.trim() || !b.seoDesc?.trim()).length;

//   return (
//     <div className="p-10 space-y-8 pb-20">
//       {/* Header */}
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

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {[
//           { label: "Total Posts", count: realBlogs.length, color: "text-slate-900" },
//           { label: "Published", count: publishedCount, color: "text-emerald-600" },
//           { label: "Drafts", count: draftCount, color: "text-amber-600" },
//           { label: "SEO Issues", count: missingSeoCount, color: "text-rose-600" },
//         ].map((stat, i) => (
//           <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
//             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
//             <h3 className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.count}</h3>
//           </div>
//         ))}
//       </div>

//       {/* Data Table Container */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
//           <div className="relative w-full sm:w-96">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//             <input 
//               type="text" 
//               placeholder="Search articles..." 
//               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm border-collapse">
//             <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
//               <tr>
//                 <th className="px-6 py-4">Title</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">SEO</th>
//                 <th className="px-6 py-4">Category</th>
//                 <th className="px-6 py-4">Is Home</th>
//                 <th className="px-6 py-4">Date</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {realBlogs.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
//                     No blog posts found. Click "Create New Blog" to get started!
//                   </td>
//                 </tr>
//               ) : (
//                 realBlogs.map((blog) => (
//                   <tr key={blog.id} className="hover:bg-slate-50 transition-colors group">
//                     <td className="px-6 py-4">
//                       <p className="font-bold text-slate-900 mb-0.5">{blog.title}</p>
//                       <p className="text-xs text-slate-500 font-mono">/{blog.slug}</p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${
//                         blog.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
//                         blog.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
//                       }`}>
//                         {blog.status === 'PUBLISHED' && <CheckCircle2 size={10}/>}
//                         {blog.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       {blog.seoTitle?.trim() && blog.seoDesc?.trim() ? (
//                         <span className="text-emerald-600 text-[10px] font-black uppercase flex items-center gap-1">
//                           <CheckCircle2 size={12}/> Optimized
//                         </span>
//                       ) : (
//                         <span className="text-rose-600 text-[10px] font-black uppercase flex items-center gap-1">
//                           <AlertCircle size={12}/> Incomplete
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-slate-600 font-medium text-xs">
//                       {blog.category || "General"}
//                     </td>
//                     <td className="px-6 py-4">
//                       <HomeToggle id={blog.id} initialValue={blog.isHome || false} />
//                     </td>
//                     <td className="px-6 py-4 text-slate-500 text-xs font-medium">
//                       {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
//                         month: 'short', day: 'numeric', year: 'numeric'
//                       }) : "---"}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2 justify-end">
//                         <Link href={`/admin/blogs/${blog.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
//                           <Edit size={16} />
//                         </Link>
//                         <DeleteBlogButton id={blog.id} title={blog.title} />
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React from "react";
// import Link from "next/link";
// import { 
//   Plus, FileText, Search,
//   CheckCircle2, AlertCircle, Edit
// } from "lucide-react";
// import { getBlogs } from "@/lib/actions/blog.actions";
// import DeleteBlogButton from "@/components/admin/blogs/DeleteBlogButton";
// import HomeToggle from "@/components/admin/blogs/HomeToggle";

// // Define the Blog structure to prevent GitHub/TypeScript build errors
// interface Blog {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string | null;   // Added from error message
//   content?: string | null;   // Added from error message
//   status: string | null;
//   seoTitle?: string | null;
//   seoDesc?: string | null;
//   category?: string | null;
//   subCategory?: string | null; // Added from error message
//   tags?: string | null;        // Added from error message
//   isHome?: boolean | null;     // THE FIX: Allow null here
//   createdAt: Date | null;
// }


// export const dynamic = "force-dynamic";

// export default async function BlogsListingPage() {
//   const response = await getBlogs();
  
//   // Ensure we always have an array, even if the API fails
//   const realBlogs: Blog[] = response?.data || [];

//   // Summary Stats Logic
//   const publishedCount = realBlogs.filter((b) => b.status === "PUBLISHED").length;
//   const draftCount = realBlogs.filter((b) => b.status === "DRAFT").length;
  
//   // Robust SEO check: counts blogs missing a title OR a description
//   const missingSeoCount = realBlogs.filter((b) => {
//     const hasTitle = b.seoTitle && b.seoTitle.trim() !== "";
//     const hasDesc = b.seoDesc && b.seoDesc.trim() !== "";
//     return !hasTitle || !hasDesc;
//   }).length;

//   return (
//     <div className="p-10 space-y-8 pb-20">
//       {/* Header */}
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

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {[
//           { label: "Total Posts", count: realBlogs.length, color: "text-slate-900" },
//           { label: "Published", count: publishedCount, color: "text-emerald-600" },
//           { label: "Drafts", count: draftCount, color: "text-amber-600" },
//           { label: "SEO Issues", count: missingSeoCount, color: "text-rose-600" },
//         ].map((stat) => (
//           <div key={stat.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
//             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
//             <h3 className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.count}</h3>
//           </div>
//         ))}
//       </div>

//       {/* Data Table Container */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
//           <div className="relative w-full sm:w-96">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//             <input 
//               type="text" 
//               placeholder="Search articles..." 
//               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm border-collapse">
//             <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
//               <tr>
//                 <th className="px-6 py-4">Title</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">SEO</th>
//                 <th className="px-6 py-4">Category</th>
//                 <th className="px-6 py-4">Is Home</th>
//                 <th className="px-6 py-4">Date</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {realBlogs.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
//                     No blog posts found. Click "Create New Blog" to get started!
//                   </td>
//                 </tr>
//               ) : (
//                 realBlogs.map((blog) => (
//                   <tr key={blog.id} className="hover:bg-slate-50 transition-colors group">
//                     <td className="px-6 py-4">
//                       <p className="font-bold text-slate-900 mb-0.5">{blog.title}</p>
//                       <p className="text-xs text-slate-500 font-mono">/{blog.slug}</p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${
//                         blog.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
//                         blog.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
//                       }`}>
//                         {blog.status === 'PUBLISHED' && <CheckCircle2 size={10}/>}
//                         {blog.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       {blog.seoTitle?.trim() && blog.seoDesc?.trim() ? (
//                         <span className="text-emerald-600 text-[10px] font-black uppercase flex items-center gap-1">
//                           <CheckCircle2 size={12}/> Optimized
//                         </span>
//                       ) : (
//                         <span className="text-rose-600 text-[10px] font-black uppercase flex items-center gap-1">
//                           <AlertCircle size={12}/> Incomplete
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-slate-600 font-medium text-xs">
//                       {blog.category || "General"}
//                     </td>
//                     <td className="px-6 py-4">
//                       <HomeToggle id={blog.id} initialValue={blog.isHome || false} />
//                     </td>
//                     <td className="px-6 py-4 text-slate-500 text-xs font-medium">
//                       {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
//                         month: 'short', day: 'numeric', year: 'numeric'
//                       }) : "---"}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2 justify-end">
//                         <Link href={`/admin/blogs/${blog.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
//                           <Edit size={16} />
//                         </Link>
//                         {/* <DeleteBlogButton id={blog.id} title={blog.title} /> */}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page