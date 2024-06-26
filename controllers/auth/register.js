const bcrypt = require('bcrypt');
const { escapeHtml, isValidEmail, isValidPassword, generateToken, getTokenExpiration, sendConfirmationEmail } = require('../../utils');
const { client } = require('../../database/connect');

exports.handleRegister = async (req, res) => {
    const { email, username, password, 'confirm-password': confirmPassword } = req.body;
  
    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Email, username, and password are required.' });
    }
  
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
  
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.' });
    }
  
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
  
    const sanitizedEmail = escapeHtml(email);
    const sanitizedUsername = escapeHtml(username);
    const sanitizedPassword = escapeHtml(password);
  
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [sanitizedEmail]);
      const existingUser = result.rows[0];
  
      if (existingUser) {
        return res.status(409).json({ error: 'Email address is already in use.' });
      }
  
      const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
      const confirmationToken = generateToken();
      const confirmationTokenExpires = getTokenExpiration();
  
      const insertQuery = `
        INSERT INTO users (email, username, password, "confirmationToken", "confirmationTokenExpires", "isConfirmed")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const insertResult = await client.query(insertQuery, [sanitizedEmail, sanitizedUsername, hashedPassword, confirmationToken, confirmationTokenExpires, false]);
      const newUser = insertResult.rows[0];
  
      await sendConfirmationEmail(newUser, req);
  
      return res.status(201).json({ success: 'Your account has been successfully registered! Please check your email to confirm your account and complete the registration process.' });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };