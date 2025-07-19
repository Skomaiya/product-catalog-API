const Product = require('../models/product');
const Variant = require('../models/variant');

// Update product inventory
exports.updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Invalid stock value. Must be a non-negative number.' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { inventory: stock },
      { new: true }
    );

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update variant inventory
exports.updateVariantStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Invalid stock value. Must be a non-negative number.' });
    }

    const variant = await Variant.findByIdAndUpdate(
      req.params.id,
      { inventory: stock },
      { new: true }
    );

    if (!variant) return res.status(404).json({ error: 'Variant not found' });
    res.status(200).json(variant);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get products with low stock
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    if (isNaN(threshold) || threshold < 0) {
      return res.status(400).json({ error: 'Invalid threshold value' });
    }

    const lowStockProducts = await Product.find({ inventory: { $lt: threshold } });
    res.status(200).json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Optional: Get variants with low stock
exports.getLowStockVariants = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    if (isNaN(threshold) || threshold < 0) {
      return res.status(400).json({ error: 'Invalid threshold value' });
    }

    const lowStockVariants = await Variant.find({ inventory: { $lt: threshold } });
    res.status(200).json(lowStockVariants);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
