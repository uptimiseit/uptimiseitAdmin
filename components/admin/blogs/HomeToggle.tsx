"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { updateBlogPost } from "@/lib/actions/blog.actions";
import { Loader2 } from "lucide-react";

interface HomeToggleProps {
  id: number;
  initialValue: boolean;
}

export default function HomeToggle({ id, initialValue }: HomeToggleProps) {
  const [isHome, setIsHome] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      // We only send the field we want to update
      const result = await updateBlogPost(id, { isHome: !isHome });
      
      if (result.success) {
        setIsHome(!isHome);
      } else {
        alert("Failed to update featured status.");
      }
    } catch (error) {
      console.error("Toggle Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none ${
          isHome ? "bg-indigo-600 shadow-inner" : "bg-slate-200"
        } ${isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
      >
        <motion.div
          initial={false}
          animate={{ x: isHome ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
        />
      </button>
      
      <div className="flex items-center gap-1.5 min-w-[30px]">
        {isLoading ? (
          <Loader2 size={12} className="animate-spin text-slate-400" />
        ) : (
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            isHome ? "text-indigo-600" : "text-slate-400"
          }`}>
            {isHome ? "On" : "Off"}
          </span>
        )}
      </div>
    </div>
  );
}