import { FaTimes, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { FieldError } from "./FieldError";

interface FaqFormModalProps {
  isOpen: boolean;
  editingId: string | null;
  formData: { question: string; answer: string };
  errors: Record<string, string>;
  loading: boolean;
  onClose: () => void;
  onChange: (data: { question: string; answer: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClearError?: (field: string) => void;
}

export const FaqFormModal = ({
  isOpen,
  editingId,
  formData,
  errors,
  loading,
  onClose,
  onChange,
  onSubmit,
  onClearError,
}: FaqFormModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-white w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-5 sm:p-6 md:p-8 space-y-5 md:space-y-8">
          <div className="flex items-center justify-between border-b pb-3 md:pb-4">
            <h2 className="text-base md:text-xl font-medium tracking-tight">
              {editingId ? "Edit FAQ" : "New Question"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes size={15} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="Ex: What are your shipping times?"
                  value={formData.question}
                  onChange={(e) => {
                    onChange({ ...formData, question: e.target.value });
                    if (onClearError && errors.question)
                      onClearError("question");
                  }}
                  className={`w-full bg-gray-50 border-none px-3 py-3 md:p-4 rounded-lg text-xs md:text-sm font-bold tracking-tight focus:outline-none focus:ring-2 outline-none transition-all
                    ${errors.question ? "ring-2 ring-red-400 bg-red-50" : "ring-black"}`}
                />
                <FieldError msg={errors.question} />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Answer
                </label>
                <textarea
                  placeholder="Provide a clear and concise answer..."
                  rows={5}
                  value={formData.answer}
                  onChange={(e) => {
                    onChange({ ...formData, answer: e.target.value });
                    if (onClearError && errors.answer) onClearError("answer");
                  }}
                  className={`w-full bg-gray-50 border-none px-3 py-3 md:p-4 rounded-lg text-[10px] md:text-xs leading-relaxed text-gray-500 focus:outline-none focus:ring-2 resize-none outline-none transition-all
                    ${errors.answer ? "ring-2 ring-red-400 bg-red-50" : "ring-black"}`}
                />
                <FieldError msg={errors.answer} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <FaSpinner size={12} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <FaCheckCircle size={12} />{" "}
                  {editingId ? "Update FAQ" : "Save FAQ"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
