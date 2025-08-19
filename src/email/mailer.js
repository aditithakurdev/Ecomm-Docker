const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter;

const transporterReady = (async () => {
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '********' : 'MISSING');

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use App Password if 2FA is enabled
    },
  });

  console.log('📧 Gmail Transporter Ready');
  console.log('Login:', process.env.EMAIL_USER);
})();

module.exports = {
  send: async (mailOptions) => {
    await transporterReady; // ✅ Ensure transporter is initialized

    if (!transporter) {
      throw new Error('❌ Transporter not ready');
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return info;
  }
};
