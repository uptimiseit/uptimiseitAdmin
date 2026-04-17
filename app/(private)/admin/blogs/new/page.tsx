import React from "react";
import BlogEditorForm from "@/components/admin/blogs/BlogEditorForm";

export const metadata = {
  title: "Create New Blog | Uptimise Admin",
};

export default function NewBlogPage() {
  return (
    <div className="max-w-400 mx-auto">
      <BlogEditorForm isEditMode={false} />
    </div>
  );
}