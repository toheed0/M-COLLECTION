import React from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../../slices/cartSlice";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, userId, guestId, size, color }));
  };

  return (
    <div className="p-4 sm:p-6">
      {cart.products.map((product) => {
        const price = Number(product.price || 0);
        return (
          <div
            key={product._id || product.productId || product.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b pb-4 transition rounded-lg"
          >
            {/* Left: Image + Details */}
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-28 sm:w-20 sm:h-24 object-cover rounded-lg border"
              />

              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  Size: <span className="font-medium">{product.size}</span> | Color:{" "}
                  <span className="font-medium">{product.color}</span>
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center mt-3">
                  <button
                    onClick={() =>
                      handleAddToCart(product.productId || product._id, -1, product.quantity, product.size, product.color)
                    }
                    className="text-gray-600 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 text-lg font-medium"
                  >
                    -
                  </button>
                  <span className="mx-3 text-gray-700 font-medium">{product.quantity}</span>
                  <button
                    onClick={() =>
                      handleAddToCart(product.productId || product._id, 1, product.quantity, product.size, product.color)
                    }
                    className="text-gray-600 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Price + Delete */}
            <div className="flex justify-between sm:flex-col sm:items-end mt-4 sm:mt-0">
              <p className="text-lg font-semibold text-gray-800">${price.toFixed(2)}</p>
              <button
                onClick={() => handleRemoveFromCart(product.productId || product._id, product.size, product.color)}
                className="mt-2 hover:text-red-700 transition"
              >
                <MdDelete className="h-6 w-6 text-red-500" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartContent;
