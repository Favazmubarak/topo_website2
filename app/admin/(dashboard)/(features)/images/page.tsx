"use client";

import React, { useState, useEffect, useRef } from "react";
import { useImageAdmin } from "./hooks/useImageAdmin";
import { Section } from "./api/imageApi";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaImage,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaChevronDown,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Image from "next/image";

// ── Constants ────────────────────────────────────────────────────────────────

const SECTIONS: { value: Section; label: string; description: string }[] = [
  { value: "hero",        label: "Hero",          description: "Main banner / hero section" },
  { value: "about",       label: "About Us",       description: "About page imagery" },
  { value: "why-choose",  label: "Why Choose Us",  description: "Why-choose section" },
  { value: "cta",         label: "CTA",            description: "Call-to-action section" },
];

// ── Custom Dropdown ───────────────────────────────────────────────────────────

interface DropdownProps {
  value: Section;
  onChange: (v: Section) => void;
}

const SectionDropdown = ({ value, onChange }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = SECTIONS.find((s) => s.value === value)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-600 transition-all"
      >
        <span>{active.label}</span>
        <FaChevronDown
          size={8}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[180px] animate-in fade-in zoom-in-95 duration-150">
          {SECTIONS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => { onChange(s.value); setOpen(false); }}
              className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                s.value === value
                  ? "bg-black text-white"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  s.value === value ? "bg-white" : "bg-gray-300"
                }`}
              />
              <span className="text-[11px] font-bold tracking-tight">{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── FieldError ────────────────────────────────────────────────────────────────

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="flex items-center gap-1 text-[9px] text-red-500 font-semibold mt-1.5 animate-in fade-in duration-200">
      <FaExclamationCircle size={8} />
      {msg}
    </p>
  ) : null;

// ── Page ──────────────────────────────────────────────────────────────────────

const ImagesAdminPage = () => {
  const [activeSection, setActiveSection] = useState<Section>("hero");

  const {
    images,
    loading,
    error,
    successMessage,
    fetchImage,
    refetchImage,
    addImage,
    updateImage,
    deleteImage,
    clearStatus,
  } = useImageAdmin(activeSection);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section>("hero");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [readyImages, setReadyImages] = useState<Record<string, boolean>>({});
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // ── Fetch on section change ──
  useEffect(() => {
    fetchImage(activeSection);
  }, [activeSection, fetchImage]);

  // ── Toasts ──
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      clearStatus();
      refetchImage(activeSection);
      closeForm();
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearStatus();
    }
  }, [error]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const openAddForm = () => {
    setEditingId(null);
    setSelectedSection(activeSection);
    setSelectedFile(null);
    setPreviewUrl(null);
    setLocalErrors({});
    clearStatus();
    setIsFormOpen(true);
  };

  const handleEdit = (img: any) => {
    setEditingId(img._id);
    setSelectedSection(img.section as Section);
    setSelectedFile(null);
    setPreviewUrl(img.imageUrl);
    setLocalErrors({});
    clearStatus();
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setSelectedFile(null);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setLocalErrors({});
    clearStatus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large — max 10 MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image (jpeg, png, webp).");
      return;
    }
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (localErrors.image) setLocalErrors((p) => { const { image, ...r } = p; return r; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!selectedSection) errs.section = "Section is required";
    if (!selectedFile && !editingId) errs.image = "Image is required";
    if (Object.keys(errs).length > 0) {
      setLocalErrors(errs);
      toast.error("Please fix the errors before saving.");
      return;
    }
    setLocalErrors({});
    const formData = new FormData();
    formData.append("section", selectedSection);
    if (selectedFile) formData.append("image", selectedFile);
    if (editingId) await updateImage(editingId, formData);
    else await addImage(formData);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this image?")) return;
    await deleteImage(id);
    refetchImage(activeSection);
  };

  const sectionImages = images ?? [];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white pb-12 md:pb-20 px-3 sm:px-4 md:px-0 text-black font-montserrat">
      <div className="max-w-[1400px] mx-auto">

        {/* ── Header ── */}
        <div className="mb-6 md:mb-10 flex items-center justify-between border-b pb-4 md:pb-6">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight">
              Section Images
            </h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400 mt-0.5">
              Manage CMS images per section
            </p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 bg-black text-white px-3 sm:px-5 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <FaPlus size={8} />
            <span className="hidden sm:inline">Add Image</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* ── Section Filter ── */}
        <div className="mb-8 flex items-center gap-3">
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
            Section
          </span>
          <SectionDropdown
            value={activeSection}
            onChange={setActiveSection}
          />
        </div>

        {/* ── Loading skeleton ── */}
        {loading && sectionImages.length === 0 && (
          <div className={`grid gap-3 sm:gap-4 md:gap-6 ${
            activeSection === "hero" || activeSection === "about"
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1"
          }`}>
            {[...Array(activeSection === "hero" || activeSection === "about" ? 2 : 1)].map((_, i) => (
              <div
                key={i}
                className={`rounded-xl md:rounded-2xl bg-gray-100 animate-pulse ${
                  activeSection === "hero" || activeSection === "about"
                    ? "aspect-video"
                    : "aspect-[21/9]"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── Image Grid ── */}
        {sectionImages.length > 0 && (() => {
          // Aspect ratio per section — matches live-site dimensions exactly
          const aspectClass =
            activeSection === "hero"       ? "aspect-video"    // 16/9 — full-screen banner
          : activeSection === "about"      ? "aspect-video"    // 16/9 — image pair
          : activeSection === "why-choose" ? "aspect-[21/9]"   // ultra-wide strip
          :                                  "aspect-[21/9]";  // cta — wide banner

          const gridClass =
            activeSection === "hero" || activeSection === "about"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6"
              : "grid grid-cols-1 gap-3 sm:gap-4 md:gap-6";

          return (
            <div className={gridClass}>
              {sectionImages.map((img) => (
                <div
                  key={img._id}
                  className={`group relative ${aspectClass} w-full rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={`${img.section} image`}
                    fill
                    className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                      readyImages[img._id] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setReadyImages((prev) => ({ ...prev, [img._id]: true }))}
                  />
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className="bg-black/70 backdrop-blur-sm text-white text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {img.section}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="absolute inset-0 bg-black/20 lg:bg-black/40 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 md:gap-5 pointer-events-none lg:pointer-events-auto">
                    <button
                      onClick={() => handleEdit(img)}
                      className="bg-white text-black p-2.5 md:p-3 rounded-full hover:scale-110 transition-transform shadow-lg pointer-events-auto"
                    >
                      <FaEdit size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(img._id)}
                      className="bg-white text-red-500 p-2.5 md:p-3 rounded-full hover:scale-110 transition-transform shadow-lg pointer-events-auto"
                    >
                      <FaTrash size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── Empty State ── */}
        {sectionImages.length === 0 && !loading && (
          <div className="text-center py-16 md:py-24 border-2 border-dashed border-gray-100 rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-3">
            <FaImage className="text-gray-200" size={36} />
            <p className="text-sm text-gray-300 font-medium italic">
              No images for{" "}
              <span className="font-black uppercase">
                {SECTIONS.find((s) => s.value === activeSection)?.label}
              </span>{" "}
              yet.
            </p>
            <button
              onClick={openAddForm}
              className="mt-2 flex items-center gap-1.5 bg-black text-white px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
            >
              <FaPlus size={8} /> Add First Image
            </button>
          </div>
        )}

      </div>

      {/* ── Modal Form ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeForm} />
          <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-5 sm:p-6 md:p-8 space-y-5 md:space-y-7">

              {/* Header */}
              <div className="flex items-center justify-between border-b pb-3 md:pb-4">
                <h2 className="text-base md:text-xl font-medium tracking-tight">
                  {editingId ? "Update Image" : "Add Section Image"}
                </h2>
                <button onClick={closeForm} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FaTimes size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">


                {/* ── Image Upload ── */}
                <div className="space-y-1.5">
                  <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Image{editingId ? " (leave blank to keep current)" : ""}
                  </label>
                  <div
                    className={`relative aspect-video rounded-lg md:rounded-xl bg-gray-50 border-2 border-dashed overflow-hidden flex flex-col items-center justify-center group/upload hover:border-black/20 transition-colors cursor-pointer ${
                      localErrors.image ? "border-red-300 bg-red-50" : "border-gray-100"
                    }`}
                    onClick={() => document.getElementById("images-file-input")?.click()}
                  >
                    {previewUrl ? (
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    ) : (
                      <>
                        <FaPlus className="text-gray-200 mb-2 group-hover/upload:text-black transition-colors" size={18} />
                        <p className="text-[10px] md:text-xs text-gray-400 font-bold">Click to select image</p>
                        <p className="text-[8px] text-gray-300 mt-0.5">jpeg, png, webp — max 10 MB</p>
                      </>
                    )}
                    {previewUrl && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                          Change Image
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    id="images-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <FieldError msg={localErrors.image} />
                </div>

                {/* ── Submit ── */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <><FaSpinner size={12} className="animate-spin" /> Uploading…</>
                  ) : (
                    <><FaCheckCircle size={12} /> {editingId ? "Update Image" : "Save Image"}</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesAdminPage;
