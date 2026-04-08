"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ServicesPageData, IndustriesPageData, ProcessPageData } from "@/types";

export default function PageHeroesAdmin() {
  const [activeTab, setActiveTab] = useState("services");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${activeTab}-page`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/content/${activeTab}-page`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success("Saved successfully!");
    } catch (err) {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (field: "image" | "secondaryImage") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setUploading(true);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "hero-images");
        const uploadPromise = fetch("/api/upload", { method: "POST", body: fd })
          .then((res) => res.json())
          .then((json) => {
            if (json.url) {
              setData({ ...data, hero: { ...data.hero, [field]: json.url } });
              return "Image uploaded successfully!";
            } else {
              throw new Error(json.error || "Upload failed");
            }
          })
          .finally(() => setUploading(false));

        toast.promise(uploadPromise, {
          loading: "Uploading image...",
          success: "Image uploaded successfully!",
          error: (err) => err.message || "Network error during upload",
        });
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: "services", label: "Services Page" },
    { id: "industries", label: "Industries Page" },
    { id: "process", label: "Process Page" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">
          Page Heroes Configuration
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Changes
        </button>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-sm">
        <h2 className="font-extrabold text-[#0F172A] text-lg tracking-wide mb-4">
          Hero Text & Content
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Badge Text
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
            value={data?.hero?.badge || ""}
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
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
              value={data?.hero?.title || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  hero: { ...data.hero, title: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Title Accent (Highlighted)
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
              value={data?.hero?.titleAccent || ""}
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
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium h-24 resize-none"
            value={data?.hero?.description || ""}
            onChange={(e) =>
              setData({
                ...data,
                hero: { ...data.hero, description: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="font-extrabold text-[#0F172A] text-lg tracking-wide mb-4">
          Hero Images
        </h2>
        <div className="flex gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Primary Image
            </label>
            <div
              className="relative rounded-2xl overflow-hidden w-64 aspect-[16/9] bg-slate-100 cursor-pointer group border-2 border-dashed border-slate-200"
              onClick={() => handleImageUpload("image")}>
              {data?.hero?.image ? (
                <Image
                  src={data.hero.image}
                  alt="Primary"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
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
            </div>
          </div>

          {data?.hero?.secondaryImage !== undefined && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Secondary Image
              </label>
              <div
                className="relative rounded-2xl overflow-hidden w-64 aspect-[16/9] bg-slate-100 cursor-pointer group border-2 border-dashed border-slate-200"
                onClick={() => handleImageUpload("secondaryImage")}>
                {data.hero.secondaryImage ? (
                  <Image
                    src={data.hero.secondaryImage}
                    alt="Secondary"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
