const UserModel = require("../models/User");
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
      const { username, firstname, lastname, email, password, oldPassword } =
        req.body; // Ensure password is included
      const userId = req.user.id;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      if (firstname) user.firstname = firstname;
      if (lastname) user.lastname = lastname;
      if (email) user.email = email;
      if (username) user.username = username;
      if (password != "") {
        if (oldPassword == req.user.password) {
          if (bcrypt.compare(password, req.user.password)) {
            user.password = await bcrypt.hash(password, 10);
            await user.save();
          }
        }
      }

      res.status(200).send({
        success: true,
        message: "User updated successfully",
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).send({
        message:
          error.message ||
          "Some error occurred while updating user informations",
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
        message: error.message || "An error occurred while deleting the User",
      });
    }
  },
};
