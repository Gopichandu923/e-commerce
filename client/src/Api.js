import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4040/api",
});
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
const GetAllCategories = async () => await api.get("/product/categories/");

// to get products by categories
const GetProductsByCategory = async (category) =>
  await api.get(`/product/category/${category}`);

// to search products
const GetProducts = async (keyword) =>
  await api.get(`/product/search?keyword=${encodeURIComponent(keyword)}`);

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

//to add item to cart

const AddItemToCart = async (token, id) =>
  await api.post(`/product/add`, {
    productId: id,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// to update the cart

const UpdateCart = async (token, id, quantity) =>
  await api.put(`/cart/${id}`, {
    quantity: quantity,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  await api.post(`/favourite/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// to remove item from the favourites
const RemoveItemFromFavourites = async (token, id) =>
  await api.delete(`/favourite/${id}`, {
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
  GetCartItems,
  DeleteCartItem,
  DeleteCartItems,
  AddItemToCart,
  UpdateCart,
  GetFavouriteItems,
  RemoveItemFromFavourites,
  AddItemToFavourites,
};
