import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4040/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message;
      if (message) {
        error.message = message;
      }
    }
    return Promise.reject(error);
  }
);

// Helper for multipart form data
const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

//user

// Login
const Login = async (data) => await api.post("/user/login", data);

// Signup
const Register = async (data) => await api.post("/user", data);

// Forgot Password
const ForgotPassword = async (email) => await api.post("/user/forgot-password", { email });

// Reset Password
const ResetPassword = async (token, password) => await api.put(`/user/reset-password/${token}`, { password });

// Verify Email
const VerifyEmail = async (token) => await api.post(`/user/verify-email/${token}`);

//products

// to get all products
const GetAllProducts = async () => await api.get("/product");

// to get product details
const GetProductById = async (id) => await api.get(`/product/${id}`);

// submit product review
const SubmitProductReview = async (token, id, rating, comment) =>
  await api.post(`/product/${id}/reviews`, { rating, comment }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//to get all categories
const GetAllCategories = async () => await api.get("/product/categories");

// to get products by categories
const GetProductsByCategory = async (category) =>
  await api.get(`/product/category/${category}`);

// upload product image
const UploadProductImage = async (token, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return await api.post("/product/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// create product
const CreateProduct = async (token, data) =>
  await api.post("/product", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// get my products
const GetMyProducts = async (token) =>
  await api.get("/product/my-products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// update product
const UpdateProduct = async (token, id, data) =>
  await api.put(`/product/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// delete product
const DeleteProduct = async (token, id) =>
  await api.delete(`/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// to search products
const GetProducts = async (keyword, page = 1, limit = 20, sort = "newest", minPrice, maxPrice, category, brand) => {
  const params = new URLSearchParams();
  params.append("keyword", keyword);
  params.append("page", page);
  params.append("limit", limit);
  params.append("sort", sort);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (category) params.append("category", category);
  if (brand) params.append("brand", brand);
  return await api.get(`/product/search?${params.toString()}`);
};

//cart

//to get all cart items
const GetCartItems = async (token) =>
  await api.get("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// to clear the cart
const DeleteCartItems = async (token) =>
  await api.delete("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//to add items to cart
const AddItemToCart = async (token, id) =>
  await api.post(
    `/cart/add`,
    { productId: id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// to update the cart
const UpdateCart = async (token, id, quantity) =>
  await api.put(
    `/cart/${id}`,
    { quantity: quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// to remove particular item from the cart
const DeleteCartItem = async (token, id) =>
  await api.delete(`/cart/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//favourites

// to get all favourites
const GetFavouriteItems = async (token) =>
  await api.get("/favourite", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// to add item to favourites
const AddItemToFavourites = async (token, id) =>
  await api.post(
    `/favourite/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// to remove item from the favourites
const RemoveItemFromFavourites = async (token, id) =>
  await api.delete(`/favourite/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//orders
const GetMyOrders = async (token) =>
  await api.get("/order/myorders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const GetOrderById = async (token, id) =>
  await api.get(`/order/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const AddOrder = async (token, data) =>
  await api.post("/order", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//address
const GetAddresses = async (token) =>
  await api.get("/address", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const AddAddress = async (token, data) =>
  await api.post("/address", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const UpdateAddress = async (token, id, data) =>
  await api.put(`/address/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const DeleteAddress = async (token, id) =>
  await api.delete(`/address/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const SetMainAddress = async (token, id) =>
  await api.patch(`/address/${id}/set-main`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// payment
const CreatePaymentOrder = async (token, amount) =>
  await api.post("/payment/order", { amount }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const VerifyPayment = async (token, data) =>
  await api.post("/payment/verify", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
  GetAllProducts,
  GetAllCategories,
  GetProductById,
  SubmitProductReview,
  GetProductsByCategory,
  GetProducts,
  UploadProductImage,
  CreateProduct,
  GetMyProducts,
  UpdateProduct,
  DeleteProduct,
  GetCartItems,
  DeleteCartItem,
  DeleteCartItems,
  AddItemToCart,
  UpdateCart,
  GetFavouriteItems,
  RemoveItemFromFavourites,
  AddItemToFavourites,
  GetMyOrders,
  GetOrderById,
  AddOrder,
  GetAddresses,
  AddAddress,
  UpdateAddress,
  DeleteAddress,
  SetMainAddress,
  CreatePaymentOrder,
  VerifyPayment,
};
