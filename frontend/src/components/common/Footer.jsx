import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import { IoCallOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-4 lg:px-0">
        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Newsletter</h3>
          <p className="text-gray-600 mb-4">
            Stay updated with our latest fashion drops, exclusive discounts, and new arrivals.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Sign up for our newsletter and be the first to know!
          </p>
          <form className="flex shadow-sm rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow p-3 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 text-sm font-medium hover:bg-indigo-700 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Shop</h3>
          <ul className="space-y-2">
            <li>
              <Link className="text-gray-600 hover:text-indigo-600 transition" to="#">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link className="text-gray-600 hover:text-indigo-600 transition" to="#">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link className="text-gray-600 hover:text-indigo-600 transition" to="#">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link className="text-gray-600 hover:text-indigo-600 transition" to="#">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link className="text-gray-600 hover:text-indigo-600 transition" to="#">
                Contact Us
              </Link>
            </li>
            <li>
              <Link className="text-gray-600 hover:text-indigo-600 transition" to="#">
                About
              </Link>
            </li>
            <li>
              <Link className="text-gray-600 hover:text-indigo-600 transition" to="#">
                FAQs
              </Link>
            </li>
            <li>
              <Link className="text-gray-600 hover:text-indigo-600 transition" to="#">
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
          <div className="flex items-center gap-4 mb-6">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition transform hover:scale-110"
            >
              <FaFacebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition transform hover:scale-110"
            >
              <FaTwitter className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition transform hover:scale-110"
            >
              <FaInstagram className="h-6 w-6" />
            </a>
          </div>
          <div className="flex items-center text-gray-600 gap-2 mb-1">
            <IoCallOutline className="w-5 h-5" />
            <span>+92 123 4567</span>
          </div>
          <p className="text-gray-500 text-sm">Customer support available 24/7</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
        &copy; 2025 M-Collection. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
