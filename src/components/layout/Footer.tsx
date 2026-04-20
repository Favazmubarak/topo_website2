import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { HiMapPin, HiPhone, HiEnvelope } from "react-icons/hi2";

const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-20 font-poppins overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 md:gap-12 lg:gap-16 mb-10">
          <div className="lg:col-span-2 flex flex-col" data-aos="fade-up">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="topo logo"
                width={360}
                height={144}
                className="w-auto h-20 sm:h-28 lg:h-36 object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-sm">
              Premium aluminum window solutions designed for durability, style, 
              and performance. Established in 2016.
            </p>
            <div className="flex items-center flex-wrap gap-4 md:gap-6 mt-6 md:mt-8">
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <FaInstagram className="w-6 h-6 sm:w-9 sm:h-9 lg:w-10 lg:h-10" />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <FaFacebook className="w-5 h-5 sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <FaWhatsapp className="w-5 h-5 sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <FaYoutube className="w-8 h-8 sm:w-9 sm:h-9 lg:w-11 lg:h-11" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col space-y-4 md:space-y-6 lg:col-span-1" data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-lg md:text-xl lg:text-2xl font-medium">Company</h3>
            <ul className="space-y-2 font-light text-sm sm:text-base lg:text-lg">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="#about" className="hover:underline">About</Link></li>
              <li><Link href="/products" className="hover:underline">Products</Link></li>
              <li><Link href="/gallery" className="hover:underline">Gallery</Link></li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4 md:space-y-6 lg:col-span-1" data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-lg md:text-xl lg:text-2xl font-medium">Support</h3>
            <ul className="space-y-2 font-light text-sm sm:text-base lg:text-lg">
              <li><Link href="#" className="hover:underline">Help</Link></li>
              <li><Link href="#" className="hover:underline break-words">privacy policy</Link></li>
              <li><Link href="#" className="hover:underline break-words">Warranty Information</Link></li>
              <li><Link href="#" className="hover:underline">FAQ</Link></li>
              <li><Link href="#" className="hover:underline">Contact Support</Link></li>
            </ul>
          </div>

          <div className="flex flex-col space-y-4 md:space-y-6 lg:col-span-2" data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-lg md:text-xl lg:text-2xl font-medium">Contact</h3>
            <ul className="space-y-4 font-light">
              <li className="flex items-start space-x-3 sm:space-x-4">
                <HiMapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mt-1 shrink-0" />
                <span className="text-sm sm:text-base lg:text-lg leading-snug break-words">
                  Kakathodu, Karumanamkurissi (P.O.),<br />
                  Cherpulassery, Palakkad, Kerala<br />
                  679 504.
                </span>
              </li>
              <li className="flex items-center space-x-3 sm:space-x-4">
                <HiPhone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 shrink-0" />
                <span className="text-sm sm:text-base lg:text-lg break-all">75564442588</span>
              </li>
              <li className="flex items-center space-x-3 sm:space-x-4">
                <HiEnvelope className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 shrink-0" />
                <span className="text-sm sm:text-base lg:text-lg break-all">Toppo@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white pt-8">
        </div>
      </div>
    </footer>
  );
};

export default Footer;
