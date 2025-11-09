import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProductsByFilter } from '../slices/productsSlice';
import axios from 'axios';

// Components
import Hero from '../components/layout/Hero';
import GenderCollectionSection from '../components/product/GenderCollectionSection';
import NewArrivals from '../components/product/NewArrivals';
import ProductDetails from '../components/product/ProductDetails';
import ProductGrid from '../components/product/ProductGrid';
import FeatureCollection from '../components/product/FeatureCollection';
import Features from '../components/product/Features';

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const [bestSellerProducts, setBestSellerProducts] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Page load animation
        setIsVisible(true);
        
        // Fetch products
        dispatch(
            fetchProductsByFilter({
                gender: "Women",
                category: "Bottom Wear",
                limit: 8,
            })
        );

        // Fetch best sellers
        const fetchBestSellers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-selling`);
                setBestSellerProducts(response.data);
            } catch (error) {
                console.error("Error fetching best sellers:", error);
            }
        };
        fetchBestSellers();
    }, [dispatch]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                duration: 0.8
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const fadeInUp = {
        hidden: { y: 60, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const scaleIn = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={containerVariants}
                className="overflow-hidden"
            >
                {/* Hero Section */}
                <motion.div variants={itemVariants}>
                    <Hero />
                </motion.div>

                {/* Gender Collection */}
                <motion.div variants={fadeInUp}>
                    <GenderCollectionSection />
                </motion.div>

                {/* New Arrivals */}
                <motion.div variants={fadeInUp}>
                    <NewArrivals />
                </motion.div>

                {/* Best Seller Section */}
                <motion.section 
                    variants={containerVariants}
                    className="py-16 bg-gradient-to-br from-gray-50 to-white"
                >
                    <motion.div 
                        variants={scaleIn}
                        className="container mx-auto px-4"
                    >
                        <motion.h2 
                            variants={fadeInUp}
                            className="text-center font-bold text-4xl mb-12 relative"
                        >
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Best Sellers
                            </span>
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "100px" }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"
                            />
                        </motion.h2>

                        <AnimatePresence mode="wait">
                            {bestSellerProducts && bestSellerProducts.length > 0 ? (
                                <motion.div
                                    key="best-seller"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <ProductDetails productId={bestSellerProducts[0]._id} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-12"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                                    />
                                    <p className="text-gray-600 text-lg">Loading featured product...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.section>

                {/* Top Wear Section */}
                <motion.section 
                    variants={containerVariants}
                    className="py-16 bg-white"
                >
                    <div className="container mx-auto px-4">
                        <motion.div variants={fadeInUp} className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Top Wear for Women
                                </span>
                            </h2>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-600 text-lg max-w-2xl mx-auto"
                            >
                                Discover our exclusive collection of trendy and comfortable tops
                            </motion.p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <ProductGrid products={products} loading={loading} error={error} />
                        </motion.div>
                    </div>
                </motion.section>

                {/* Feature Collection */}
                <motion.div variants={fadeInUp}>
                    <FeatureCollection />
                </motion.div>

                {/* Features */}
                <motion.div variants={fadeInUp}>
                    <Features />
                </motion.div>

                {/* Floating Elements for Premium Look */}
                <div className="fixed top-1/4 left-5 -z-10 opacity-10">
                    <motion.div
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 10, 0]
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-20 h-20 bg-purple-500 rounded-full blur-xl"
                    />
                </div>

                <div className="fixed bottom-1/4 right-5 -z-10 opacity-10">
                    <motion.div
                        animate={{ 
                            y: [0, 20, 0],
                            rotate: [0, -10, 0]
                        }}
                        transition={{ 
                            duration: 5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-24 h-24 bg-pink-500 rounded-full blur-xl"
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Home;