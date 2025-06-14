// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FiHeart,
  FiShoppingCart,
  FiMessageSquare,
  FiSend,
  FiChevronLeft,
} from "react-icons/fi";
import Rating from "../components/Rating";
import ProductCard from "../components/ProductCard";

const API_BASE_URL = "http://localhost:4040/api";
const USER_AUTH_TOKEN = localStorage.getItem("token");
const USER_INFO = "gopi"; // Placeholder for logged-in user

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [favoriteProcessing, setFavoriteProcessing] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        ...(USER_AUTH_TOKEN && { Authorization: `Bearer ${USER_AUTH_TOKEN}` }),
      },
    });
  }, []);

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get(`/product/${productId}`);
      setProduct(data);
      if (data.category) {
        fetchRelatedProducts(data.category, data._id);
      }
    } catch (err) {
      console.error("Failed to fetch product details:", err);
      setError(err.response?.data?.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  }, [productId, axiosInstance]);

  const fetchRelatedProducts = async (categoryName, currentProductId) => {
    try {
      const { data } = await axiosInstance.get(
        `/product/category/${encodeURIComponent(categoryName.toLowerCase())}`
      );
      const related = data
        .filter((p) => p._id !== currentProductId)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (err) {
      console.error("Failed to fetch related products:", err);
      setRelatedProducts([]);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      setQuantity(1);
      setReviewRating(0);
      setReviewComment("");
      setReviewError("");
      setReviewSuccess("");
    }
  }, [productId, fetchProductDetails]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= (product?.countInStock || 1)) {
      setQuantity(value);
    }
  };

  const addToCartHandler = async () => {
    if (!USER_INFO) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    try {
      await axiosInstance.post("/cart/add", {
        productId: product._id,
        quantity,
      });
      alert(`${quantity} x ${product.name} added to cart!`);
    } catch (err) {
      alert(
        `Failed to add to cart: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const addToFavoriteHandler = async () => {
    if (!USER_INFO) {
      alert("Please log in to add to favorites.");
      navigate("/login");
      return;
    }
    if (favoriteProcessing) return;

    setFavoriteProcessing(true);
    try {
      await axiosInstance.post(`/favourite/${product._id}`);
      alert(`${product.name} added to favorites.`);
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message === "Product already in favorites"
      ) {
        alert("This product is already in your favorites!");
      } else {
        alert(
          `Failed to add to favorites: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    } finally {
      setFavoriteProcessing(false);
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!USER_INFO) {
      alert("Please log in to submit a review.");
      navigate("/login");
      return;
    }
    if (reviewRating === 0 || reviewComment.trim() === "") {
      setReviewError("Please provide a rating and a comment.");
      return;
    }
    setReviewSubmitting(true);
    setReviewError("");
    setReviewSuccess("");
    try {
      await axiosInstance.post(`/product/${productId}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess(
        "Review submitted successfully! It may take some time to appear."
      );
      setReviewRating(0);
      setReviewComment("");
      fetchProductDetails();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center text-xl">
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500 text-xl">
        Error: {error || "Product not found."}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
      >
        <FiChevronLeft className="-ml-1 mr-2 h-5 w-5" />
        Back
      </button>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <div className="bg-gray-100 rounded-lg p-4 flex justify-center items-center shadow-lg">
          <img
            src={
              product.image ||
              "https://via.placeholder.com/600x600?text=No+Image"
            }
            alt={product.name}
            className="max-w-full max-h-[70vh] object-contain rounded-md"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              {product.category}
              {product.brand && ` | ${product.brand}`}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
              {product.name}
            </h1>
            <div className="mb-4">
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </div>
            <p className="text-3xl font-semibold text-blue-600 mb-4">
              ${product.price?.toFixed(2)}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              {product.description}
            </p>
            <p
              className={`mb-1 font-semibold ${
                product.countInStock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.countInStock > 0
                ? `${product.countInStock} In Stock`
                : "Out of Stock"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto">
            {product.countInStock > 0 && (
              <div className="flex items-center mb-6 space-x-4">
                <label htmlFor="quantity" className="font-medium text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map(
                    (x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
              >
                <FiShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={addToFavoriteHandler}
                disabled={favoriteProcessing}
                className="flex-1 flex items-center justify-center border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg shadow-sm"
              >
                <FiHeart className="mr-2 h-5 w-5" />
                {favoriteProcessing ? "Adding..." : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
          Customer Reviews
        </h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 bg-gray-50 rounded-lg shadow"
              >
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-gray-700">{review.name}</strong>
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Rating value={review.rating} />
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet for this product.</p>
        )}
      </div>

      {/* Write a Review */}
      {USER_INFO ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiMessageSquare className="mr-2 h-6 w-6 text-blue-500" />
            Write a Customer Review
          </h3>
          {reviewSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {reviewSuccess}
            </div>
          )}
          {reviewError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {reviewError}
            </div>
          )}
          <form onSubmit={submitReviewHandler}>
            <div className="mb-4">
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Rating
              </label>
              <select
                id="rating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="0">Select...</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Comment
              </label>
              <textarea
                id="comment"
                rows="4"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              <FiSend className="mr-2 h-5 w-5" />
              {reviewSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <p className="text-gray-700">
          Please{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            sign in
          </Link>{" "}
          to write a review.
        </p>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center border-t pt-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProd) => (
              <ProductCard key={relatedProd._id} product={relatedProd} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
