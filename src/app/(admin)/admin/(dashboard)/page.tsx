import Link from "next/link";
import { readJSON } from "@/lib/jsonCMS";
import { Service, Industry, ProcessStep } from "@/types";
import { Building2, GitBranch, ChevronRight, Sparkles, ArrowRight, ExternalLink } from "lucide-react";

export default function AdminDashboard() {
  const services = readJSON<Service[]>("services");
  const industries = readJSON<Industry[]>("industries");
  const steps = readJSON<ProcessStep[]>("process");

  const stats = [
    { label: "Total Services", value: services.length, active: services.filter(s => s.status).length, icon: Building2, href: "/admin/services", color: "#1E3A8A" },
    { label: "Industries", value: industries.length, active: industries.filter(i => i.status).length, icon: GitBranch, href: "/admin/industries", color: "#0EA5E9" },
    { label: "Process Steps", value: steps.length, active: steps.filter(s => s.status).length, icon: ChevronRight, href: "/admin/process", color: "#10B981" },
    { label: "Hero Section", value: 1, active: 1, icon: Sparkles, href: "/admin/hero", color: "#F59E0B" },
  ];

  const quickLinks = [
    { label: "Edit Hero", href: "/admin/hero", desc: "Update title, stats & CTAs" },
    { label: "Manage Services", href: "/admin/services", desc: "Add, edit, or toggle services" },
    { label: "Manage Industries", href: "/admin/industries", desc: "Update industry listing" },
    { label: "Edit Process Steps", href: "/admin/process", desc: "Update implementation steps" },
    { label: "Edit About Content", href: "/admin/about", desc: "Update company description" },
    { label: "Update Contact Info", href: "/admin/contact", desc: "Address, email, phone" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:border-slate-200 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
              </div>
              <div className="text-2xl font-black text-[#0F172A] mb-0.5">{stat.value}</div>
              <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
              <div className="text-xs text-slate-300 mt-1">{stat.active} active</div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-extrabold text-[#0F172A] text-base mb-5">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#1E3A8A]/20 hover:bg-[#1E3A8A]/3 transition-all duration-200"
            >
              <div>
                <div className="font-bold text-sm text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                  {link.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{link.desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-[#1E3A8A] flex-shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* View Website */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-2xl p-6 flex items-center justify-between">
        <div>
          <div className="font-extrabold text-white text-base mb-1">View Live Website</div>
          <div className="text-blue-200 text-sm">See your changes reflected on the frontend</div>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-white text-[#1E3A8A] hover:bg-blue-50 transition-colors shadow"
        >
          <ExternalLink className="w-4 h-4" />
          Open Site
        </Link>
      </div>
    </div>
  );
}
