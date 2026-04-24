"use client";

import Image from "next/image";

type ProductCardProps = {
  productName: string;
  title: string;
  description: string;
  image: string;
  priority?: boolean;
};

export default function ProductCard({
  productName,
  title,
  description,
  image,
  priority = false,
}: ProductCardProps) {
  return (
    <div
      className="relative group overflow-hidden rounded-xl md:rounded-2xl 
      aspect-[3/4] md:aspect-[4/5] shadow-lg transition-all duration-500 hover:shadow-2xl"
    >
      <Image
        src={image}
        alt={title}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 60vw, (max-width: 1024px) 40vw, 30vw"
        unoptimized
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60" />

      {/* Content */}
      <div
        className="absolute bottom-2 left-2 right-2 
        bg-white/70 p-3 sm:p-4 md:p-5 
        rounded-lg md:rounded-xl flex flex-col gap-1
        transition-all duration-300 lg:min-h-[150px]"
      >
        <h3
          className="font-poppins text-black 
          text-[12px] sm:text-[14px] md:text-[18px] lg:text-[20px]
          leading-snug font-medium"
        >
          {productName}
        </h3>

        <p
          className="font-poppins 
            text-[10px] sm:text-xs md:text-sm lg:text-base 
            tracking-wide text-black"
        >
          {title}
        </p>

        <p
          className="font-montserrat text-[#2F2F2F] 
          text-[10px] sm:text-[11px] md:text-[13px] lg:text-[15px]
          leading-snug font-normal"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
