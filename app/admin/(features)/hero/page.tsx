"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useImage } from "@/app/(features)/home/hooks/useImage";
import { useImageAdmin } from "../hooks/useImage";
import { FaUpload, FaSync, FaImage, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const HeroAdminPage = () => {
  // ✅ Hooks from stores
  const { images,fetchImage, loading: fetchLoading, error: fetchError } = useImage("hero");
  const { addImage, updateImage, deleteImage, loading, error, successMessage, clearStatus } = useImageAdmin();

  // ✅ Local component state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageReady, setCurrentImageReady] = useState(false);
  const [previewImageReady, setPreviewImageReady] = useState(false);

  const currentImage = images?.[0] ?? null;

  // ✅ Initialize AOS on mount only
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: false,
    });
  }, []);

  // ✅ Refresh AOS when images change
  useEffect(() => {
    AOS.refresh();
  }, [currentImage?.imageUrl, previewUrl]);

  // ✅ Reset preview ready state when URL changes
  useEffect(() => {
    setCurrentImageReady(false);
  }, [currentImage?.imageUrl]);

  useEffect(() => {
    setPreviewImageReady(false);
  }, [previewUrl]);

  // ✅ Handle success/error messages from store
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

  // ✅ Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }

      // ✅ Revoke old preview URL to prevent memory leak
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("section", "hero");

    try {
      if (currentImage) {
        await updateImage(currentImage._id, formData);
      } else {
        await addImage(formData);
      }

      await fetchImage("hero")
    } catch (err) {
      // Error is already handled in useEffect above
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async () => {
    if (!currentImage) return;
    if (!window.confirm("Are you sure you want to delete the hero image?")) return;

    try {
      await deleteImage(currentImage._id);
      fetchImage("hero")
    } catch (err) {
      // Error is already handled in useEffect above
      console.error("Delete error:", err);
    }
  };

  const containerClassName = "relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center";

  return (
    <div className="min-h-[80vh] bg-white pt-40 sm:pt-32 md:pt-40 lg:pt-40 xl:pt-52 pb-16 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-8 pb-4 border-b">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaImage className="text-blue-600" />
            Hero Section Management
          </h1>
          <p className="text-gray-500 mt-1">Manage the hero section background image with real-time updates.</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">

          {/* Left: Current Image */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Current Production Hero</h2>
              <div className="flex items-center gap-2">
                {currentImage && (
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    title="Delete image"
                    aria-label="Delete hero image"
                  >
                    <FaTrash />
                  </button>
                )}
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Live Site
                </span>
              </div>
            </div>

            <div className={containerClassName}>
              {fetchLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <FaSync className="animate-spin text-2xl text-blue-500" />
                  <span className="text-xs text-gray-400">Refreshing...</span>
                </div>
              ) : currentImage ? (
                <div key={currentImage._id} className="relative w-full h-full">
                  <Image
                    src={currentImage.imageUrl}
                    alt="Current hero image"
                    fill
                    className={`object-cover transition-opacity duration-1000 ${currentImageReady ? "opacity-100" : "opacity-0"
                      }`}
                    onLoad={() => setCurrentImageReady(true)}
                    
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <FaImage className="text-4xl mb-2 opacity-20" />
                  <p className="text-sm">No hero image active</p>
                </div>
              )}
            </div>

            {fetchError && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded border border-red-200">
                {fetchError}
              </div>
            )}
          </div>

          {/* Right: Upload Form */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {currentImage ? "Update Hero Visual" : "Upload New Visual"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Preview Container */}
              <div className={containerClassName}>
                {previewUrl ? (
                  <div key={previewUrl} className="relative w-full h-full">
                    <Image
                      src={previewUrl}
                      alt="Image preview"
                      fill
                      className={`object-cover transition-opacity duration-700 ${previewImageReady ? "opacity-100" : "opacity-0"
                        }`}
                      onLoad={() => setPreviewImageReady(true)}
                    />

                    {/* Replace Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/20 transition-all cursor-pointer flex items-center justify-center ${previewImageReady ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                      onClick={() => document.getElementById("hero-upload")?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          document.getElementById("hero-upload")?.click();
                        }
                      }}
                    >
                      <span className="bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded text-xs font-bold shadow-lg">
                        Replace
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center text-center cursor-pointer w-full h-full hover:bg-gray-100/50 transition-colors"
                    onClick={() => document.getElementById("hero-upload")?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        document.getElementById("hero-upload")?.click();
                      }
                    }}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <FaUpload className="text-xl text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Select Hero Image</p>
                    <p className="text-xs text-gray-400 mt-1">Click to browse files</p>
                  </div>
                )}
              </div>

              {/* Hidden Input */}
              <input
                type="file"
                id="hero-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload hero image"
              />

              {/* Submit Section */}
              <div className="space-y-3">
                <div className="h-14">
                  <button
                    type="submit"
                    disabled={!selectedFile || loading}
                    className={`w-full h-full rounded-lg font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 ${!selectedFile || loading
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.99] shadow-blue-100"
                      }`}
                  >
                    {loading ? (
                      <FaSync className="animate-spin text-lg" />
                    ) : (
                      <>
                        <FaSync className={selectedFile ? "animate-pulse" : ""} />
                        {currentImage ? "Update Hero Visual" : "Upload Hero Visual"}
                      </>
                    )}
                  </button>
                </div>

                <div className="h-6 flex items-center justify-center">
                  {selectedFile && (
                    <p className="text-xs text-gray-500 italic truncate max-w-full px-4">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-gray-400 text-xs flex justify-between items-center h-10">
          <p>Hero Section ID: {currentImage?._id || "None"}</p>
          <p>Preferred: 1920x1080px (16:9)</p>
        </div>
      </div>
    </div>
  );
};

export default HeroAdminPage;