import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4040/api/",
});

// Login

const Login = async (data) => await api.post("/user/login", data);

// Signup

const Register = async (data) => await api.post("/user", data);

//products

// to get all products
const GetAllProducts = async () => await api.get("/product");

//to get all categories
const GetAllCategories = async () => await api.get("/");

// to get products by categories
const GetProductsByCategory = async (category) =>
  await api.get(`/product/category/${category}`);

//cart

//favourites
