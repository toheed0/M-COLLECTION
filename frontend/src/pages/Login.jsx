import React, { useEffect } from "react";
import loginImg from "../assets/login.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/authSlice";
import { mergeCart } from "../slices/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ------------------- Validation Schema -------------------
const schema = yup.object().shape({
  email: yup.string().email("Valid email required").required("Email is required"),
  password: yup.string().min(6, "Password minimum 6 characters").required("Password is required"),
});

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, error, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // ------------------- react-hook-form -------------------
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  // ------------------- Login Submit -------------------
  const onSubmit = (data) => {
    dispatch(loginUser({ email: data.email, password: data.password }));
  };

  // ------------------- Redirect & Merge Cart -------------------
  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  // ------------------- Toast Errors -------------------
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 3000, pauseOnHover: true, draggable: true });
    }
  }, [error]);

  return (
    <div className="min-h-screen flex">
      <ToastContainer />

      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-10 lg:px-20 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Welcome Back 👋</h2>
          <p className="text-gray-500 text-center mb-10">Please login to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                {...register("email")}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                {...register("password")}
                placeholder="********"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-500 text-sm mt-5">
              Don’t have an account?{" "}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="text-black font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <img src={loginImg} alt="Login Illustration" className="w-full h-screen object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-3xl font-bold">Shop Smarter, Live Better</h2>
          <p className="text-gray-200 mt-2 max-w-sm">
            Discover premium fashion and lifestyle essentials tailored just for you.
          </p>
        </div>
      </div>
    </div>
  );
};
