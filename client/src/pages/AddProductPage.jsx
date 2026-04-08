import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromCookie } from "../utils/cookie.js";
import { UploadProductImage, CreateProduct } from "../Api.js";
import toast from "react-hot-toast";

const AddProductPage = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const currentUser = getUserFromCookie();
  const token = currentUser?.token;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    category: "",
    countInStock: "",
  });

  const categories = [
    "Men's Clothing",
    "Women's Clothing",
    "Electronics",
    "Jewelery",
    "Home & Furniture",
    "Sports",
    "Books",
    "Toys",
    "Beauty",
    "Other",
  ];

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!token) {
      toast.error("Please login first");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const response = await UploadProductImage(token, file);
      console.log("Upload response:", response);
      setUploadedUrl(response.data.imageUrl);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login first");
      return;
    }

    const errors = [];
    if (!formData.name.trim()) errors.push("Product name is required");
    if (!formData.price || formData.price <= 0) errors.push("Valid price is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.brand.trim()) errors.push("Brand is required");
    if (!formData.category) errors.push("Category is required");
    if (!formData.countInStock || formData.countInStock < 0) errors.push("Valid stock quantity is required");
    if (!uploadedUrl) errors.push("Product image is required");

    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        countInStock: parseInt(formData.countInStock),
        image: uploadedUrl,
      };

      await CreateProduct(token, productData);
      toast.success("Product added successfully!");
      navigate("/shop");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className={`space-y-6 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6`}>
          {/* Image Upload */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Product Image *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                darkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg mx-auto" />
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Click to upload product image
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    JPG, PNG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {uploadedUrl && (
              <p className="mt-2 text-sm text-green-600">Image uploaded successfully!</p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
              }`}
              placeholder="Enter product name"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Stock Quantity *
              </label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
                placeholder="0"
              />
            </div>
          </div>

          {/* Brand and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
                placeholder="Enter brand name"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                list="categories"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
                placeholder="Enter or select category"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
              }`}
              placeholder="Enter product description"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;