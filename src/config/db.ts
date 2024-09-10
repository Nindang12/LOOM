const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'nindang',
    password: 'nindang123',
    database: 'nexusocial'
});

db.connect((err:any) => {
    if (err) {
        console.error('Error connecting to database: ', err);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = db;