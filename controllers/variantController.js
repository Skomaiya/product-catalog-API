const Variant = require('../models/variant');

exports.getAllVariants = async (req, res) => {
  try {
    const variants = await Variant.find().populate('product');
    res.status(200).json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createVariant = async (req, res) => {
  try {
    const variant = new Variant(req.body);
    const savedVariant = await variant.save();
    res.status(201).json(savedVariant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    const variantId = req.params.id;
    const updates = req.body;

    const updatedVariant = await Variant.findByIdAndUpdate(
      variantId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedVariant) {
      return res.status(404).json({ error: 'Variant not found' });
    }

    res.status(200).json(updatedVariant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getVariantsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await Variant.find({ product: productId });
    res.status(200).json(variants);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndDelete(req.params.id);
    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }
    res.status(200).json({ message: 'Variant deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
