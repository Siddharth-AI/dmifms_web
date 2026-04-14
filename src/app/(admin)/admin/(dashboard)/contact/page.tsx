"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Info, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ContactData } from "@/types";

export default function AdminContactPage() {
  const [data, setData] = useState<ContactData | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/content/contact")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/content/contact", {
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

  const uploadImg = async (file: File, field: "image" | "secondaryImage") => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "contact-images");

    const uploadPromise = fetch("/api/upload", { method: "POST", body: fd })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.url && data) {
          setData({ ...data, hero: { ...data.hero, [field]: json.url } });
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
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]/30 transition-all bg-white";
  const lbl = (t: string) => (
    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
      {t}
    </label>
  );

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
            Contact Page
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage contact info and hero content.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-50">
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}{" "}
          Save Changes
        </button>
      </div>

      {/* ── Hero Section ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-sm">
        <h2 className="font-extrabold text-[#0F172A] text-lg tracking-wide flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-[#1E3A8A]" /> Hero Content
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            {lbl("Badge")}{" "}
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
          <div>
            {lbl("Title")}{" "}
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
            {lbl("Title Accent")}{" "}
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
            className={`${inp} h-24`}
            value={data.hero?.description || ""}
            onChange={(e) =>
              setData({
                ...data,
                hero: { ...data.hero, description: e.target.value },
              })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            {lbl("Primary Background Image")}
            <div
              className="relative rounded-2xl overflow-hidden w-full aspect-[16/9] bg-slate-100 cursor-pointer group border-2 border-dashed border-slate-200"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const f = (e.target as HTMLInputElement).files?.[0];
                  if (f) uploadImg(f, "image");
                };
                input.click();
              }}>
              {data.hero?.image ? (
                <Image
                  src={data.hero.image}
                  alt="Hero"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
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
          <div>
            {lbl("Secondary Image (Form Panel Texture)")}
            <div
              className="relative rounded-2xl overflow-hidden w-full aspect-[16/9] bg-slate-100 cursor-pointer group border-2 border-dashed border-slate-200"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const f = (e.target as HTMLInputElement).files?.[0];
                  if (f) uploadImg(f, "secondaryImage");
                };
                input.click();
              }}>
              {data.hero?.secondaryImage ? (
                <Image
                  src={data.hero.secondaryImage}
                  alt="Secondary"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
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
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-extrabold text-[#0F172A] text-sm uppercase tracking-wide mb-4">
          Contact Information
        </h2>
        <div>
          {lbl("Address")}
          <textarea
            className={`${inp} resize-none`}
            rows={2}
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        </div>
        <div>
          {lbl("Email")}
          <input
            className={inp}
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div>
          {lbl("Phone")}
          <input
            className={inp}
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-4">
          <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wide">
            Social Links
          </h3>
          <div>
            {lbl("LinkedIn URL")}
            <input
              className={inp}
              value={data.social?.linkedin || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  social: { ...data.social, linkedin: e.target.value },
                })
              }
              placeholder="https://linkedin.com/company/..."
            />
          </div>
          <div>
            {lbl("X URL")}
            <input
              className={inp}
              value={data.social?.twitter || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  social: { ...data.social, twitter: e.target.value },
                })
              }
              placeholder="https://x.com/..."
            />
          </div>
          <div>
            {lbl("Facebook URL")}
            <input
              className={inp}
              value={data.social?.facebook || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  social: { ...data.social, facebook: e.target.value },
                })
              }
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
