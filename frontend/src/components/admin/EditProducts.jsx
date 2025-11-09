import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { fetchProductDetails, updateProduct } from "../../slices/adminProductslice";

const EditProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectProduct, loading, error } = useSelector((state) => state.adminProducts);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    materials: "",
    gender: "Unisex",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  // Prefill product form
  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectProduct) {
      setProductData({
        name: selectProduct?.name || "",
        description: selectProduct?.description || "",
        price: selectProduct?.price || 0,
        countInStock: selectProduct?.countInStock || 0,
        sku: selectProduct?.sku || "",
        category: selectProduct?.category || "",
        brand: selectProduct?.brand || "",
        sizes: selectProduct?.sizes || [],
        colors: selectProduct?.colors || [],
        collections: selectProduct?.collections || "",
        materials: selectProduct?.materials || "",
        gender: selectProduct?.gender || "Unisex",
        images: selectProduct?.images || [],
      });
    }
  }, [selectProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    setProductData((prev) => ({
      ...prev,
      [field]: e.target.value.split(",").map((item) => item.trim()),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProduct({ id, productData })).unwrap();
      navigate("/admin/products");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed: " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-8 shadow-xl rounded-3xl bg-gray-50 mt-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-700">Name</label>
          <input
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-700">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
            rows={4}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Stock */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Stock Quantity</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              required
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* SKU */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-gray-700">SKU</label>
          <input
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Sizes & Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Sizes (comma separated)</label>
            <input
              value={productData.sizes.join(", ")}
              onChange={(e) => handleArrayChange(e, "sizes")}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">Colors (comma separated)</label>
            <input
              value={productData.colors.join(", ")}
              onChange={(e) => handleArrayChange(e, "colors")}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Images */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-gray-700">Images</label>
          <input type="file" onChange={handleImageUpload} className="mb-2" />
          {uploading && <p className="text-blue-500">Uploading...</p>}
          <div className="flex flex-wrap gap-4 mt-2">
            {productData.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
                  alt={img.altText}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold p-3 rounded-xl shadow-lg transition duration-300">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProducts;
