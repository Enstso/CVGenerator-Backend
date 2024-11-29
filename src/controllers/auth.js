const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { register } = require("../validator/user");

module.exports = {

  register: async (req, res) => {
    try {
      const { username, email, password, firstname, lastname } = req.body;
  
      // Ensure all required fields are provided
      if (!username || !email || !password || !firstname || !lastname) {
        return res.status(400).send({
          error: "Missing required fields: username, email, password, firstname, or lastname.",
        });
      }
  
      // Validate the user data (Assuming `register` is your validation function)
      const isNotValidateUser = await register(req.body);
      if (!isNotValidateUser.success) {
        return res.status(400).send({
          error: isNotValidateUser.message,
        });
      }
  
      // Check if the user already exists by email or username
      const existingUser = await UserModel.findOne({
        $or: [{ email }, { username }]
      });
      if (existingUser) {
        return res.status(400).send({
          error: "User with this email or username already exists.",
        });
      }
  
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        firstname,
        lastname,
      });
  
      await newUser.save();
  
      // Respond with a success message and some user details (without password)
      return res.status(201).send({
        success: true,
        message: "User registered successfully",
        user: {
          username: newUser.username,
          email: newUser.email,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
        },
      });
    } catch (error) {
      console.error("Error during registration:", error); // Log the error for debugging
      return res.status(500).send({
        message: "Some error occurred while registering the user",
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
