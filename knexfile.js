'use strict';
require('dotenv').config();

module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    waitForConnections: true,
    idleTimeout: 10000,
    enableKeepAlive: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
  pool:{
    min: 0,
    max: 150
  },
  acquireConnectionTimeout:1000000,
};
