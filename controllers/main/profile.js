const bcrypt = require('bcrypt');
const { client } = require('../../database/connect');

exports.updateUserInfo = async (req, res) => {
  const { email, username, 'current-password': currentPassword } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await client.query(query, [req.session.userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid current password' });
    }

    const updateFields = [];
    const updateValues = [];

    if (email) {
      updateFields.push('email');
      updateValues.push(email);
    }

    if (username) {
      updateFields.push('username');
      updateValues.push(username);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No information to update' });
    }

    const setClause = updateFields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const updateQuery = `UPDATE users SET ${setClause} WHERE id = $${updateFields.length + 1}`;
    await client.query(updateQuery, [...updateValues, req.session.userId]);

    res.status(200).json({ success: 'Information updated successfully' });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUserPassword = async (req, res) => {
  const { 'old-password': oldPassword, 'new-password': newPassword, 'confirm-new-password': confirmNewPassword } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await client.query(query, [req.session.userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid old password' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = `
      UPDATE users
      SET password = $1
      WHERE id = $2
      RETURNING *;
    `;
    await client.query(updateQuery, [hashedPassword, user.id]);

    res.status(200).json({ success: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const query = 'SELECT email, username FROM users WHERE id = $1';
    const result = await client.query(query, [req.session.userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};