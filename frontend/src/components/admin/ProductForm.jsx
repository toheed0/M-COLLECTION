import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct, fetchAdminProducts } from "../../slices/adminProductslice";
import { toast } from "sonner";

const ProductForm = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    countInStock: 0,
    sku: "",
    sizes: ["M", "S", "L"],
    colors: ["Black"],
    collections: "Default",
    images: [], // store File objects
    brand: "",
    materials: "",
    gender: "Unisex",
    isFeatured: false,
    isPublished: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (name === "sizes" || name === "colors") {
      setForm({ ...form, [name]: value.split(",").map((v) => v.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (idx, file) => {
    const newImages = [...form.images];
    newImages[idx] = file; // store actual File object
    setForm({ ...form, images: newImages });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, null] });
  };

  const removeImageField = (idx) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    setForm({ ...form, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      toast.error("Please fill all required fields (Name, Price, Category)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("countInStock", form.countInStock);
      formData.append("sku", form.sku || "SKU" + Date.now());
      formData.append("sizes", form.sizes.join(","));
      formData.append("colors", form.colors.join(","));
      formData.append("collections", form.collections);
      formData.append("brand", form.brand);
      formData.append("materials", form.materials);
      formData.append("gender", form.gender);
      formData.append("isFeatured", form.isFeatured);
      formData.append("isPublished", form.isPublished);

      // Append all image files
      form.images.forEach((file) => {
        if (file) formData.append("images", file);
      });

      // Dispatch createProduct
      await dispatch(createProduct(formData)).unwrap();
      toast.success("Product created successfully!");
      dispatch(fetchAdminProducts());

      // Reset form
      setForm({
        name: "",
        price: "",
        description: "",
        category: "",
        countInStock: 0,
        sku: "",
        sizes: ["M"],
        colors: ["Black"],
        collections: "Default",
        images: [],
        brand: "",
        materials: "",
        gender: "Unisex",
        isFeatured: false,
        isPublished: false,
      });
    } catch (error) {
      toast.error(error.message || "Failed to create product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white shadow rounded-xl max-w-2xl mx-auto space-y-4"
      encType="multipart/form-data"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-700">Add Product</h2>

      {/* Basic fields */}
      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Product Name *" className="w-full border p-2 rounded" required />
      <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price *" className="w-full border p-2 rounded" required />
      <input type="text" name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="w-full border p-2 rounded" />
      <input type="number" name="countInStock" value={form.countInStock} onChange={handleChange} placeholder="Stock Count" className="w-full border p-2 rounded" />
      <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category *" className="w-full border p-2 rounded" required />
      <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />

      {/* Sizes and colors */}
      <input type="text" name="sizes" value={form.sizes.join(",")} onChange={handleChange} placeholder="Sizes (comma separated)" className="w-full border p-2 rounded" />
      <input type="text" name="colors" value={form.colors.join(",")} onChange={handleChange} placeholder="Colors (comma separated)" className="w-full border p-2 rounded" />

      {/* Collections, Brand, Materials, Gender */}
      <input type="text" name="collections" value={form.collections} onChange={handleChange} placeholder="Collections" className="w-full border p-2 rounded" />
      <input type="text" name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="w-full border p-2 rounded" />
      <input type="text" name="materials" value={form.materials} onChange={handleChange} placeholder="Materials" className="w-full border p-2 rounded" />
      <select name="gender" value={form.gender} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="Unisex">Unisex</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
      </select>

      {/* Images */}
      <div>
        <h4 className="font-semibold mb-2">Images</h4>
        {form.images.map((img, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-2">
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(idx, e.target.files[0])} className="border p-2 rounded w-1/2" />
            {img && (
              <img src={URL.createObjectURL(img)} alt={img.name} className="w-20 h-20 object-cover rounded" />
            )}
            <button type="button" onClick={() => removeImageField(idx)} className="bg-red-500 text-white px-2 rounded">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addImageField} className="bg-blue-500 text-white px-3 py-1 rounded">Add Image</button>
      </div>

      {/* Checkboxes */}
      <label className="flex items-center space-x-2">
        <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
        Featured
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
        Published
      </label>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Product</button>
    </form>
  );
};

export default ProductForm;
