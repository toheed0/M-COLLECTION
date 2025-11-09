import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa6';
import AdminSidebr from './AdminSidebr';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const[issidebarOpen,setIsSidebarOpen]=useState(null);
    const toggleSidebar=()=>{
        setIsSidebarOpen(!issidebarOpen);
    }
  return (
    <>
    <div className='min-h-screen flex flex-col md:flex-row relative'>
        {/* mobile toggle button */}
        <div className='flex md:hidden p-4 bg-gray-900 text-white z-20
        '>
            <button onClick={toggleSidebar}>
                <FaBars size={24} />
                
            </button>
            <h1 className='ml-4 text-xl font-medium'>Admin Dashboard</h1>
        </div>

        {/* overlay for mobile sidebar */}
        {issidebarOpen && (
            <div className='fixed inset-0 z-10 bg-black bg-opacity-45 md:hidden' onClick={toggleSidebar}>
            </div>
        )}

        {/* Sidebar */}
        <div className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative transform ${issidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static z-20`}>

        {/* sidebar content */}
        <AdminSidebr/>
        </div>

        {/* main content */}

        <div className='flex-grow p-6 overflow-auto'>
            <Outlet/>
        </div>

    </div>
    </>
  )
}

export default AdminLayout