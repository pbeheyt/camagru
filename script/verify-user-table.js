const { client, connectToDatabase } = require('../database/connect');

const verifyUserTableSchema = async () => {
  await connectToDatabase();

  const query = `
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'users';
  `;
  const result = await client.query(query);

  console.log('User table schema:', result.rows);

  await client.end();
};

verifyUserTableSchema();