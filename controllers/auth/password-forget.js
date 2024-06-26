const { generateToken, getTokenExpiration, sendPasswordResetEmail } = require('../../utils');
const { client } = require('../../database/connect');

exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await client.query(query, [email]);
        const user = result.rows[0];
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        const token = generateToken();
        const updateQuery = `
          UPDATE users
          SET "passwordResetToken" = $1, "passwordResetExpires" = $2
          WHERE email = $3
          RETURNING *;
        `;
        const updateResult = await client.query(updateQuery, [token, getTokenExpiration(), email]);
        const updatedUser = updateResult.rows[0];
    
        await sendPasswordResetEmail(updatedUser, req);
    
        return res.json({ success: 'Password reset request sent' });
      } catch (error) {
        console.error('Error requesting password reset:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    };
