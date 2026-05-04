import express from "express";
import sendEmail from "../utils/sendEmail.js";
import { isLoggedIn } from "../middlewares/authmiddleware.js";

const router = express.Router();

// @desc    Send contact email
// @route   POST /api/contact
// @access  Private
router.post("/", isLoggedIn, async (req, res) => {
  const { firstName, lastName, email, inquiryType, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }

  try {
    // 1. Send Email to Admin
    const emailHtml = `
      <div style="font-family: 'Playfair Display', serif; background-color: #f8f5f2; padding: 40px; border-radius: 20px;">
        <h2 style="color: #3e3e3e; text-align: center;">New Contact Message from ${firstName} ${lastName}</h2>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 15px; border: 1px solid #e0d8ce;">
          <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
          <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="background-color: #fdfaf7; padding: 20px; border-radius: 10px; font-style: italic;">"${message}"</p>
        </div>
        <p style="text-align: center; color: #8c8c73; font-size: 12px; margin-top: 20px;">Received via Reaina's Haven Contact Form</p>
      </div>
    `;

    await sendEmail({
      email: process.env.EMAIL_USER, // Send to the admin email
      subject: `New Inquiry: ${inquiryType} from ${firstName}`,
      html: emailHtml
    });

    // 2. Send Confirmation Email to User (Optional but professional)
    const userHtml = `
      <div style="font-family: serif; color: #3e3e3e; text-align: center; padding: 40px;">
        <h1 style="color: #a67c52;">Thank you for reaching out!</h1>
        <p>Dear ${firstName},</p>
        <p>We've received your message and our team will get back to you within 24 hours.</p>
        <div style="margin: 30px 0; padding: 20px; background: #fdfaf7; border-radius: 10px;">
          <p><strong>Your Message:</strong></p>
          <p>"${message}"</p>
        </div>
        <p>Warmly,<br/>The Reaina's Haven Team</p>
      </div>
    `;

    await sendEmail({
      email: email,
      subject: "We've received your message! - Reaina's Haven",
      html: userHtml
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
