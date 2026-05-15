"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { FaCheck, FaTimes, FaUndo } from "react-icons/fa";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: File) => void;
  onCancel: () => void;
  aspect?: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  fileName: string
): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], fileName, { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
};

export const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCropComplete,
  onCancel,
  aspect = 4 / 5,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleDone = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedFile = await getCroppedImg(
          image,
          croppedAreaPixels,
          "cropped-product.jpg"
        );
        onCropComplete(croppedFile);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0066B2] flex items-center justify-center text-white">
            <FaUndo size={12} />
          </div>
          <div>
            <h3 className="text-white text-sm font-bold tracking-tight">Crop Product Image</h3>
            <p className="text-white/40 text-[9px] uppercase font-black tracking-widest">Adjust framing for perfect display</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-white/40 hover:text-white transition-colors"
        >
          <FaTimes size={18} />
        </button>
      </div>

      {/* Cropper Area */}
      <div className="relative flex-1 bg-[#121212]">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />
      </div>

      {/* Footer Controls */}
      <div className="p-6 md:p-8 border-t border-white/10 z-10 bg-black/50">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/40">
              <span>Zoom</span>
              <span>{(zoom * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#0066B2]"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              className="flex-1 px-6 py-4 rounded-xl bg-[#0066B2] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#005596] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <FaCheck size={10} /> Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
