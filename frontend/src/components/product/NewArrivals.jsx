import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [imgData, setImgData] = useState([]);

  // ✅ Fetch new arrivals
  useEffect(() => {
    const fetchImgData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setImgData(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchImgData();
  }, []);

  // ✅ Handle scroll buttons visibility
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    checkScroll();
    scrollContainer.addEventListener("scroll", checkScroll);
    return () => scrollContainer.removeEventListener("scroll", checkScroll);
  }, [imgData]);

  const scrollLeftFn = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRightFn = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <section className="relative py-20 bg-[#0d0d0d] text-white overflow-hidden">
      <div className="container mx-auto text-center mb-14">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent"
        >
          Explore New Arrivals
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto"
        >
          Step into the season with our latest styles — bold, modern, and elegant.
        </motion.p>
      </div>

      {/* ✅ Scrollable Product Slider */}
      <div className="relative">
        {/* Scroll buttons over images */}
        <div className=" absolute inset-x-0 top-[45%] flex justify-between px-4 sm:px-10 z-20 pointer-events-none">
          <button
            onClick={scrollLeftFn}
            disabled={!canScrollLeft}
            className={` p-3 sm:p-4 rounded-full border border-gray-500 backdrop-blur-md bg-white/10 pointer-events-auto transition ${
              canScrollLeft
                ? "hover:bg-white/20 text-white"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <FaAngleLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            onClick={scrollRightFn}
            disabled={!canScrollRight}
            className={`p-3 sm:p-4 rounded-full border border-gray-500 backdrop-blur-md bg-white/10 pointer-events-auto transition ${
              canScrollRight
                ? "hover:bg-white/20 text-white"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <FaAngleRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Product List */}
        <div
          ref={scrollRef}
          className="relative container mx-auto flex overflow-x-auto space-x-8 scroll-smooth hide-scrollbar px-6"
        >
          {imgData.length > 0 ? (
            imgData.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="min-w-[80%] sm:min-w-[50%] lg:min-w-[30%] relative group overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                {/* Product Image */}
                <img
                  src={item.images?.[0]?.url || ""}
                  alt={item.name || "Product"}
                  className="w-full h-[450px] md:h-[550px] object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Overlay Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-6">
                  <Link to={`/product/${item._id}`} className="block">
                    <h4 className="text-2xl font-semibold mb-2">{item.name}</h4>
                    <p className="text-gray-300 mb-4">${item.price}</p>
                    <button className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition-all duration-300">
                      View Details
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full py-10">
              No new arrivals found.
            </p>
          )}
        </div>
      </div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-center mt-14 text-gray-400 tracking-widest uppercase text-sm"
      >
        Elevate your wardrobe • Inspired by modern elegance
      </motion.p>
    </section>
  );
};

export default NewArrivals;
