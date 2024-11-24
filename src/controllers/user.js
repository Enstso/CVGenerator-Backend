const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {
    getMyInfos: async (req,res) => {
        try {
            const { id, firstName, lastName, email } = req.user;
            res.send([
                id,
                firstName,
                lastName,
                email
            ]);
        } catch (error) {
            res.status(500).send({
                message: error.message || 'Some error occurred on getting user informations'
        })
        }
    },
    updateMyInfos: async (req,res) => {
        try {
            const { firstName, lastName, email } = req.body;
            const userId = req.user.id;

            const user = await UserModel.findById(userId);
            if (!user){
                return res.status(404).send({
                    message: 'User not found'
                });
            }

            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (email) user.email = email;
            if (password) {
                user.password = await bcrypt.hash(password, 18);
            }

            await user.save();

            res.status(200).send({
                success: true,
                message: 'User updated successfully',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            });

        } catch (error) {
            res.status(500).send({
                message: error.message || 'Some error occured while updating user informations',
            });
        }
    }
}