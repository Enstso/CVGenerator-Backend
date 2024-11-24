const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/jwt');
const recommendationController = require('../controllers/recommendation');

/**
 * @swagger
 * tags:
 *   name: Recommendation
 *   description: API for managing recommendations
 */

/**
 * @swagger
 * /api/recommendations:
 *   post:
 *     summary: Create a new recommendation
 *     description: Allows an authenticated user to create a recommendation for a specific CV.
 *     tags:
 *       - Recommendation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *                 description: The ID of the CV to associate the recommendation with.
 *                 example: mettre_id_du_cvè_cree
 *               content:
 *                 type: string
 *                 description: The content of the recommendation.
 *                 example: "Excellent developer with great communication skills."
 *               rating:
 *                 type: number
 *                 description: The rating of the recommendation (1-5).
 *                 example: 5
 *               user:
 *                 type: string
 *                 description: The ID of the user to associate the recommendation with.
 *                 example: mettre_id_utilisateur
 *     responses:
 *       201:
 *         description: Recommendation created successfully.
 *       400:
 *         description: Bad request - Invalid data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.post('/', verifyToken, recommendationController.createRecommendation)
/**
 * @swagger
 * /api/recommendations/{id}:
 *   get:
 *     summary: Get a recommendation by ID
 *     description: Retrieve the details of a specific recommendation by its ID.
 *     tags:
 *       - Recommendation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the recommendation to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved recommendation details.
 *       404:
 *         description: Recommendation not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id',recommendationController.getRecommendationById)
/**
 * @swagger
 * /api/recommendations/cv/{cvId}:
 *   get:
 *     summary: Get all recommendations for a specific CV
 *     description: Retrieve all recommendations associated with a specific CV by its ID.
 *     tags:
 *       - Recommendation
 *     parameters:
 *       - in: path
 *         name: cvId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the CV to retrieve recommendations for.
 *     responses:
 *       200:
 *         description: Successfully retrieved recommendations.
 *       404:
 *         description: CV not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/cv/:cvId',recommendationController.getRecommendationsByCv)
/**
 * @swagger
 * /api/recommendations/{id}:
 *   delete:
 *     summary: Delete a recommendation by ID
 *     description: Allows an authenticated user to delete their own recommendation by its ID.
 *     tags:
 *       - Recommendation
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the recommendation to delete.
 *     responses:
 *       200:
 *         description: Recommendation deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Recommendation not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', verifyToken, recommendationController.deleteRecommendation)
module.exports = router;