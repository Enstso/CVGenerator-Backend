const { Validator } = require('jsonschema');
const validator = require('validator');

module.exports = {
    verifyUser: (user) => {
        let validator = new Validator();
        let userSchema = {
            type: 'object',
            properties: {
                firstname: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 20,
                    errorMessage: 'User firstname is missinng or incorrect'
                },
                lastname: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 20,
                    errorMessage: 'User lastname is missinng or incorrect'
                },
                email: {
                    type: 'email',
                    format: 'email',
                    errorMessage: 'User email is missinng or incorrect'
                },
                password: {
                    type: 'string',
                    minLength: 6,
                    errorMessage: "User's password, must contain at least one uppercase letter and one digit",
                    pattern: '^(?=.*[A-Z])(?=.*[0-9]).+$'
                }
            },
            required: ['fistname', 'lastname', 'email', 'password']
        };
        
        const result = validator.validator(user, userSchema);

        if (Array.isArray(result.errors) && result.errors.length) {
            let failedInputs = '';

            result.errors.forEach((error) => {
                failedInputs += (error.schema.error || error.message) + ', '
            });
            return {
                message: failedInputs
            }
        }
    }
}
