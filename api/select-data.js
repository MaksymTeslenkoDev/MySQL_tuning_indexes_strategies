'use strict';
require('dotenv').config();
const path = require('node:path');
const logger = require('../src/logger')(path.resolve(process.cwd(), './logs'));
const withLogsHOC = require('../tools/perfLogsHOC')(logger);

const IndexType = process.env.INDEX_TYPE || 'BTREE';
const lowerDateYear = '1990-01-01';
const upperDateYear = '2000-01-01';

const lessThanSQL =
  'SELECT * FROM users WHERE birthdate < Date(?) LIMIT 1000';
const greaterThanSQL =
  'SELECT * FROM users WHERE birthdate > Date(?) LIMIT 1000';
const betweenSQL =
  'SELECT * FROM users WHERE birthdate BETWEEN Date(?) AND Date(?) LIMIT 1000';
const selectExactBirthdate =
  'SELECT * FROM users WHERE birthdate = Date(?) LIMIT 1000';
const selectByName =
  'SELECT * FROM users WHERE username LIKE "%john%" LIMIT 1000';

module.exports = (table) => async () => {
  try {
    const db = table('users');
    logger.log('---------------------------------');
    logger.log('Select data from users table');
    logger.log(`Index type: ${IndexType}`);
    logger.log('LIMIT 100_000 rows');
    logger.log('---');

    logger.log('Querying data by username = john (without index)');
    const resUsername = await withLogsHOC(() => db.query(selectByName));
    logger.log(`Selected ${resUsername[0].length} rows`);
    logger.log('---');

    logger.log(`Querying data by birthdate < ${lowerDateYear} (with index)`);
    const resLessThan = await withLogsHOC(() =>
      db.query(lessThanSQL, [lowerDateYear]),
    );
    logger.log(`Selected ${resLessThan[0].length} rows`);

    logger.log(`Querying data by birthdate > ${lowerDateYear} (with index)`);
    const resGreaterThan = await withLogsHOC(() =>
      db.query(greaterThanSQL, [lowerDateYear]),
    );
    logger.log(`Selected ${resGreaterThan[0].length} rows`);
    logger.log('---');

    logger.log(
      `Querying data by birthdate between ${lowerDateYear} and ${upperDateYear} (with index)`,
    );
    const resBetween = await withLogsHOC(() =>
      db.query(betweenSQL, [lowerDateYear, upperDateYear]),
    );
    logger.log(`Selected ${resBetween[0].length} rows`);
    logger.log('---');

    logger.log(`Querying data by birthdate = ${lowerDateYear} (with index)`);
    const resExactBirthdate = await withLogsHOC(() =>
      db.query(selectExactBirthdate, [lowerDateYear]),
    );
    logger.log(`Selected ${resExactBirthdate[0].length} rows`);
    logger.log('---');
    return {
      resUsernameLength: resUsername[0].length,
      resLessThanLength: resLessThan[0].length,
      resGreaterThanLength: resGreaterThan[0].length,
      resBetweenLength: resBetween[0].length,
      resExactBirthdateLength: resExactBirthdate[0].length,
    };
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
