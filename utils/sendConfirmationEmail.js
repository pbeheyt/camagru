const transporter = require('./mailer');

async function sendConfirmationEmail(user, req) {
  // Define email options
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Account Confirmation',
    text: `Please confirm your account by clicking the following link: http://${req.headers.host}/confirm/${user.confirmationToken}`
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendConfirmationEmail;
