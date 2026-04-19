"use client";

import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden px-6 sm:px-10 md:px-16 lg:px-24">

            {/* Background Image */}
            <Image
                src="/hero/banner.jpeg"
                alt="Hero Background"
                fill
                priority
                className="object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/5" />

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-13 justify-center h-full -translate-y-12 md:-translate-y-16">

                {/* Wrapper */}
                <div className="flex flex-col gap-13 items-start">

                    {/* Line 1 */}
                    <div className="relative scale-x-50 origin-left">
                        <h1 className="
    font-highrise 
    font-black
    text-white 
    uppercase 
    leading-[0.8] 
    tracking-[-0.05em]
    scale-y-[1.3]
    text-[42px]
    sm:text-[56px]
    md:text-[72px]
    lg:text-[80px]
    xl:text-[110px]
    text-left
    whitespace-nowrap
">
                            FRAMING THE FUTURE OF
                        </h1>
                    </div>

                    {/* Line 2 */}
                    <div className="relative scale-x-50 origin-left">
                        <h2 className="
            font-highrise 
            font-black
            text-white 
            uppercase 
            leading-[0.8] 
            tracking-[-0.05em]
            scale-y-[1.3]
            text-[42px]
            sm:text-[56px]
            md:text-[72px]
            lg:text-[80px]
            xl:text-[110px]
            text-left
        ">
                            MODERN LIVING
                        </h2>
                    </div>

                </div>
            </div>

            {/* Bottom White Fade Effect */}
            <div className="absolute bottom-0 left-0 w-full h-30 
bg-[linear-gradient(to_top,white_0%,white_25%,rgba(255,255,255,0.1)_70%,transparent_100%)]" />
        </section>
    );
}