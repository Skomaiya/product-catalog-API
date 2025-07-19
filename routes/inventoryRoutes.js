const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Manage product and variant stock levels
 */

// Protected: Only admin can access inventory routes

/**
 * @swagger
 * /api/inventory/products/{id}/stock:
 *   patch:
 *     summary: Update the stock level of a product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Product stock updated successfully
 *       400:
 *         description: Invalid stock value
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.patch('/products/:id/stock', authentication, authorization('admin'), inventoryController.updateProductStock);

/**
 * @swagger
 * /api/inventory/products/low-stock:
 *   get:
 *     summary: Retrieve products with stock below a specified threshold
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: number
 *           default: 5
 *         required: false
 *         description: Inventory threshold
 *     responses:
 *       200:
 *         description: List of low-stock products
 *       400:
 *         description: Invalid threshold value
 *       500:
 *         description: Server error
 */
router.get('/products/low-stock', authentication, authorization('admin'), inventoryController.getLowStockProducts);

/**
 * @swagger
 * /api/inventory/variants/{id}/stock:
 *   patch:
 *     summary: Update the stock level of a variant
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Variant stock updated successfully
 *       400:
 *         description: Invalid stock value
 *       404:
 *         description: Variant not found
 *       500:
 *         description: Server error
 */
router.patch('/variants/:id/stock', authentication, authorization('admin'), inventoryController.updateVariantStock);

/**
 * @swagger
 * /api/inventory/variants/low-stock:
 *   get:
 *     summary: Retrieve variants with stock below a specified threshold
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: number
 *           default: 5
 *         required: false
 *         description: Inventory threshold
 *     responses:
 *       200:
 *         description: List of low-stock variants
 *       400:
 *         description: Invalid threshold value
 *       500:
 *         description: Server error
 */
router.get('/variants/low-stock', authentication, authorization('admin'), inventoryController.getLowStockVariants);

module.exports = router;
