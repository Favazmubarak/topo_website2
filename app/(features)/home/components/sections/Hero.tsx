"use client";

import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden">

            {/* Background Image */}
            <Image
                src="/hero/banner.jpeg"
                alt="Hero Background"
                fill
                priority
                className="object-cover"
            />

            {/* Dark overlay (optional for contrast) */}
            <div className="absolute inset-0 bg-black/5" />

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-13 items-between justify-center h-full">

                {/* First Line */}
                <div className="relative  right-75 scale-x-50">
                    <h1
                        className="
        font-highrise 
        font-black
        text-white 
        uppercase 
        leading-[0.8] 
        tracking-[-0.05em]
        scale-y-130
        text-[42px]
        sm:text-[56px]
        md:text-[72px]
        lg:text-[80px]
        xl:text-[110px]
        max-w-full
        text-end
      "
                    >
                        FRAMING THE FUTURE OF
                    </h1>
                </div>

                {/* Second Line */}
                <div className="relative right-75 scale-x-50">
                    <h2
                        className="
                        ml-auto
        font-highrise 
        font-black
        text-white 
        uppercase 
        leading-[0.8] 
        tracking-[-0.05em]
        scale-y-130
        text-[42px]
        sm:text-[56px]
        md:text-[72px]
        lg:text-[80px]
        xl:text-[110px]
        max-w-full
        text-end
      "
                    >
                        MODERN LIVING
                    </h2>
                </div>

            </div>

            {/* Bottom White Fade Effect */}
            <div className="absolute bottom-0 left-0 w-full h-30 
bg-[linear-gradient(to_top,white_0%,white_25%,rgba(255,255,255,0.1)_70%,transparent_100%)]" />
        </section>
    );
}