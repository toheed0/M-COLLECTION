import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="w-full h-80 bg-gray-100" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-100 rounded-full w-3/4" />
      <div className="h-4 bg-gray-100 rounded-full w-1/3" />
    </div>
  </div>
);

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-4">⚠️</span>
        <p className="text-gray-500 text-sm">Something went wrong. Please try again.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-4">🛍️</span>
        <p className="text-gray-400 font-medium">No products found</p>
        <p className="text-gray-300 text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {products.map((product, index) => {
        const firstImage =
          product?.images?.[0]?.url ||
          product?.imges?.[0]?.url ||
          "https://via.placeholder.com/300";

        const altText =
          product?.images?.[0]?.altText ||
          product?.imges?.[0]?.altText ||
          product?.name ||
          "Product Image";

        return (
          <motion.div key={product._id || index} variants={cardVariants}>
            <Link to={`/product/${product._id}`} className="block group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 border border-gray-100">
                {/* Image */}
                <div className="relative w-full h-80 overflow-hidden bg-gray-50">
                  <img
                    src={firstImage}
                    alt={altText}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100">
                    <span className="bg-white text-gray-900 text-xs font-semibold tracking-widest uppercase px-6 py-2.5 rounded-full shadow-lg translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                      View Product
                    </span>
                  </div>
                  {/* Category badge */}
                  {product.category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-600 text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wide leading-snug line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-base font-bold text-gray-900">
                      ${product.price}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-xs text-gray-400 line-through">
                        ${product.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProductGrid;
