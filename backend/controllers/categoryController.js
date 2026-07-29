import Category from "../models/Category.js";

// Add Category
export const addCategory = async (
  req,
  res
) => {
  try {
    const exists = await Category.findOne({
      name: req.body.name,
    });

    if (exists) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category =
      await Category.create({
        name: req.body.name,
      });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Categories
export const getCategories =
  async (req, res) => {
    try {
      const categories =
        await Category.find();

      res.status(200).json(
        categories
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  // Update Category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
      }
    );

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Category
export const deleteCategory =
  async (req, res) => {
    try {
      await Category.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        message:
          "Category deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };