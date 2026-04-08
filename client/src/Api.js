import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4040/api",
});

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

//products

// to get all products
const GetAllProducts = async () => await api.get("/product");

// to get product details
const GetProductById = async (id) => await api.get(`/product/${id}`);

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

export {
  Login,
  Register,
  GetAllProducts,
  GetAllCategories,
  GetProductById,
  GetProductsByCategory,
  GetProducts,
  UploadProductImage,
  CreateProduct,
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
};
