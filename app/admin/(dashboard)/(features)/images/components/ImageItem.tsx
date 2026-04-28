import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Section } from "../api/imageApi";

interface ImageItemProps {
  img: { _id: string; imageUrl: string; section: string };
  aspectClass: string;
  isReady: boolean;
  onReady: (id: string) => void;
  onEdit: (img: any) => void;
  onDelete: (id: string) => void;
}

export const ImageItem = ({
  img,
  aspectClass,
  isReady,
  onReady,
  onEdit,
  onDelete,
}: ImageItemProps) => (
  <div
    className={`group relative ${aspectClass} w-full rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500`}
  >
    <Image
      src={img.imageUrl}
      alt={`${img.section} image`}
      fill
      className={`object-cover transition-all duration-700 group-hover:scale-105 ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
      onLoad={() => onReady(img._id)}
    />
    <div className="absolute top-3 left-3 z-10 pointer-events-none">
      <span className="bg-black/70 backdrop-blur-sm text-white text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
        {img.section}
      </span>
    </div>
    <div className="absolute inset-0 bg-black/20 lg:bg-black/40 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 md:gap-5 pointer-events-none lg:pointer-events-auto">
      <button
        onClick={() => onEdit(img)}
        className="bg-white text-black p-2.5 md:p-3 rounded-full hover:scale-110 transition-transform shadow-lg pointer-events-auto"
      >
        <FaEdit size={13} />
      </button>
      <button
        onClick={() => onDelete(img._id)}
        className="bg-white text-red-500 p-2.5 md:p-3 rounded-full hover:scale-110 transition-transform shadow-lg pointer-events-auto"
      >
        <FaTrash size={13} />
      </button>
    </div>
  </div>
);
