const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management including creation, retrieval, update, and deletion
 */

// Protected: Only admin can modify products
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *               discount:
 *                 type: number
 *                 minimum: 0
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid product data
 */
router.post('/', authentication, authorization('admin'), productController.createProduct);

/**
 * @swagger
 * /products/low-stock:
 *   get:
 *     summary: Retrieve products with stock below a given threshold
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: number
 *           default: 5
 *         description: Threshold value for low stock
 *     responses:
 *       200:
 *         description: Low-stock product list returned
 *       500:
 *         description: Server error
 */
router.get('/low-stock', authentication, authorization('admin'), productController.getLowStockProducts);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Product fields to update
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid update data
 */
router.patch('/:id', authentication, authorization('admin'), productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid product ID
 */
router.delete('/:id', authentication, authorization('admin'), productController.deleteProduct);

/**
 * @swagger
 * /products/{id}/increase-inventory:
 *   patch:
 *     summary: Increase product inventory
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Inventory increased
 *       400:
 *         description: Invalid request or product not found
 *       404:
 *         description: Product not found
 */
router.patch('/:id/increase-inventory', authentication, authorization('admin'), productController.increaseInventory);

/**
 * @swagger
 * /products/{id}/decrease-inventory:
 *   patch:
 *     summary: Decrease product inventory
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Inventory decreased
 *       400:
 *         description: Not enough inventory or invalid input
 *       404:
 *         description: Product not found
 */
router.patch('/:id/decrease-inventory', authentication, authorization('admin'), productController.decreaseInventory);

// Public: Anyone can view products
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products with optional filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, date_newest, date_oldest]
 *         description: Sort order
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         description: Filter by variant size
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter by variant color
 *     responses:
 *       200:
 *         description: List of products returned successfully
 *       404:
 *         description: No products found
 *       500:
 *         description: Server error
*/
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details with final price and variants
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid product ID
 */
router.get('/:id', productController.getProductById);

module.exports = router;