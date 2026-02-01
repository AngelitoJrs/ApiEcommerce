const mysql = require('mysql2');
require('dotenv').config();

// Creamos la conexión usando las variables del archivo .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Exportamos la versión de promesas para usar async/await
module.exports = pool.promise();