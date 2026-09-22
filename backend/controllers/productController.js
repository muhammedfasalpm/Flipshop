import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// Add Product (Admin)
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, brand, price, stock, rating } = req.body;

    if (!name || !description || !category || !brand || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // req.files is populated by multer-storage-cloudinary where file.path contains the secure Cloudinary HTTPS URL
    const images = req.files?.map((file) => file.path || file.secure_url) || [];

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one product image",
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      brand,
      price: Number(price),
      stock: Number(stock),
      rating: rating ? Number(rating) : 0,
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

// Get All Products (Supports Search, Filtering, Sorting & Pagination)
export const getProducts = async (req, res) => {
  try {
    const { search, category, sort, page, limit } = req.query;

    const queryFilter = {};

    // 1. Keyword Search (name, description, brand)
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      queryFilter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
      ];
    }

    // 2. Category Filter
    if (category && category.trim() !== "" && category.trim().toLowerCase() !== "all") {
      queryFilter.category = new RegExp(`^${category.trim()}$`, "i");
    }

    // 3. Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === "price_asc" || sort === "lowToHigh") {
      sortOptions = { price: 1 };
    } else if (sort === "price_desc" || sort === "highToLow") {
      sortOptions = { price: -1 };
    } else if (sort === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sort === "newest") {
      sortOptions = { createdAt: -1 };
    }

    // 4. Pagination
    const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 12;
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(queryFilter);
    const products = await Product.find(queryFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalProducts / limitNum) || 1;

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalProducts,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.body.name) product.name = req.body.name;
    if (req.body.description) product.description = req.body.description;
    if (req.body.category) product.category = req.body.category;
    if (req.body.brand) product.brand = req.body.brand;
    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.body.stock !== undefined) product.stock = Number(req.body.stock);

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path || file.secure_url);
      product.images = newImages;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Safely remove Cloudinary assets if present
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        if (imgUrl && imgUrl.includes("cloudinary.com")) {
          try {
            const parts = imgUrl.split("/");
            const filenameWithExt = parts.pop();
            const publicId = filenameWithExt.split(".")[0];
            const folderIndex = parts.indexOf("flipshop");
            if (folderIndex !== -1) {
              const fullPublicId = `${parts.slice(folderIndex).join("/")}/${publicId}`;
              await cloudinary.uploader.destroy(fullPublicId);
            }
          } catch (cloudErr) {
            console.error("Notice: Cloudinary asset deletion bypassed:", cloudErr.message);
          }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
