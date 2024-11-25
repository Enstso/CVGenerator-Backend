const UserModel = require("../models/User");
const { register } = require("../validator/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {

  register: async (req, res) => {
    try {
      const newUser = req.body;
      const isNotValidateUser = await register(newUser);
      if (!isNotValidateUser.success) {
        return res.status(400).send({
          error: isNotValidateUser.message,
        });
      }
      newUser.password = await bcrypt.hash(newUser.password, 10);
      await UserModel.create(newUser);
      return res.status(201).send();
    } catch (error) {
      return res.status(500).send({
        message: "Some error occurred while registering user",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await UserModel.verifyLogin(email, password);
      if (!result.success) {
        return res.status(401).send({ error: result.message });
      }
      const secret = process.env.JWT_SECRET || "secret";
      const jwtData = {
        expiresIn: process.env.JWT_TIMEOUT_DURATION || "1h",
      };
      const token = jwt.sign({ email }, secret, jwtData);
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 3600000,
      });
      return res.status(200).send({
        message: "Login successful.",
      });
    } catch (error) {
      res.status(500).send({
        message: "Some error occurred while logging user",
      });
    }
  },

  logout: (req, res) => {
    try {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      return res.status(200).send({
        message: "Successfully logged out.",
      });
    } catch (error) {
      return res.status(500).send({
        message: "An error occurred while logging out.",
      });
    }
  }
};
