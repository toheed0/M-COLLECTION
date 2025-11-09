import React, { useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import CartContent from '../cart/CartContent';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Cart = ({ openCart, handleCart }) => {
    const navigate=useNavigate();
    const {user,guestId}=useSelector((state)=>state.auth);
    const {cart}=useSelector((state)=>state.cart);
    const userId=user?user._id:null;
    const handleCheckout=()=>{
        handleCart();
        if(!user){
            navigate('/login?redirect=checkout');

        }else{
            navigate('/checkout');
        }
        
    }
  return (
    <>
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/4 bg-white h-full shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${openCart ? "translate-x-0":"translate-x-full"}`}>

    <div className='flex justify-end p-4'>
        <button onClick={handleCart}>
            <IoCloseSharp className="w-6 h-6" />
        </button>

    </div>

    {/* cart contact area with scroll able  */}

    <div className='flex-grow p-4 overflow-y-auto'>
        <h2 className='text-xl mt-4 font-semibold'>Your Cart</h2>
        {cart && cart?.products?.length>0?(<CartContent cart={cart} userId={userId} guestId={guestId}/>):(
            <p className='text-center'>Your Cart is empty</p>
        )}
        

    </div>

    <div className='p-4 bg-white sticky bottom-0'>
        {cart && cart?.products?.length>0 && (
            <>
             <button onClick={handleCheckout} className='w-full bg-black text-white cursor-pointer py-3 px-2 hover:scale-95 rounded-lg font-semibold'>Check Out</button>
            </>
        )}
    </div>
    </div>
    </>
   
  )
}

export default Cart