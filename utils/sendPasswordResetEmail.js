const transporter = require('./mailer');

async function sendPasswordResetEmail(user, req) {
  // Define email options
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
            <a href="http://${req.headers.host}/reset-password/${user.passwordResetToken}" style="color: #ffffff; text-decoration: none;">Reset Password</a>
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

  // Send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendPasswordResetEmail;
