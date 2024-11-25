const { verifyRecommendation } = require('../validator/recommendation');
const RecommendationModel = require('../models/Recommendation');
const CvModel = require('../models/CV');

module.exports = {

    createRecommendation: async (req, res) => {
        try {
            const isNotValid = verifyRecommendation(req.body);
            if (isNotValid) {
                return res.status(400).send({
                    error: isNotValid.message,
                });
            }
            const { cv, content, rating } = req.body;
            const cvExists = await CvModel.findById(cv);
            if (!cvExists) {
                return res.status(404).send({
                    message: 'CV not found',
                });
            }
            const newRecommendation = new RecommendationModel({
                user: req.user.id,
                cv,
                content,
                rating,
            });

            await newRecommendation.save();           
            res.status(201).send({
                success: true,
                message: 'Recommendation created successfully',
                recommendation: newRecommendation,
            });   
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: 'An error occurred while creating the recommendation',
            });
        }
    },

    getRecommendationsByCv: async (req, res) => {
        try {
            const { cvId } = req.params;
            const cvExists = await CvModel.findById(cvId);
            
            if (!cvExists) {
                return res.status(404).send({
                    message: 'CV not found',
                });
            }

            const recommendations = await RecommendationModel.find({ cv: cvId }).populate('user', 'firstName lastName email');
            res.status(200).send({
                success: true,
                recommendations,
            });
        } catch (error) {
            res.status(500).send({
                message: 'An error occurred while retrieving recommendations',
            });
        }
    },

    getRecommendationById: async (req, res) => {
        try {
            const { id } = req.params;

            const recommendation = await RecommendationModel.findById(id).populate('user', 'firstName lastName email');

            if (!recommendation) {
                return res.status(404).send({
                    message: 'Recommendation not found',
                });
            }

            res.status(200).send({
                success: true,
                recommendation,
            });
        } catch (error) {
            res.status(500).send({
                message: 'An error occurred while retrieving the recommendation',
            });
        }
    },
    
    updateRecommendation: async (req, res) => {
        try {
            const { id } = req.params;

            const isNotValid = verifyRecommendation(req.body);
            
            if (isNotValid) {
                return res.status(400).send({
                    error: isNotValid.message,
                });
            }

            const options = { new: true, runValidators: true };

            const updatedRecommendation = await RecommendationModel.findByIdAndUpdate(id, req.body, options);

            if (!updatedRecommendation) {
                return res.status(404).send({
                    message: 'Recommendation not found',
                });
            }

            if (updatedRecommendation.user.toString() !== req.user.id) {
                return res.status(403).send({
                    message: 'You are not authorized to update this recommendation',
                });
            }

            res.status(200).send({
                success: true,
                message: 'Recommendation updated successfully',
                recommendation: updatedRecommendation,
            });

        } catch (error) {
            res.status(500).send({
                message: 'An error occurred while updating the recommendation',
            });
        }
    },


    deleteRecommendation: async (req, res) => {
        try {
            const { id } = req.params;

            const recommendation = await RecommendationModel.findById(id);
            
            if (!recommendation) {
                return res.status(404).send({
                    message: 'Recommendation not found',
                });
            }

            if (recommendation.user.toString() !== req.user.id) {
                return res.status(403).send({
                    message: 'You are not authorized to delete this recommendation',
                });
            }

            await recommendation.remove();

            res.status(200).send({
                success: true,
                message: 'Recommendation deleted successfully',
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || 'An error occurred while deleting the recommendation',
            });
        }
    },
};