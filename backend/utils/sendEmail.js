import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  console.log(`📧 Sending email to: ${options.email} | Subject: ${options.subject}`);

  if (!process.env.EMAIL_USER || !process.env.APP_PASSWORD) {
    console.error("❌ EMAIL_USER or APP_PASSWORD is missing from environment variables!");
    throw new Error("Email configuration missing");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Reaina's Haven 🌿" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully via Gmail! MessageID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email via Gmail.");
    if (error.code === 'ESOCKET' || error.message.includes('10060') || error.code === 'ECONNRESET') {
      console.error("🚨 NETWORK ERROR: Your ISP is blocking Gmail SMTP. Falling back to Ethereal Test Email for debugging...");
      
      // Fallback to Ethereal Email for testing
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const testInfo = await testTransporter.sendMail(mailOptions);
      console.log("🟢 [DEBUG MODE] Email generated successfully via Ethereal!");
      console.log("📧 VIEW YOUR EMAIL HERE:", nodemailer.getTestMessageUrl(testInfo));
      return testInfo;
    } else {
      console.error(error.message);
      throw error;
    }
  }
};

export default sendEmail;
