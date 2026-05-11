"use client";

import React, { useState, useEffect } from "react";
import { useFaqAdmin } from "@/src/features/faq/hooks/useFaqAdmin";
import { toast } from "react-hot-toast";


import { FaqHeader } from "@/src/features/faq/components/FaqHeader";
import { FaqList } from "@/src/features/faq/components/FaqList";
import { FaqFormModal } from "@/src/features/faq/components/FaqFormModal";
import { FaqSkeleton } from "@/src/features/faq/components/FaqSkeleton";

const FaqAdminPage = () => {
  const { faqs, fetchFAQs, createFAQ, updateFAQ, deleteFAQ, loading, error, fieldErrors, successMessage, clearStatus } = useFaqAdmin();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const errors = { ...localErrors, ...fieldErrors };

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

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
    setFormData({ question: "", answer: "" });
    setLocalErrors({});
    clearStatus();
  };

  const handleEdit = (faq: any) => {
    setEditingId(faq._id);
    setFormData({ question: faq.question, answer: faq.answer });
    setLocalErrors({});
    clearStatus();
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formData.question.trim()) errs.question = "Question is required";
    else if (formData.question.trim().length < 8) errs.question = "Question must be at least 8 characters";
    if (!formData.answer.trim()) errs.answer = "Answer is required";
    else if (formData.answer.trim().length < 3) errs.answer = "Answer must be at least 3 characters";

    if (Object.keys(errs).length > 0) {
      setLocalErrors(errs);
      toast.error("Please fix the errors below before saving");
      return;
    }
    setLocalErrors({});
    if (editingId) {
      await updateFAQ(editingId, formData);
    } else {
      await createFAQ(formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this FAQ?")) {
      await deleteFAQ(id);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-12 md:pb-20 px-3 sm:px-4 md:px-0 text-black font-montserrat">
      <div className="max-w-[1400px] mx-auto">
        <FaqHeader onAddClick={() => setIsFormOpen(true)} />

        {loading && faqs.length === 0 && <FaqSkeleton />}

        {!loading && faqs.length > 0 && (
          <FaqList faqs={faqs} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {faqs.length === 0 && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-gray-300 font-medium italic">No FAQs yet. Start by adding your first question.</p>
          </div>
        )}

        <FaqFormModal
          isOpen={isFormOpen}
          editingId={editingId}
          formData={formData}
          errors={errors}
          loading={loading}
          onClose={closeForm}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onClearError={(field) => setLocalErrors(p => { const { [field]: _, ...r } = p; return r; })}
        />
      </div>
    </div>
  );
};

export default FaqAdminPage;
