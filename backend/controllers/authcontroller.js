import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password // Let the Mongoose pre-save hook hash the password
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Send Welcome Email
  try {
    await sendEmail({
      email: user.email,
      subject: "Welcome to Reaina's Haven! 🌿",
      message: `Hello ${user.name},\n\nWelcome to Reaina's Haven! We are so glad to have you with us.\n\nEnjoy our handmade products and cozy cafe!`,
      html: `<h1>Welcome, ${user.name}!</h1><p>Welcome to <b>Reaina's Haven</b>! 🌿</p><p>We are so glad to have you with us. Explore our 100% handmade collections and delightful cafe menu.</p><br/><p>Warm regards,<br/>The Reaina's Haven Team</p>`
    });
  } catch (err) {
    console.error("Email error:", err.message);
  }

  // Notify Admin of New Registration
  try {
    await sendEmail({
      email: process.env.EMAIL_USER,
      subject: `New User Registration: ${user.name}`,
      html: `
        <div style="font-family: serif; color: #3e3e3e; padding: 20px; border: 1px solid #e0d8ce; border-radius: 15px;">
          <h2 style="color: #a67c52;">New Haven Member! ✨</h2>
          <p>A new user has just registered on the platform:</p>
          <ul style="list-style: none; padding: 0;">
            <li><b>Name:</b> ${user.name}</li>
            <li><b>Email:</b> ${user.email}</li>
            <li><b>Date:</b> ${new Date().toLocaleString()}</li>
          </ul>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #8c8c73;">Please check the admin dashboard for more details.</p>
        </div>
      `
    });
  } catch (err) {
    console.error("Admin signup notification error:", err.message);
  }

  // Emit socket event for new signup
  if (req.io) {
    req.io.emit("newSignup", { name: user.name, email: user.email });
  }

  res.json({ user, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // We must explicitly select the password because it has select: false in the schema
  const user = await User.findOne({ email }).select('+password');

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

  // Emit socket event for user login
  if (req.io) {
    req.io.emit("userLogin", { name: user.name, email: user.email });
  }

  res.json({ user, token });
};