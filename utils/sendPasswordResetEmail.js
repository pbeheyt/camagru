const nodemailer = require('nodemailer')

async function sendPasswordResetEmail(user, req) {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Password Reset Request',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
    Please click on the following link, or paste this into your browser to complete the process:
    http://${req.headers.host}/reset-password/${user.passwordResetToken}
    If you did not request this, please ignore this email and your password will remain unchanged.
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendPasswordResetEmail;