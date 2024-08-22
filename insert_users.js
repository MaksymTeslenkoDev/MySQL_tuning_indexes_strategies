'use strict';
require('dotenv').config();
const path = require('node:path');
const { Readable, Writable } = require('node:stream');
const { faker } = require('@faker-js/faker');
const { performance } = require('node:perf_hooks');
const logger = require('./src/logger')(path.resolve(__dirname, './logs'));
const db = require('./db')(require('./knexfile'))('users');
const { parseAndFormatDeltaTime } = require('./tools/time');
const Formatter = require('./tools/formatter');

const TOTAL_USERS = parseInt(process.env.TOTAL_USERS_TO_INSERT);
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE);
const INDEX_TYPE = process.env.INDEX_TYPE || 'BTREE';

async function* generateUsers(total, batchSize) {
  let counter = 0;

  while (counter < total) {
    const usersBatch = [];

    for (let i = 0; i < batchSize; i++) {
      if (counter >= total) break;

      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
      };

      usersBatch.push(user);
      counter++;
    }

    yield usersBatch;
    await new Promise((resolve) => setImmediate(resolve));
  }
}

class DatabaseWritableStream extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true });
    this.insertedCount = 0;
  }

  async _write(chunk, encoding, callback) {
    try {
      await db.create(chunk);
      this.insertedCount += chunk.length;
      console.log(`${this.insertedCount}/${TOTAL_USERS} users inserted...`);
      callback();
    } catch (error) {
      logger.error(error);
      callback(error);
    }
  }

  _final(callback) {
    console.log('Finished writing all data to the database.');
    callback();
  }
}

const startTime = performance.now();
logger.log('---------------------------------');
logger.log(`Inserting ${Formatter.formatNumber(TOTAL_USERS)} users ...`);
logger.log(`Batch size: ${Formatter.formatNumber(BATCH_SIZE)}`);
logger.log(`Index type: ${INDEX_TYPE}`);
logger.log(
  `INNODB_FLUSH_LOG_AT_TRX_COMMIT: ${process.env.INNODB_FLUSH_LOG_AT_TRX_COMMIT}`,
);
logger.log(`Insertion started at: ${new Date().toISOString()}`);

const readable = Readable.from(generateUsers(TOTAL_USERS, BATCH_SIZE));
const writable = new DatabaseWritableStream();
readable.pipe(writable);

writable.on('finish', () => {
  const endTime = performance.now();
  const deltaTime = endTime - startTime;

  logger.log(`Insertion ended at: ${new Date().toISOString()}`);
  logger.log(
    `Total time taken: ${parseAndFormatDeltaTime(deltaTime.toFixed(2))}`,
  );
  logger.log('All users inserted.');

  db.close();
});

writable.on('error', (error) => {
  logger.error({ writable: error });
});
