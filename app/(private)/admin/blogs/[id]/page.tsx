// import React from "react";
// import { notFound } from "next/navigation";
// import BlogEditorForm from "@/components/admin/blogs/BlogEditorForm";
// import { getBlogById } from "@/lib/actions/blog.actions";

// export const dynamic = "force-dynamic";

// // 1. Change the type so TypeScript knows params is a Promise
// export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  
//   // 2. Await the params to unwrap them
//   const resolvedParams = await params;
  
//   // 3. Now you can safely extract the ID
//   const blogId = parseInt(resolvedParams.id);
  
//   if (isNaN(blogId)) return notFound();

//   // 4. Fetch the data from Neon DB
//   const response = await getBlogById(blogId);
  
//   if (!response.success || !response.data) return notFound();

//   return (
//     <div className="max-w-400 mx-auto">
//       <BlogEditorForm 
//         initialData={response.data} 
//         isEditMode={true} 
//       />
//     </div>
//   );
// }




import { getBlogById, getBlogs } from "@/lib/actions/blog.actions";
import BlogEditorForm from "@/components/admin/blogs/BlogEditorForm";
import { notFound } from "next/navigation";

// Add 'async' to the props type if using Next.js 15
export default async function EditBlogPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await the params before using them
  const { id } = await params;

  // 1. Fetch the specific blog data
  const blogResponse = await getBlogById(parseInt(id));
  
  // 2. Fetch ALL blogs for the related list
  const allBlogsResponse = await getBlogs();

  if (!blogResponse || !blogResponse.success) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-10">
      <BlogEditorForm 
        isEditMode={true} 
        initialData={blogResponse.data} 
        allBlogs={allBlogsResponse.data || []} 
      />
    </div>
  );
}