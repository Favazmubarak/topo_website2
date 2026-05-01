import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { HiMapPin, HiPhone, HiEnvelope } from "react-icons/hi2";

const Footer = () => {
  return (
    <footer id="footer" className="bg-brand-blue text-white py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-10 lg:px-16 font-poppins overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-10">
          <div className="lg:col-span-2 flex flex-col" data-aos="fade-up">
            <Link href="/">
              <Image
                src="/logo.webp"
                alt="topo logo"
                width={360}
                height={144}
                className="w-auto h-14 sm:h-20 lg:h-24 object-contain brightness-0 invert"
              />
            </Link>

            <p className="text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-sm mt-2">
              Premium aluminum window solutions designed for durability, style,
              and performance. Established in 2016.
            </p>

            <div className="flex items-center flex-wrap gap-3 md:gap-4 mt-4 md:mt-5">
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <FaInstagram className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </Link>

              <Link href="#" className="hover:opacity-80 transition-opacity">
                <FaFacebook className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              </Link>

              <Link href="#" className="hover:opacity-80 transition-opacity">
                <FaWhatsapp className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </Link>

              <Link href="#" className="hover:opacity-80 transition-opacity">
                <FaYoutube className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
              </Link>
            </div>
          </div>

          <div
            className="flex flex-col space-y-3 md:space-y-4 lg:col-span-1"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h3 className="text-base md:text-lg lg:text-xl font-medium">
              Company
            </h3>

            <ul className="space-y-1 font-light text-sm sm:text-base lg:text-base">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>

              <li>
                <Link href="#about" className="hover:underline">
                  About
                </Link>
              </li>

              <li>
                <Link href="/products" className="hover:underline">
                  Products
                </Link>
              </li>

              <li>
                <Link href="/gallery" className="hover:underline">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div
            className="flex flex-col space-y-3 md:space-y-4 lg:col-span-1"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3 className="text-base md:text-lg lg:text-xl font-medium">
              Support
            </h3>

            <ul className="space-y-1 font-light text-sm sm:text-base lg:text-base">
              <li>
                <Link href="#" className="hover:underline">
                  Help
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:underline break-words">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:underline break-words">
                  Warranty Information
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:underline">
                  FAQ
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:underline">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div
            className="flex flex-col space-y-3 md:space-y-4 lg:col-span-2"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <h3 className="text-base md:text-lg lg:text-xl font-medium">
              Contact
            </h3>

            <ul className="space-y-3 font-light">
              <li className="flex items-start space-x-3">
                <HiMapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mt-1 shrink-0" />

                <span className="text-sm sm:text-base lg:text-base leading-snug break-words">
                  Kakathodu, Karumanamkurissi (P.O.),
                  <br />
                  Cherpulassery, Palakkad, Kerala
                  <br />
                  679 504.
                </span>
              </li>

              <li className="flex items-center space-x-3">
                <HiPhone className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0" />

                <span className="text-sm sm:text-base lg:text-base break-all">
                  75564442588
                </span>
              </li>

              <li className="flex items-center space-x-3">
                <HiEnvelope className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0" />

                <span className="text-sm sm:text-base lg:text-base break-all">
                  Toppo@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white pt-5 mt-6"></div>
      </div>
    </footer>
  );
};

export default Footer;