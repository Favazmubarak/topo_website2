"use client";

import React, { useState, useEffect } from "react";
import { useFaqAdmin } from "../../hooks/useFaqAdmin";
import { FaPlus, FaTrash, FaEdit, FaSync, FaTimes, FaQuestionCircle, FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

const FaqAdminPage = () => {
  const { faqs, fetchFAQs, createFAQ, updateFAQ, deleteFAQ, loading, error, successMessage, clearStatus } = useFaqAdmin();

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

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
    setFormData({ question: "", answer: "" });
  };

  const handleEdit = (faq: any) => {
    setEditingId(faq._id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

        {/* Header */}
        <div className="mb-6 md:mb-12 flex items-center justify-between border-b pb-4 md:pb-6">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight">Frequently Asked Questions</h1>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400 mt-0.5">Manage site-wide help and support</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 bg-black text-white px-3 sm:px-5 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <FaPlus size={8} /> <span className="hidden sm:inline">Add New</span><span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq) => (
            <div key={faq._id} className="group bg-gray-50/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between gap-3 md:gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                    <FaQuestionCircle className="text-gray-300 shrink-0" size={12} />
                    <h3 className="text-xs md:text-sm font-bold tracking-tight text-black">{faq.question}</h3>
                  </div>
                  <p className="text-[10px] md:text-[11px] leading-relaxed text-gray-500 font-medium pl-5 md:pl-6">{faq.answer}</p>
                </div>
                <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 bg-white/80 lg:bg-transparent p-1 rounded-lg backdrop-blur-sm lg:backdrop-blur-none">
                  <button onClick={() => handleEdit(faq)} className="p-1.5 md:p-2 text-gray-400 hover:text-black transition-colors"><FaEdit size={11} /></button>
                  <button onClick={() => handleDelete(faq._id)} className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 transition-colors"><FaTrash size={11} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {faqs.length === 0 && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-gray-300 font-medium italic">No FAQs yet. Start by adding your first question.</p>
          </div>
        )}

        {/* Empty State */}

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeForm} />
            <div className="relative bg-white w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-5 sm:p-6 md:p-8 space-y-5 md:space-y-8">
                <div className="flex items-center justify-between border-b pb-3 md:pb-4">
                  <h2 className="text-base md:text-xl font-medium tracking-tight">
                    {editingId ? "Edit FAQ" : "New Question"}
                  </h2>
                  <button onClick={closeForm} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"><FaTimes size={15} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Question</label>
                      <input
                        type="text"
                        placeholder="Ex: What are your shipping times?"
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        className="w-full bg-gray-50 border-none px-3 py-3 md:p-4 rounded-lg text-xs md:text-sm font-bold tracking-tight focus:ring-2 ring-black outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Answer</label>
                      <textarea
                        placeholder="Provide a clear and concise answer..."
                        rows={5}
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        className="w-full bg-gray-50 border-none px-3 py-3 md:p-4 rounded-lg text-[10px] md:text-xs leading-relaxed text-gray-500 focus:ring-2 ring-black resize-none outline-none"
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

export default FaqAdminPage;
