'use strict';
require('dotenv').config();
const path = require('node:path');
const { Readable, Writable } = require('node:stream');
const { faker } = require('@faker-js/faker');
const { performance } = require('node:perf_hooks');
const logger = require('../src/logger')(path.resolve(process.cwd(), './logs'));
const { parseAndFormatDeltaTime } = require('../tools/time');
const Formatter = require('../tools/formatter');

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

module.exports = (table) => () =>
  new Promise((resolve, reject) => {
    const db = table('users');

    const startTime = performance.now();
    logger.log('---------------------------------');
    logger.log(`Inserting ${Formatter.formatNumber(TOTAL_USERS)} users ...`);
    logger.log(`Batch size: ${Formatter.formatNumber(BATCH_SIZE)}`);
    logger.log(`Index type: ${INDEX_TYPE}`);
    logger.log(
      `INNODB_FLUSH_LOG_AT_TRX_COMMIT: ${process.env.INNODB_FLUSH_LOG_AT_TRX_COMMIT}`,
    );
    logger.log(`Insertion started at: ${new Date().toISOString()}`);

    let insertedCount = 0;
    const insertedChunksIds = [];
    const readable = Readable.from(generateUsers(TOTAL_USERS, BATCH_SIZE));
    const writable = new Writable({
      objectMode: true,
      write: async function (chunk, encoding, next) {
        try{
          const res = await db.create(chunk);
          insertedCount += chunk.length;
          insertedChunksIds.push(...res);
          console.log(`${insertedCount}/${TOTAL_USERS} users inserted...`);
          next();
        }catch(error){
          next(error);
        }
      },
    });
    readable.pipe(writable);

    writable.on('finish', async () => {
      const endTime = performance.now();
      const deltaTime = endTime - startTime;

      logger.log(`Insertion ended at: ${new Date().toISOString()}`);
      logger.log(
        `Total time taken: ${parseAndFormatDeltaTime(deltaTime.toFixed(2))}`,
      );
      logger.log('All users inserted.');

      try {
        resolve(insertedChunksIds);
      } catch (error) {
        reject(error);
      }
    });

    writable.on('error', (error) => {
      logger.error({ writable: error });
      reject(error);
    });
  });
