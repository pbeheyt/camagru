const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASS,
  }
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
}

function generateEmailHtml(content, options = {}) {
  const {
    backgroundColor = '#ffffff',
    headerBackgroundColor = '#3786dd',
    headerTextColor = '#ffffff',
    bodyBackgroundColor = '#ffffff',
    textColor = '#000000',
  } = options;

  return `
    <div style="background-color: ${backgroundColor}; font-family: Arial, sans-serif; margin: 0; padding: 0;">
      <div style="background-color: ${headerBackgroundColor}; color: ${headerTextColor}; font-size: 24px; font-weight: bold; line-height: 1.2; padding: 20px; text-align: center;">
        Camagru
      </div>
      <div style="background-color: ${bodyBackgroundColor}; margin: 0 auto; max-width: 600px; padding: 20px;">
        <div style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; color: ${textColor};">
          ${content}
        </div>
        <div style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
          <p>Best regards,</p>
          <p>The Camagru App</p>
        </div>
      </div>
    </div>
  `;
}

async function sendConfirmationEmail(user, req) {
  const content = `
    <p>Dear ${user.username},</p>
    <p>Thank you for signing up for Camagru!</p>
    <p>To complete the registration process, please click on the following link to confirm your account:</p>
    <div style="background-color: #343a40; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; line-height: 1.2; padding: 10px 20px; text-align: center; text-decoration: none;">
      <a href="http://${req.headers.host}/confirm/${user.confirmationToken}" style="color: #ffffff; text-decoration: none;">Confirm Account</a>
    </div>
    <p>If you did not sign up for Camagru, please ignore this email and your account will not be created.</p>
  `;
  const html = generateEmailHtml(content);

  await sendEmail(user.email, 'Account Confirmation', html);
}

async function sendPasswordResetEmail(user, req) {
  const content = `
    <p>Dear ${user.username},</p>
    <p>You are receiving this email because you (or someone else) have requested the reset of the password for your Camagru account.</p>
    <p>Please click on the following link to complete the process:</p>
    <div style="background-color: #343a40; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; line-height: 1.2; padding: 10px 20px; text-align: center; text-decoration: none;">
      <a href="http://${req.headers.host}/password-reset/${user.passwordResetToken}" style="color: #ffffff; text-decoration: none;">Reset Password</a>
    </div>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;
  const html = generateEmailHtml(content);

  await sendEmail(user.email, 'Password Reset Request', html);
}

async function sendCommentNotificationEmail(imageUserEmail, imageUserUsername, commenterUsername, commentText) {
  const content = `
    <p>Dear ${imageUserUsername},</p>
    <p>User ${commenterUsername} commented on your image: ${commentText}</p>
  `;
  const html = generateEmailHtml(content);

  await sendEmail(imageUserEmail, 'New comment on your image', html);
}

module.exports = {
  sendEmail,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendCommentNotificationEmail,
};
