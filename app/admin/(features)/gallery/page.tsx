"use client";

import React, { useState, useEffect } from "react";
import { useGalleryAdmin } from "./hooks/useGalleryAdmin";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaImage, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Skeleton } from "@/src/components/common/Skeleton";

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="flex items-center gap-1 text-[9px] text-red-500 font-semibold mt-1.5 animate-in fade-in duration-200">
      <FaExclamationCircle size={8} />{msg}
    </p>
  ) : null;

const GalleryAdminPage = () => {
  const { images, fetchImages, createImage, updateImage, deleteImage, loading, error, fieldErrors, successMessage, clearStatus, hasMore, page } = useGalleryAdmin();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [readyImages, setReadyImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchImages(1);
  }, [fetchImages]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchImages(page + 1);
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { id: "admin-success" });
      clearStatus();
      closeForm();
    }
  }, [successMessage, clearStatus]);

  useEffect(() => {
    if (error && Object.keys(fieldErrors).length === 0) {
      toast.error(error, { id: "admin-error" });
      clearStatus();
    }
  }, [error]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setSelectedFile(null);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    clearStatus();
  };

  const handleEdit = (img: any) => {
    setEditingId(img._id);
    setPreviewUrl(img.imageUrl);
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image is too large. Maximum allowed size is 10MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (jpeg, jpg, png, webp)");
      return;
    }
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewReady(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
    } else if (!editingId) {
      toast.error("Please select an image");
      return;
    }
    if (editingId) {
      await updateImage(editingId, formData);
    } else {
      await createImage(formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this image?")) {
      await deleteImage(id);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-12 md:pb-20 px-3 sm:px-4 md:px-0 text-black font-montserrat">
      <div className="max-w-[1400px] mx-auto">

        <div className="mb-6 md:mb-12 flex items-center justify-between border-b pb-4 md:pb-6">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight">Gallery Management</h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400 mt-0.5">Showcase your best projects</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 bg-black text-white px-3 sm:px-5 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <FaPlus size={8} /> <span className="hidden sm:inline">Add Image</span><span className="sm:hidden">Add</span>
          </button>
        </div>

        {loading && images.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl md:rounded-2xl" />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {images.map((img) => (
            <div key={img._id} className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <Image
                src={img.imageUrl}
                alt="Gallery item"
                fill
                className={`object-cover transition-all duration-700 group-hover:scale-110 ${readyImages[img._id] ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setReadyImages(prev => ({ ...prev, [img._id]: true }))}
              />
              {!readyImages[img._id] && (
                <Skeleton className="absolute inset-0 rounded-none" />
              )}
              <div className="absolute inset-0 bg-black/20 lg:bg-black/40 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 md:gap-4 pointer-events-none lg:pointer-events-auto">
                <button
                  onClick={() => handleEdit(img)}
                  className="bg-white text-black p-2 md:p-3 rounded-full hover:scale-110 transition-transform shadow-lg pointer-events-auto"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="bg-white text-red-500 p-2 md:p-3 rounded-full hover:scale-110 transition-transform shadow-lg pointer-events-auto"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && images.length > 0 ? <><FaSpinner size={12} className="animate-spin" /> Loading...</> : "Load More"}
            </button>
          </div>
        )}

        {images.length === 0 && !loading && (
          <div className="text-center py-16 md:py-20 border-2 border-dashed border-gray-100 rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-3">
            <FaImage className="text-gray-200" size={32} />
            <p className="text-sm text-gray-300 font-medium italic">No gallery images found. Upload your first work.</p>
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeForm} />
            <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-5 sm:p-6 md:p-8 space-y-5 md:space-y-8">
                <div className="flex items-center justify-between border-b pb-3 md:pb-4">
                  <h2 className="text-base md:text-xl font-medium tracking-tight">
                    {editingId ? "Update Image" : "Add Image to Gallery"}
                  </h2>
                  <button onClick={closeForm} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"><FaTimes size={15} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Gallery Image</label>
                    <div
                      className="relative aspect-video rounded-lg md:rounded-xl bg-gray-50 border-2 border-dashed border-gray-100 overflow-hidden flex flex-col items-center justify-center group/upload hover:border-black/10 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('gallery-file-input')?.click()}
                    >
                      {previewUrl ? (
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <>
                          <FaPlus className="text-gray-200 mb-2 group-hover/upload:text-black transition-colors" size={18} />
                          <p className="text-[10px] md:text-xs text-gray-400 font-bold">Select high-quality work</p>
                        </>
                      )}
                      {previewUrl && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity">
                          <p className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest">Change Image</p>
                        </div>
                      )}
                    </div>
                    <input id="gallery-file-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading
                      ? <><FaSpinner size={12} className="animate-spin" /> Uploading…</>
                      : <><FaCheckCircle size={12} /> {editingId ? "Update Image" : "Save to Gallery"}</>
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

export default GalleryAdminPage;
