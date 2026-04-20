"use client";

import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative w-full h-[65vh] sm:h-[75vh] md:h-screen overflow-hidden px-4 sm:px-6 md:px-12 lg:px-20">

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

                <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-13 items-start">

                    <div className="inline-block flex flex-col gap-2 sm:gap-3 md:gap-4">

                        {/* Line 1 */}
                        <div className="w-fit">
                            <h1 className="
                                font-highrise 
                                font-black
                                text-white 
                                uppercase 
                                leading-[0.9] 
                                text-[36px]
                                sm:text-[48px]
                                md:text-[70px]
                                lg:text-[90px]
                                xl:text-[120px]
                                whitespace-nowrap
                               [text-shadow:0_2px_15px_rgba(0,0,0,0.5)]
                                scale-y-120
                            ">
                                FRAMING THE FUTURE OF
                            </h1>
                        </div>

                        {/* Line 2 */}
                        <div className="flex justify-end w-full 
    mt-3 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8">
                            <h2 className="
        font-highrise 
        font-black
        text-white 
        uppercase 
        leading-[0.9] 
        text-[36px]
        sm:text-[48px]
        md:text-[70px]
        lg:text-[90px]
        xl:text-[120px]
        whitespace-nowrap
        text-right
        [text-shadow:0_2px_15px_rgba(0,0,0,0.5)]
        scale-y-120
    ">
                                MODERN LIVING
                            </h2>
                        </div>

                    </div>

                </div>
            </div>

            {/* Bottom White Fade Effect */}
            <div className="absolute bottom-0 left-0 w-full h-20 sm:h-24 md:h-28 lg:h-32 
            bg-[linear-gradient(to_top,white_0%,white_25%,rgba(255,255,255,0.1)_70%,transparent_100%)]" />
        </section>
    );
}