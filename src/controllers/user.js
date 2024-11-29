const UserModel = require("../models/User");
const { user } = require("../validator/user");

const bcrypt = require("bcrypt");

module.exports = {
  getMyInfos: async (req, res) => {
    try {
      const { username, firstname, lastname, email } = req.user;
      res.send({
        username,
        firstname,
        lastname,
        email,
      });
    } catch (error) {
      res.status(500).send({
        message: "Some error occurred on getting user informations",
      });
    }
  },

  updateMyInfos: async (req, res) => {
    try {
      const data = req.body;
      const userId = req.user.id;
  
      // Validate user input
      const isNotValidateUser = await user({
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      });
  
      if (!isNotValidateUser.success) {
        return res.status(400).send({
          error: isNotValidateUser.message,
        });
      }
  
      // Fetch user from database
      const userDb = await UserModel.findById(userId);
      if (!userDb) {
        return res.status(404).send({ error: "User not found" });
      }
  
      // Verify old password before updating
      const isPasswordValid = await bcrypt.compare(data.oldPassword, userDb.password);
      if (!isPasswordValid) {
        return res.status(400).send({ error: "Old password is incorrect" });
      }
  
      // Hash new password if provided
      let updatedPassword = userDb.password; // Retain old password by default
      if (data.password) {
        updatedPassword = await bcrypt.hash(data.password, 10);
      }
  
      // Update user in database
      const updateFields = {
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: updatedPassword,
      };
  
      await UserModel.updateOne({ _id: userId }, { $set: updateFields });
  
      // Respond with success
      res.status(200).send({
        success: true,
        message: "User updated successfully",
        user: {
          firstname: updateFields.firstname,
          lastname: updateFields.lastname,
          email: updateFields.email,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error); // Log for debugging
      res.status(500).send({
        message: "An error occurred while updating user information",
      });
    }
  },
  

  deleteUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await UserModel.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Ensure the current user is authorized to delete this user
      if (user.toString() !== req.user.id) {
        return res.status(403).send({
          message: "You are not authorized to delete this user",
        });
      }

      res.status(200).send({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).send({
        message: "An error occurred while deleting the User",
      });
    }
  },
};
