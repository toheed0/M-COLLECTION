import React, { useState } from "react";
import register from "../assets/register.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {registerUser}from '../slices/authSlice';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Register = () => {
    const[email, setEmail]=useState("");
    const[password, setPassword]=useState("");
    const [name, setName]=useState("");
    const dispatch=useDispatch();
     const navigation=useNavigate();
        const location=useLocation();
        const {user,guestId}=useSelector((state)=>state.auth);
        const {cart}=useSelector((state)=>state.cart);
        const redirect=new URLSearchParams(location.search).get("redirect")||"/";
        const isCheckoutRedirect=redirect.includes("checkout");
    
        useEffect(()=>{
          if(user){
            if(cart?.products.length>0 && guestId){
              dispatch(mergeCart({guestId,user})).then(()=>{
                navigation(isCheckoutRedirect?"/checkout":"/");
              });
            }else{
               navigation(isCheckoutRedirect?"/checkout":"/");
            }
          }
        },[user,guestId,cart,navigation,isCheckoutRedirect,dispatch]);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ name, email, password }));
    }
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-10 lg:px-20 bg-white">
        <div className="max-w-md w-full mx-auto">
          <p className="text-gray-900 text-center mb-10">
            Please Register your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder="Enter Name"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300"
            >
              Sign Up
            </button>

            <p className="text-center text-gray-500 text-sm mt-5">
              Do You have an account?{" "}
              <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-black font-semibold hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src=
          {register}
          alt="Register Illustration"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-3xl font-bold">Shop Smarter, Live Better</h2>
          <p className="text-gray-200 mt-2 max-w-sm">
            Discover premium fashion and lifestyle essentials tailored just for
            you.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
