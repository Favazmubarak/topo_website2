"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTestimonialAdmin } from "../../hooks/useTestimonialAdmin";
import { FaPlus, FaTrash, FaEdit, FaSync, FaUpload, FaTimes, FaStar } from "react-icons/fa";
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
    <div className="min-h-screen bg-white pb-20 px-4 md:px-0 text-black font-montserrat">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-12 flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Client Testimonials</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-1">Manage feedback and social proof</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95"
          >
            <FaPlus size={10} /> Add New
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t._id} className="group relative bg-gray-50/50 p-8 rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">{t.name}</h3>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={8} className={i < t.rating ? "text-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 bg-white/80 lg:bg-transparent p-1 rounded-lg backdrop-blur-sm lg:backdrop-blur-none">
                  <button onClick={() => handleEdit(t)} className="p-2 text-gray-400 hover:text-black transition-colors"><FaEdit size={13} /></button>
                  <button onClick={() => handleDelete(t._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><FaTrash size={13} /></button>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-500 italic line-clamp-6 break-words">"{t.review}"</p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {testimonials.length === 0 && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-gray-300 font-medium italic">No testimonials yet. Share what your clients say.</p>
          </div>
        )}

        {/* Empty State */}

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeForm} />
            <div className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-xl font-medium tracking-tight">
                    {editingId ? "Edit Feedback" : "Add Testimonial"}
                  </h2>
                  <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center">
                    <div
                      className="relative w-24 h-24 rounded-full bg-gray-50 border border-gray-100 overflow-hidden cursor-pointer group mb-2"
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                    >
                      {previewUrl ? (
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
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
                    className="w-full bg-black text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2"
                  >
                    {editingId ? "Update Testimonial" : "Post Testimonial"}
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
