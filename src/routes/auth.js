const router = require("express").Router();
const authController = require("../controllers/auth");

/**
 * @swagger
 * tags:
 *      name: Authentication
 *      description: API for user authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The user's first name.
 *                 example: John
 *               lastname:
 *                 type: string
 *                 description: The user's last name.
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: P@ssw0rd!
 *     responses:
 *       201:
 *         description: User registered successfully.
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
 *                   description: The first name of the user.
 *                   example: John
 *                 lastname:
 *                   type: string
 *                   description: The last name of the user.
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: john.doe@example.com
 *       400:
 *         description: Bad request - Invalid input or missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Logs in a user and returns a JWT token for authenticated access.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: P@ssw0rd!
 *     responses:
 *       200:
 *         description: Successfully authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for accessing protected routes.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the user.
 *                       example: "670507e5a85e8b4542098ab9"
 *                     firstname:
 *                       type: string
 *                       description: The first name of the user.
 *                       example: John
 *                     lastname:
 *                       type: string
 *                       description: The last name of the user.
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                       example: john.doe@example.com
 *       401:
 *         description: Unauthorized - Email or password incorrect.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", authController.login);

router.get("/logout", authController.logout);

module.exports = router;
