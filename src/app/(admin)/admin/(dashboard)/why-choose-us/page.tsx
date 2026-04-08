"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Pencil, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Differentiator } from "@/types";

export default function AdminWhyChooseUsPage() {
  const [items, setItems] = useState<Differentiator[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/content/why-choose-us").then((r) => r.json()).then((d) => {
      setItems(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, []);

  const saveAll = async () => {
    setSaving(true);
    await fetch("/api/content/why-choose-us", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = (id: number, field: keyof Differentiator, value: unknown) => {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
    </div>
  );

  const inp = "w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]/40 transition-all bg-white";
  const lbl = (t: string) => <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">{t}</label>;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-[#0F172A]">Why Choose Us (Differentiators)</h1>
          <p className="text-xs text-slate-400 mt-0.5">{items.length} items</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newId = Date.now();
              const newItem: Differentiator = { id: newId, title: "New Strength", description: "", icon: "clipboard-list" };
              setItems((prev) => [...prev, newItem]);
              setEditing(newId);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-[#1E3A8A] border border-[#1E3A8A]/20 bg-[#1E3A8A]/5 hover:bg-[#1E3A8A]/10 transition-colors">
            <Plus className="w-4 h-4" /> Add Item
          </button>
          <button onClick={saveAll} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:opacity-90 disabled:opacity-60 transition-all shadow-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save All"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = editing === item.id;
          return (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-100 text-slate-500 font-bold text-xs">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#0F172A] text-sm truncate">{item.title}</div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">{item.description}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setEditing(isOpen ? null : item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1E3A8A] bg-[#1E3A8A]/8 hover:bg-[#1E3A8A]/15 transition-colors">
                    {isOpen ? <><ChevronUp className="w-3.5 h-3.5" /> Close</> : <><Pencil className="w-3.5 h-3.5" /> Edit</>}
                  </button>
                  <button onClick={() => { if (confirm("Delete this item?")) setItems((prev) => prev.filter((s) => s.id !== item.id)); }}
                    className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 grid gap-4 sm:grid-cols-2">
                  <div>
                    {lbl("Title")}
                    <input className={inp} value={item.title} onChange={(e) => update(item.id, "title", e.target.value)} />
                  </div>
                  <div>
                    {lbl("Icon Name (lucide-react)")}
                    <input className={inp} value={item.icon} onChange={(e) => update(item.id, "icon", e.target.value)} placeholder="e.g., clipboard-list, users, layers" />
                  </div>
                  <div className="sm:col-span-2">
                    {lbl("Description")}
                    <textarea rows={2} className={inp} value={item.description} onChange={(e) => update(item.id, "description", e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm bg-white rounded-2xl border border-slate-100 border-dashed">
            No items found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
