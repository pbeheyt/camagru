const transporter = require('./mailer');

async function sendPasswordResetEmail(user, req) {
  // Define email options
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

  // Send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendPasswordResetEmail;
