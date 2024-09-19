import mysql from 'mysql2/promise';

const createDbConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'louisdevzz',
      password: 'Vohuunhan1310@',
      database: 'nexusocial'
    });

    console.log('Connected to the database');
    return connection;
  } catch (err) {
    console.error('Error connecting to database: ', err);
    throw err;
  }
};

const db = createDbConnection();

export default db;