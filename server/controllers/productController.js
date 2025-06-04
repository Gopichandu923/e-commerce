import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    user: req.user._id,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    numReviews: 0,
    description: req.body.description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.status(200).json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categoriesWithImages = await Product.aggregate([
    {
      $match: {
        category: { $exists: true, $ne: null, $ne: "" },
        image: { $exists: true, $ne: null, $ne: "" },
      },
    },
    {
      $group: {
        _id: "$category",
        image: { $first: "$image" },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        image: 1,
      },
    },
    {
      $sort: { name: 1 },
    },
  ]);

  if (categoriesWithImages && categoriesWithImages.length > 0) {
    res.status(200).json(categoriesWithImages);
  } else {
    res.status(200).json([]);
  }
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  if (!category) {
    res.status(400);
    throw new Error("Category parameter is required");
  }
  const products = await Product.find({
    category: { $regex: category, $options: "i" },
  });
  if (products.length > 0) {
    res.status(200).json(products);
  } else {
    res.status(404);
    throw new Error("No products found under this category");
  }
});

const seacrhProducts = asyncHandler(async (req, res) => {
  const keywordQuery = req.query.keyword;

  if (!keywordQuery || keywordQuery.trim() === "") {
    res.status(400).json({ message: "Please provide a search keyword." });
    return;
  }

  const searchCriteria = {
    $or: [
      { name: { $regex: keywordQuery, $options: "i" } },
      { description: { $regex: keywordQuery, $options: "i" } },
      { category: { $regex: keywordQuery, $options: "i" } },
      { brand: { $regex: keywordQuery, $options: "i" } },
    ],
  };
  const products = await Product.find(searchCriteria).sort({ createdAt: -1 });

  res.json(products);
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllCategories,
  getProductsByCategory,
  seacrhProducts,
};
