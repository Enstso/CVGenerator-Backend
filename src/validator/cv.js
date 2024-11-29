const { Validator } = require('jsonschema');

module.exports = {
    verifyCV: (cv) => {
        const validator = new Validator();
        const cvSchema = {
            type: 'object',
            properties: {
                title: { type: 'string', minLength: 1 },
                summary: { type: 'string', minLength: 1 },
                skills: {
                    type: 'array',
                    items: { type: 'string', minLength: 1 },
                    minItems: 1,
                },
                experiences: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            company: { type: 'string', minLength: 1 },
                            position: { type: 'string', minLength: 1 },
                            startDate: { type: 'string',  minLength: 1 },
                            endDate: { type: 'string',  minLength: 1 },
                            description: { type: 'string', minLength: 1 },
                        },
                        required: ['company', 'position', 'startDate'],
                    },
                },
                education: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            school: { type: 'string', minLength: 1 },
                            degree: { type: 'string', minLength: 1 },
                            startDate: { type: 'string',  minLength: 1 },
                            endDate: { type: 'string',  minLength: 1 },
                        },
                        required: ['school', 'degree', 'startDate'],
                    },
                },
                visibility: { type: 'string', enum: ['public', 'private'] },
            },
            required: ['title', 'summary', 'skills', 'experiences', 'education', 'visibility'],
        };

        const result = validator.validate(cv, cvSchema);
        if (Array.isArray(result.errors) && result.errors.length) {
            let failedInputs = result.errors
              .map((error) => error.schema?.errorMessage || error.message)
              .join(", ");
            return {
              success: false,
              message: failedInputs,
            };
          }
          // Validation réussie
          return { success: true };
    },
};
