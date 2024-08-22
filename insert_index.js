'use strict';
require('dotenv').config();
const path = require('node:path');
const logger = require('./src/logger')(path.resolve(__dirname, './logs'));
const withLogsHOC = require('./tools/perfLogsHOC')(logger);

const table = 'users';
const db = require('./db')(require('./knexfile'))(table);
const INDEX_TYPE = process.env.INDEX_TYPE || 'BTREE';
const IndexName = 'birthdate_indx';

const column = 'birthdate';

(async () => {
  try {
    switch (INDEX_TYPE) {
      case 'DROP':
        logger.log('-------------------');
        logger.log(`DROP index`);
        const sqlDrop = `DROP INDEX ${IndexName} ON ${table};`
        await withLogsHOC(()=>db.query(sqlDrop));
        break;
      default:
        logger.log('-------------------');
        logger.log(`Creating index with type: ${INDEX_TYPE}`);
        const sqlCreate = `CREATE INDEX ${IndexName} ON ${table} (${column}) USING ${INDEX_TYPE};`
        await withLogsHOC(()=>db.query(sqlCreate));
    }
  } catch (error) {
    console.error(error);
  } finally {
    await db.close();
    console.log('Connection closed');
  }
})();
