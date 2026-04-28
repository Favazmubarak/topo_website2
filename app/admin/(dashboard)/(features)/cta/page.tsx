"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useImage } from "@/app/(main)/(features)/home/hooks/useImage";
import { useImageAdmin } from "../../hooks/useImageAdmin";
import { FaUpload, FaSync } from "react-icons/fa";
import { toast } from "react-hot-toast";

const CTAAdminPage = () => {
  const { images, fetchImage, loading: fetchLoading } = useImage("cta");
  const { addImage, updateImage, deleteImage, loading, successMessage, error, clearStatus } = useImageAdmin();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageReady, setImageReady] = useState(false);

  const currentImage = images?.[0] ?? null;

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      clearStatus();
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [successMessage, clearStatus]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearStatus();
    }
  }, [error, clearStatus]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageReady(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("section", "cta");
    try {
      if (currentImage) await updateImage(currentImage._id, formData);
      else await addImage(formData);
      await fetchImage("cta");
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!currentImage || !window.confirm("Delete image?")) return;
    try {
      await deleteImage(currentImage._id);
      await fetchImage("cta");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-white pb-12 md:pb-20 px-3 sm:px-4 md:px-0">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6 md:mb-10 flex items-center justify-between border-b pb-3 md:pb-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-black tracking-tight">CTA Section</h1>
          {currentImage && (
            <button onClick={handleDelete} className="text-[9px] md:text-xs text-red-500 hover:underline">Delete Current</button>
          )}
        </div>

        <div className="space-y-8">
          <div
            className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer group"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            {fetchLoading ? (
              <div className="absolute inset-0 flex items-center justify-center"><FaSync className="animate-spin text-gray-200" /></div>
            ) : (previewUrl || currentImage?.imageUrl) ? (
              <div className="relative w-full h-full">
                <Image
                  src={previewUrl || currentImage!.imageUrl}
                  alt="CTA"
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageReady ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setImageReady(true)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg text-black transition-all hover:scale-110 active:scale-95">
                  <FaSync size={14} className={loading ? "animate-spin" : ""} />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <FaUpload size={20} className="mb-3 opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Ready for Upload</span>
              </div>
            )}
          </div>

          <input type="file" id="file-input" className="hidden" accept="image/*" onChange={handleFileChange} />

          {selectedFile && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-black text-white py-3 md:py-4 rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <FaSync className="animate-spin" /> : "Save"}
            </button>
          )}
        </div>

        {!selectedFile && currentImage && (
          <p className="text-[9px] text-gray-300 mt-8 text-center font-mono opacity-50">NODE: {currentImage._id}</p>
        )}
      </div>
    </div>
  );
};

export default CTAAdminPage;
