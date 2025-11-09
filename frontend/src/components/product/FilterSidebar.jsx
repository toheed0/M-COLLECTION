import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const FilterSidebar = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    category: '',
    gender: '',
    color: '',
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 1000000,
  });

  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const category = ['Top-wear', 'Bottom-wear'];
  const color = ['red', 'blue', 'green', 'black', 'white', 'yellow'];
  const size = ['S', 'M', 'L', 'XL', 'XXL'];
  const material = ['Cotton', 'Polyester', 'Wool', 'Leather'];
  const brand = ['Nike', 'Adidas', 'Puma', 'Reebok'];
  const gender = ['Men', 'Women'];

  useEffect(() => {
    const param = Object.fromEntries([...searchParam]);
    setFilter({
      category: param.category || '',
      gender: param.gender || '',
      color: param.color || '',
      size: param.size ? param.size.split(',') : [],
      material: param.material ? param.material.split(',') : [],
      brand: param.brand ? param.brand.split(',') : [],
      minPrice: param.minPrice || 0,
      maxPrice: param.maxPrice || 100,
    });
    setPriceRange([param.minPrice || 0, param.maxPrice || 100000]);
  }, [searchParam]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedFilter = { ...filter };
    if (type === 'checkbox') {
      if (checked) updatedFilter[name] = [...(updatedFilter[name] || []), value];
      else updatedFilter[name] = updatedFilter[name].filter((item) => item !== value);
    } else updatedFilter[name] = value;

    setFilter(updatedFilter);
    updateUrlParams(updatedFilter);
  };

  const updateUrlParams = (updatedFilter) => {
    const param = new URLSearchParams();
    Object.keys(updatedFilter).forEach((key) => {
      if (Array.isArray(updatedFilter[key]) && updatedFilter[key].length > 0) {
        param.append(key, updatedFilter[key].join(','));
      } else if (updatedFilter[key]) {
        param.append(key, updatedFilter[key]);
      }
    });
    setSearchParam(param);
    navigate(`?${param.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const updatedFilter = { ...filter, minPrice: 0, maxPrice: newPrice };
    setFilter(updatedFilter);
    updateUrlParams(updatedFilter);
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-2xl shadow-xl space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Filters</h2>

      {/* Category */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Category</p>
        <div className="flex flex-col gap-2">
          {category.map((cat) => (
            <motion.label
              key={cat}
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filter.category === cat}
                onChange={handleFilterChange}
                className="accent-blue-600 w-5 h-5 cursor-pointer"
              />
              <span className="text-gray-700">{cat}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Gender</p>
        <div className="flex flex-col gap-2">
          {gender.map((gen) => (
            <motion.label
              key={gen}
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="radio"
                name="gender"
                value={gen}
                checked={filter.gender === gen}
                onChange={handleFilterChange}
                className="accent-blue-600 w-5 h-5 cursor-pointer"
              />
              <span className="text-gray-700">{gen}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Color</p>
        <div className="flex flex-wrap gap-3">
          {color.map((col) => (
            <motion.div
              key={col}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
              style={{ backgroundColor: col }}
            >
              <input
                type="checkbox"
                id={col}
                name="color"
                value={col}
                checked={filter.color === col}
                onChange={handleFilterChange}
                className="hidden"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {size.map((sz) => (
            <motion.label
              key={sz}
              className={`px-3 py-1 rounded-lg border cursor-pointer ${
                filter.size.includes(sz) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="checkbox"
                name="size"
                value={sz}
                checked={filter.size.includes(sz)}
                onChange={handleFilterChange}
                className="hidden"
              />
              {sz}
            </motion.label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Material</p>
        <div className="flex flex-wrap gap-2">
          {material.map((mat) => (
            <motion.label
              key={mat}
              className={`px-3 py-1 rounded-lg border cursor-pointer ${
                filter.material.includes(mat) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="checkbox"
                name="material"
                value={mat}
                checked={filter.material.includes(mat)}
                onChange={handleFilterChange}
                className="hidden"
              />
              {mat}
            </motion.label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Brand</p>
        <div className="flex flex-wrap gap-2">
          {brand.map((br) => (
            <motion.label
              key={br}
              className={`px-3 py-1 rounded-lg border cursor-pointer ${
                filter.brand.includes(br) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="checkbox"
                name="brand"
                value={br}
                checked={filter.brand.includes(br)}
                onChange={handleFilterChange}
                className="hidden"
              />
              {br}
            </motion.label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-gray-700 font-medium mb-2">Price Range</p>
        <input
  type="range"
  min={0}
  max={1000000}  // increased to 1 million (you can increase more if needed)
  step={1000}    // optional: smoother control
  value={priceRange[1]}
  onChange={handlePriceChange}
  className="w-full h-2 rounded-lg bg-gray-200 appearance-none cursor-pointer"
/>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSidebar;
