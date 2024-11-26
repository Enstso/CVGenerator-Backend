const { verifyCV } = require('../validator/cv');
const CvModel = require('../models/CV');

module.exports = {
    createCV: async (req,res) => {
        try {
            
            const isNotValid = verifyCV(req.body);
            if (isNotValid) {
                return res.status(400).send({
                    error: isNotValid.message,
                });
            }

            // Création du CV
            const { title, summary, skills, visibility } = req.body;

            const newCV = new CvModel({
                user: req.user.id,
                title,
                summary,
                skills,
                visibility: visibility || 'public',
            });

            await newCV.save();

            res.status(201).send({
                success: true,
                message: 'CV created successfully',
                cv: newCV,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || 'An error occurred while creating the CV',
            });
        }
    },

    getAllPublicCvs: async (req, res) => {
        try {
            const cvs = await CvModel.find({ visibility: 'public' }).populate('user', 'firstname lastname email');

            res.status(200).send({
                success: true,
                cvs,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || 'An error occurred while retrieving CVs',
            });
        }
    },

    getCVById: async (req, res) => {
        try {
            const { id } = req.params;

            const cv = await CvModel.findById(id).populate('user', 'firstname lastname email');

            if (!cv) {
                return res.status(404).send({
                    message: 'CV not found',
                });
            }

            if (cv.visibility === 'private' && cv.user._id.toString() !== req.user?.id) {
                return res.status(403).send({
                    message: 'You are not authorized to view this CV',
                });
            }

            res.status(200).send({
                success: true,
                cv,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || 'An error occurred while retrieving the CV',
            });
        }
    },

    updateCV: async (req, res) => {
        try {
            const { id } = req.params;

            
            const isNotValid = verifyCV(req.body);
            if (isNotValid) {
                return res.status(400).send({
                    error: isNotValid.message,
                });
            }

            const updatedCv = await CvModel.findByIdAndUpdate(id, req.body, {
                new: true
            });

            if (!updatedCv) {
                return res.status(404).send({
                    message: `CV with id=${id} not found`,
                });
            }

            if (updatedCv.user.toString() !== req.user.id) {
                return res.status(403).send({
                    message: 'You are not authorized to update this CV',
                });
            }
            res.status(200).send({
                success: true,
                message: 'CV updated successfully',
                data: updatedCv
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || `An error occurred while updating the CV with id=${req.params.id}`,
            });
        }
    },

    deleteCV: async (req, res) => {
        try {
            const { id } = req.params;
            const cv = await CvModel.findByIdAndDelete(id);

            if (!cv) {
                return res.status(404).send({
                    message: 'CV not found',
                });
            }

            if (cv.user.toString() !== req.user.id) {
                return res.status(403).send({
                    message: 'You are not authorized to delete this CV',
                });
            }

            res.status(200).send({
                success: true,
                message: 'CV deleted successfully',
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || `An error occurred while deleting the CV with id=${req.params.id}`,
            });
        }
    },
};
