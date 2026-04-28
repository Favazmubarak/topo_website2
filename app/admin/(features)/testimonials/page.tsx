"use client"

import React, { useState, useEffect } from "react";
import { useTestimonialAdmin } from "./hooks/useTestimonialAdmin";
import { toast } from "react-hot-toast";

// Components
import { TestimonialHeader } from "./components/TestimonialHeader";
import { TestimonialGrid } from "./components/TestimonialGrid";
import { TestimonialFormModal } from "./components/TestimonialFormModal";
import { TestimonialSkeleton } from "./components/TestimonialSkeleton";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

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
        <TestimonialHeader onAddClick={() => setIsFormOpen(true)} />

        {loading && testimonials.length === 0 && <TestimonialSkeleton />}

        <TestimonialGrid
          testimonials={testimonials}
          readyImages={readyImages}
          onImageLoad={(id) => setReadyImages((prev) => ({ ...prev, [id]: true }))}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <TestimonialFormModal
        isOpen={isFormOpen}
        editingId={editingId}
        formData={formData}
        errors={errors}
        loading={loading}
        previewUrl={previewUrl}
        previewReady={previewReady}
        onClose={closeForm}
        onFileChange={handleFileChange}
        onFormDataChange={(data) => {
          setFormData({ ...formData, ...data });
          if (data.name && localErrors.name) setLocalErrors(p => { const { name, ...r } = p; return r; });
          if (data.review && localErrors.review) setLocalErrors(p => { const { review, ...r } = p; return r; });
        }}
        onSubmit={handleSubmit}
        onPreviewLoad={() => setPreviewReady(true)}
        fieldErrors={fieldErrors}
      />
    </div>
  );
};

export default TestimonialsAdminPage;
