import Image from "next/image";
import { FaTimes, FaPlus, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { Section } from "../api/imageApi";
import { FieldError } from "./FieldError";

interface ImageFormModalProps {
  isOpen: boolean;
  editingId: string | null;
  loading: boolean;
  previewUrl: string | null;
  errors: Record<string, string>;
  onClose: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ImageFormModal = ({
  isOpen,
  editingId,
  loading,
  previewUrl,
  errors,
  onClose,
  onFileChange,
  onSubmit,
}: ImageFormModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-5 sm:p-6 md:p-8 space-y-5 md:space-y-7">
          <div className="flex items-center justify-between border-b pb-3 md:pb-4">
            <h2 className="text-base md:text-xl font-medium tracking-tight">
              {editingId ? "Update Image" : "Add Section Image"}
            </h2>
            <button onClick={onClose} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FaTimes size={15} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5 md:space-y-6">
            <div className="space-y-1.5">
              <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Image{editingId ? " (leave blank to keep current)" : ""}
              </label>
              <div
                className={`relative aspect-video rounded-lg md:rounded-xl bg-gray-50 border-2 border-dashed overflow-hidden flex flex-col items-center justify-center group/upload hover:border-black/20 transition-colors cursor-pointer ${
                  errors.image ? "border-red-300 bg-red-50" : "border-gray-100"
                }`}
                onClick={() => document.getElementById("images-file-input")?.click()}
              >
                {previewUrl ? (
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <>
                    <FaPlus className="text-gray-200 mb-2 group-hover/upload:text-black transition-colors" size={18} />
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold">Click to select image</p>
                    <p className="text-[8px] text-gray-300 mt-0.5">jpeg, png, webp — auto-compressed</p>
                  </>
                )}
                {previewUrl && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                      Change Image
                    </p>
                  </div>
                )}
              </div>
              <input
                id="images-file-input"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
              <FieldError msg={errors.image} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><FaSpinner size={12} className="animate-spin" /> Uploading…</>
              ) : (
                <><FaCheckCircle size={12} /> {editingId ? "Update Image" : "Save Image"}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
