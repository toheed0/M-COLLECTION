import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../slices/productsSlice";
import { addToCart } from "../../slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectSize, setSelectSize] = useState("");
  const [selectColor, setSelectColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;
  // 🔹 Fetch product details + similar
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  // 🔹 Set main image when product data loads
  useEffect(() => {
    if (selectProduct?.images?.length > 0) {
      setMainImage(selectProduct.images[0].url);
    }
  }, [selectProduct]);

  // 🔹 Handle quantity increment/decrement
  const handleQuantityChange = (type) => {
    if (type === "increment") setQuantity(quantity + 1);
    else if (type === "decrement" && quantity > 1) setQuantity(quantity - 1);
  };

  // 🔹 Add to cart handler
  const handleAddToCart = () => {
    if (!selectSize || !selectColor) {
      toast.error("Please select size and color", { duration: 1000 });
      return;
    }

    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectSize,
        color: selectColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to cart", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) return <p className="text-center">Loading product details...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      {selectProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Left thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectProduct.images?.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={img.altText || `thumbnail${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === img.url
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </div>

            {/* Main image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                <img
                  src={mainImage}
                  alt="main product"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Mobile thumbnails */}
            <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
              {selectProduct.images?.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={img.altText || `thumbnail${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === img.url
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </div>

            {/* Right side details */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectProduct.name}
              </h1>

              <p className="text-gray-600 mb-1 line-through text-lg">
                {selectProduct.discountPrice &&
                  `$${selectProduct.discountPrice}`}
              </p>

              <p className="text-xl text-gray-500 mb-2">
                ${selectProduct.price}
              </p>

              <p className="text-gray-500 mb-4">
                {selectProduct.description}
              </p>

              {/* Color Options */}
              <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-3">
                  {selectProduct.colors?.map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setSelectColor(clr)}
                      className={`w-8 h-8 rounded-full border ${
                        selectColor === clr
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: clr.toLowerCase(),
                        filter: "brightness(0.9)",
                      }}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Size Options */}
              <div className="mb-5">
                <p className="text-gray-700 mb-2">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectProduct.sizes?.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectSize(sz)}
                      className={`px-3 py-1 rounded border ${
                        selectSize === sz
                          ? "bg-black text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange("decrement")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increment")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`mb-4 px-6 py-2 text-white rounded-lg ${
                  isButtonDisabled
                    ? "opacity-50 cursor-not-allowed bg-gray-500"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "Add to Cart"}
              </button>

              {/* Characteristics */}
              <div className="mt-10 text-gray-600">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Collection</td>
                      <td className="py-1">
                        {selectProduct.collections}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1">Gender</td>
                      <td className="py-1">{selectProduct.gender}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="mt-20">
            <h3 className="text-2xl text-center font-medium mb-4">
              You may also like
            </h3>
            <ProductGrid products={similarProducts} loading={loading} error={error} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
