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

async function sendConfirmationEmail(user, req) {
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: user.email,
    subject: 'Account Confirmation',
    html: `
      <div style="background-color: #f5f5f5; font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <div style="background-color: #343a40; color: #ffffff; font-size: 24px; font-weight: bold; line-height: 1.2; padding: 20px; text-align: center;">
          Camagru
        </div>
        <div style="background-color: #ffffff; margin: 0 auto; max-width: 600px; padding: 20px;">
          <div style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            <p>Dear ${user.username},</p>
            <p>Thank you for signing up for Camagru!</p>
            <p>To complete the registration process, please click on the following link to confirm your account:</p>
          </div>
          <div style="background-color: #343a40; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; line-height: 1.2; padding: 10px 20px; text-align: center; text-decoration: none;">
            <a href="http://${req.headers.host}/confirm/${user.confirmationToken}" style="color: #ffffff; text-decoration: none;">Confirm Account</a>
          </div>
          <div style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
            <p>If you did not sign up for Camagru, please ignore this email and your account will not be created.</p>
            <p>Best regards,</p>
            <p>The Camagru App</p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

async function sendPasswordResetEmail(user, req) {
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <div style="background-color: #f5f5f5; font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <div style="background-color: #343a40; color: #ffffff; font-size: 24px; font-weight: bold; line-height: 1.2; padding: 20px; text-align: center;">
          Camagru
        </div>
        <div style="background-color: #ffffff; margin: 0 auto; max-width: 600px; padding: 20px;">
          <div style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            <p>Dear ${user.username},</p>
            <p>You are receiving this email because you (or someone else) have requested the reset of the password for your Camagru account.</p>
            <p>Please click on the following link to complete the process:</p>
          </div>
          <div style="background-color: #343a40; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; line-height: 1.2; padding: 10px 20px; text-align: center; text-decoration: none;">
            <a href="http://${req.headers.host}/password-reset/${user.passwordResetToken}" style="color: #ffffff; text-decoration: none;">Reset Password</a>
          </div>
          <div style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p>Best regards,</p>
            <p>The Camagru App</p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendConfirmationEmail,
  sendPasswordResetEmail,
};
