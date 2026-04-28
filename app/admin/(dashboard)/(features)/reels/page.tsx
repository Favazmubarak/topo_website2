"use client"

import React, { useState, useEffect } from "react";
import { useReelAdmin } from "./hooks/useReelAdmin";
import { Reel } from "./api/reelApi";
import { FaPlus, FaTrash, FaEdit, FaSpinner, FaTimes, FaExternalLinkAlt, FaPlay, FaVideo, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";

const ReelsAdminPage = () => {
  const {
    reels, fetchReels,
    createReel, updateReel, deleteReel,
    loading, error, fieldErrors, successMessage, clearStatus,
  } = useReelAdmin();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", link: "" });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => { fetchReels(); }, [fetchReels]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      clearStatus();
      closeForm();
    }
  }, [successMessage]);

  useEffect(() => {
    if (error && Object.keys(fieldErrors || {}).length === 0) {
      toast.error(error);
      clearStatus();
    }
  }, [error]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ title: "", link: "" });
    setFormError(null);
    clearStatus();
  };

  const handleEdit = (reel: Reel) => {
    setEditingId(reel._id);
    setFormData({ title: reel.title, link: reel.link });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearStatus();
    if (editingId) {
      await updateReel(editingId, formData);
    } else {
      await createReel(formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this reel?")) return;
    await deleteReel(id);
  };

  return (
    <div className="min-h-screen bg-white pb-12 md:pb-20 px-3 sm:px-4 md:px-0 text-black">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-6 md:mb-10 flex items-center justify-between border-b pb-4 md:pb-6">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight">Reels Management</h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400 mt-0.5">
              Manage video content
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 bg-black text-white px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <FaPlus size={8} /> <span className="hidden sm:inline">Add New Reel</span><span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Reels grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {reels.map((reel) => (
            <div key={reel._id} className="group relative bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="p-2 md:p-3 bg-black text-white rounded-lg md:rounded-xl shadow-md">
                  <FaPlay size={12} className="md:hidden" />
                  <FaPlay size={14} className="hidden md:block" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(reel)} className="p-1.5 md:p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all">
                    <FaEdit size={13} className="md:hidden" />
                    <FaEdit size={15} className="hidden md:block" />
                  </button>
                  <button onClick={() => handleDelete(reel._id)} className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all">
                    <FaTrash size={13} className="md:hidden" />
                    <FaTrash size={15} className="hidden md:block" />
                  </button>
                </div>
              </div>

              <div className="mt-4 md:mt-6 space-y-1 md:space-y-2">
                <h3 className="text-sm md:text-base font-bold tracking-tight line-clamp-1">{reel.title}</h3>
                <a
                  href={reel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FaExternalLinkAlt size={8} /> View Source
                </a>
              </div>

              <div className="mt-3 md:mt-4 text-[8px] md:text-[9px] text-gray-400 font-medium italic">
                Updated: {new Date(reel.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {reels.length === 0 && !loading && (
          <div className="text-center py-16 md:py-24 border-2 border-dashed border-gray-100 rounded-xl md:rounded-2xl flex flex-col items-center gap-3">
            <FaVideo size={32} className="text-gray-200 md:text-[40px]" />
            <p className="text-sm md:text-base text-gray-400 font-medium">No reels yet. Add your first reel.</p>
          </div>
        )}

        {/* Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeForm} />

            <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-5 sm:p-6 md:p-8 space-y-5 md:space-y-6">

                {/* Modal header */}
                <div className="flex items-center justify-between border-b pb-3 md:pb-4">
                  <h2 className="text-base md:text-lg font-medium tracking-tight">
                    {editingId ? "Edit Reel" : "Add New Reel"}
                  </h2>
                  <button onClick={closeForm} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaTimes size={15} />
                  </button>
                </div>

                {/* Error banner */}
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] md:text-[11px] rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 leading-relaxed">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Reel Title</label>
                    <input
                      type="text"
                      placeholder="E.G. SUMMER COLLECTION"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
                      className={`w-full bg-gray-50 px-3 py-3 md:p-4 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold tracking-tight focus:ring-2 outline-none transition-all ${
                        fieldErrors.title ? "ring-2 ring-red-400 bg-red-50" : "ring-black"
                      }`}
                      required
                    />
                    {fieldErrors.title && (
                      <p className="flex items-center gap-1 text-[9px] md:text-[10px] text-red-500 ml-1">
                        <FaExclamationCircle size={8} /> {fieldErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Link */}
                  <div className="space-y-1">
                    <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Video Link</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/reel/..."
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className={`w-full bg-gray-50 px-3 py-3 md:p-4 rounded-lg md:rounded-xl text-[11px] md:text-xs font-medium focus:ring-2 outline-none transition-all ${
                        fieldErrors.link ? "ring-2 ring-red-400 bg-red-50" : "ring-black"
                      }`}
                      required
                    />
                    {fieldErrors.link && (
                      <p className="flex items-center gap-1 text-[9px] md:text-[10px] text-red-500 ml-1">
                        <FaExclamationCircle size={8} /> {fieldErrors.link}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading
                      ? <><FaSpinner size={11} className="animate-spin" /> Processing…</>
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

export default ReelsAdminPage;
