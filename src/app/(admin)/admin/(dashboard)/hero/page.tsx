"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  Loader2,
  Plus,
  X,
  Upload,
  ImageIcon,
  GripVertical,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { HeroData } from "@/types";

export default function AdminHeroPage() {
  const [data, setData] = useState<HeroData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const slidesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/content/hero")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/content/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success("Saved successfully!");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const uploadSlideImg = async (file: File, slideIndex: number) => {
    setUploadingSlide(slideIndex);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "hero-slides");

    const uploadPromise = fetch("/api/upload", { method: "POST", body: fd })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.url && data) {
          const newSlides = [...data.slides];
          newSlides[slideIndex].image = json.url;
          setData({ ...data, slides: newSlides });
          return "Image uploaded successfully!";
        } else {
          throw new Error(json.error || "Upload failed");
        }
      })
      .finally(() => setUploadingSlide(null));

    toast.promise(uploadPromise, {
      loading: "Uploading image...",
      success: "Image uploaded successfully! Remember to click Save Changes.",
      error: (err) => err.message || "Network error during upload",
    });
  };

  const addSlide = () => {
    if (!data) return;
    const newSlides = [
      ...(data.slides || []),
      {
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2569&auto=format&fit=crop",
        title: "New Slide Title",
        subtitle: "New Subtitle",
        description: "Description here",
        cta_label: "Explore",
        cta_href: "/services",
      },
    ];
    setData({ ...data, slides: newSlides });

    toast("Fill your content in the new slide and please save!", {
      icon: "ℹ️",
    });

    // Scroll directly to the newly added slide using ref
    setTimeout(() => {
      slidesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const removeSlide = (index: number) => {
    if (!data || !data.slides) return;

    // Prevent deleting if it's the last slide
    if (data.slides.length <= 1) {
      toast.error("You must have at least one slide in the Hero section.");
      return;
    }

    const newSlides = data.slides.filter((_, i) => i !== index);
    setData({ ...data, slides: newSlides });
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
    <div className="max-w-7xl space-y-6">
      {/* ── Slides Manager ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-[#0F172A] text-lg tracking-wide flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#1E3A8A]" /> Dynamic Slider
              Content
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage the images and text for your homepage slider.
            </p>
          </div>
          <button
            onClick={addSlide}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
            <Plus className="w-5 h-5" /> Add New Slide
          </button>
        </div>

        <div className="space-y-8">
          {data.slides &&
            data.slides.map((slide, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl border-2 border-slate-200 bg-white shadow-sm hover:border-brand-blue/30 transition-colors group">
                {/* Slide Number Badge */}
                <div className="absolute -top-4 left-6 bg-brand-navy text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                  SLIDE {idx + 1}
                </div>

                <button
                  onClick={() => removeSlide(idx)}
                  className="absolute -top-4 right-6 w-8 h-8 rounded-full bg-red-100 border-2 border-white shadow-sm text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors z-10"
                  title="Delete this slide">
                  <X className="w-4 h-4" />
                </button>

                <div className="flex gap-5">
                  {/* Image Upload Area */}
                  <div className="w-40 shrink-0">
                    {lbl("Background Image")}
                    <div
                      className="relative rounded-xl overflow-hidden h-28 bg-slate-200 cursor-pointer group/img border border-slate-300"
                      onClick={() => fileRefs.current[idx]?.click()}>
                      <Image
                        src={slide.image}
                        alt={`Slide ${idx}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      {uploadingSlide === idx && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <input
                      ref={(el) => {
                        fileRefs.current[idx] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0])
                          uploadSlideImg(e.target.files[0], idx);
                      }}
                    />
                  </div>

                  {/* Text Content Area */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        {lbl("Main Heading")}
                        <input
                          className={inp}
                          value={slide.title}
                          onChange={(e) => {
                            const s = [...data.slides];
                            s[idx].title = e.target.value;
                            setData({ ...data, slides: s });
                          }}
                        />
                      </div>
                      <div>
                        {lbl("Subheading (Top)")}
                        <input
                          className={inp}
                          value={slide.subtitle}
                          onChange={(e) => {
                            const s = [...data.slides];
                            s[idx].subtitle = e.target.value;
                            setData({ ...data, slides: s });
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      {lbl("Description Paragraph")}
                      <textarea
                        className={`${inp} h-20 resize-none`}
                        value={slide.description || ""}
                        onChange={(e) => {
                          const s = [...data.slides];
                          s[idx].description = e.target.value;
                          setData({ ...data, slides: s });
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        {lbl("Button Label")}
                        <input
                          className={inp}
                          value={slide.cta_label || ""}
                          onChange={(e) => {
                            const s = [...data.slides];
                            s[idx].cta_label = e.target.value;
                            setData({ ...data, slides: s });
                          }}
                        />
                      </div>
                      <div>
                        {lbl("Button Link")}
                        <input
                          className={inp}
                          value={slide.cta_href || ""}
                          onChange={(e) => {
                            const s = [...data.slides];
                            s[idx].cta_href = e.target.value;
                            setData({ ...data, slides: s });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {(!data.slides || data.slides.length === 0) && (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-sm text-slate-500 font-medium">
                No slides added yet. Add a slide to show the Hero carousel.
              </p>
            </div>
          )}

          <div ref={slidesEndRef} className="h-4" />
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-blue-900/20 w-full justify-center">
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saved ? "✓ Saved Successfully!" : "Save All Changes"}
      </button>
    </div>
  );
}
