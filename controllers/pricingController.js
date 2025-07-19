const Product = require('../models/product');
const Variant = require('../models/variant');

const calculateFinalPrice = (price, discount, type) => {
  let finalPrice = price;

  if (type === 'percentage') {
    finalPrice = price - (price * (discount / 100));
  } else if (type === 'fixed') {
    finalPrice = Math.max(price - discount, 0);
  }

  return parseFloat(finalPrice.toFixed(2)); // round to 2 decimal places
};

// Update pricing and discount for a product
exports.updateProductPricing = async (req, res) => {
  try {
    const { price, discount, discountType } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { price, discount, discountType },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const finalPrice = calculateFinalPrice(price, discount, discountType);
    res.json({ ...product._doc, finalPrice });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get product with final price after discount
exports.getProductWithDiscount = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) return res.status(404).json({ error: 'Product not found' });

    const finalProductPrice = calculateFinalPrice(product.price, product.discount, product.discountType);

    const variants = await Variant.find({ product: product._id });

    const variantsWithFinalPrice = variants.map((variant) => {
      const finalPrice = calculateFinalPrice(variant.price, variant.discount, variant.discountType);
      return {
        ...variant._doc,
        finalPrice,
      };
    });

    res.json({
      status: 'success',
      data: {
        ...product._doc,
        finalPrice: finalProductPrice,
        variants: variantsWithFinalPrice,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
