'use strict';

const path = require('node:path');
const logger = require('./src/logger')(path.resolve(__dirname, './logs'));
const db = require('./db')(require('./knexfile'))('users');

(async () => {
  try {
    await db.query(`
        DROP TABLE IF EXISTS users;
      `);

    await db.query(`
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          birthdate DATE NOT NULL
        );
      `);
    logger.log('Table users created');
  } catch (error) {
    logger.error(error);
  } finally {
    await db.close();
    logger.log('Connection closed');
  }
})();
