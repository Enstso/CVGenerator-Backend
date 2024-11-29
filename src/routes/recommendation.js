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
 *   get:
 *     summary: Get all recommendations by the authenticated user
 *     description: Retrieve all recommendations created by the authenticated user.
 *     tags:
 *       - Recommendation
 *     security:
 *       - cookieAuth: [] # JWT in cookies for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved recommendations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "12345"
 *                       content:
 *                         type: string
 *                         example: "Great collaborator and problem solver."
 *                       rating:
 *                         type: integer
 *                         example: 5
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.get('/',verifyToken,recommendationController.getRecommendationByUserId);


/**
 * @swagger
 * /api/recommendations:
 *   post:
 *     summary: Create a new recommendation
 *     description: Allows an authenticated user to create a new recommendation for a specific CV.
 *     tags:
 *       - Recommendation
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cvId:
 *                 type: string
 *                 description: The ID of the CV to associate the recommendation with.
 *                 example: "cv12345"
 *               content:
 *                 type: string
 *                 description: The content of the recommendation.
 *                 example: "Great team player and problem solver."
 *               rating:
 *                 type: integer
 *                 description: The rating for the recommendation (1-5).
 *                 example: 5
 *     responses:
 *       201:
 *         description: Recommendation created successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: CV not found.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "12345"
 *                 content:
 *                   type: string
 *                   example: "Great collaborator and problem solver."
 *                 rating:
 *                   type: integer
 *                   example: 5
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

router.get('/cv/:cvId',recommendationController.getRecommendationsByCv);
/**
 * @swagger
 * /api/recommendations/{id}:
 *   delete:
 *     summary: Delete a recommendation by ID
 *     description: Allows an authenticated user to delete their own recommendation by its ID.
 *     tags:
 *       - Recommendation
 *     security:
 *       - cookieAuth: []
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
router.delete('/:id', verifyToken, recommendationController.deleteRecommendation);
module.exports = router;