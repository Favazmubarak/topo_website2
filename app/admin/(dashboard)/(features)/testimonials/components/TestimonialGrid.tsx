import { TestimonialItem } from "./TestimonialItem";

interface TestimonialGridProps {
  testimonials: any[];
  readyImages: Record<string, boolean>;
  onImageLoad: (id: string) => void;
  onEdit: (testimonial: any) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const TestimonialGrid = ({
  testimonials,
  readyImages,
  onImageLoad,
  onEdit,
  onDelete,
  loading,
}: TestimonialGridProps) => {
  if (testimonials.length === 0 && !loading) {
    return (
      <div className="text-center py-16 md:py-20 border-2 border-dashed border-gray-100 rounded-xl md:rounded-2xl">
        <p className="text-sm md:text-base text-gray-300 font-medium italic">No testimonials yet. Share what your clients say.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {testimonials.map((t) => (
        <TestimonialItem
          key={t._id}
          testimonial={t}
          isImageReady={readyImages[t._id]}
          onImageLoad={onImageLoad}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
