import AdminSidebar from "@/components/admin/AdminSidebar";
import React from "react";
// import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Portal | Uptimise IT",
  description: "Secure control center for Uptimise IT.",
  robots: {
    index: false, // Prevents Google from indexing your admin panel
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Base styling for the entire admin ecosystem
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900 selection:bg-indigo-200">
      
      {/* 1. The Persistent Sidebar */}
      <AdminSidebar  />

      {/* 2. The Dynamic Content Area */}
      {/* lg:ml-64 pushes the content to the right on desktop to make room for the fixed 64-width sidebar */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </div>

    </div>
  );
}