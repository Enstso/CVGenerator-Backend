const { Validator } = require('jsonschema');
const validator = require('validator');
module.exports = {
    verifyCV: (cv) => {
        const validator = new Validator();
        const cvSchema = {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    minLength: '1',
                    errorMessage: 'CV title is missing or invalid',
                },
                summary: {
                    type: 'string',
                    minLength: '1',
                    errorMessage: 'CV summary is missing or invalid',
                },
                skills: {
                    type: 'array',
                    items: {
                        type: 'string',
                        minLength: 1,
                        errorMessage: 'Each skill must be a non-empty string'
                    },
                    minItems: 1,
                    errorMessage: 'Skills must contain at least one valid skill',
                },
                visibility: {
                    type: 'string',
                    enum: ['public','private'],
                    errorMessage: 'Visibility must be either "public" or "private"', 
                },
            },
            required : ['title', 'summary', 'skills'],
        };

        const result = validator.validate(cv, cvSchema);

        if (Array.isArray(result.errors) && result.errors.length){
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