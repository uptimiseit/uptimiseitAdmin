// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { 
//   Save, Globe, ArrowLeft, Settings, Search, 
//   Image as ImageIcon, Tag, LayoutTemplate, 
//   Link as LinkIcon, Bold, Italic, List, 
//   Quote, Loader2, CheckCircle2
// } from "lucide-react";
// import { saveBlogPost, updateBlogPost } from "@/lib/actions/blog.actions";

// interface BlogEditorFormProps {
//   initialData?: any;
//   isEditMode?: boolean;
// }

// export default function BlogEditorForm({ initialData, isEditMode = false }: BlogEditorFormProps) {
//   const router = useRouter();

//   // --- CONTENT STATE ---
//   const [title, setTitle] = useState(initialData?.title || "");
//   const [slug, setSlug] = useState(initialData?.slug || "");
//   const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
//   const [content, setContent] = useState(initialData?.content || "");

//   // --- SEO & MEDIA STATE ---
//   const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
//   const [seoDesc, setSeoDesc] = useState(initialData?.seoDesc || "");
//   const [focusKeyword, setFocusKeyword] = useState(initialData?.focusKeyword || "");
  
//   // featuredImage is what saves to the Database
//   const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
//   // imagePreview is what shows in the UI right now
//   const [imagePreview, setImagePreview] = useState(initialData?.featuredImage || "");
//   const [isUploading, setIsUploading] = useState(false);

//   // --- ORG & PUBLISHING STATE ---
//   const [category, setCategory] = useState(initialData?.category || "");
//   const [tags, setTags] = useState(initialData?.tags || "");
//   const [author, setAuthor] = useState(initialData?.author || "Saurabh Sharma");
//   const [status, setStatus] = useState(initialData?.status || "DRAFT");
//   const [isSaving, setIsSaving] = useState(false);

//   // Auto-generate slug
//   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newTitle = e.target.value;
//     setTitle(newTitle);
//     if (!isEditMode && !initialData?.slug) {
//       setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
//     }
//   };


//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // 1. Instantly show a high-quality local preview in the UI
//     const objectUrl = URL.createObjectURL(file);
//     setImagePreview(objectUrl);
//     setIsUploading(true);

//     try {
//       // 2. Ask our backend for the AWS STS Presigned URL
//       const res = await fetch(`/api/upload-url?file=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`);
      
//       if (!res.ok) throw new Error("Failed to get upload credentials");
//       const { signedUrl, cdnUrl } = await res.json();

//       // 3. Upload the file DIRECTLY to AWS S3 (bypassing our Next.js server)
//       // ---> THIS IS WHERE YOU ADD THE HEADERS <---
//       const uploadRes = await fetch(signedUrl, {
//         method: "PUT",
//         body: file,
//         headers: {
//           "Content-Type": file.type, 
//         },
//       });

//       if (!uploadRes.ok) throw new Error("Failed to upload to S3");

//       // 4. Success! Save the CloudFront URL to the form state
//       setFeaturedImage(cdnUrl);
      
//     } catch (error) {
//       console.error("Upload Error:", error);
//       alert("Failed to upload image. Check your AWS credentials.");
//       setImagePreview(""); // Clear the preview if upload fails
//     } finally {
//       setIsUploading(false);
//     }
//   };

  

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);
    
//     const payload = {
//       title, slug, excerpt, content, category, tags, seoTitle, seoDesc, focusKeyword, 
//       status: "PUBLISHED", author, featuredImage
//     };

//     try {
//       const result = (isEditMode && initialData?.id)
//         ? await updateBlogPost(initialData.id, payload)
//         : await saveBlogPost(payload);

//       if (result.success) {
//         setStatus("PUBLISHED");
//         setIsSaving(false);
//         router.push("/admin/blogs");
//       } else {
//         setIsSaving(false);
//         alert(result.message || "Failed to save the blog post."); 
//       }
//     } catch (error) {
//       console.error("Save error:", error);
//       setIsSaving(false);
//       alert("An unexpected error occurred while saving.");
//     }
//   };        
  
//   return (
//     <form onSubmit={handleSave} className="space-y-6 pb-24">
      
//       {/* STICKY HEADER ACTIONS */}
//       <div className="sticky top-0 z-40 bg-[#FDFDFF]/90 backdrop-blur-md pb-4 pt-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 -mx-6 px-6 lg:-mx-10 lg:px-10">
//         <div className="flex items-center gap-4">
//           <button 
//             type="button"
//             onClick={() => router.back()}
//             className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors"
//           >
//             <ArrowLeft size={18} />
//           </button>
//           <div>
//             <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
//               {isEditMode ? `Edit Post: ${title || "Untitled"}` : "Create New Blog Post"}
//             </h1>
//             <div className="flex items-center gap-2 mt-1">
//               <span className={`w-2 h-2 rounded-full ${status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
//               <p className="text-xs font-mono text-slate-500">
//                 {slug ? `uptimiseit.com/blog/${slug}` : "Unsaved Draft"}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <button 
//             type="button" 
//             className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2"
//           >
//             <Globe size={16} /> Preview
//           </button>
//           <button 
//             type="submit" 
//             disabled={isSaving}
//             className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
//           >
//             {isSaving ? (
//               <><Loader2 size={16} className="animate-spin" /> Saving...</>
//             ) : (
//               <><Save size={16} /> {status === 'PUBLISHED' ? 'Update Post' : 'Publish Post'}</>
//             )}
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-6">
        
//         {/* LEFT: MAIN CONTENT AREA */}
//         <div className="lg:col-span-2 space-y-8">
          
//           <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-800">Article Title *</label>
//               <input 
//                 type="text" 
//                 value={title}
//                 onChange={handleTitleChange}
//                 placeholder="e.g. The Future of AI in Software Engineering"
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-lg font-bold text-slate-900 placeholder:font-normal outline-none transition-all" 
//                 required
//               />
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <label className="text-sm font-bold text-slate-800">URL Slug *</label>
//                 <div className="relative">
//                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">/</span>
//                   <input 
//                     type="text" 
//                     value={slug}
//                     onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
//                     placeholder="future-of-ai"
//                     className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm text-slate-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <label className="text-sm font-bold text-slate-800">Excerpt</label>
//                   <span className={`text-[10px] font-mono ${excerpt.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
//                     {excerpt.length}/160
//                   </span>
//                 </div>
//                 <textarea 
//                   rows={2}
//                   value={excerpt}
//                   onChange={(e) => setExcerpt(e.target.value)}
//                   placeholder="Short summary for blog cards..."
//                   className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 resize-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
//                 />
//               </div>
//             </div>
//           </div>

//           {/* FEATURED IMAGE */}
//           <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
//             <div className="flex justify-between items-center border-b border-slate-100 pb-3">
//               <h3 className="font-bold text-slate-900 flex items-center gap-2">
//                 <ImageIcon size={18} className="text-indigo-500" /> Featured Media
//               </h3>
//               {imagePreview && (
//                 <button 
//                   type="button" 
//                   onClick={() => {
//                     setFeaturedImage("");
//                     setImagePreview("");
//                   }} 
//                   className="text-xs font-bold text-red-500 hover:text-red-700"
//                 >
//                   Remove Image
//                 </button>
//               )}
//             </div>

//             {imagePreview ? (
//               // IMAGE PREVIEW MODE
//               <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 shadow-inner group">
//                 <img 
//                   src={imagePreview} 
//                   alt="Featured Preview" 
//                   className="absolute inset-0 w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                   <p className="text-white font-bold text-sm">Image is using CDN</p>
//                 </div>
//               </div>
//             ) : (
//               // UPLOAD MODE
//               <label className="w-full h-56 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors cursor-pointer group relative">
//                 <input 
//                   type="file" 
//                   accept="image/*" 
//                   onChange={handleImageUpload} 
//                   className="hidden" 
//                   disabled={isUploading}
//                 />
//                 {isUploading ? (
//                   <div className="flex flex-col items-center">
//                     <Loader2 size={24} className="text-indigo-500 animate-spin mb-2" />
//                     <p className="text-sm font-bold text-slate-700">Uploading to CDN...</p>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 mb-3 shadow-sm transition-colors">
//                       <ImageIcon size={20} />
//                     </div>
//                     <p className="text-sm font-bold text-slate-700">Click to upload featured image</p>
//                     <p className="text-xs text-slate-500 mt-1">Recommended size: 1200 x 630px (Max 2MB)</p>
//                   </>
//                 )}
//               </label>
//             )}

//             {/* Hidden Input showing the CDN URL */}
//             {featuredImage && (
//               <div className="pt-2">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">CDN Link (Saved to DB)</label>
//                 <input 
//                   type="text" 
//                   readOnly 
//                   value={featuredImage} 
//                   className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded text-xs text-slate-600 font-mono outline-none" 
//                 />
//               </div>
//             )}
//           </div>

//           {/* EDITOR AREA */}
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//             <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-1 overflow-x-auto">
//               <select className="text-sm border border-slate-200 rounded-lg bg-white text-slate-700 py-1.5 px-2 outline-none cursor-pointer hover:border-slate-300">
//                 <option>Paragraph</option>
//                 <option>Heading 2</option>
//                 <option>Heading 3</option>
//               </select>
//               <div className="w-px h-6 bg-slate-200 mx-2"></div>
//               <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><Bold size={16}/></button>
//               <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><Italic size={16}/></button>
//               <div className="w-px h-6 bg-slate-200 mx-2"></div>
//               <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><List size={16}/></button>
//               <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><Quote size={16}/></button>
//               <div className="w-px h-6 bg-slate-200 mx-2"></div>
//               <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><LinkIcon size={16}/></button>
//               <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><ImageIcon size={16}/></button>
//               <div className="w-px h-6 bg-slate-200 mx-2"></div>
//               <button type="button" className="p-1.5 px-3 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg text-indigo-700 flex items-center gap-1.5 text-xs font-bold transition-colors">
//                 <LayoutTemplate size={14}/> Insert Block
//               </button>
//             </div>

//             <div className="p-6 md:p-8 flex-1">
//               <textarea 
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 className="w-full h-125 resize-none outline-none text-slate-800 leading-relaxed bg-transparent min-h-[500px]" 
//                 placeholder="Write your article content here... (Supports Markdown / Rich Text)"
//               ></textarea>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN: Settings Sidebar */}
//         <div className="space-y-6">
          
//           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
//             <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
//               <Tag size={16} className="text-cyan-500" /> Organization
//             </h4>
//             <div className="space-y-4">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-700">Category *</label>
//                 <select 
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
//                   required
//                 >
//                   <option value="">Select Category...</option>
//                   <option value="AI & Automation">AI & Automation</option>
//                   <option value="Software Development">Software Development</option>
//                   <option value="Cloud & DevOps">Cloud & DevOps</option>
//                   <option value="Design & UX">Design & UX</option>
//                 </select>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-700">Tags</label>
//                 <input 
//                   type="text" 
//                   value={tags}
//                   onChange={(e) => setTags(e.target.value)}
//                   placeholder="e.g. Next.js, Architecture" 
//                   className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-700">Author</label>
//                 <select 
//                   value={author}
//                   onChange={(e) => setAuthor(e.target.value)}
//                   className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
//                 >
//                   <option value="Uptimise Engineering">Uptimise Engineering</option>
//                   <option value="Saurabh Sharma">Saurabh Sharma</option>
//                   <option value="Guest Author">Guest Author</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
//             <div className="flex items-center justify-between border-b border-slate-100 pb-3">
//               <h4 className="font-bold text-slate-900 flex items-center gap-2">
//                 <Search size={16} className="text-amber-500" /> SEO Settings
//               </h4>
//               {seoTitle && seoDesc ? (
//                 <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-1 rounded">Optimized</span>
//               ) : (
//                 <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-1 rounded">Needs Work</span>
//               )}
//             </div>
            
//             <div className="space-y-4">
//               <div className="space-y-1.5">
//                 <div className="flex justify-between items-center">
//                   <label className="text-xs font-bold text-slate-800">Meta Title</label>
//                   <span className={`text-[10px] font-mono ${seoTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{seoTitle.length}/60</span>
//                 </div>
//                 <input 
//                   type="text" 
//                   value={seoTitle} 
//                   onChange={(e) => setSeoTitle(e.target.value)} 
//                   className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <div className="flex justify-between items-center">
//                   <label className="text-xs font-bold text-slate-800">Meta Description</label>
//                   <span className={`text-[10px] font-mono ${seoDesc.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{seoDesc.length}/160</span>
//                 </div>
//                 <textarea 
//                   rows={3} 
//                   value={seoDesc} 
//                   onChange={(e) => setSeoDesc(e.target.value)} 
//                   className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
//                 ></textarea>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-800">Focus Keyword</label>
//                 <input 
//                   type="text" 
//                   value={focusKeyword}
//                   onChange={(e) => setFocusKeyword(e.target.value)}
//                   placeholder="e.g. SaaS Architecture" 
//                   className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
//             <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Publishing</h4>
            
//             <div className="space-y-4">
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-slate-600 font-medium">Status</span>
//                 {status === 'PUBLISHED' ? (
//                   <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">
//                     <CheckCircle2 size={14} /> Published
//                   </span>
//                 ) : (
//                   <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
//                     Draft
//                   </span>
//                 )}
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-slate-600 font-medium">Visibility</span>
//                 <span className="font-bold text-slate-900">Public</span>
//               </div>
//             </div>

//             {status === 'PUBLISHED' && (
//               <button 
//                 type="button" 
//                 onClick={() => setStatus('DRAFT')}
//                 className="w-full py-2 mt-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
//               >
//                 Revert to Draft
//               </button>
//             )}
//           </div>

//         </div>
//       </div>
//     </form>
//   );
// }


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Save, Globe, ArrowLeft, Settings, Search, 
  Image as ImageIcon, Tag, LayoutTemplate, 
  Link as LinkIcon, Bold, Italic, List, 
  Quote, Loader2, CheckCircle2, Layers // Added Layers icon for subcategory
} from "lucide-react";
import { saveBlogPost, updateBlogPost } from "@/lib/actions/blog.actions";

interface BlogEditorFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function BlogEditorForm({ initialData, isEditMode = false }: BlogEditorFormProps) {
  const router = useRouter();

  // --- CONTENT STATE ---
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");

  // --- SEO & MEDIA STATE ---
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoDesc || "");
  const [focusKeyword, setFocusKeyword] = useState(initialData?.focusKeyword || "");
  
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [imagePreview, setImagePreview] = useState(initialData?.featuredImage || "");
  const [isUploading, setIsUploading] = useState(false);

  // --- ORG & PUBLISHING STATE ---
  const [category, setCategory] = useState(initialData?.category || "");
  const [subCategory, setSubCategory] = useState(initialData?.subCategory || ""); // Added Sub-Category State
  const [tags, setTags] = useState(initialData?.tags || "");
  const [author, setAuthor] = useState(initialData?.author || "Saurabh Sharma");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditMode && !initialData?.slug) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setIsUploading(true);

    try {
      const res = await fetch(`/api/upload-url?file=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`);
      if (!res.ok) throw new Error("Failed to get upload credentials");
      const { signedUrl, cdnUrl } = await res.json();

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload to S3");
      setFeaturedImage(cdnUrl);
      
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload image.");
      setImagePreview("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      title, slug, excerpt, content, 
      category, subCategory,
      tags, seoTitle, seoDesc, focusKeyword, 
      status: "PUBLISHED", author, featuredImage
    };

    try {
      const result = (isEditMode && initialData?.id)
        ? await updateBlogPost(initialData.id, payload)
        : await saveBlogPost(payload);

      if (result.success) {
        setStatus("PUBLISHED");
        setIsSaving(false);
        router.push("/admin/blogs");
      } else {
        setIsSaving(false);
        alert(result.message || "Failed to save the blog post."); 
      }
    } catch (error) {
      console.error("Save error:", error);
      setIsSaving(false);
      alert("An unexpected error occurred while saving.");
    }
  };        
  
  return (
    <form onSubmit={handleSave} className="space-y-6 pb-24">
      
      {/* STICKY HEADER ACTIONS */}
      <div className="sticky top-0 z-40 bg-[#FDFDFF]/90 backdrop-blur-md pb-4 pt-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 -mx-6 px-6 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isEditMode ? `Edit Post: ${title || "Untitled"}` : "Create New Blog Post"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <p className="text-xs font-mono text-slate-500">
                {slug ? `uptimiseit.com/blog/${slug}` : "Unsaved Draft"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2"
          >
            <Globe size={16} /> Preview
          </button>
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={16} /> {status === 'PUBLISHED' ? 'Update Post' : 'Publish Post'}</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-6">
        
        {/* LEFT: MAIN CONTENT AREA */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Article Title *</label>
              <input 
                type="text" 
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. The Future of AI in Software Engineering"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-lg font-bold text-slate-900 placeholder:font-normal outline-none transition-all" 
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800">URL Slug *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">/</span>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="future-of-ai"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm text-slate-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-800">Excerpt</label>
                  <span className={`text-[10px] font-mono ${excerpt.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
                    {excerpt.length}/160
                  </span>
                </div>
                <textarea 
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short summary for blog cards..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 resize-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          {/* FEATURED IMAGE */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon size={18} className="text-indigo-500" /> Featured Media
              </h3>
              {imagePreview && (
                <button 
                  type="button" 
                  onClick={() => {
                    setFeaturedImage("");
                    setImagePreview("");
                  }} 
                  className="text-xs font-bold text-red-500 hover:text-red-700"
                >
                  Remove Image
                </button>
              )}
            </div>

            {imagePreview ? (
              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 shadow-inner group">
                <img 
                  src={imagePreview} 
                  alt="Featured Preview" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-bold text-sm">Image is using CDN</p>
                </div>
              </div>
            ) : (
              <label className="w-full h-56 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors cursor-pointer group relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  disabled={isUploading}
                />
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 size={24} className="text-indigo-500 animate-spin mb-2" />
                    <p className="text-sm font-bold text-slate-700">Uploading to CDN...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 mb-3 shadow-sm transition-colors">
                      <ImageIcon size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Click to upload featured image</p>
                    <p className="text-xs text-slate-500 mt-1">Recommended size: 1200 x 630px (Max 2MB)</p>
                  </>
                )}
              </label>
            )}

            {featuredImage && (
              <div className="pt-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">CDN Link (Saved to DB)</label>
                <input 
                  type="text" 
                  readOnly 
                  value={featuredImage} 
                  className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded text-xs text-slate-600 font-mono outline-none" 
                />
              </div>
            )}
          </div>

          {/* EDITOR AREA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-1 overflow-x-auto">
              <select className="text-sm border border-slate-200 rounded-lg bg-white text-slate-700 py-1.5 px-2 outline-none cursor-pointer hover:border-slate-300">
                <option>Paragraph</option>
                <option>Heading 2</option>
                <option>Heading 3</option>
              </select>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><Bold size={16}/></button>
              <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><Italic size={16}/></button>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><List size={16}/></button>
              <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><Quote size={16}/></button>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><LinkIcon size={16}/></button>
              <button type="button" className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"><ImageIcon size={16}/></button>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <button type="button" className="p-1.5 px-3 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg text-indigo-700 flex items-center gap-1.5 text-xs font-bold transition-colors">
                <LayoutTemplate size={14}/> Insert Block
              </button>
            </div>

            <div className="p-6 md:p-8 flex-1">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-125 resize-none outline-none text-slate-800 leading-relaxed bg-transparent min-h-[500px]" 
                placeholder="Write your article content here..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings Sidebar */}
        <div className="space-y-6">
          
          {/* Organization Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Tag size={16} className="text-cyan-500" /> Organization
            </h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Category *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer"
                  required
                >
                  <option value="">Select Category...</option>
                  <option value="Engineering Blogs">Engineering Blogs</option>
                  <option value="Tech Trends">Tech Trends</option>
                  <option value="Guides">Guides</option>
                </select>
              </div>

              {/* NEW SUB-CATEGORY INPUT */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Sub-category <Layers size={12} className="text-slate-400" />
                </label>
                <input 
                  type="text" 
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  placeholder="e.g. Next.js Tutorials" 
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tags</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. React, S3, AWS" 
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Author</label>
                <select 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
                >
                  <option value="Uptimise Engineering">Uptimise Engineering</option>
                  <option value="Saurabh Sharma">Saurabh Sharma</option>
                  <option value="Guest Author">Guest Author</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEO Settings Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Search size={16} className="text-amber-500" /> SEO Settings
              </h4>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-800">Meta Title</label>
                  <span className={`text-[10px] font-mono ${seoTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{seoTitle.length}/60</span>
                </div>
                <input 
                  type="text" 
                  value={seoTitle} 
                  onChange={(e) => setSeoTitle(e.target.value)} 
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-800">Meta Description</label>
                  <span className={`text-[10px] font-mono ${seoDesc.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{seoDesc.length}/160</span>
                </div>
                <textarea 
                  rows={3} 
                  value={seoDesc} 
                  onChange={(e) => setSeoDesc(e.target.value)} 
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                ></textarea>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Focus Keyword</label>
                <input 
                  type="text" 
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" 
                />
              </div>
            </div>
          </div>

          {/* Publishing Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Publishing</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Status</span>
                {status === 'PUBLISHED' ? (
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <CheckCircle2 size={14} /> Published
                  </span>
                ) : (
                  <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">Draft</span>
                )}
              </div>
            </div>
            {status === 'PUBLISHED' && (
              <button 
                type="button" 
                onClick={() => setStatus('DRAFT')}
                className="w-full py-2 mt-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Revert to Draft
              </button>
            )}
          </div>

        </div>
      </div>
    </form>
  );
}