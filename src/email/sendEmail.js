const path = require('path');
const ejs = require('ejs');
const mailer = require('./mailer'); // ✅ Rename for clarity

const sendEmail = async (to, subject, templateName, data) => {
  console.log('Sending email to:', to);
  console.log('Subject:', subject);   
  console.log('Template:', templateName);
  console.log('Data:', data);

  try {
    // Ensure correct path to the EJS template
    const templatePath = path.join(__dirname, '..', 'email', 'template', templateName);
    console.log('Template path:', templatePath);

    // Render the EJS template
    const html = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    // ✅ Correct method call
    const info = await mailer.send(mailOptions);

    console.log('Email sent:', info.messageId || info.response);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
