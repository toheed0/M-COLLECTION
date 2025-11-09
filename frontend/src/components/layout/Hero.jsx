import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/h.png";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative w-full h-[500px] sm:h-[650px] lg:h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImg}
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 brightness-[0.85]"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16">
        {/* Animated Headings */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="leading-tight font-extrabold uppercase text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="block text-3xl sm:text-5xl md:text-6xl bg-gradient-to-r from-gray-200 via-white to-gray-400 bg-clip-text text-transparent"
          >
            Discover Your Style
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="block text-4xl sm:text-6xl md:text-7xl font-light italic mt-2 text-white/90 tracking-wide"
          >
            with M-Collection
          </motion.span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl font-medium tracking-wide text-gray-200 drop-shadow-[0_2px_6px_rgba(255,255,255,0.1)]"
        >
          Step into the world of timeless fashion & luxury craftsmanship
        </motion.p>

        {/* Shop Now Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-8 sm:mt-10"
        >
          <Link
            to="/collection/all"
            className="inline-block bg-gradient-to-r from-white to-gray-200 text-black font-semibold px-8 py-3 sm:px-10 sm:py-4 rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.25)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Shop Now
          </Link>
        </motion.div>

        {/* Bottom Floating Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 text-gray-300 text-xs sm:text-sm tracking-widest uppercase"
        >
          <span className="border-t border-gray-500 pt-2 block">
            Premium. Minimal. Timeless.
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
