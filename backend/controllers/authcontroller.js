
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    console.log("1. Signup request received");

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    console.log("2. Creating user");

    const user = await User.create({
      name,
      email,
      password
    });

    console.log("3. User created:", user._id);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("4. JWT generated");

    if (req.io) {
      req.io.emit("newSignup", {
        name: user.name,
        email: user.email
      });
    }

    console.log("5. Sending response");

    return res.status(201).json({
      user,
      token
    });

  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      message: "Signup failed",
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  if (req.io) {
    req.io.emit("userLogin", {
      name: user.name,
      email: user.email
    });
  }

  res.json({ user, token });
};
