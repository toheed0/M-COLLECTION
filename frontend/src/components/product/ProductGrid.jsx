import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p className="text-center py-10 text-lg">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">Error: {error}</p>;
  }

  if (!products || products.length === 0) {
    return <p className="text-center py-10 text-gray-500">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
          <motion.div
            key={product._id || index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link to={`/product/${product._id}`}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <div className="w-full h-80 overflow-hidden">
                  <motion.img
                    src={firstImage}
                    alt={altText}
                    loading="lazy" // ✅ Lazy loading applied here
                    className="w-full h-full object-cover rounded-t-2xl transition-transform duration-500"
                    whileHover={{ scale: 1.1 }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-700 font-bold text-lg">
                    ${product.price}
                  </p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
