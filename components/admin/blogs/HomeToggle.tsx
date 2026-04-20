"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { updateBlogPost } from "@/lib/actions/blog.actions";
import { Loader2, Check } from "lucide-react";

interface HomeToggleProps {
  id: number;
  initialValue: boolean;
}

export default function HomeToggle({ id, initialValue }: HomeToggleProps) {
  const [isHome, setIsHome] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const result = await updateBlogPost(id, { isHome: !isHome });
      
      if (result.success) {
        setIsHome(!isHome);
      } else {
        alert("Transmission Error: Could not update status.");
      }
    } catch (error) {
      console.error("Toggle Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 group">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative w-12 h-6 rounded-full transition-all duration-500 ease-in-out focus:outline-none border-2 ${
          isHome 
            ? "bg-indigo-600 border-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]" 
            : "bg-slate-100 border-slate-200"
        } ${isLoading ? "opacity-50 cursor-wait" : "cursor-pointer hover:scale-105 active:scale-95"}`}
      >
        {/* Toggle Knob */}
        <motion.div
          initial={false}
          animate={{ 
            x: isHome ? 24 : 2,
            scale: isLoading ? 0.8 : 1
          }}
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
          className="absolute top-0 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          {isHome && !isLoading && <div className="w-1 h-1 bg-green-600 rounded-full" />}
        </motion.div>
      </button>
      
      {/* Label with Micro-interactions */}
      <div className="flex items-center gap-2 min-w-[40px]">
        {isLoading ? (
          <Loader2 size={12} className="animate-spin text-indigo-500" />
        ) : (
          <motion.span 
            initial={false}
            animate={{ color: isHome ? "#008000" : "##c4182f" }}
            className={`text-[10px] font-black uppercase tracking-[0.1em] transition-colors`}
          >
            {isHome ? "Active" : "Hidden"}
          </motion.span>
        )}
      </div>
    </div>
  );
}