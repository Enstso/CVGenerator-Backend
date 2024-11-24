const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            let token = req.headers['authorization'];
            if (!token) {
                res.status(401).send({
                    message: 'No token provided'
                });
            } else {
                token = token.replace('Bearer ', '');
                const decoded = jwt.verify(token, process.env.jwt || 'secret');
                const email = decoded.email;
                
                const user = await UserModel.findOne( { email } );
                if (!user) {
                    res.status(401).send({
                        message: 'Invalid token'
                    });
                }

                req.user = user;
                next();
            }
        } catch (error) {

            if (error.name === 'JsonWebTokenError'){
                return res.status(401).send({
                    message: 'Invalid token'
                });
            } else if (error.name === 'TokenExpireError'){
                return res.status(401).send({
                    message: 'Token expired'
                });
            }

            return res.status(500).send({
                message: error.message || 'Something went wrong'
            });
        }
    }
};