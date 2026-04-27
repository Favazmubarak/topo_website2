"use client";

import React, { useState, useEffect } from "react";
import { useGalleryAdmin } from "../../hooks/useGalleryAdmin";
import { FaPlus, FaTrash, FaEdit, FaSync, FaTimes, FaImage } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Image from "next/image";

const GalleryAdminPage = () => {
  const { images, fetchImages, createImage, updateImage, deleteImage, loading, error, successMessage, clearStatus } = useGalleryAdmin();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

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
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleEdit = (img: any) => {
    setEditingId(img._id);
    setPreviewUrl(img.imageUrl);
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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
    <div className="min-h-screen bg-white pb-20 px-4 md:px-0 text-black font-montserrat">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-12 flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Gallery Management</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-1">Showcase your best projects</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95"
          >
            <FaPlus size={10} /> Add Image
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img._id} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <Image
                src={img.imageUrl}
                alt="Gallery item"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 lg:bg-black/40 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 pointer-events-none lg:pointer-events-auto">
                <button
                  onClick={() => handleEdit(img)}
                  className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform shadow-lg pointer-events-auto"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="bg-white text-red-500 p-3 rounded-full hover:scale-110 transition-transform shadow-lg pointer-events-auto"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {images.length === 0 && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center">
            <FaImage className="text-gray-200 mb-4" size={40} />
            <p className="text-gray-300 font-medium italic">No gallery images found. Upload your first showcase work.</p>
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
                    {editingId ? "Update Image" : "Add Image to Gallery"}
                  </h2>
                  <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload Area */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Gallery Image</label>
                    <div
                      className="relative aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-100 overflow-hidden flex flex-col items-center justify-center group/upload hover:border-black/10 transition-colors cursor-pointer"
                      onClick={() => document.getElementById('gallery-file-input')?.click()}
                    >
                      {previewUrl ? (
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <>
                          <FaPlus className="text-gray-200 mb-2 group-hover/upload:text-black transition-colors" size={20} />
                          <p className="text-xs text-gray-400 font-bold">Select high-quality work</p>
                        </>
                      )}
                      {previewUrl && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity">
                          <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Image</p>
                        </div>
                      )}
                    </div>
                    <input
                      id="gallery-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2"
                  >
                    {editingId ? "Update Item" : "Publish to Gallery"}
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
