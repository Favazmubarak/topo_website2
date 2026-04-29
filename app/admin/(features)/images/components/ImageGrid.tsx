import { Section } from "../api/imageApi";
import { ImageItem } from "./ImageItem";
import { FaPlus, FaImage } from "react-icons/fa";
import { SECTIONS } from "./SectionFilter";

interface ImageGridProps {
  images: any[];
  activeSection: Section;
  loading: boolean;
  readyImages: Record<string, boolean>;
  onReady: (id: string) => void;
  onEdit: (img: any) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export const ImageGrid = ({
  images,
  activeSection,
  loading,
  readyImages,
  onReady,
  onEdit,
  onDelete,
  onAddClick,
}: ImageGridProps) => {
  if (images.length === 0 && !loading) {
    const activeLabel = SECTIONS.find((s) => s.value === activeSection)?.label;
    return (
      <div className="text-center py-16 md:py-24 border-2 border-dashed border-gray-100 rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-3">
        <FaImage className="text-gray-200" size={36} />
        <p className="text-sm text-gray-300 font-medium italic">
          No images for <span className="font-black uppercase">{activeLabel}</span> yet.
        </p>
        <button
          onClick={onAddClick}
          className="mt-2 flex items-center gap-1.5 bg-black text-white px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
        >
          <FaPlus size={8} /> Add First Image
        </button>
      </div>
    );
  }

  const aspectClass = "aspect-video";

  const gridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6";

  return (
    <div className={gridClass}>
      {images.map((img) => (
        <ImageItem
          key={img._id}
          img={img}
          aspectClass={aspectClass}
          isReady={readyImages[img._id]}
          onReady={onReady}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
