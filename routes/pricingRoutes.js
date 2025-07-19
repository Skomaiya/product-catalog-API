const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

/**
 * @swagger
 * tags:
 *   name: Pricing
 *   description: Product pricing and discount management
*/

// Protected: Only admin can modify product pricing
/**
 * @swagger
 * /pricing/product/{id}:
 *   patch:
 *     summary: Update the price and discount details of a product
 *     tags: [Pricing]
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
 *               - price
 *               - discount
 *               - discountType
 *             properties:
 *               price:
 *                 type: number
 *                 minimum: 0
 *               discount:
 *                 type: number
 *                 minimum: 0
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *     responses:
 *       200:
 *         description: Product pricing updated successfully with final price returned
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.patch('/product/:id', authentication, authorization('admin'), pricingController.updateProductPricing);

// Public: Anyone can view product pricing
/**
 * @swagger
 * /pricing/product/{id}:
 *   get:
 *     summary: Retrieve a product along with its final price after applying discount
 *     tags: [Pricing]
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
 *         description: Product details with calculated final price
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/product/:id', pricingController.getProductWithDiscount);

module.exports = router;
