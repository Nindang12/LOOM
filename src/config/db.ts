import mysql from 'mysql2/promise';

const createDbConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST,
      port: parseInt(process.env.PORT_SQL as string),
      user: 'root',
      password: process.env.PASSWORD ? process.env.PASSWORD : '',
      database: process.env.DATABASE
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