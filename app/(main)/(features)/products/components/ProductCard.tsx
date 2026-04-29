"use client";

import { useState } from "react";

import Image from "next/image";
import { Skeleton } from "@/src/components/common/Skeleton";


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
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setImageLoaded(true)}
        sizes="(max-width: 768px) 60vw, (max-width: 1024px) 40vw, 30vw"
        unoptimized
      />

      {!imageLoaded && (
        <Skeleton className="absolute inset-0 rounded-none" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60" />

      {/* Content */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute bottom-2 left-2 right-2 
        bg-white/80 backdrop-blur-sm p-3 sm:p-4 md:p-5 
        rounded-lg md:rounded-xl flex flex-col gap-1
        transition-all duration-500 cursor-pointer
        ${isExpanded ? "min-h-[37.5%] max-h-[90%] h-auto overflow-y-auto" : "h-[37.5%]"}`}
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
            tracking-wide text-black transition-all duration-300"
        >
          {title}
        </p>

        <p
          className={`font-montserrat text-[#2F2F2F] 
          text-[10px] sm:text-[11px] md:text-[13px] lg:text-[15px]
          leading-snug font-normal transition-all duration-300
          ${isExpanded ? "block" : "line-clamp-1 sm:line-clamp-2 md:line-clamp-3"}`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
