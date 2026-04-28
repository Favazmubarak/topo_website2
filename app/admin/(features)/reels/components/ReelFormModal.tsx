import React, { useState, useEffect } from "react";
import { FaTimes, FaSpinner, FaCloudUploadAlt } from "react-icons/fa";
import { FieldError } from "./FieldError";

interface ReelFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    editingId: string | null;
    formData: { thumbnail: File | null; thumbnailPreview?: string; link: string };
    setFormData: (data: any) => void;
    loading: boolean;
    fieldErrors: Partial<Record<"thumbnail" | "link" | "general", string>>;
}

export const ReelFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    editingId,
    formData,
    setFormData,
    loading,
    fieldErrors,
}: ReelFormModalProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(formData.thumbnailPreview || null);

    useEffect(() => {
        if (formData.thumbnailPreview) {
            setPreviewUrl(formData.thumbnailPreview);
        } else {
            setPreviewUrl(null);
        }
    }, [formData.thumbnailPreview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, thumbnail: file });
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
                <div className="p-5 sm:p-6 md:p-8 space-y-5 md:space-y-6">
                    {/* Modal header */}
                    <div className="flex items-center justify-between border-b pb-3 md:pb-4">
                        <h2 className="text-base md:text-lg font-medium tracking-tight text-black">
                            {editingId ? "Edit Reel" : "Add New Reel"}
                        </h2>
                        <button onClick={onClose} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors text-black">
                            <FaTimes size={15} />
                        </button>
                    </div>

                    {/* General Error Banner */}
                    {fieldErrors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] md:text-[11px] rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 leading-relaxed">
                            {fieldErrors.general}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* Thumbnail Upload */}
                        <div className="space-y-1">
                            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Reel Thumbnail</label>
                            <div className="relative group">
                                <div 
                                    className={`relative w-full h-40 md:h-48 rounded-lg md:rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-gray-50 ${
                                        fieldErrors.thumbnail ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-black"
                                    }`}
                                >
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <FaCloudUploadAlt className="text-white text-3xl" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <FaCloudUploadAlt size={30} className="mb-2" />
                                            <span className="text-[10px] md:text-xs">UPLODAD THUMBNAIL</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        required={!editingId}
                                    />
                                </div>
                            </div>
                            <FieldError msg={fieldErrors.thumbnail} />
                        </div>

                        {/* Link */}
                        <div className="space-y-1">
                            <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Video Link</label>
                            <input
                                type="url"
                                placeholder="https://instagram.com/reel/..."
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                className={`w-full bg-gray-50 px-3 py-3 md:p-4 rounded-lg md:rounded-xl text-[11px] md:text-xs font-medium focus:ring-2 outline-none transition-all text-black ${
                                    fieldErrors.link ? "ring-2 ring-red-400 bg-red-50" : "ring-black"
                                }`}
                                required
                            />
                            <FieldError msg={fieldErrors.link} />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 md:py-4 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner size={11} className="animate-spin" /> Processing…
                                </>
                            ) : (
                                editingId ? "Update" : "Save"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
