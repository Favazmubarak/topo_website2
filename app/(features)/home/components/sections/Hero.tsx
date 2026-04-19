"use client";

import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative w-full h-[65vh] sm:h-[75vh] md:h-screen overflow-hidden px-6 sm:px-10 md:px-16 lg:px-24">

            {/* Background Image */}
            <Image
                src="/hero/banner.jpeg"
                alt="Hero Background"
                fill
                priority
                className="object-cover object-center"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/5" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center h-full -translate-y-4 sm:-translate-y-6 md:-translate-y-12 lg:-translate-y-16">

                {/* Wrapper */}
                <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-13 items-start">

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
    text-[26px]
    sm:text-[38px]
    md:text-[60px]
    lg:text-[80px]
    xl:text-[110px]
    text-left
    whitespace-nowrap
    [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]
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
                            text-[26px]
                            sm:text-[38px]
                            md:text-[60px]
                            lg:text-[80px]
                            xl:text-[110px]
                            text-left
                             [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]
                        ">
                            MODERN LIVING
                        </h2>
                    </div>

                </div>
            </div>

            {/* Bottom White Fade Effect */}
            <div className="absolute bottom-0 left-0 w-full h-20 sm:h-24 md:h-28 lg:h-32 
bg-[linear-gradient(to_top,white_0%,white_25%,rgba(255,255,255,0.1)_70%,transparent_100%)]" />
        </section>
    );
}