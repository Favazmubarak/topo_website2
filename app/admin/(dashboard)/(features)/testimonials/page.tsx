"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTestimonialAdmin } from "../../hooks/useTestimonialAdmin";
import { FaPlus, FaTrash, FaEdit, FaSync, FaUpload, FaTimes, FaStar, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

const TestimonialsAdminPage = () => {
  const { testimonials, fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, loading, error, successMessage, clearStatus } = useTestimonialAdmin();

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    review: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [readyImages, setReadyImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      clearStatus();
      closeForm();
    }
  }, [successMessage, clearStatus]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearStatus();
    }
  }, [error, clearStatus]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: "", rating: 5, review: "" });
    setSelectedFile(null);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleEdit = (testimonial: any) => {
    setEditingId(testimonial._id);
    setFormData({
      name: testimonial.name,
      rating: testimonial.rating,
      review: testimonial.review,
    });
    setPreviewUrl(testimonial.avatar);
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPreviewReady(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("rating", formData.rating.toString());
    data.append("review", formData.review);
    if (selectedFile) data.append("avatar", selectedFile);

    if (editingId) {
      await updateTestimonial(editingId, data);
    } else {
      if (!selectedFile) {
        toast.error("Please select a profile image");
        return;
      }
      await createTestimonial(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this testimonial?")) {
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
            <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400 mt-0.5">Manage feedback and social proof</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 bg-black text-white px-3 sm:px-5 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <FaPlus size={8} /> <span className="hidden sm:inline">Add New</span><span className="sm:hidden">Add</span>
          </button>
        </div>

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

        {/* Empty State */}

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeForm} />
            <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-5 sm:p-6 md:p-8 space-y-5 md:space-y-8">
                <div className="flex items-center justify-between border-b pb-3 md:pb-4">
                  <h2 className="text-base md:text-xl font-medium tracking-tight">
                    {editingId ? "Edit Feedback" : "Add Testimonial"}
                  </h2>
                  <button onClick={closeForm} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"><FaTimes size={15} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center">
                    <div
                      className="relative w-24 h-24 rounded-full bg-gray-50 border border-gray-100 overflow-hidden cursor-pointer group mb-2"
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
                    <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Client Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border-none p-4 rounded-lg text-sm font-bold tracking-tight focus:ring-2 ring-black"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Rating</label>
                      <div className="flex gap-2 bg-gray-50 p-4 rounded-lg">
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
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-end ml-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Review Statement</label>
                        <span className={`text-[9px] font-bold ${formData.review.length > 280 ? 'text-red-500' : 'text-gray-400'}`}>
                          {formData.review.length} / 300
                        </span>
                      </div>
                      <textarea
                        placeholder="Ex: The quality of their aluminum windows is unmatched..."
                        rows={4}
                        maxLength={300}
                        value={formData.review}
                        onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                        className="w-full bg-gray-50 border-none p-4 rounded-lg text-xs leading-relaxed text-gray-500 focus:ring-2 ring-black resize-none italic"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading
                      ? <><FaSpinner size={12} className="animate-spin" /> Saving…</>
                      : editingId ? "Update" : "Save"
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
