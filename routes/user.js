const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/userAuth");
userRouter.post("/signup", async (req, res) => {
  try {
    const { userName, email, password, address, role, phone } = req.body;
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({
      userName,
      email,
      password: passwordHash,
      address,
      role: role || "user",  // Default role to "user" if not provided
      phone
    });

    // Set the role to "admin" if username is "admin" and password is "admin"
    if (userName === "admin" && password === process.env.ADMIN_PASSWORD) {
      user.role = "admin";
    }

    // Save the user to the database
    await user.save();
    res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: " + err });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName: userName });
    if (!user) {
      res.status(404).json({ message: "Invalid credential" });
    }
    isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const authClaims = [{ name: user.userName }, { role: user.role }];
      const token = jwt.sign({ authClaims }, process.env.SECRETKEY, {
        expiresIn: "30d",
      });
      res.status(200).json({ id: user._id, role: user.role, token: token });
    } else {
      res.status(400).json({ message: "Invalid credential" });
    }
  } catch (err) {
    res.status(500).json({ message: "internal server error" + err });
  }
});

userRouter.get("/getUserInformation", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    if (!id) {
      return res
        .status(400)
        .json({ message: "User ID is required in the headers" });
    }

    const data = await User.findById(id).select("-password");

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Data fetched successfully", data });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
});

userRouter.put("/updateUser", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address, userName, email } = req.body;
    await User.findByIdAndUpdate(id, { address, userName, email });
    return res.status(200).json({ message: "user updated succesfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
});

module.exports = userRouter;
