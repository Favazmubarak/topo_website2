import Image from "next/image";
import { FaTimes, FaExclamationCircle, FaUpload, FaSync, FaStar, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { FieldError } from "./FieldError";

interface TestimonialFormModalProps {
  isOpen: boolean;
  editingId: string | null;
  formData: { name: string; rating: number; review: string };
  errors: Record<string, string>;
  loading: boolean;
  previewUrl: string | null;
  previewReady: boolean;
  onClose: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormDataChange: (data: Partial<{ name: string; rating: number; review: string }>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPreviewLoad: () => void;
  fieldErrors: Record<string, string>;
}

export const TestimonialFormModal = ({
  isOpen,
  editingId,
  formData,
  errors,
  loading,
  previewUrl,
  previewReady,
  onClose,
  onFileChange,
  onFormDataChange,
  onSubmit,
  onPreviewLoad,
  fieldErrors,
}: TestimonialFormModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-5 sm:p-6 md:p-8 space-y-5 md:space-y-6">
          <div className="flex items-center justify-between border-b pb-3 md:pb-4">
            <h2 className="text-base md:text-xl font-medium tracking-tight">
              {editingId ? "Edit Feedback" : "Add Testimonial"}
            </h2>
            <button onClick={onClose} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FaTimes size={15} />
            </button>
          </div>

          {fieldErrors.general && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-red-600 text-[10px] font-semibold">
              <FaExclamationCircle className="mt-0.5 shrink-0" size={11} />
              {fieldErrors.general}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="flex flex-col items-center">
              <div
                className={`relative w-24 h-24 rounded-full bg-gray-50 border overflow-hidden cursor-pointer group mb-1
                  ${errors.avatar ? "border-red-300 ring-2 ring-red-300" : "border-gray-100"}`}
                onClick={() => document.getElementById("avatar-upload")?.click()}
              >
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className={`object-cover transition-opacity duration-500 ${previewReady ? "opacity-100" : "opacity-0"}`}
                    onLoad={onPreviewLoad}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <FaUpload size={20} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <FaSync size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Profile Image</span>
              <FieldError msg={errors.avatar} />
              <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={onFileChange} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">
                  Client Name
                  <span className={`float-right font-bold ${formData.name.length > 45 ? "text-red-500" : "text-gray-300"}`}>
                    {formData.name.length}/50
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => onFormDataChange({ name: e.target.value })}
                  className={`w-full bg-gray-50 p-4 rounded-lg text-sm font-bold tracking-tight focus:outline-none focus:ring-2 transition-all
                    ${errors.name ? "ring-2 ring-red-400 bg-red-50" : "ring-black"}`}
                />
                <FieldError msg={errors.name} />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Rating</label>
                <div className={`flex gap-2 bg-gray-50 p-4 rounded-lg ${errors.rating ? "ring-2 ring-red-400 bg-red-50" : ""}`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onFormDataChange({ rating: star })}
                      className={`transition-all ${star <= formData.rating ? "text-yellow-400 scale-110" : "text-gray-200"}`}
                    >
                      <FaStar size={16} />
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.rating} />
              </div>

              <div>
                <div className="flex justify-between items-end ml-1 mb-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Review Statement</label>
                  <span className={`text-[9px] font-bold ${formData.review.length > 280 ? "text-red-500" : "text-gray-300"}`}>
                    {formData.review.length}/300
                  </span>
                </div>
                <textarea
                  placeholder="Ex: The quality of their aluminum windows is unmatched..."
                  rows={4}
                  maxLength={300}
                  value={formData.review}
                  onChange={(e) => onFormDataChange({ review: e.target.value })}
                  className={`w-full bg-gray-50 p-4 rounded-lg text-xs leading-relaxed text-gray-500 focus:outline-none focus:ring-2 resize-none italic transition-all
                    ${errors.review ? "ring-2 ring-red-400 bg-red-50" : "ring-black"}`}
                />
                <FieldError msg={errors.review} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading
                ? <><FaSpinner size={12} className="animate-spin" /> Saving…</>
                : <><FaCheckCircle size={12} /> {editingId ? "Update Testimonial" : "Save Testimonial"}</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
