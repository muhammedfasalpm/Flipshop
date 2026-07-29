
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// Add To Wishlist
export const addToWishlist = async (
  req,
  res
) => {
  try {
    const { userId, productId } = req.body;

    const product = await Product.findById(
      productId
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let wishlist =
      await Wishlist.findOne({
        user: userId,
      });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: [],
      });
    }

    const exists = wishlist.products.some(
      (item) =>
        item.toString() === productId
    );

    if (!exists) {
      wishlist.products.push(productId);
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      wishlist,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Wishlist
export const getWishlist = async (
  req,
  res
) => {
  try {
    const wishlist =
      await Wishlist.findOne({
        user: req.params.userId,
      }).populate("products");

    if (!wishlist) {
      return res.status(200).json({
        products: [],
      });
    }

    res.status(200).json(wishlist);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove From Wishlist
export const removeFromWishlist =
  async (req, res) => {
    try {
      const { userId } = req.body;

      const wishlist =
        await Wishlist.findOne({
          user: userId,
        });

      if (!wishlist) {
        return res.status(404).json({
          message: "Wishlist not found",
        });
      }

      wishlist.products =
        wishlist.products.filter(
          (product) =>
            product.toString() !==
            req.params.productId
        );

      await wishlist.save();

      res.status(200).json({
        success: true,
        wishlist,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

// Clear Wishlist
export const clearWishlist = async (
  req,
  res
) => {
  try {
    await Wishlist.findOneAndDelete({
      user: req.params.userId,
    });

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

