import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  console.log(`📧 Attempting to send email to: ${options.email}...`);
  
  if (!process.env.EMAIL_USER || !process.env.APP_PASSWORD) {
    console.error("❌ Email Error: EMAIL_USER or APP_PASSWORD missing in .env");
    throw new Error("Email configuration missing");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASSWORD, 
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `"Reaina's Haven" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    console.log("⏳ Sending mail via Gmail SMTP...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Nodemailer Error:", error.message);
    if (error.message.includes('EAUTH')) {
      console.error("🔑 Authentication failed! Check your APP_PASSWORD.");
    }
    throw error;
  }
};

export default sendEmail;
