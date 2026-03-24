"use client";

import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteSeoData } from "@/lib/actions/seo.actions";
// import { deleteSeoPost } from "@/lib/actions/Seo.actions";

interface DeleteProps {
  id: number;
  title: string;
  entityType: string;
}

export default function DeleteSeoButton({ id, title, entityType }: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Standard browser confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    
    const result = await deleteSeoData(entityType, id);
    
    if (!result.success) {
      alert(result.message);
      setIsDeleting(false);
    }
    // If successful, Next.js revalidatePath will automatically refresh the parent table!
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      title="Delete Post"
      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block disabled:opacity-50"
    >
      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}