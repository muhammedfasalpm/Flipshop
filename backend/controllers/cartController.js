import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Add To Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const effectiveUserId = userId || req.user?._id;

    if (!effectiveUserId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    const qty = parseInt(quantity, 10) > 0 ? parseInt(quantity, 10) : 1;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: effectiveUserId });

    if (!cart) {
      cart = new Cart({
        user: effectiveUserId,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product && item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
      cart.items[itemIndex].price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity: qty,
        price: product.price,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Cart (Null-Safe for Deleted Products)
export const getCart = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        items: [],
        totalPrice: 0,
      });
    }

    // Filter out items where the referenced product no longer exists in DB
    const validItems = cart.items.filter((item) => item.product !== null);

    // Recalculate total price safely
    const totalPrice = validItems.reduce(
      (acc, item) => acc + (item.product?.price || item.price || 0) * (item.quantity || 1),
      0
    );

    // If invalid/deleted items were filtered out, save cleaned cart asynchronously
    if (validItems.length !== cart.items.length) {
      cart.items = validItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price || item.price,
      }));
      cart.totalPrice = totalPrice;
      await cart.save();
    }

    res.status(200).json({
      _id: cart._id,
      user: cart.user,
      items: validItems,
      totalPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Quantity
export const updateQuantity = async (req, res) => {
  try {
    const { userId, quantity } = req.body;
    const effectiveUserId = userId || req.user?._id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: effectiveUserId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product && item.product._id.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity < 1 ? 1 : quantity;

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + (item.product?.price || item.price || 0) * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      items: cart.items.filter((i) => i.product !== null),
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove From Cart
export const removeFromCart = async (req, res) => {
  try {
    const effectiveUserId = req.body.userId || req.user?._id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: effectiveUserId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product && item.product.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    const effectiveUserId = req.params.userId || req.user?._id;
    await Cart.findOneAndDelete({ user: effectiveUserId });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
