"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, FileText, Briefcase, Search, 
  Image as ImageIcon, MessageSquare, LogOut, 
  Layers, Settings, Users
} from "lucide-react";
import Image from "next/image";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleSignOut = () => {
    // 1. Clear session markers (if you use tokens, clear them here)
    // Note: We keep 'admin_saved_email' if you want "Remember Me" to persist 
    // across sessions, but clear the active authentication state.
    
    // If you have an auth cookie or token:
    // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // 2. Redirect to login page
    router.push("/admin/login");
  };

  // Reusable Nav Link Component for consistent styling & active states
  const NavLink = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
    const isActive = pathname === href;
    
    return (
      <Link 
        href={href} 
        className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
          isActive 
            ? 'bg-indigo-600/10 text-indigo-400' 
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
      >
        <Icon size={18} /> {label}
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-[#020617] border-r border-slate-800 text-slate-400 fixed h-full z-20">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/white-logo.png" alt="Uptimise IT" width={140} height={42} className="opacity-90 hover:opacity-100 transition-opacity" priority /> 
        </Link>
      </div>

      {/* Navigation Links - Scrollbar explicitly hidden here using Tailwind arbitrary variants */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* OVERVIEW */}
        <div>
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3">Overview</p>
          <div className="space-y-1">
            <NavLink href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          </div>
        </div>

        {/* CONTENT */}
        <div>
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3">Content</p>
          <div className="space-y-1">
            <NavLink href="/admin/pages" icon={Layers} label="Pages" />
            <NavLink href="/admin/solutions" icon={FileText} label="Solutions" />
            <NavLink href="/admin/industries" icon={FileText} label="Industries" />
            <NavLink href="/admin/blogs" icon={FileText} label="Blogs" />
            <NavLink href="/admin/case-studies" icon={FileText} label="Case Studies" />
            <NavLink href="/admin/briefs" icon={FileText} label="Briefs" />
            <NavLink href="/admin/intake" icon={FileText} label="Project Intake" />

          </div>
        </div>

        {/* BUSINESS */}
        <div>
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3">Business</p>
          <div className="space-y-1">
            <NavLink href="/admin/inquiries" icon={MessageSquare} label="Inquiries" />
            <NavLink href="/admin/leads" icon={Users} label="Leads" />
            <NavLink href="/admin/partners" icon={Briefcase} label="Partners" />
            <NavLink href="/admin/users" icon={Users} label="Users & Roles" />
          </div>
        </div>

        {/* SEO & SITE */}
        <div>
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3">SEO & Site</p>
          <div className="space-y-1">
            <NavLink href="/admin/seo" icon={Search} label="SEO Manager" />
            <NavLink href="/admin/media" icon={ImageIcon} label="Media Library" />
            <NavLink href="/admin/settings" icon={Settings} label="Site Settings" />
          </div>
        </div>

      </div>

      {/* Footer / Sign Out */}
      {/* <div className="p-4 border-t border-slate-800"> */}
        {/* <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-slate-800/50 hover:text-white text-slate-400 rounded-lg font-medium transition-colors">
          <LogOut size={18} /> Sign Out
        </button> */}

        <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 w-full hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-lg font-medium transition-colors group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> 
          Sign Out
        </button>
      </div>
      {/* </div> */}
    </aside>
  );
}