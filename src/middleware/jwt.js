const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            // Vérification de l'existence de l'en-tête Authorization
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).send({
                    success: false,
                    message: 'No token provided or malformed authorization header',
                });
            }

            // Extraction du token
            const token = authHeader.replace('Bearer ', '');

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
