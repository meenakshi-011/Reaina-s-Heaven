import dotenv from 'dotenv';
import sendEmail from './utils/sendEmail.js';

dotenv.config();

const testMail = async () => {
  console.log("🧪 Starting standalone email test...");
  console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
  console.log("🔑 APP_PASSWORD:", process.env.APP_PASSWORD ? "SET (hidden)" : "NOT SET");

  try {
    await sendEmail({
      email: process.env.EMAIL_USER,
      subject: "Standalone Test Email - Reaina's Haven",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #a67c52;">Email System Check ✅</h2>
          <p>If you are reading this, your Nodemailer configuration is correct!</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    console.log("✅ Standalone test successful!");
  } catch (error) {
    console.error("❌ Standalone test failed!");
    console.error("Error details:", error);
  }
};

testMail();
