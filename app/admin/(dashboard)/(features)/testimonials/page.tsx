"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTestimonialAdmin } from "./hooks/useTestimonialAdmin";
import { FaPlus, FaTrash, FaEdit, FaSync, FaUpload, FaTimes, FaStar, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="flex items-center gap-1 text-[9px] text-red-500 font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
      <FaExclamationCircle size={8} />
      {msg}
    </p>
  ) : null;

const validate = (
  formData: { name: string; rating: number; review: string },
  isCreate: boolean,
  hasFile: boolean
) => {
  const errs: Record<string, string> = {};

  if (!formData.name.trim()) {
    errs.name = "Client name is required";
  } else if (formData.name.trim().length < 2) {
    errs.name = "Name must be at least 2 characters";
  } else if (formData.name.trim().length > 50) {
    errs.name = "Name cannot exceed 50 characters";
  }

  if (formData.rating < 1 || formData.rating > 5) {
    errs.rating = "Rating must be between 1 and 5";
  }

  if (!formData.review.trim()) {
    errs.review = "Review is required";
  } else if (formData.review.trim().length < 10) {
    errs.review = "Review must be at least 10 characters";
  } else if (formData.review.trim().length > 300) {
    errs.review = "Review cannot exceed 300 characters";
  }

  if (isCreate && !hasFile) {
    errs.avatar = "Profile image is required";
  }

  return errs;
};

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────

const TestimonialsAdminPage = () => {
  const {
    testimonials, fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
    loading, error, fieldErrors, successMessage, clearStatus,
  } = useTestimonialAdmin();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", rating: 5, review: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [readyImages, setReadyImages] = useState<Record<string, boolean>>({});
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const errors = { ...localErrors, ...fieldErrors };

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      clearStatus();
      closeForm();
    }
  }, [successMessage]);

  useEffect(() => {
    if (error && Object.keys(fieldErrors).length === 0) {
      toast.error(error);
      clearStatus();
    }
  }, [error]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: "", rating: 5, review: "" });
    setSelectedFile(null);
    setLocalErrors({});
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleEdit = (t: any) => {
    setEditingId(t._id);
    setFormData({ name: t.name, rating: t.rating, review: t.review });
    setPreviewUrl(t.avatar);
    setLocalErrors({});
    clearStatus();
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setLocalErrors((prev) => ({ ...prev, avatar: "Image is too large. Maximum allowed size is 10MB." }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setLocalErrors((prev) => ({ ...prev, avatar: "Please upload a valid image file (jpeg, jpg, png, webp)" }));
      return;
    }

    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewReady(false);
    setLocalErrors((prev) => { const { avatar, ...rest } = prev; return rest; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clientErrs = validate(formData, !editingId, !!selectedFile);

    if (Object.keys(clientErrs).length > 0) {
      setLocalErrors(clientErrs);
      toast.error("Please fix the errors below before saving");
      return;
    }

    setLocalErrors({});
    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("rating", formData.rating.toString());
    data.append("review", formData.review.trim());
    if (selectedFile) data.append("avatar", selectedFile);

    if (editingId) {
      await updateTestimonial(editingId, data);
    } else {
      await createTestimonial(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      await deleteTestimonial(id);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-12 md:pb-20 px-3 sm:px-4 md:px-0 text-black font-montserrat">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-6 md:mb-12 flex items-center justify-between border-b pb-4 md:pb-6">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight">Client Testimonials</h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400 mt-0.5">
              Manage feedback and social proof
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 bg-black text-white px-3 sm:px-5 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <FaPlus size={8} /> <span className="hidden sm:inline">Add New</span><span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && testimonials.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50/50 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-100/50 animate-pulse">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-2 h-2 bg-gray-200 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded w-full" />
                  <div className="h-2 bg-gray-100 rounded w-5/6" />
                  <div className="h-2 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <div key={t._id} className="group relative bg-gray-50/50 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className={`object-cover transition-opacity duration-500 ${readyImages[t._id] ? "opacity-100" : "opacity-0"}`}
                      onLoad={() => setReadyImages(prev => ({ ...prev, [t._id]: true }))}
                    />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-tight">{t.name}</h3>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={7} className={i < t.rating ? "text-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 bg-white/80 lg:bg-transparent p-1 rounded-lg backdrop-blur-sm lg:backdrop-blur-none">
                  <button onClick={() => handleEdit(t)} className="p-1.5 md:p-2 text-gray-400 hover:text-black transition-colors"><FaEdit size={12} /></button>
                  <button onClick={() => handleDelete(t._id)} className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 transition-colors"><FaTrash size={12} /></button>
                </div>
              </div>
              <p className="text-[10px] md:text-[11px] leading-relaxed text-gray-500 italic line-clamp-6 break-words">"{t.review}"</p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {testimonials.length === 0 && !loading && (
          <div className="text-center py-16 md:py-20 border-2 border-dashed border-gray-100 rounded-xl md:rounded-2xl">
            <p className="text-sm md:text-base text-gray-300 font-medium italic">No testimonials yet. Share what your clients say.</p>
          </div>
        )}

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeForm} />
            <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-5 sm:p-6 md:p-8 space-y-5 md:space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-3 md:pb-4">
                  <h2 className="text-base md:text-xl font-medium tracking-tight">
                    {editingId ? "Edit Feedback" : "Add Testimonial"}
                  </h2>
                  <button onClick={closeForm} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaTimes size={15} />
                  </button>
                </div>

                {/* General server error banner */}
                {fieldErrors.general && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-red-600 text-[10px] font-semibold">
                    <FaExclamationCircle className="mt-0.5 shrink-0" size={11} />
                    {fieldErrors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative w-24 h-24 rounded-full bg-gray-50 border overflow-hidden cursor-pointer group mb-1
                        ${errors.avatar ? "border-red-300 ring-2 ring-red-300" : "border-gray-100"}`}
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                    >
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className={`object-cover transition-opacity duration-500 ${previewReady ? "opacity-100" : "opacity-0"}`}
                          onLoad={() => setPreviewReady(true)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                          <FaUpload size={20} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <FaSync size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Profile Image</span>
                    <FieldError msg={errors.avatar} />
                    <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>

                  <div className="space-y-4">

                    {/* Name */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">
                        Client Name
                        <span className={`float-right font-bold ${formData.name.length > 45 ? "text-red-500" : "text-gray-300"}`}>
                          {formData.name.length}/50
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (localErrors.name) setLocalErrors(p => { const { name, ...r } = p; return r; });
                        }}
                        className={`w-full bg-gray-50 p-4 rounded-lg text-sm font-bold tracking-tight focus:outline-none focus:ring-2 transition-all
                          ${errors.name ? "ring-2 ring-red-400 bg-red-50" : "ring-black"}`}
                      />
                      <FieldError msg={errors.name} />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Rating</label>
                      <div className={`flex gap-2 bg-gray-50 p-4 rounded-lg ${errors.rating ? "ring-2 ring-red-400 bg-red-50" : ""}`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: star })}
                            className={`transition-all ${star <= formData.rating ? "text-yellow-400 scale-110" : "text-gray-200"}`}
                          >
                            <FaStar size={16} />
                          </button>
                        ))}
                      </div>
                      <FieldError msg={errors.rating} />
                    </div>

                    {/* Review */}
                    <div>
                      <div className="flex justify-between items-end ml-1 mb-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Review Statement</label>
                        <span className={`text-[9px] font-bold ${formData.review.length > 280 ? "text-red-500" : "text-gray-300"}`}>
                          {formData.review.length}/300
                        </span>
                      </div>
                      <textarea
                        placeholder="Ex: The quality of their aluminum windows is unmatched..."
                        rows={4}
                        maxLength={300}
                        value={formData.review}
                        onChange={(e) => {
                          setFormData({ ...formData, review: e.target.value });
                          if (localErrors.review) setLocalErrors(p => { const { review, ...r } = p; return r; });
                        }}
                        className={`w-full bg-gray-50 p-4 rounded-lg text-xs leading-relaxed text-gray-500 focus:outline-none focus:ring-2 resize-none italic transition-all
                          ${errors.review ? "ring-2 ring-red-400 bg-red-50" : "ring-black"}`}
                      />
                      <FieldError msg={errors.review} />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading
                      ? <><FaSpinner size={12} className="animate-spin" /> Saving…</>
                      : <><FaCheckCircle size={12} /> {editingId ? "Update Testimonial" : "Save Testimonial"}</>
                    }
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsAdminPage;
