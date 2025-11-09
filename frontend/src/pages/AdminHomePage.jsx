import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { fetchAdminProducts } from '../slices/adminProductslice';
import { fetchAllOrders } from '../slices/adminOrderSlice';

const AdminHomePage = () => {
const dispatch=useDispatch();
const {products,loading:productLoading,error:productError}=useSelector((state)=>state.adminProducts);
const {orders,totalOrders,totalSales, loading:orderLoading,error:orderError}=useSelector((state)=>state.adminOrders);

useEffect(()=>{
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
},[dispatch]);

  return (
    <>
    <div className='max-w-7xl mx-auto p-6'>
        <h1 className='text-3xl font-bold mb-6'>
            Admin Dashboard
        </h1>
        {productLoading || orderLoading ?(<p>Loading...</p>):productError?(
            <p className='text-red-500'>Error: {productError}</p>
        ):orderError?(
             <p className='text-red-500'>Error: {orderError}</p>
        ):(
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='p-4 shadow-md rounded-lg'>
                <h2 className='text-xl font-semibold'>Revenu</h2>
                <p className='text-2xl'>${totalSales.toFixed(2)}</p>
            </div>
             <div className='p-4 shadow-md rounded-lg'>
                <h2 className='text-xl font-semibold'>Total Orders</h2>
                <p className='text-2xl'>${totalOrders}</p>
                <Link to={'/admin/orders'} className='text-blue-600 hover:underline'>Manage Orders</Link>
            </div>
             <div className='p-4 shadow-md rounded-lg'>
                <h2 className='text-xl font-semibold'>Total Products</h2>
                <p className='text-2xl'>{products.length}</p>
                <Link to={'/admin/products'} className='text-blue-600 hover:underline'>Manage Products</Link>
            </div>
        </div>
        )}
        <div className='mt-6'>
            <h2 className='text-2xl font-bold mb-4'>Recent Orders</h2>
            <div className='overflow-x-auto'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Order ID</th>
                            <th className='py-3 px-4'>User</th>
                            <th className='py-3 px-4'>Total Price</th>
                            <th className='py-3 px-4'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} className='border-b'>
                                    <td className='py-3 px-4'>{order.id}</td>
                                    <td className='py-3 px-4'>{order.user.name}</td>
                                    <td className='py-3 px-4'>${order.totalPrice.toFixed(2)}</td>
                                    <td className='py-3 px-4'>{order.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='py-3 px-4 text-center'>No recent orders</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
  )
}

export default AdminHomePage