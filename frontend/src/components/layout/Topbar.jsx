import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { FaInstagram, FaSquareXTwitter } from "react-icons/fa6";

const Topbar = () => {
  return (
    <div className="bg-gradient-to-r z-50 from-black via-gray-900 to-black text-gray-100 shadow-md border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center py-2 px-4 text-xs md:text-sm tracking-wide font-medium">
        {/* LEFT - SOCIAL ICONS */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="#"
            className="group hover:text-white transition flex items-center"
            aria-label="Meta"
          >
            <TbBrandMeta className="h-5 w-5 text-gray-300 group-hover:text-white transition-transform duration-300 group-hover:scale-110" />
          </a>
          <a
            href="#"
            className="group hover:text-white transition flex items-center"
            aria-label="Instagram"
          >
            <FaInstagram className="h-5 w-5 text-gray-300 group-hover:text-pink-500 transition-transform duration-300 group-hover:scale-110" />
          </a>
          <a
            href="#"
            className="group hover:text-white transition flex items-center"
            aria-label="Twitter / X"
          >
            <FaSquareXTwitter className="h-5 w-5 text-gray-300 group-hover:text-sky-400 transition-transform duration-300 group-hover:scale-110" />
          </a>
        </div>

        {/* CENTER - MESSAGE */}
        <div className="text-center">
          <span className="font-light text-gray-200 tracking-wide">
            🚚{" "}
            <span className="text-white font-medium">
              We Ship All Over Pakistan
            </span>{" "}
            – Fast, Secure & Reliable Delivery!
          </span>
        </div>

        {/* RIGHT - CONTACT */}
        <div className="hidden md:block">
          <a
            href="tel:+921234567"
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            📞 +92 123 4567
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
