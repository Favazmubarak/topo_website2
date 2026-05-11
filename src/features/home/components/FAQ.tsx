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
      className="w-full bg-white md:py-12 sm:py-10 py-8 px-4 sm:px-6 md:px-12 lg:px-20"
      id="faq"
    >
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 justify-between items-start">
        <div className="w-full lg:w-[35%] text-left" data-aos="fade-right">
          <h2 className="font-montserrat text-[#0066B2] text-[clamp(24px,5vw,50px)] font-medium leading-tight mb-4 tracking-tight">
            Frequently Asked <br className="hidden lg:block" /> Questions
          </h2>
          <p className="font-montserrat font-[500] text-[#929292] text-sm sm:text-base md:text-[18px] leading-relaxed max-w-[500px]">
            Find clear answers to your questions and discover everything you need to know about our products and services.
          </p>
        </div>
        <div className="w-full lg:w-[60%] flex flex-col gap-4 sm:gap-6 lg:ml-auto">

          {showSkeleton ? (
            <FAQSkeleton />
          ) : error ? (
            <div className="flex justify-center items-center min-h-[400px] text-red-500">
              Error: {error}
            </div>
          ) : faqs.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px] text-gray-500">
              No FAQs available right now.
            </div>
          ) : (
            faqs.map((faq, index) => (
              <div
                key={faq._id}
                data-aos="fade-left"
                data-aos-delay={index * 80}
                className="bg-[#E1ECFF] rounded-[20px] p-5 sm:p-6 md:p-8 flex flex-col transition-all duration-300 hover:scale-[1.01] cursor-pointer group"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-hidden">
                    <span className="font-montserrat text-[#0066B2] text-sm sm:text-lg md:text-xl font-medium min-w-[30px] sm:min-w-[40px]">
                      ({index + 1})
                    </span>

                    <p className="font-montserrat text-black text-[13px] sm:text-base md:text-[18px] font-medium leading-[1.4] break-words whitespace-normal">
                      {faq.question}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <div
                      className={`bg-[#0066B2] text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#005596] ${activeIndex === index ? "rotate-180" : ""
                        }`}
                    >
                      <FaChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
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
                    <p className="font-montserrat text-[#929292] text-[12px] sm:text-sm md:text-base leading-relaxed pl-[44px] sm:pl-[64px] md:pl-[72px] break-words whitespace-normal">
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
