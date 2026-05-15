"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useFAQ } from "../hooks/useFaq";
import FAQSkeleton from "./FAQSkeleton";
import { FAQ as FAQType } from "../api/faqApi";


interface FAQProps {
  initialFAQs?: FAQType[];
}

export default function FAQ({ initialFAQs }: FAQProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { faqs: fetchedFaqs, loading, error } = useFAQ();

  const faqs = fetchedFaqs.length > 0 ? fetchedFaqs : (initialFAQs || []);
  const showSkeleton = loading && faqs.length === 0;

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      className="w-full bg-white md:pt-16 md:pb-8 sm:pt-12 sm:pb-6 pt-10 pb-4 px-4 sm:px-6 md:px-12 lg:px-20"
      id="faq"
    >
      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 justify-between items-start">
        <div className="w-full lg:w-[35%] text-left" data-aos="fade-right">
          <h2 className="font-montserrat text-[#0066B2] text-[clamp(22px,4vw,42px)] font-medium leading-tight mb-4 tracking-tight">
            Frequently Asked <br className="hidden lg:block" /> Questions
          </h2>
          <p className="font-montserrat font-[400] text-[#929292] text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-[400px]">
            Find clear answers to your questions and discover everything you need to know about our products and services.
          </p>
        </div>
        
        {/* Adjusted FAQ Container Width and Gap */}
        <div className="w-full lg:w-[55%] flex flex-col gap-3 sm:gap-4 lg:ml-auto">

          {showSkeleton ? (
            <FAQSkeleton />
          ) : error ? (
            <div className="flex justify-center items-center min-h-[300px] text-red-500">
              Error: {error}
            </div>
          ) : faqs.length === 0 ? (
            <div className="flex justify-center items-center min-h-[300px] text-gray-500">
              No FAQs available right now.
            </div>
          ) : (
            faqs.map((faq, index) => (
              <div
                key={faq._id}
                data-aos="fade-left"
                data-aos-delay={index * 50}
                // Reduced padding (p-4 sm:p-5) and scale intensity
                className="bg-[#E1ECFF] rounded-[15px] p-4 sm:p-5 flex flex-col transition-all duration-300 hover:bg-[#D8E6FF] cursor-pointer group"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-4 sm:gap-5 overflow-hidden">
                    <span className="font-montserrat text-[#0066B2] text-xs sm:text-base font-medium min-w-[25px] sm:min-w-[35px]">
                      ({index + 1})
                    </span>

                    {/* Slightly smaller question text */}
                    <p className="font-montserrat text-black text-[12px] sm:text-sm md:text-[16px] font-medium leading-snug break-words whitespace-normal">
                      {faq.question}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {/* Smaller Chevron Container */}
                    <div
                      className={`bg-[#0066B2] text-white rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-300 group-hover:bg-[#005596] ${activeIndex === index ? "rotate-180" : ""
                        }`}
                    >
                      <FaChevronDown className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>
                </div>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${activeIndex === index
                      ? "grid-rows-[1fr] opacity-100 mt-2"
                      : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden min-h-0">
                    {/* Smaller answer text and adjusted indentation */}
                    <p className="font-montserrat text-[#929292] text-[11px] sm:text-[13px] md:text-sm leading-relaxed pl-[35px] sm:pl-[50px] break-words whitespace-normal pt-2">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </section>
  );
}
