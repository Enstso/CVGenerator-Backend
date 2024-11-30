const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CvSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        title: {
            type: String,
            required: true
        },
        summary: {
            type: String
        },
        skills: [String],
        experiences: [
            {
                company: String,
                position: String,
                startDate: Date,
                endDate: Date,
                description: String,
            },
        ],
        education: [
            {
                school: String,
                degree: String,
                startDate: Date,
                endDate: Date,
            }
        ],
        visibility: {
            type: String, 
            enum: ['public', 'private'],
            default: 'public'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('cv', CvSchema);
