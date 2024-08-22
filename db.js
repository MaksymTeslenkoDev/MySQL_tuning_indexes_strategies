'use strict';
const knex = require('knex');

const crud = (pool) => (table) => ({
  async query(sql, args) {
    return pool.raw(sql, args);
  },

  async read(id, filter, fields = ['*']) {
    if (!id) {
      return pool.select(fields).from(table).whereRaw(filter);
    }
    return pool.select(fields).from(table).where({ id });
  },

  async create(record) {
    return pool(table).insert(record);
  },

  async update(id, record) {
    return pool(table).where({ id }).update(record);
  },

  async delete(id) {
    return pool(table).where({ id }).del();
  },

  async addIndex(column, indexName, indexType = 'BTREE') {
    return pool.schema.alterTable(table, (t) => {
      t.index(column, indexName, indexType);
    });
  },

  async removeIndex(indexName) {
    return pool.schema.alterTable(table, (t) => {
      t.dropIndex([], indexName);
    });
  },

  async close() {
    return await pool.destroy();
  },
});

module.exports = (options) => crud(knex(options));
