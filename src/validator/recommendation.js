const { Validator } = require('jsonschema');

module.exports = {
    verifyRecommendation: (recommendation) => {
        const validator = new Validator();
        const recommendationSchema = {
            type: 'object',
            properties: {
                user: {
                    type: 'string',
                    pattern: '^[0-9a-fA-F]{24}$',
                    errorMessage: 'User ID must be a valid MongoDB ObjectId',
                },
                cv: {
                    type: 'string',
                    pattern: '^[0-9a-fA-F]{24}$',
                    errorMessage: 'CV ID must be a valid MongoDB ObjectId',
                },
                content: {
                    type: 'string',
                    minLength: 1,
                    errorMessage: 'Recommendation content is missing or invalid',
                },
                rating: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 5,
                    errorMessage: 'Rating must be an integer between 1 and 5',
                }
            },
            required: ['user', 'cv', 'content', 'rating'],
        };

        const result = validator.validate(recommendation, recommendationSchema);

        if (Array.isArray(result.errors) && result.errors.length) {
            let failedInputs = '';

            result.errors.forEach((error) => {
                failedInputs += (error.schema.errorMessage || error.message) + ', ';
            });

            return {
                message: failedInputs.trim().replace(/,$/, ''),
            };
        }


    }
}