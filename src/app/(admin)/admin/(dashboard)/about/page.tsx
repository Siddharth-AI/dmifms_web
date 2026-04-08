"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Loader2, Plus, X, Upload, ImageIcon, Info } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { AboutData } from "@/types";

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/content/about")
      .then((r) => r.json())
      .then((json) => {
        // Fallback for older data structures
        if (!json.stats) {
          json.stats = [
            { value: "500", suffix: "+", label: "Sites Managed" },
            { value: "5,000", suffix: "+", label: "Workforce" },
          ];
        }
        setData(json);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success("Saved successfully!");
    } catch (e) {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const uploadImg = async (file: File, isHeroImage = false) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "about-images");

    const uploadPromise = fetch("/api/upload", { method: "POST", body: fd })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.url && data) {
          if (isHeroImage) {
            setData({ ...data, hero: { ...data.hero, image: json.url } });
          } else {
            setData({ ...data, image: json.url });
          }
          return "Image uploaded successfully!";
        } else {
          throw new Error(json.error || "Upload failed");
        }
      })
      .finally(() => setUploading(false));

    toast.promise(uploadPromise, {
      loading: "Uploading image...",
      success: "Image uploaded successfully! Remember to click Save Changes.",
      error: (err) => err.message || "Network error during upload",
    });
  };

  if (!data)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
      </div>
    );

  const inp =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]/40 transition-all bg-white";
  const lbl = (t: string) => (
    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
      {t}
    </label>
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* ── Hero Content ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-sm">
        <h2 className="font-extrabold text-[#0F172A] text-lg tracking-wide flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-[#1E3A8A]" /> Hero Section
        </h2>

        <div>
          {lbl("Badge")}
          <input
            className={inp}
            value={data.hero?.badge || ""}
            onChange={(e) =>
              setData({
                ...data,
                hero: { ...data.hero, badge: e.target.value },
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            {lbl("Title")}
            <input
              className={inp}
              value={data.hero?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  hero: { ...data.hero, title: e.target.value },
                })
              }
            />
          </div>
          <div>
            {lbl("Title Accent")}
            <input
              className={inp}
              value={data.hero?.titleAccent || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  hero: { ...data.hero, titleAccent: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div>
          {lbl("Description")}
          <textarea
            className={`${inp} h-24 resize-none leading-relaxed`}
            value={data.hero?.description || ""}
            onChange={(e) =>
              setData({
                ...data,
                hero: { ...data.hero, description: e.target.value },
              })
            }
          />
        </div>
      </div>

      {/* ── Hero Image Upload ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="font-extrabold text-[#0F172A] text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#1E3A8A]" /> Hero Image
        </h2>
        <div className="flex gap-6 items-center">
          <div
            className="relative rounded-2xl overflow-hidden w-64 aspect-[16/9] bg-slate-100 cursor-pointer group border-2 border-dashed border-slate-200 hover:border-[#1E3A8A]/40 transition-colors"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  uploadImg(file, true);
                }
              };
              input.click();
            }}>
            {data.hero?.image ? (
              <Image
                src={data.hero.image}
                alt="Hero Image"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-semibold">No image selected</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-6 h-6 text-white" />
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Text Content ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-sm">
        <h2 className="font-extrabold text-[#0F172A] text-lg tracking-wide flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-[#1E3A8A]" /> About Us Content
        </h2>

        <div>
          {lbl("Main Heading (Large Serif Text)")}
          <input
            className={inp}
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="e.g. SILA is a next generation business services platform"
          />
        </div>

        <div>
          {lbl("Description Paragraph")}
          <textarea
            className={`${inp} h-32 resize-none leading-relaxed`}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="Write a detailed description about your company..."
          />
        </div>
      </div>

      {/* ── Image Upload ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="font-extrabold text-[#0F172A] text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#1E3A8A]" /> Right Side Image
        </h2>

        <div className="flex gap-6 items-center">
          <div
            className="relative rounded-2xl overflow-hidden w-64 aspect-[4/3] bg-slate-100 cursor-pointer group border-2 border-dashed border-slate-200 hover:border-[#1E3A8A]/40 transition-colors"
            onClick={() => fileRef.current?.click()}>
            {data.image ? (
              <Image
                src={data.image}
                alt="About Image"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-semibold">No image selected</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-6 h-6 text-white" />
            </div>

            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) uploadImg(e.target.files[0]);
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors mb-2">
              <Upload className="w-4 h-4" /> Upload New Image
            </button>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Recommended format: JPG or WebP.
              <br />
              Ideal aspect ratio: 4:3 (e.g. 800x600px).
              <br />
              Max file size: 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats Grid Manager ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-extrabold text-[#0F172A] text-sm uppercase tracking-wide">
            Stats Grid (Shown below description)
          </h2>
          <button
            onClick={() => {
              const newStats = [
                ...(data.stats || []),
                { value: "0", suffix: "+", label: "New Stat" },
              ];
              setData({ ...data, stats: newStats });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Stat Box
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {data.stats &&
            data.stats.map((stat, i) => (
              <div
                key={i}
                className="relative p-4 rounded-xl border border-slate-200 bg-slate-50 group">
                <button
                  onClick={() => {
                    const newStats = data.stats.filter((_, j) => j !== i);
                    setData({ ...data, stats: newStats });
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-slate-200 text-red-500 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100">
                  <X className="w-3 h-3" />
                </button>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      {lbl("Value (e.g. 500)")}
                      <input
                        className={inp}
                        value={stat.value}
                        onChange={(e) => {
                          const s = [...data.stats];
                          s[i].value = e.target.value;
                          setData({ ...data, stats: s });
                        }}
                      />
                    </div>
                    <div className="w-20">
                      {lbl("Suffix")}
                      <input
                        className={inp}
                        value={stat.suffix || ""}
                        placeholder="+, %"
                        onChange={(e) => {
                          const s = [...data.stats];
                          s[i].suffix = e.target.value;
                          setData({ ...data, stats: s });
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    {lbl("Label (e.g. Sites Managed)")}
                    <input
                      className={inp}
                      value={stat.label}
                      onChange={(e) => {
                        const s = [...data.stats];
                        s[i].label = e.target.value;
                        setData({ ...data, stats: s });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:opacity-90 disabled:opacity-60 transition-all shadow-xl shadow-blue-900/20 w-full justify-center">
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saved ? "✓ Changes Saved Successfully!" : "Save About Section"}
        </button>
      </div>
    </div>
  );
}
