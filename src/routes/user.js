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
 * /api/users:
 *   get:
 *     summary: Retrieve user information
 *     description: Fetch the information of the currently authenticated user. The authentication is done via a session-based JWT stored in a cookie.
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []  # Indicates that this route requires a cookie-based JWT
 *     responses:
 *       200:
 *         description: Successfully retrieved user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The user's username.
 *                   example: johndoe
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
 *         description: Unauthorized - Missing or invalid JWT cookie.
 *       500:
 *         description: Internal server error.
 */

router.get('/', verifyToken, userController.getMyInfos);

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Update user information
 *     description: Allows an authenticated user to update their personal information, including changing their password.
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: new_username
 *               firstname:
 *                 type: string
 *                 example: Jane
 *               lastname:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: jane.smith@example.com
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the user.
 *                 example: CurrentPassword123
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User updated successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid input or incorrect old password.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

router.put('/', verifyToken, userController.updateMyInfos);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete user account
 *     description: Deletes the authenticated user's account permanently.
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully.
 *       403:
 *         description: Unauthorized - Attempting to delete another user's account.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/',verifyToken,userController.deleteUser);
module.exports = router;

