import React from "react";
import { CiCreditCard1 } from "react-icons/ci";
import { FaShoppingBag } from "react-icons/fa";
import { HiOutlineArrowPath } from "react-icons/hi2";

const featuresData = [
  {
    id: 1,
    icon: <FaShoppingBag className="text-4xl text-indigo-600 group-hover:text-white transition" />,
    title: "Free Shipping",
    desc: "On all orders over $500",
  },
  {
    id: 2,
    icon: <HiOutlineArrowPath className="text-4xl text-indigo-600 group-hover:text-white transition" />,
    title: "7 Days Easy Returns",
    desc: "Money back guarantee",
  },
  {
    id: 3,
    icon: <CiCreditCard1 className="text-4xl text-indigo-600 group-hover:text-white transition" />,
    title: "Secure Checkout",
    desc: "100% secure payment process",
  },
];

const Features = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Why Shop With <span className="text-indigo-600">Us?</span>
        </h2>
        <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
          Experience premium quality service and seamless shopping every time you order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {featuresData.map((feature) => (
          <div
            key={feature.id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 border border-gray-100 p-8 flex flex-col items-center text-center"
          >
            <div className="p-5 rounded-full bg-indigo-50 group-hover:bg-indigo-600 shadow-inner mb-4 transition">
              {feature.icon}
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition">
              {feature.title}
            </h4>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
