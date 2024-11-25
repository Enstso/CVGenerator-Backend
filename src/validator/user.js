const { Validator } = require('jsonschema');
const UserModel = require('../models/User'); 

module.exports = {
    register: async (user) => {
        const validator = new Validator();
        const userSchema = {
            type: 'object',
            properties: {
                firstname: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 20,
                    errorMessage: 'User firstname is missing or incorrect'
                },
                lastname: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 20,
                    errorMessage: 'User lastname is missing or incorrect'
                },
                username: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 20,
                    errorMessage: 'User username is missing or incorrect'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    errorMessage: 'User email is missing or incorrect'
                },
                password: {
                    type: 'string',
                    minLength: 6,
                    errorMessage: "User's password must contain at least one uppercase letter and one digit",
                    pattern: '^(?=.*[A-Z])(?=.*[0-9]).+$'
                }
            },
            required: ['username','firstname', 'lastname', 'email', 'password']
        };

        // Validation de la structure JSON
        const result = validator.validate(user, userSchema);
        if (Array.isArray(result.errors) && result.errors.length) {
            let failedInputs = result.errors
                .map(error => error.schema?.errorMessage || error.message)
                .join(', ');
            return {
                success: false,
                message: failedInputs
            };
        }

        // Vérifier si l'utilisateur existe déjà (par email ou username)
        const existingUser = await UserModel.checkUserExists(user.email,user.username);
        if (existingUser) {
            return {
                success: false,
                message: 'User already exists with the provided email or username'
            };
        }
        // Validation réussie
        return { success: true };
    }
};
