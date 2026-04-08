"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, ToggleLeft, ToggleRight, Pencil, ChevronUp, Plus, Trash2 } from "lucide-react";
import { ProcessStep } from "@/types";

export default function AdminProcessPage() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/content/process").then((r) => r.json()).then((d) => {
      setSteps(d);
      setLoading(false);
    });
  }, []);

  const saveAll = async () => {
    setSaving(true);
    await fetch("/api/content/process", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(steps),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = (id: number, field: keyof ProcessStep, value: unknown) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
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
          <h1 className="text-lg font-extrabold text-[#0F172A]">Process Steps</h1>
          <p className="text-xs text-slate-400 mt-0.5">{steps.filter((s) => s.status).length} of {steps.length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newId = Date.now();
              const newStep: ProcessStep = { id: newId, step: String(steps.length + 1).padStart(2, "0"), title: "New Step", description: "", icon: "check-circle-2", color: "#1E3A8A", status: true };
              setSteps((prev) => [...prev, newStep]);
              setEditing(newId);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-[#1E3A8A] border border-[#1E3A8A]/20 bg-[#1E3A8A]/5 hover:bg-[#1E3A8A]/10 transition-colors">
            <Plus className="w-4 h-4" /> Add Step
          </button>
          <button onClick={saveAll} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:opacity-90 disabled:opacity-60 transition-all shadow-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save All"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const isOpen = editing === step.id;
          return (
            <div key={step.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                {/* Step number badge */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-black"
                  style={{ backgroundColor: step.color || "#1E3A8A" }}
                >
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#0F172A] text-sm truncate">{step.title}</div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">{step.description}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => update(step.id, "status", !step.status)}>
                    {step.status
                      ? <ToggleRight className="w-6 h-6 text-emerald-500 cursor-pointer" />
                      : <ToggleLeft className="w-6 h-6 text-slate-300 cursor-pointer" />}
                  </button>
                  <button onClick={() => setEditing(isOpen ? null : step.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1E3A8A] bg-[#1E3A8A]/8 hover:bg-[#1E3A8A]/15 transition-colors">
                    {isOpen ? <><ChevronUp className="w-3.5 h-3.5" /> Close</> : <><Pencil className="w-3.5 h-3.5" /> Edit</>}
                  </button>
                  <button onClick={() => { if (confirm("Delete this step?")) setSteps((prev) => prev.filter((s) => s.id !== step.id)); }}
                    className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-slate-100 p-4 bg-slate-50/80 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>{lbl("Step Number")}<input className={inp} value={step.step} onChange={(e) => update(step.id, "step", e.target.value)} /></div>
                    <div className="col-span-2">{lbl("Title")}<input className={inp} value={step.title} onChange={(e) => update(step.id, "title", e.target.value)} /></div>
                  </div>
                  <div>{lbl("Description")}<textarea className={`${inp} resize-none`} rows={2} value={step.description} onChange={(e) => update(step.id, "description", e.target.value)} /></div>
                  <div>
                    {lbl("Accent Color (hex)")}
                    <div className="flex items-center gap-2">
                      <input type="color" value={step.color || "#1E3A8A"} onChange={(e) => update(step.id, "color", e.target.value)}
                        className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5" />
                      <input className={inp} value={step.color || "#1E3A8A"} onChange={(e) => update(step.id, "color", e.target.value)} />
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
