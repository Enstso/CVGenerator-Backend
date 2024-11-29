const router = require('express').Router();
const userController = require('../controllers/user');
const { verifyToken } = require('../middleware/jwt');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for managing user information
 */

/**
 * @swagger
 * /api/users/me:
 *   post:
 *     summary: Get the current user's information
 *     description: Retrieve the information of the currently authenticated user based on the provided JWT token.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # Indicates that this route requires a bearer token
 *     responses:
 *       200:
 *         description: Successfully retrieved user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the user.
 *                   example: "670507e5a85e8b4542098ab9"
 *                 firstname:
 *                   type: string
 *                   description: The user's first name.
 *                   example: John
 *                 lastname:
 *                   type: string
 *                   description: The user's last name.
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   description: The user's email address.
 *                   example: john.doe@example.com
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *       500:
 *         description: Internal server error.
 */

router.get('/', verifyToken, userController.getMyInfos);

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Update user information
 *     description: Allows an authenticated user to update their personal information.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: jane.smith@example.com
 *               password:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Bad request - Invalid data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

router.put('/', verifyToken, userController.updateMyInfos);

router.delete('/',verifyToken,userController.deleteUser);
module.exports = router;

