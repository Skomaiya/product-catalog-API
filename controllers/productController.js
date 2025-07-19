const Product = require('../models/product');
const Category = require('../models/category');



// Discount helper

function calculateDiscountedPrice(price, discount, discountType) {
  if (!discount || discount === 0) return price;

  let finalPrice = price;

  if (discountType === 'percentage') {
    finalPrice = price - (price * (discount / 100));
  } else if (discountType === 'fixed') {
    finalPrice = price - discount;
  }

  return parseFloat(finalPrice.toFixed(2));
}


// Create a product
exports.createProduct = async (req, res) => {
  try {
    if (req.body.category && typeof req.body.category === 'string') {
      const foundCategory = await Category.findOne({ name: req.body.category });
      if (!foundCategory) {
        return res.status(400).json({ error: 'Invalid category name provided' });
      }
      req.body.category = foundCategory._id;
    }

    const product = await Product.create(req.body);
    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Get all products with filters and discounted price
const Variant = require('../models/variant'); // Ensure this is imported

exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, inStock, size, color } = req.query;

    let filter = {};

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        return res.status(404).json({
          status: 'fail',
          message: 'Category not found',
        });
      }
    }


    let productQuery = Product.find(filter).populate('category');

    // Sort logic
    if (sort) {
      const sortOptions = {
        'price_asc': { createdAt: 1 }, // Temporary sorting (will refine after fetching variants)
        'price_desc': { createdAt: -1 },
        'date_newest': { createdAt: -1 },
        'date_oldest': { createdAt: 1 },
      };
      productQuery = productQuery.sort(sortOptions[sort] || {});
    }

    const products = await productQuery;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No products found with given filters',
      });
    }

    // Fetch variants for all products
    const productIds = products.map(p => p._id);
    let variantFilter = { product: { $in: productIds } };

    if (minPrice || maxPrice) {
      variantFilter.price = {};
      if (minPrice) variantFilter.price.$gte = parseFloat(minPrice);
      if (maxPrice) variantFilter.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') variantFilter.quantity = { $gt: 0 };
    if (size) variantFilter.size = size;
    if (color) variantFilter.color = color;

    const allVariants = await Variant.find(variantFilter);

    const transformed = products.map(product => {
      const productVariants = allVariants.filter(v => v.product.toString() === product._id.toString());

      const updatedVariants = productVariants.map(variant => ({
        ...variant.toObject(),
        finalPrice: calculateDiscountedPrice(variant.price, variant.discount || 0, variant.discountType || 'percentage')
      }));

      const productFinalPrice = calculateDiscountedPrice(product.price, product.discount, product.discountType);

      return {
        ...product.toObject(),
        finalPrice: productFinalPrice,
        variants: updatedVariants
      };
    });

    res.status(200).json({
      status: 'success',
      results: transformed.length,
      data: transformed,
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching products',
      error: error.message,
    });
  }
};


// Get product by ID with discounted prices
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('category');

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    const variants = await Variant.find({ product: id });

    const updatedVariants = variants.map(variant => ({
      ...variant.toObject(),
      finalPrice: calculateDiscountedPrice(variant.price, variant.discount || 0, variant.discountType || 'percentage'),
    }));

    const productFinalPrice = calculateDiscountedPrice(product.price, product.discount, product.discountType);

    res.status(200).json({
      status: 'success',
      data: {
        ...product.toObject(),
        finalPrice: productFinalPrice,
        variants: updatedVariants,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving product',
      error: error.message,
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    if (req.body.category && typeof req.body.category === 'string') {
      const foundCategory = await Category.findOne({ name: req.body.category });
      if (!foundCategory) {
        return res.status(400).json({ error: 'Invalid category name provided' });
      }
      req.body.category = foundCategory._id;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json({ message: 'Product updated', updated });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Increase product inventory
exports.increaseInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.inventory += amount;
    await product.save();

    res.status(200).json({ message: 'Inventory increased', product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Decrease product inventory
exports.decreaseInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.inventory < amount) {
      return res.status(400).json({ error: 'Not enough inventory available' });
    }

    product.inventory -= amount;
    await product.save();

    res.status(200).json({ message: 'Inventory decreased', product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get low stock products
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;

    const lowStockProducts = await Product.find({
      'variants.quantity': { $lt: threshold }
    }).populate('category');

    res.status(200).json({
      status: 'success',
      count: lowStockProducts.length,
      data: lowStockProducts,
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve low stock products',
      error: error.message,
    });
  }
};
