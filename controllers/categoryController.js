const Category = require('../models/category');

// Create a category
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get single category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.status(200).json(category);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    return res.status(200).json({ message: 'Category updated', updated });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    return res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
