import React, { useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProductsByFilter, setFilters } from '../../slices/productsSlice';

const Searchbr = () => {

    const [searchTerm, setSearchTerm]=useState('');
    const [isopen, setIsOpen]=useState(false);
    const dispatch=useDispatch();
    const navigation=useNavigate();

    const handle = () => {
        setIsOpen(!isopen);
    }

    const handlesearch = (e) => {
        e.preventDefault();
        dispatch(setFilters({ search: searchTerm }));
        dispatch(fetchProductsByFilter({ search: searchTerm }));
        navigation(`/collection/all?search=${searchTerm}`);
        setIsOpen(false);
    }

  return (
    <>
    <div className={`flex items-center justify-center w-full translate-all duration-300 ${isopen ?"absolute top-0 left-0 w-full bg-white h-24 z-50":"w-auto" }`}>
        {
            isopen ? <form onSubmit={handlesearch} className='relative flex item-center justify-center w-full'>

                <div className='relative w-1/2'>
                <input type="text" placeholder='search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700' />

                <button type='submit' className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black '>
                <CiSearch className="w-6 h-6 " />
            </button>

                </div>

                <button type='button' onClick={handle} className='absolute right-4 top-1/2  transform -translate-y-1/2 text-gray-600 hover:text-black '>
                    <IoCloseSharp className="w-6 h-6 " />
                </button>

            </form> : <button onClick={handle}>
                <CiSearch className="w-6 h-6 " />
            </button>
        }
    </div>

    </>
  )
}

export default Searchbr