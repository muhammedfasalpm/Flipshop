
import Product from "../models/Product.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      stock,
      rating,
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      !brand ||
      !price ||
      !stock
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const images =
      req.files?.map((file) => file.path) || [];

    const product = await Product.create({
      name,
      description,
      category,
      brand,
      price,
      stock,
      rating,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.price = req.body.price;
    product.stock = req.body.stock;

    if (req.files && req.files.length > 0) {
      product.images = req.files.map(
        (file) => file.path
      );
    }

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

