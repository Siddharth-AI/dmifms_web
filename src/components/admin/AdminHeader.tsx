"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/hero": "Hero Section",
  "/admin/services": "Services Manager",
  "/admin/industries": "Industries Manager",
  "/admin/process": "Process Steps",
  "/admin/about": "About Content",
  "/admin/contact": "Contact Info",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? "Admin Panel";

  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-8 py-5 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
      <div>
        <h1 className="font-extrabold text-slate-900 text-xl tracking-tight">{title}</h1>
        <p className="text-slate-500 text-sm font-medium mt-1 tracking-wide">Manage your website content and settings</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#2563EB] hover:border-[#2563EB]/30 hover:shadow-md transition-all">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/30 border border-blue-400/50 cursor-pointer hover:scale-105 transition-transform">
          <span className="text-white font-black text-sm">AD</span>
        </div>
      </div>
    </header>
  );
}
