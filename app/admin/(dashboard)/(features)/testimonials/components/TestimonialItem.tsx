import Image from "next/image";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";

interface TestimonialItemProps {
  testimonial: { _id: string; name: string; avatar: string; rating: number; review: string };
  isImageReady: boolean;
  onImageLoad: (id: string) => void;
  onEdit: (testimonial: any) => void;
  onDelete: (id: string) => void;
}

export const TestimonialItem = ({
  testimonial,
  isImageReady,
  onImageLoad,
  onEdit,
  onDelete,
}: TestimonialItemProps) => (
  <div className="group relative bg-gray-50/50 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-2xl transition-all duration-500">
    <div className="flex items-start justify-between mb-4 md:mb-6">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className={`object-cover transition-opacity duration-500 ${isImageReady ? "opacity-100" : "opacity-0"}`}
            onLoad={() => onImageLoad(testimonial._id)}
          />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold tracking-tight">{testimonial.name}</h3>
          <div className="flex gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={7} className={i < testimonial.rating ? "text-yellow-400" : "text-gray-200"} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 bg-white/80 lg:bg-transparent p-1 rounded-lg backdrop-blur-sm lg:backdrop-blur-none">
        <button onClick={() => onEdit(testimonial)} className="p-1.5 md:p-2 text-gray-400 hover:text-black transition-colors"><FaEdit size={12} /></button>
        <button onClick={() => onDelete(testimonial._id)} className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 transition-colors"><FaTrash size={12} /></button>
      </div>
    </div>
    <p className="text-[10px] md:text-[11px] leading-relaxed text-gray-500 italic line-clamp-6 break-words">"{testimonial.review}"</p>
  </div>
);
