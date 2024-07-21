import mysql from 'mysql2/promise';
import config from './config.js';

async function initializeDatabase() {
  const pool = mysql.createPool(config.db);

  try {
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        PRIMARY KEY (id)
      )
    `;

    await pool.query(createUsersTableQuery);
    console.log('Users table created or already exists');

    const insertUsersQuery = `
      INSERT INTO users (id, name, email) 
      VALUES 
        ('exampleapikey1', 'John Doe', 'john.doe@example.com'),
        ('exampleapikey2', 'Jane Smith', 'jane.smith@example.com')
    `;

    try {
      await pool.query(insertUsersQuery);
      console.log('Sample data inserted into users table');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('Sample data already exists in the users table');
      } else {
        throw error;
      }
    }

  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await pool.end();
  }
}

initializeDatabase().catch(console.error);
