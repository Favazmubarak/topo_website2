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
            <div className="relative z-10 flex items-center h-full px-6 sm:px-10 md:px-16 lg:px-24">
                <h1
                    className="
    font-highrise 
    text-white 
    uppercase 
    leading-[0.85] 
    tracking-[-0.03em]

    text-[42px]
    sm:text-[56px]
    md:text-[72px]
    lg:text-[96px]
    xl:text-[120px]

    max-w-[900px]
  "
                >
                    FRAMING THE FUTURE OF <br />
                    MODERN LIVING
                </h1>
            </div>

            {/* Bottom White Fade Effect */}
            <div className="absolute bottom-0 left-0 w-full h-30 
bg-[linear-gradient(to_top,white_0%,white_25%,rgba(255,255,255,0.1)_70%,transparent_100%)]" />
        </section>
    );
}