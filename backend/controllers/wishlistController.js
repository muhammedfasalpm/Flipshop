import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// Add To Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const effectiveUserId = userId || req.user?._id;

    if (!effectiveUserId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({ user: effectiveUserId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: effectiveUserId,
        products: [],
      });
    }

    const exists = wishlist.products.some(
      (item) => item && item.toString() === productId
    );

    if (!exists) {
      wishlist.products.push(productId);
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Wishlist (Null-Safe)
export const getWishlist = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;

    const wishlist = await Wishlist.findOne({ user: userId }).populate("products");

    if (!wishlist) {
      return res.status(200).json({
        products: [],
      });
    }

    // Filter out null/deleted products
    const validProducts = (wishlist.products || []).filter((prod) => prod !== null);

    // Asynchronously save clean list if invalid items were found
    if (validProducts.length !== wishlist.products.length) {
      wishlist.products = validProducts.map((p) => p._id);
      await wishlist.save();
    }

    res.status(200).json({
      _id: wishlist._id,
      user: wishlist.user,
      products: validProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove From Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const effectiveUserId = req.body.userId || req.user?._id;
    const productId = req.params.productId;

    const wishlist = await Wishlist.findOne({ user: effectiveUserId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (product) => product && product.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Wishlist
export const clearWishlist = async (req, res) => {
  try {
    const effectiveUserId = req.params.userId || req.user?._id;
    await Wishlist.findOneAndDelete({ user: effectiveUserId });

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
