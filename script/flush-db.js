const { client, connectToDatabase } = require('../database/connect');

const flushDatabase = async () => {
  const tables = ['likes', 'comments', 'images', 'users'];
  try {
    console.log('Attempting to flush database...');
    await connectToDatabase(); // Ensure connection

    // Disable foreign key checks
    await client.query('SET session_replication_role = replica;');

    for (const table of tables) {
      console.log(`Dropping table ${table}...`);
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
      console.log(`Table ${table} dropped.`);
    }

    // Enable foreign key checks
    await client.query('SET session_replication_role = origin;');

    console.log('Database flushed successfully!');
  } catch (error) {
    console.error('Error flushing database:', error);
  } finally {
    try {
      await client.end(); // Close the database connection
      console.log('Database connection closed.');
    } catch (closeError) {
      console.error('Error closing the database connection:', closeError);
    }
  }
};

flushDatabase();
