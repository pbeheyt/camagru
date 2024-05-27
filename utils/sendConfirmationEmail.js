const nodemailer = require('nodemailer')

async function sendConfirmationEmail(user) {
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
	  subject: 'Account Confirmation',
	  text: `Please confirm your account by clicking the following link: http://localhost:3000/confirm/${user.confirmationToken}`
	};
  
	await transporter.sendMail(mailOptions);
}

module.exports = sendConfirmationEmail;