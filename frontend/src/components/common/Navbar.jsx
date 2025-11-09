import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdPerson } from "react-icons/io";
import { FiShoppingBag } from "react-icons/fi";
import { IoMenu, IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import Searchbr from "./Searchbr";
import Cart from "../layout/Cart";

const Navbar = () => {
  const [openCart, setOpenCart] = useState(false);
  const [menuopen, setMenuOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  const handleCart = () => setOpenCart(!openCart);
  const handleMenu = () => setMenuOpen(!menuopen);

  return (
    <>
      {/* NAVBAR */}
      <nav className="relative z-40 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* BRAND */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-extrabold tracking-wide text-gray-900 hover:text-black transition-all duration-300"
          >
            M<span className="text-gray-500">Collection</span>
          </Link>

          {/* LINKS */}
          <div className="hidden md:flex items-center space-x-8">
            {["Men", "Women", "Top-Wear", "Bottom-Wear"].map((item) => (
              <Link
                key={item}
                to={`/collection/all?${
                  item === "Men" || item === "Women"
                    ? `gender=${item}`
                    : `category=${item}`
                }`}
                className="relative text-gray-700 font-medium uppercase tracking-wider text-sm hover:text-black transition-all duration-300 group"
              >
                {item}
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-5">
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="bg-black text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
              >
                Admin
              </Link>
            )}

            {/* Profile */}
            <Link
              to="/profile"
              className="text-gray-700 hover:text-black transition"
            >
              <IoMdPerson className="w-6 h-6" />
            </Link>

            {/* Cart */}
            <button
              onClick={handleCart}
              className="relative text-gray-700 hover:text-black transition"
            >
              <FiShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-[10px] px-1.5 py-0.5 shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="hidden md:block">
              <Searchbr />
            </div>

            {/* Menu Button */}
            <button
              onClick={handleMenu}
              className="md:hidden text-gray-700 hover:text-black"
            >
              <IoMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* CART */}
      <Cart openCart={openCart} handleCart={handleCart} />

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 z-50 h-full bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${
          menuopen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
            Menu
          </h2>
          <button onClick={handleMenu}>
            <IoCloseSharp className="w-6 h-6 text-gray-700 hover:text-black" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-lg font-medium text-gray-700">
          <Link
            to="/collection/all?gender=Men"
            onClick={handleMenu}
            className="block hover:text-black transition"
          >
            Men
          </Link>
          <Link
            to="/collection/all?gender=Women"
            onClick={handleMenu}
            className="block hover:text-black transition"
          >
            Women
          </Link>
          <Link
            to="/collection/all?category=Top-Wear"
            onClick={handleMenu}
            className="block hover:text-black transition"
          >
            Top-Wear
          </Link>
          <Link
            to="/collection/all?category=Bottom-Wear"
            onClick={handleMenu}
            className="block hover:text-black transition"
          >
            Bottom-Wear
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
