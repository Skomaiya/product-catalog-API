const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

/**
 * @swagger
 * tags:
 *  name: Variants
 * description: Manage product variants including creation, retrieval, and deletion
*/

// Public: Anyone can view variants
/**
 * @swagger
 * /variants:
 *   get:
 *     summary: Get all variants
 *     tags: [Variants]
 *     responses:
 *       200:
 *         description: List of all variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Variant'
 *       500:
 *         description: Server error
 */
router.get('/', variantController.getAllVariants);

/**
 * @swagger
 * /variants/{productId}:
 *   get:
 *     summary: Get variants by product ID
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Variants for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Invalid product ID
 */
router.get('/:productId', variantController.getVariantsByProduct);

/**
 * @swagger
 * /variants/{id}:
 *   patch:
 *     summary: Update a variant by ID
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the variant to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 example: 33.49
 *               inventory:
 *                 type: integer
 *                 example: 18
 *               color:
 *                 type: string
 *                 example: "Red"
 *               size:
 *                 type: string
 *                 example: "Medium"
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *       400:
 *         description: Invalid request or data
 *       404:
 *         description: Variant not found
 */
router.patch('/:id', authentication, authorization('admin'), variantController.updateVariant);

// Protected: Only admin can create or delete variants
/**
 * @swagger
 * /variants:
 *   post:
 *     summary: Create a new variant
 *     tags: [Variants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VariantInput'
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Invalid input
 */
router.post('/', authentication, authorization('admin'), variantController.createVariant);

/**
 * @swagger
 * /variants/{id}:
 *   delete:
 *     summary: Delete a variant by ID
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the variant to delete
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *       404:
 *         description: Variant not found
 *       400:
 *         description: Invalid ID or request
 */
router.delete('/:id', authentication, authorization('admin'), variantController.deleteVariant);

module.exports = router;
