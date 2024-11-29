const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cv');
const { verifyToken } = require('../middleware/jwt');

/**
 * @swagger
 * tags:
 *   name: CV
 *   description: API for managing CVs
 */

/**
 * @swagger
 * /api/cvs:
 *   post:
 *     summary: Create a new CV
 *     description: Allows an authenticated user to create a new CV. Authentication is managed through a session cookie containing a JWT.
 *     tags:
 *       - CV
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Software Engineer
 *               summary:
 *                 type: string
 *                 example: Experienced in full-stack development.
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "React", "Node.js"]
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *                 example: public
 *     responses:
 *       201:
 *         description: CV created successfully.
 *       400:
 *         description: Bad request - Invalid data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

router.post('/', verifyToken, cvController.createCV);

/**
 * @swagger
 * /api/cvs:
 *   get:
 *     summary: Get all public CVs
 *     description: Retrieve a list of all public CVs visible to everyone.
 *     tags:
 *       - CV
 *     responses:
 *       200:
 *         description: Successfully retrieved list of CVs.
 *       500:
 *         description: Internal server error.
 */
router.get('/', cvController.getAllPublicCvs);

/**
 * @swagger
 * /api/cvs/{id}:
 *   get:
 *     summary: Get a specific CV
 *     description: Retrieve the details of a specific CV by its ID.
 *     tags:
 *       - CV
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the CV to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved CV details.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: CV not found.
 *       500:
 *         description: Internal server error.
 */

router.get('/:id', verifyToken,cvController.getCVById);

/**
 * @swagger
 * /api/cvs/{id}:
 *   put:
 *     summary: Update a CV
 *     description: Allows an authenticated user to update one of their CVs. Authentication is managed through a session cookie containing a JWT.
 *     tags:
 *       - CV
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the CV to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Title
 *               summary:
 *                 type: string
 *                 example: Updated Summary
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "React"]
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *                 example: private
 *     responses:
 *       200:
 *         description: CV updated successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: CV not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', verifyToken, cvController.updateCV);

/**
 * @swagger
 * /api/cvs/{id}:
 *   delete:
 *     summary: Delete a CV
 *     description: Allows an authenticated user to delete one of their CVs. Authentication is managed through a session cookie containing a JWT.
 *     tags:
 *       - CV
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the CV to delete.
 *     responses:
 *       200:
 *         description: CV deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: CV not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', verifyToken, cvController.deleteCV);

/**
 * @swagger
 * /api/cvs/user/myCvs:
 *   get:
 *     summary: Retrieve all CVs created by the authenticated user
 *     description: Returns a list of all CVs that belong to the currently authenticated user.
 *     tags:
 *       - CV
 *     security:
 *       - cookieAuth: [] # JWT session token
 *     responses:
 *       200:
 *         description: Successfully retrieved user's CVs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cvs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6744a42b5e47a033e03209bf"
 *                       title:
 *                         type: string
 *                         example: "Software Engineer"
 *                       summary:
 *                         type: string
 *                         example: "Experienced in full-stack development."
 *                       skills:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["JavaScript", "React", "Node.js"]
 *                       visibility:
 *                         type: string
 *                         enum: [public, private]
 *                         example: "public"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-11-25T16:22:03.274Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-11-25T16:22:03.274Z"
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       404:
 *         description: No CVs found for the user.
 *       500:
 *         description: Internal server error.
 */
router.get('/user/myCvs',verifyToken,cvController.getCVsByUserId);

module.exports = router;

