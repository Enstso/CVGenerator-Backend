const UserModel = require('../models/User');
const { verifyUser } = require('../validator/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    register: async (req, res) => {
        try {
            const newUser = req.body;
            const isNotValidateUser = verifyUser(newUser);

            if (isNotValidateUser) {
                res.status(400).send({
                    error: isNotValidateUser.message
                });
            } else {
                newUser.password = await bcrypt.hash(newUser.password, 10);
                const { id, lastname, firstname, email } = await UserModel.create(newUser);

                res.send({
                    sucess: true,
                    user: {
                        id,
                        lastname,
                        firstname,
                        email
                    }
                });
            }
        } catch (error) {
            res.status(500).send({
                message: error.message || 'Some error occurred while registering user'
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(401).send({ message: 'Email or Password wrong' });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).send({ message: 'Email or Password wrong' });
            }

            const userData = {
                email: user.email
            };
            const secret = process.env.JWT_SECRET || 'secret';
            const jwtData = {
                expiresIn: process.env.JWT_TIMEOUT_DURATION || '1h'
            };

            const token = jwt.sign(userData, secret, jwtData);

            res.status(200).send({
                message: 'Successfully logged in',
                user: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    token
                }
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || 'some error occurred while logging user'
            });
        }
    }
};
