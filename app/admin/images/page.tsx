"use client";

import React, { useState, useEffect } from "react";
import { useImageAdmin } from "@/src/features/images/hooks/useImageAdmin";
import { Section } from "@/src/features/images/api/imageApi";
import { toast } from "react-hot-toast";


import { ImageHeader } from "@/src/features/images/components/ImageHeader";
import { SectionFilter } from "@/src/features/images/components/SectionFilter";
import { ImageGrid } from "@/src/features/images/components/ImageGrid";
import { ImageFormModal } from "@/src/features/images/components/ImageFormModal";
import { ImageSkeleton } from "@/src/features/images/components/ImageSkeleton";

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

  
  useEffect(() => {
    fetchImage(activeSection);
  }, [activeSection, fetchImage]);

  
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { id: "admin-success" });
      clearStatus();
      refetchImage(activeSection);
      closeForm();
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      toast.error(error, { id: "admin-error" });
      clearStatus();
    }
  }, [error]);

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

  return (
    <div className="min-h-screen bg-white pb-12 md:pb-20 px-3 sm:px-4 md:px-0 text-black font-montserrat">
      <div className="max-w-[1400px] mx-auto">
        <ImageHeader onAddClick={openAddForm} />

        <SectionFilter
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {loading && (images?.length ?? 0) === 0 && (
          <ImageSkeleton activeSection={activeSection} />
        )}

        <ImageGrid
          images={images ?? []}
          activeSection={activeSection}
          loading={loading}
          readyImages={readyImages}
          onReady={(id) => setReadyImages((p) => ({ ...p, [id]: true }))}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddClick={openAddForm}
        />
      </div>

      <ImageFormModal
        isOpen={isFormOpen}
        editingId={editingId}
        loading={loading}
        previewUrl={previewUrl}
        errors={localErrors}
        onClose={closeForm}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ImagesAdminPage;
