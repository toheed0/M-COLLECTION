import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOption = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const handleSortChange = (e) => {
        const sortby = e.target.value;
        searchParams.set("sortby", sortby);
        setSearchParams(searchParams);
        
    }
  return (
    <>
    <div className='mb-4 flex item-center justify-end'>
        <select name="sort" id="sort" className='border p-2 rounded-md focus:outline-none' onChange={handleSortChange}
        value={searchParams.get("sortby") || ""}>
            <option value="priceLowToHigh">Default</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="popularity">Popularity</option>
        </select>
    </div>
    </>
  )
}

export default SortOption