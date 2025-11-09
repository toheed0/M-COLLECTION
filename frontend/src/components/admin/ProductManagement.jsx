import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, deleteProduct } from '../../slices/adminProductslice';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct({ id }));
    }
  };

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-2xl mb-6 font-bold'>Products Management</h2>
       <Link
    to="/admin/products/new"
    className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
  >
    Add Product
  </Link>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className='overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='min-w-full'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 text-left'>Name</th>
              <th className='p-3 text-left'>Price</th>
              <th className='p-3 text-left'>SKU</th>
              <th className='p-3 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className='border-b'>
                  <td className='p-3'>{product.name}</td>
                  <td className='p-3'>${product.price}</td>
                  <td className='p-3'>{product.sku}</td>
                  <td className='p-3'>
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className='text-yellow-500 hover:underline'
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className='text-red-500 hover:underline ml-4'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4' className='p-3 text-center'>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
