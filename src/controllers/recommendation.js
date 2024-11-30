const { verifyRecommendation } = require('../validator/recommendation');
const RecommendationModel = require('../models/Recommendation');
const CvModel = require('../models/CV');
const recommendation = require('../validator/recommendation');

module.exports = {

   getRecommendationByUserId: async (req,res) => {
        // Retrieve all recommendations created by the authenticated user
        const result = await RecommendationModel.find({user:req.user.id});

        // Respond with the user's recommendations
        return res.status(200).send({  success: true,
            recommendations:result});
    },
    createRecommendation: async (req, res) => {
        try {
            const isNotValid = verifyRecommendation(req.body);
            if (!isNotValid.success) {
                return res.status(400).send({
                    error: isNotValid.message,
                });
            }
            const { cvId, content, rating } = req.body;
            // Check if the associated CV exists
            const cvExists = await CvModel.findById(cvId);
            if (!cvExists) {
                return res.status(404).send({
                    message: 'CV not found',
                });
            }
            // Create a new recommendation instance
            const newRecommendation = new RecommendationModel({
                user: req.user.id, // Assign the recommendation to the authenticated user
                cv:cvId,
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
            // Check if the specified CV exists
            if (!cvExists) {
                return res.status(404).send({
                    message: 'CV not found',
                });
            }

            // Retrieve all recommendations for the specified CV
            const recommendations = await RecommendationModel.find({ cv: cvId }).populate('user', 'firstname lastname email');
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
            
            // Find the recommendation by its ID and populate user details
            const recommendation = await RecommendationModel.findById(id).populate('user', 'firstname lastname email');
            
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

            // Validate the updated recommendation data
            const isNotValid = verifyRecommendation(req.body);
            
            if (isNotValid) {
                return res.status(400).send({
                    error: isNotValid.message,
                });
            }

            // Update the recommendation with the new data
            const options = { new: true, runValidators: true }; // Return updated document and validate changes

            const updatedRecommendation = await RecommendationModel.findByIdAndUpdate(id, req.body, options);

            if (!updatedRecommendation) {
                return res.status(404).send({
                    message: 'Recommendation not found',
                });
            }

            // Ensure the authenticated user owns the recommendation
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

            // Find and delete the recommendation by its ID
            const recommendation = await RecommendationModel.findByIdAndDelete(id);
            
            if (!recommendation) {
                return res.status(404).send({
                    message: 'Recommendation not found',
                });
            }

            // Ensure the authenticated user owns the recommendation
            if (recommendation.user.toString() !== req.user.id) {
                return res.status(403).send({
                    message: 'You are not authorized to delete this recommendation',
                });
            }
          
            res.status(200).send({
                success: true,
                message: 'Recommendation deleted successfully',
            });
        
        } catch (error) {
            res.status(500).send({
                message: 'An error occurred while deleting the recommendation',
            });
        }
    },
};