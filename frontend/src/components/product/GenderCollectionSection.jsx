import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Wemen from "../../assets/w.jpg";
import men from "../../assets/m.jpg";

const GenderCollectionSection = () => {
  return (
    <section className="py-20 px-4 lg:px-10 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">

        {/* Women’s Collection */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative flex-1 group overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.08)]"
        >
          <motion.img
            src={Wemen}
            alt="Women's Collection"
            className="w-full h-[600px] md:h-[700px] object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-all duration-500" />
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute bottom-10 left-10 text-white"
          >
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-wide mb-3">
              Women’s Collection
            </h3>
            <Link
              to="/collection/all?gender=women"
              className="inline-block bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 shadow-[0_3px_20px_rgba(255,255,255,0.3)]"
            >
              Shop Now
            </Link>
          </motion.div>
        </motion.div>

        {/* Men’s Collection */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative flex-1 group overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.08)]"
        >
          <motion.img
            src={men}
            alt="Men's Collection"
            className="w-full h-[600px] md:h-[700px] object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-all duration-500" />
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="absolute bottom-10 left-10 text-white"
          >
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-wide mb-3">
              Men’s Collection
            </h3>
            <Link
              to="/collection/all?gender=men"
              className="inline-block bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 shadow-[0_3px_20px_rgba(255,255,255,0.3)]"
            >
              Shop Now
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Tagline Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-center mt-14 text-gray-300 uppercase tracking-widest text-sm"
      >
        <p>Elegance • Confidence • Modern Luxury</p>
      </motion.div>
    </section>
  );
};

export default GenderCollectionSection;
