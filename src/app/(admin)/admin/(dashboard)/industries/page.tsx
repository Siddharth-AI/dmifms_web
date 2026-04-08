"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, ToggleLeft, ToggleRight, Pencil, ChevronUp, Upload, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Industry } from "@/types";

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/content/industries").then((r) => r.json()).then((d) => {
      setIndustries(d);
      setLoading(false);
    });
  }, []);

  const saveAll = async () => {
    setSaving(true);
    await fetch("/api/content/industries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(industries),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = (id: number, field: keyof Industry, value: unknown) => {
    setIndustries((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const uploadImage = async (file: File, id: number) => {
    setUploading(id);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "industries");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json.url) update(id, "image", json.url);
    setUploading(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
    </div>
  );

  const inp = "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]/40 transition-all bg-white";
  const lbl = (t: string) => <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">{t}</label>;
  const sorted = [...industries].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-[#0F172A]">Industries</h1>
          <p className="text-xs text-slate-400 mt-0.5">{industries.filter((i) => i.status).length} of {industries.length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newId = Date.now();
              const newIndustry: Industry = { id: newId, name: "New Industry", slug: `industry-${newId}`, icon: "building-2", description: "", image: "", services: [], status: true, order: industries.length + 1 };
              setIndustries((prev) => [...prev, newIndustry]);
              setEditing(newId);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-[#1E3A8A] border border-[#1E3A8A]/20 bg-[#1E3A8A]/5 hover:bg-[#1E3A8A]/10 transition-colors">
            <Plus className="w-4 h-4" /> Add Industry
          </button>
          <button onClick={saveAll} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:opacity-90 disabled:opacity-60 transition-all shadow-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save All"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((industry) => {
          const isOpen = editing === industry.id;
          return (
            <div key={industry.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                  {industry.image && <Image src={industry.image} alt={industry.name} fill className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#0F172A] text-sm truncate">{industry.name}</div>
                  <div className={`text-xs font-semibold mt-0.5 ${industry.status ? "text-emerald-600" : "text-slate-400"}`}>
                    {industry.status ? "Active" : "Hidden"}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => update(industry.id, "status", !industry.status)}>
                    {industry.status
                      ? <ToggleRight className="w-6 h-6 text-emerald-500 cursor-pointer" />
                      : <ToggleLeft className="w-6 h-6 text-slate-300 cursor-pointer" />}
                  </button>
                  <button onClick={() => setEditing(isOpen ? null : industry.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1E3A8A] bg-[#1E3A8A]/8 hover:bg-[#1E3A8A]/15 transition-colors">
                    {isOpen ? <><ChevronUp className="w-3.5 h-3.5" /> Close</> : <><Pencil className="w-3.5 h-3.5" /> Edit</>}
                  </button>
                  <button onClick={() => { if (confirm("Delete this industry?")) setIndustries((prev) => prev.filter((i) => i.id !== industry.id)); }}
                    className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-slate-100 p-4 bg-slate-50/80 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>{lbl("Name")}<input className={inp} value={industry.name} onChange={(e) => update(industry.id, "name", e.target.value)} /></div>
                    <div>{lbl("Order")}<input className={inp} type="number" value={industry.order} onChange={(e) => update(industry.id, "order", Number(e.target.value))} /></div>
                  </div>
                  <div>{lbl("Description")}<textarea className={`${inp} resize-none`} rows={2} value={industry.description} onChange={(e) => update(industry.id, "description", e.target.value)} /></div>
                  <div>
                    {lbl("Services (comma-separated)")}
                    <input className={inp} value={industry.services.join(", ")}
                      onChange={(e) => update(industry.id, "services", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
                  </div>
                  <div>
                    {lbl("Image")}
                    <div className="flex items-center gap-3 mt-1">
                      <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                        {industry.image && <Image src={industry.image} alt={industry.name} fill className="object-cover" />}
                        {uploading === industry.id && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <input type="file" accept="image/*" id={`ind-${industry.id}`} className="hidden"
                          onChange={(e) => { if (e.target.files?.[0]) uploadImage(e.target.files[0], industry.id); }} />
                        <label htmlFor={`ind-${industry.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" /> Upload New Image
                        </label>
                        <p className="text-[11px] text-slate-400 mt-1 truncate max-w-xs">{industry.image || "No image"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={saveAll} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-blue-900/20">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saved ? "Saved!" : "Save All Changes"}
      </button>
    </div>
  );
}
