import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import featureImage from '../../assets/featured.webp';

const FeatureCollection = () => {
  return (
    <section className="py-20 px-4 lg:px-0 bg-gray-50">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center rounded-3xl shadow-xl overflow-hidden bg-green-100">
        
        {/* Left Content */}
        <motion.div
          className="lg:w-1/2 p-8 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Comfort & Style
          </h2>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Apparel made for your everyday life
          </h1>
          <p className="text-lg text-gray-500 mb-6 leading-relaxed">
            Discover our collection of apparel designed to provide unparalleled comfort and style for your everyday life. From casual wear to work attire, our pieces are crafted with high-quality materials to ensure you look and feel your best all day long.
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/collection/all"
              className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 shadow-lg transition-all duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="lg:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={featureImage}
            alt="Featured"
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCollection;
