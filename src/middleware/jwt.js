const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            console.log(req.headers);

            // Vérification de l'existence du cookie contenant le JWT
            const token = req.cookies?.jwt; // Utilisation de req.cookies.jwt si express-cookie-parser est utilisé

            if (!token) {
                return res.status(401).send({
                    success: false,
                    message: 'No token provided in cookies',
                });
            }

            // Vérification et décodage du token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            const user = await UserModel.findOne({ email: decoded.email });

            // Vérification de l'utilisateur
            if (!user) {
                return res.status(401).send({
                    success: false,
                    message: 'Invalid token: user not found',
                });
            }

            // Ajout des informations utilisateur à la requête
            req.user = user;
            next();
        } catch (error) {
            // Gestion des erreurs JWT spécifiques
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).send({
                    success: false,
                    message: 'Invalid token',
                });
            } else if (error.name === 'TokenExpiredError') {
                return res.status(401).send({
                    success: false,
                    message: 'Token expired',
                });
            }

            // Autres erreurs inattendues
            return res.status(500).send({
                success: false,
                message: error.message || 'Something went wrong',
            });
        }
    },
};
