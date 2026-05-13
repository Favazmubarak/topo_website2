"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useProductAdmin } from "@/src/features/products/hooks/useProductAdmin";
import { FaPlus, FaTrash, FaEdit, FaUpload, FaTimes, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/src/components/common/Skeleton";

// Smart compression — maintains quality, just reduces file size
const compressImage = (file: File, maxSizeMB: number = 3): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Only resize if larger than 2560px — preserves quality for normal images
        const maxDimension = 2560;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height / width) * maxDimension);
            width = maxDimension;
          } else {
            width = Math.round((width / height) * maxDimension);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        // Start at high quality 0.92 and reduce gradually — minimal quality loss
        let quality = 0.92;
        const maxBytes = maxSizeMB * 1024 * 1024;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              if (blob.size > maxBytes && quality > 0.5) {
                quality = Math.max(quality - 0.05, 0.5);
                tryCompress();
              } else {
                const compressed = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                const originalMB = (file.size / 1024 / 1024).toFixed(1);
                const compressedMB = (compressed.size / 1024 / 1024).toFixed(1);
                if (file.size !== compressed.size) {
                  toast.success(`Image optimized: ${originalMB}MB → ${compressedMB}MB`, { duration: 3000 });
                }
                resolve(compressed);
              }
            },
            "image/jpeg",
            quality
          );
        };
        tryCompress();
      };
    };
  });
};

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="flex items-center gap-1 text-[9px] text-red-500 font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
      <FaExclamationCircle size={8} />
      {msg}
    </p>
  ) : null;

const validate = (
  formData: { productName: string; title: string; description: string },
  isCreate: boolean,
  hasFile: boolean
) => {
  const errs: Record<string, string> = {};
  if (!formData.productName.trim()) {
    errs.productName = "Product name is required";
  } else if (formData.productName.trim().length < 2) {
    errs.productName = "Product name must be at least 2 characters";
  } else if (formData.productName.trim().length > 60) {
    errs.productName = "Product name must be 60 characters or less";
  } else if (!/^[a-zA-Z0-9\s\-]+$/.test(formData.productName)) {
    errs.productName = "Only letters, numbers, spaces and hyphens allowed";
  }
  if (!formData.title.trim()) {
    errs.title = "Title is required";
  } else if (formData.title.trim().length < 3) {
    errs.title = "Title must be at least 3 characters";
  } else if (formData.title.trim().length > 100) {
    errs.title = "Title must be 100 characters or less";
  }
  if (!formData.description.trim()) {
    errs.description = "Description is required";
  } else if (formData.description.trim().length < 10) {
    errs.description = "Description must be at least 10 characters";
  } else if (formData.description.trim().length > 200) {
    errs.description = "Description must be 200 characters or less";
  }
  if (isCreate && !hasFile) {
    errs.image = "A product image is required";
  }
  return errs;
};

const ProductAdminPage = () => {
  const {
    products, fetchProducts, createProduct, updateProduct, deleteProduct,
    loading, error, fieldErrors, successMessage, clearStatus, currentPage, totalPages
  } = useProductAdmin();

  const handlePageChange = (page: number) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ productName: "", title: "", description: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [readyImages, setReadyImages] = useState<Record<string, boolean>>({});
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [isCompressing, setIsCompressing] = useState(false);

  const errors = { ...localErrors, ...fieldErrors };

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { id: "admin-success" });
      clearStatus();
      closeForm();
    }
  }, [successMessage]);

  useEffect(() => {
    if (error && Object.keys(fieldErrors).length === 0) {
      toast.error(error, { id: "admin-error" });
      clearStatus();
    }
  }, [error]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ productName: "", title: "", description: "" });
    setSelectedFile(null);
    setLocalErrors({});
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleEdit = (product: any) => {
    setEditingId(product._id);
    setFormData({
      productName: product.productName,
      title: product.title,
      description: product.description,
    });
    setPreviewUrl(product.imageUrl);
    setLocalErrors({});
    clearStatus();
    setIsFormOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLocalErrors((prev) => ({ ...prev, image: "Please upload a valid image file (jpeg, jpg, png, webp)" }));
      return;
    }

    // Hard limit — 20MB raw before compression
    if (file.size > 20 * 1024 * 1024) {
      setLocalErrors((prev) => ({ ...prev, image: "Image too large. Maximum 20MB allowed." }));
      return;
    }

    setLocalErrors((prev) => { const { image, ...rest } = prev; return rest; });

    // Show preview immediately
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewReady(false);

    // Compress if over 3MB
    if (file.size > 3 * 1024 * 1024) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file, 3);
        setSelectedFile(compressed);
      } catch {
        setSelectedFile(file);
      } finally {
        setIsCompressing(false);
      }
    } else {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCompressing) {
      toast.error("Please wait, image is being optimized...");
      return;
    }

    const clientErrs = validate(formData, !editingId, !!selectedFile);
    if (Object.keys(clientErrs).length > 0) {
      setLocalErrors(clientErrs);
      toast.error("Please fix the errors below before saving");
      return;
    }

    setLocalErrors({});
    const data = new FormData();
    data.append("productName", formData.productName.trim().toUpperCase());
    data.append("title", formData.title.trim());
    data.append("description", formData.description.trim());
    if (selectedFile) data.append("image", selectedFile);

    if (editingId) {
      await updateProduct(editingId, data);
    } else {
      await createProduct(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  const charCount = (val: string, max: number) => (
    <span className={`text-[8px] float-right ${val.length > max ? "text-red-500" : "text-gray-300"}`}>
      {val.length}/{max}
    </span>
  );

  return (
    <div className="flex-1 flex flex-col bg-white px-3 sm:px-4 md:px-0 text-black font-montserrat">
      <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col">
        <div className="flex-1">
          <div className="mb-6 md:mb-12 flex items-center justify-between border-b pb-4 md:pb-6">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight">Products Catalog</h1>
              <p className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-black tracking-widest text-gray-400 mt-0.5">
                Manage Topo portfolio items
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-1.5 bg-black text-white px-3 sm:px-5 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              <FaPlus size={8} /> <span className="hidden sm:inline">Add New</span><span className="sm:hidden">Add</span>
            </button>
          </div>

          {loading && products.length === 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <Skeleton className="aspect-[4/5] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-2 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <div key={product._id} className="group flex flex-col space-y-4">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-gray-100 group-hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={product.imageUrl}
                    alt={product.productName}
                    fill
                    className={`object-cover group-hover:scale-105 transition-all duration-700 ${readyImages[product._id] ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setReadyImages(prev => ({ ...prev, [product._id]: true }))}
                  />
                  {!readyImages[product._id] && <Skeleton className="absolute inset-0 rounded-none" />}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 bg-white/50 lg:bg-transparent p-1 rounded-lg backdrop-blur-sm lg:backdrop-blur-none">
                    <button onClick={() => handleEdit(product)} className="p-2 text-black/40 hover:text-black transition-colors"><FaEdit size={14} /></button>
                    <button onClick={() => handleDelete(product._id)} className="p-2 text-black/40 hover:text-red-500 transition-colors"><FaTrash size={14} /></button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 break-words whitespace-normal">{product.productName}</p>
                  <h3 className="text-sm font-bold tracking-tight break-words whitespace-normal">{product.title}</h3>
                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed break-words whitespace-normal">{product.description}</p>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-16 md:py-20 border-2 border-dashed border-gray-100 rounded-xl md:rounded-2xl">
              <p className="text-sm text-gray-300 font-medium italic">Empty catalog. Start by adding your first product.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-auto py-12 flex justify-center items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-full border border-gray-200 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)} className={`w-8 h-8 rounded-full text-[10px] font-black transition-all ${currentPage === page ? "bg-black text-white" : "text-gray-400 hover:bg-gray-50"}`}>{page}</button>
              ))}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-full border border-gray-200 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeForm} />
            <div className="relative bg-white w-full max-w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                <div className="flex items-center justify-between border-b pb-3 sm:pb-4">
                  <h2 className="text-lg sm:text-xl font-medium tracking-tight">{editingId ? "Edit Product" : "New Creation"}</h2>
                  <button onClick={closeForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaTimes /></button>
                </div>

                {fieldErrors.general && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-red-600 text-[10px] font-semibold">
                    <FaExclamationCircle className="mt-0.5 shrink-0" size={11} />
                    {fieldErrors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
                  <div>
                    <div
                      className={`relative aspect-[4/5] rounded-lg sm:rounded-xl bg-gray-100 border overflow-hidden cursor-pointer group ${errors.image ? "border-red-300 ring-1 ring-red-300" : "border-gray-100"}`}
                      onClick={() => !isCompressing && document.getElementById("prod-upload")?.click()}
                    >
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className={`object-contain transition-opacity duration-500 ${previewReady ? "opacity-100" : "opacity-0"}`}
                          onLoad={() => setPreviewReady(true)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-center px-2">
                          <FaUpload size={18} className="mb-2 opacity-50" />
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-50">Upload Product Image</span>
                          <span className="text-[8px] text-gray-300 mt-1">Max 20MB — auto optimized before upload</span>
                        </div>
                      )}

                      {/* Compression overlay */}
                      {isCompressing && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                          <FaSpinner size={20} className="text-white animate-spin" />
                          <span className="text-white text-[10px] font-black uppercase tracking-widest">Optimizing image...</span>
                        </div>
                      )}

                      {!isCompressing && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur px-3 sm:px-4 py-2 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all">
                            Select Image
                          </span>
                        </div>
                      )}
                    </div>
                    <FieldError msg={errors.image} />
                  </div>

                  <input type="file" id="prod-upload" className="hidden" accept="image/*" onChange={handleFileChange} />

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Product Name {charCount(formData.productName, 60)}</label>
                      <input
                        type="text"
                        placeholder="E.G. TOPO SLIM"
                        value={formData.productName}
                        onChange={(e) => { setFormData({ ...formData, productName: e.target.value.toUpperCase() }); if (localErrors.productName) setLocalErrors(p => { const { productName, ...r } = p; return r; }); }}
                        className={`w-full bg-gray-50 p-3 sm:p-4 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 transition-all ${errors.productName ? "ring-2 ring-red-400 bg-red-50" : "ring-black"}`}
                      />
                      <FieldError msg={errors.productName} />
                    </div>
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Display Title {charCount(formData.title, 100)}</label>
                      <input
                        type="text"
                        placeholder="E.G. Topo Slim Trail Runner"
                        value={formData.title}
                        onChange={(e) => { setFormData({ ...formData, title: e.target.value }); if (localErrors.title) setLocalErrors(p => { const { title, ...r } = p; return r; }); }}
                        className={`w-full bg-gray-50 p-3 sm:p-4 rounded-lg text-sm font-bold tracking-tight focus:outline-none focus:ring-2 transition-all ${errors.title ? "ring-2 ring-red-400 bg-red-50" : "ring-black"}`}
                      />
                      <FieldError msg={errors.title} />
                    </div>
                    <div>
                      <label className="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Description {charCount(formData.description, 200)}</label>
                      <textarea
                        placeholder="Brief product description…"
                        rows={4}
                        maxLength={200}
                        value={formData.description}
                        onChange={(e) => { setFormData({ ...formData, description: e.target.value }); if (localErrors.description) setLocalErrors(p => { const { description, ...r } = p; return r; }); }}
                        className={`w-full bg-gray-50 p-3 sm:p-4 rounded-lg text-[10px] sm:text-[11px] leading-relaxed text-gray-500 focus:outline-none focus:ring-2 resize-none transition-all ${errors.description ? "ring-2 ring-red-400 bg-red-50" : "ring-black"}`}
                      />
                      <FieldError msg={errors.description} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isCompressing}
                    className="w-full bg-black text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isCompressing
                      ? <><FaSpinner size={12} className="animate-spin" /> Optimizing image…</>
                      : loading
                      ? <><FaSpinner size={12} className="animate-spin" /> Saving…</>
                      : <><FaCheckCircle size={12} /> {editingId ? "Update Product" : "Save Product"}</>
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

export default ProductAdminPage;