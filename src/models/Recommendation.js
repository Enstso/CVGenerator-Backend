const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecommendationSchema = new Schema(
    {
        cv:{
            type: Schema.Types.ObjectId,
            ref: 'Cv',
            required: 'true'
        },
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: 'true'
        },
        content:{
            type: String,
            required: true
        },
        rating:{
            type: Number,
            min: 1,
            max: 5
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('recommendation', RecommendationSchema);