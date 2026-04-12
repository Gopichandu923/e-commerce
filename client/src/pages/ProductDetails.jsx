import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Rating from "../components/Rating";
import ProductCard from "../components/ProductCard";
import { getUserFromCookie } from "../utils/cookie.js";
import toast from "react-hot-toast";
import { 
  GetProductById, 
  GetProductsByCategory, 
  AddItemToCart, 
  AddItemToFavourites,
  SubmitProductReview
} from "../Api.js";

const ProductDetailPage = ({ darkMode = false }) => {
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

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await GetProductById(productId);
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
  }, [productId]);

  const fetchRelatedProducts = async (categoryName, currentProductId) => {
    try {
      const { data } = await GetProductsByCategory(categoryName.toLowerCase());
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
    const USER_INFO = getUserFromCookie();
    if (!USER_INFO) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    try {
      await AddItemToCart(USER_INFO.token, product._id);
      toast.success(`${quantity} x ${product.name} added to cart!`);
    } catch (err) {
      toast.error(
        `Failed to add to cart: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const addToFavoriteHandler = async () => {
    const USER_INFO = getUserFromCookie();
    if (!USER_INFO) {
      toast.error("Please log in to add to favorites.");
      navigate("/login");
      return;
    }
    if (favoriteProcessing) return;

    setFavoriteProcessing(true);
    try {
      await AddItemToFavourites(USER_INFO.token, product._id);
      toast.success(`${product.name} added to favorites.`);
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message === "Product already in favorites"
      ) {
        toast("This product is already in your favorites!", {
          icon: '❤️',
          style: {
            background: '#F59E0B',
            color: '#fff',
          },
        });
      } else {
        toast.error(
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
    const USER_INFO = getUserFromCookie();
    if (!USER_INFO) {
      toast.error("Please log in to submit a review.");
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
      await SubmitProductReview(USER_INFO.token, productId, reviewRating, reviewComment);
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
      <div className="container mx-auto p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#735c00]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-8 text-center text-[#ba1a1a]">
        Error: {error || "Product not found."}
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center px-4 py-2 bg-[#f5f3f4] hover:bg-[#e4e2e3] text-[#041627] font-label text-sm rounded-lg transition-colors"
      >
        <span className="material-symbols-outlined mr-2 text-lg">arrow_back</span>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div className="bg-[#f5f3f4] rounded-xl p-8 flex justify-center items-center">
          <img
            src={
              product.image ||
              "https://via.placeholder.com/600x600?text=No+Image"
            }
            alt={product.name}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-sm text-[#44474c] mb-2 font-label uppercase tracking-wider">
              {product.category}
              {product.brand && ` | ${product.brand}`}
            </p>
            <h1 className="text-3xl lg:text-4xl font-headline font-bold text-[#041627] mb-4 tracking-tight">
              {product.name}
            </h1>
            <div className="mb-6">
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </div>
            <p className="text-3xl font-headline font-bold text-[#041627] mb-6">
              ${product.price?.toFixed(2)}
            </p>
            <p className="text-[#44474c] leading-relaxed mb-6 font-body">
              {product.description}
            </p>
            <p
              className={`mb-4 font-label text-sm tracking-wide ${
                product.countInStock > 0 ? "text-[#735c00]" : "text-[#ba1a1a]"
              }`}
            >
              {product.countInStock > 0
                ? `${product.countInStock} In Stock`
                : "Out of Stock"}
            </p>
          </div>

          <div className="mt-auto">
            {product.countInStock > 0 && (
              <div className="flex items-center mb-6 space-x-4">
                <label htmlFor="quantity" className="font-label text-[#44474c]">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="p-2 bg-[#f5f3f4] rounded-lg border-0 font-body text-[#041627]"
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
                className={`flex-1 flex items-center justify-center font-label text-sm tracking-widest uppercase py-3 px-6 rounded-lg ${
                  product.countInStock === 0
                    ? "bg-[#e4e2e3] text-[#44474c] cursor-not-allowed"
                    : "btn-gradient text-white hover:opacity-90"
                }`}
              >
                <span className="material-symbols-outlined mr-2 text-lg">shopping_cart</span>
                Add to Cart
              </button>
              <button
                onClick={addToFavoriteHandler}
                disabled={favoriteProcessing}
                className="flex-1 flex items-center justify-center border-2 border-[#f5f3f4] text-[#041627] hover:bg-[#f5f3f4] font-label text-sm tracking-widest uppercase py-3 px-6 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined mr-2 text-lg">favorite</span>
                {favoriteProcessing ? "Adding..." : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-headline font-bold text-[#041627] mb-8 pb-4 border-b border-[#f5f3f4]">
          Customer Reviews
        </h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="p-6 bg-[#f5f3f4] rounded-xl"
              >
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-[#041627] font-body">{review.name}</strong>
                  <span className="text-xs text-[#44474c] font-label">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Rating value={review.rating} />
                <p className="text-[#44474c] font-body mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#44474c] font-body">No reviews yet for this product.</p>
        )}
      </div>

      {getUserFromCookie() ? (
        <div className="p-8 bg-[#f5f3f4] rounded-xl mb-16">
          <h3 className="text-xl font-headline font-bold text-[#041627] mb-6 flex items-center">
            <span className="material-symbols-outlined mr-2 text-xl">edit</span>
            Write a Customer Review
          </h3>
          {reviewSuccess && (
            <div className="mb-4 p-3 bg-[#fed65b] text-[#241a00] rounded-lg font-label text-sm">
              {reviewSuccess}
            </div>
          )}
          {reviewError && (
            <div className="mb-4 p-3 bg-[#ffdad6] text-[#93000a] rounded-lg font-label text-sm">
              {reviewError}
            </div>
          )}
          <form onSubmit={submitReviewHandler}>
            <div className="mb-4">
              <label
                htmlFor="rating"
                className="block text-sm font-label text-[#44474c] mb-2"
              >
                Your Rating
              </label>
              <select
                id="rating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full sm:w-1/2 p-2.5 bg-white rounded-lg border-0 font-body text-[#041627]"
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
                className="block text-sm font-label text-[#44474c] mb-2"
              >
                Your Comment
              </label>
              <textarea
                id="comment"
                rows="4"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 bg-white rounded-lg border-0 font-body text-[#041627]"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="btn-gradient px-6 py-3 rounded-lg text-white font-label text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
            >
              {reviewSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <p className="text-[#44474c] font-body mb-16">
          Please{" "}
          <Link to="/login" className="text-[#735c00] hover:text-[#574500] transition-colors">
            sign in
          </Link>{" "}
          to write a review.
        </p>
      )}

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-headline font-bold text-[#041627] mb-8 text-center">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
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