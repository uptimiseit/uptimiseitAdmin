import React from "react";
import { notFound } from "next/navigation";
import BlogEditorForm from "@/components/admin/blogs/BlogEditorForm";
import { getBlogById } from "@/lib/actions/blog.actions";

// 1. Change the type so TypeScript knows params is a Promise
export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Await the params to unwrap them
  const resolvedParams = await params;
  
  // 3. Now you can safely extract the ID
  const blogId = parseInt(resolvedParams.id);
  
  if (isNaN(blogId)) return notFound();

  // 4. Fetch the data from Neon DB
  const response = await getBlogById(blogId);
  
  if (!response.success || !response.data) return notFound();

  return (
    <div className="max-w-400 mx-auto">
      <BlogEditorForm 
        initialData={response.data} 
        isEditMode={true} 
      />
    </div>
  );
}