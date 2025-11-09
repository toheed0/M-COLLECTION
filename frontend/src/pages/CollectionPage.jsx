import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa6';
import FilterSidebar from '../components/product/FilterSidebar';
import SortOption from '../components/product/SortOption';
import ProductGrid from '../components/product/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilter } from '../slices/productsSlice';

const CollectionPage = () => {
    const{collection}=useParams();
    const[searchParams]=useSearchParams();
    const dispatch=useDispatch();
    const {products,loading,error}=useSelector((state)=>state.products);
const queryParams = Object.fromEntries(
  [...searchParams].filter(([key, value]) => value !== "")
);


    const[isProducts, setIsProducts] =useState([]);
    const sidebarRef=useRef(null);
    const [sidebarVisible, setSidebarVisible]=useState(false);
useEffect(() => {
    console.log("Collection:", collection);
    console.log("Query params:", queryParams);
    dispatch(fetchProductsByFilter({ collection, ...queryParams }));
}, [dispatch, collection, searchParams.toString()]);

    const toggleSidebar=()=>{
        setSidebarVisible(!sidebarVisible);
    }
    const handleout=(event)=>{
        if(sidebarRef.current && !sidebarRef.current.contains(event.target)){
            setSidebarVisible(false);
        }
    }

    useEffect(()=>{
        document.addEventListener("mousedown",handleout)
        return () => {
    document.removeEventListener("mousedown", handleout);
        }
    },[])

  return (
    <>
    <div className='flex flex-col lg:flex-row'>
        <button onClick={toggleSidebar} className='lg:hidden border p-2  flex items-center justify-center'>
            <FaFilter className='mr-2' />Filters
        </button>
        <div ref={sidebarRef} className={`${sidebarVisible ? "translate-x-0": "-translate-x-full" } fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
            <FilterSidebar />
        </div>
        <div className='flex-grow p-4 '>
            <h2 className='text-2xl uppercase mb-4'>All collection</h2>
            <SortOption/>

            <ProductGrid products={products} loading={loading} error={error}/>
        </div>
    </div>
    </>
  )
}

export default CollectionPage