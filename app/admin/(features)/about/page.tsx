"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useImage } from "@/app/(features)/home/hooks/useImage";
import { useImageAdmin } from "../hooks/useImage";
import { FaUpload, FaSync } from "react-icons/fa";
import { toast } from "react-hot-toast";

const AboutAdminPage = () => {
  const { images, fetchImage, loading: fetchLoading } = useImage("about");
  const { addImage, updateImage, deleteImage, loading, successMessage, error, clearStatus } = useImageAdmin();

  const [slotFiles, setSlotFiles] = useState<{ [key: number]: File | null }>({ 0: null, 1: null });
  const [previews, setPreviews] = useState<{ [key: number]: string | null }>({ 0: null, 1: null });
  const [readyStates, setReadyStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      clearStatus();
      setSlotFiles({ 0: null, 1: null });
      Object.values(previews).forEach(url => { if (url?.startsWith("blob:")) URL.revokeObjectURL(url); });
      setPreviews({ 0: null, 1: null });
    }
  }, [successMessage, clearStatus]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearStatus();
    }
  }, [error, clearStatus]);

  const handleFileChange = (slot: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const old = previews[slot];
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      setSlotFiles(prev => ({ ...prev, [slot]: file }));
      setPreviews(prev => ({ ...prev, [slot]: URL.createObjectURL(file) }));
      setReadyStates(prev => ({ ...prev, [`p-${slot}`]: false }));
    }
  };

  const handleSave = async (slot: number, id?: string) => {
    const file = slotFiles[slot];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("section", "about");
    try {
      if (id) await updateImage(id, formData);
      else await addImage(formData);
      await fetchImage("about");
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete?")) return;
    try {
      await deleteImage(id);
      await fetchImage("about");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 flex items-center justify-between border-b pb-4">
          <h1 className="text-xl font-medium text-black tracking-tight">About Section</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory: {images?.length || 0} / 2</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[0, 1].map((slot) => {
            const img = images?.[slot];
            const preview = previews[slot];
            const file = slotFiles[slot];
            
            return (
              <div key={slot} className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slot {slot + 1}</span>
                  {img && (
                    <button onClick={() => handleDelete(img._id)} className="text-[10px] text-red-500 hover:underline uppercase font-bold tracking-tighter">Remove</button>
                  )}
                </div>
                
                <div 
                  className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer group"
                  onClick={() => document.getElementById(`f-${slot}`)?.click()}
                >
                  {fetchLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center"><FaSync className="animate-spin text-gray-200" /></div>
                  ) : (preview || img?.imageUrl) ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={preview || img!.imageUrl}
                        alt={`Slot ${slot}`}
                        fill
                        className={`object-cover transition-opacity duration-300 ${readyStates[`p-${slot}`] || readyStates[`l-${slot}`] ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setReadyStates(prev => ({ ...prev, [preview ? `p-${slot}` : `l-${slot}`]: true }))}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg text-black transition-all hover:scale-110 active:scale-95">
                         <FaSync size={12} className={loading ? "animate-spin" : ""} />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                       <FaUpload size={16} className="mb-2 opacity-20" />
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Ready</span>
                    </div>
                  )}
                </div>

                <input type="file" id={`f-${slot}`} className="hidden" accept="image/*" onChange={(e) => handleFileChange(slot, e)} />

                {file && (
                  <button
                    onClick={() => handleSave(slot, img?._id)}
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <FaSync className="animate-spin" /> : "Commit Slot"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutAdminPage;
