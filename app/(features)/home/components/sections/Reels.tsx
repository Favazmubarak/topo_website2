"use client";

import { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const reels = [
  { id: 1, videoUrl: "/q.mp4" },
  { id: 2, videoUrl: "/a.mp4" },
  { id: 3, videoUrl: "/c.mp4" },
  { id: 4, videoUrl: "/d.mp4" },
  { id: 5, videoUrl: "/q.mp4" },
  { id: 6, videoUrl: "/a.mp4" },
  { id: 7, videoUrl: "/c.mp4" },
];

function VideoCard({ reel, index }: { reel: any; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div
      className="relative h-[45vh] sm:h-[50vh] md:h-[55vh] aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 snap-center sm:snap-start shrink-0 group/card"
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover/card:bg-black/10 transition-colors duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className={`w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:scale-110 transition-all duration-300 ${
            isPlaying ? "opacity-0 group-hover/card:opacity-100" : "opacity-100"
          }`}
        >
          {isPlaying ? (
            <FaPause className="w-5 h-5" />
          ) : (
            <FaPlay className="w-5 h-5 ml-1" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function Reels() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="w-full pb-16 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 sm:mb-14 md:mb-16">
          <h2
            className="font-montserrat text-[#0066B2] text-[clamp(22px,5vw,50px)] font-medium leading-tight"
            data-aos="fade-up"
          >
            Our Reels
          </h2>
        </div>

        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-[20vw] sm:px-0"
          >
            {reels.map((reel, index) => (
              <VideoCard key={reel.id} reel={reel} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
