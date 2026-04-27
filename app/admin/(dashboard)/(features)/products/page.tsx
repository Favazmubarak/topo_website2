"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useProductAdmin } from "../../hooks/useProductAdmin";
import { FaPlus, FaTrash, FaEdit, FaSync, FaUpload, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";

const ProductAdminPage = () => {
  const { products, fetchProducts, createProduct, updateProduct, deleteProduct, loading, error, successMessage, clearStatus } = useProductAdmin();

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productName: "",
    title: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    setFormData({ productName: "", title: "", description: "" });
    setSelectedFile(null);
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
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("productName", formData.productName);
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (selectedFile) data.append("image", selectedFile);

    if (editingId) {
      await updateProduct(editingId, data);
    } else {
      if (!selectedFile) {
        toast.error("Please select an image");
        return;
      }
      await createProduct(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 px-4 md:px-0 text-black">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-12 flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Products Catalog</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-1">Manage Topo portfolio items</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95"
          >
            <FaPlus size={10} /> Add New
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <div key={product._id} className="group flex flex-col space-y-4">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:shadow-2xl transition-all duration-500">
                <Image src={product.imageUrl} alt={product.productName} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 bg-white/50 lg:bg-transparent p-1 rounded-lg backdrop-blur-sm lg:backdrop-blur-none">
                  <button onClick={() => handleEdit(product)} className="p-2 text-black/40 hover:text-black transition-colors"><FaEdit size={14} /></button>
                  <button onClick={() => handleDelete(product._id)} className="p-2 text-black/40 hover:text-red-500 transition-colors"><FaTrash size={14} /></button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{product.productName}</p>
                <h3 className="text-sm font-bold tracking-tight">{product.title}</h3>
                <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-gray-300 font-medium italic">Empty catalog. Start by adding your first product.</p>
          </div>
        )}

        {/* Empty State */}

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">

            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeForm}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">

              <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between border-b pb-3 sm:pb-4">
                  <h2 className="text-lg sm:text-xl font-medium tracking-tight">
                    {editingId ? "Edit Product" : "New Creation"}
                  </h2>
                  <button
                    onClick={closeForm}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

                  {/* Image Upload Area */}
                  <div
                    className="relative aspect-[3/4] sm:aspect-video rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 overflow-hidden cursor-pointer group"
                    onClick={() => document.getElementById("prod-upload")?.click()}
                  >
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover sm:object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-center px-2">
                        <FaUpload size={18} className="mb-2 opacity-50" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-50">
                          Upload Hero Image
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur px-3 sm:px-4 py-2 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all">
                        Select Image
                      </span>
                    </div>
                  </div>

                  <input
                    type="file"
                    id="prod-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {/* Inputs */}
                  <div className="space-y-3 sm:space-y-4">
                    <input
                      type="text"
                      placeholder="PRODUCT NAME (E.G. TOPO SLIM)"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value.toUpperCase() })}
                      className="w-full bg-gray-50 p-3 sm:p-4 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest focus:ring-2 ring-black"
                      required
                    />

                    <input
                      type="text"
                      placeholder="DISPLAY TITLE"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-gray-50 p-3 sm:p-4 rounded-lg text-sm font-bold tracking-tight focus:ring-2 ring-black"
                      required
                    />

                    <textarea
                      placeholder="PRODUCT DESCRIPTION"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-gray-50 p-3 sm:p-4 rounded-lg text-[10px] sm:text-[11px] leading-relaxed text-gray-500 focus:ring-2 ring-black resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2"
                  >
                    {editingId ? "Commit Updates" : "Publish to Catalog"}
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
