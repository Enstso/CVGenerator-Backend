const { verifyCV } = require("../validator/cv");
const CvModel = require("../models/CV");
const mongoose = require('mongoose');

module.exports = {
  createCV: async (req, res) => {
    try {
      // Validate the CV data using a validation function
      const isNotValid = verifyCV(req.body);
      if (!isNotValid.success) {
        return res.status(400).send({
          error: isNotValid.message,
        });
      }

      // Destructure required fields from the request body
      const { title, summary, experiences,education,skills, visibility } = req.body;
      console.log(experiences);

      // Create a new CV instance using the data provided in the request
      const newCV = new CvModel({
        user: req.user.id,
        title,
        summary,
        skills,
        experiences,
        education,
        visibility: visibility || "public"
      });
      console.log(newCV);
     await newCV.save();
      // Respond with success message and the created CV
      res.status(201).send({
        success: true,
        message: "CV created successfully",
        cv: newCV,
      });
    } catch (error) {
      res.status(500).send({
        message: "An error occurred while creating the CV",
      });
    }
  },

  getAllPublicCvs: async (req, res) => {
    try {
       // Retrieve all public CVs from the database
      const cvs = await CvModel.find({ visibility: "public" }).populate(
        "user", // Populate the user details (firstname, lastname, email)
        "firstname lastname email"
      );
      // Respond with the list of public CVs
      res.status(200).send({
        success: true,
        cvs,
      });
    } catch (error) {
      res.status(500).send({
        "An error occurred while retrieving CVs",
      });
    }
  },

  getCVById: async (req, res) => {
    try {
      const { id } = req.params;
      // Find the CV by its ID and populate user details
      const cv = await CvModel.findById(id).populate(
        "user",
        "firstname lastname email"
      );
    
      if (!cv) {
        return res.status(404).send({
          message: "CV not found",
        });
      }
      // Check if the CV is private and the current user is not the owner
      if (
        cv.visibility === "private" &&
        cv.user._id.toString() !== req.user.id
      ) {
        return res.status(403).send({
          message: "You are not authorized to view this CV",
        });
      }
      // Respond with the CV details
      res.status(200).send({
        success: true,
        cv,
      });
    } catch (error) {
      res.status(500).send({
        message: "An error occurred while retrieving the CV",
      });
    }
  },

  getCVsByUserId: async (req, res) => {
    try {

      const userId = req.user.id;

      // Find all CVs belonging to the user
      const cvs = await CvModel.find({ user: userId });
      if (!cvs || cvs.length === 0) {
        return res
          .status(404)
          .send({ message: "No CVs found for the specified user" });
      }

      // Respond with the user's CVs
      res.status(200).send({
        success: true,
        cvs,
      });
    } catch (error) {
      console.error("Error retrieving user CVs:", error);
      res
        .status(500)
        .send({ message: "An error occurred while retrieving CVs" });
    }
  },

  updateCV: async (req, res) => {
    try {
      const { id } = req.params;

      const isNotValid = verifyCV(req.body);
      if (!isNotValid.success) {
        return res.status(400).send({
          error: isNotValid.message,
        });
      }

      // Find and update the CV by its ID
      const updatedCv = await CvModel.findByIdAndUpdate(id, req.body, {
        new: true, // Return the updated document
      });

      if (!updatedCv) {
        return res.status(404).send({
          message: `CV with id=${id} not found`,
        });
      }

      if (updatedCv.user.toString() !== req.user.id) {
        return res.status(403).send({
          message: "You are not authorized to update this CV",
        });
      }

      // Respond with success message and updated CV data
      res.status(200).send({
        success: true,
        message: "CV updated successfully",
        data: updatedCv,
      });
    } catch (error) {
      res.status(500).send({
        message:
          `An error occurred while updating the CV`,
      });
    }
  },

  deleteCV: async (req, res) => {
    try {
      const { id } = req.params;

      // Find and delete the CV by its ID
      const cv = await CvModel.findByIdAndDelete(id);

      if (!cv) {
        return res.status(404).send({
          message: "CV not found",
        });
      }

      // Ensure the user deleting the CV is its owner
      if (cv.user.toString() !== req.user.id) {
        return res.status(403).send({
          message: "You are not authorized to delete this CV",
        });
      }

      res.status(200).send({
        success: true,
        message: "CV deleted successfully",
      });
    } catch (error) {
      res.status(500).send({
        message: `An error occurred while deleting the CV`,
      });
    }
  },
};
