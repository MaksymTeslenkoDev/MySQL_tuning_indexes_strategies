'use strict';
const { performance } = require('node:perf_hooks');
const { parseAndFormatDeltaTime } = require('./time');

const performLogsHOC = (logger) => async (cb) => {
  const startAt = performance.now();
  logger.log(`Start at: ${new Date().toISOString()}`);
  const res = await cb();
  const deltaTime = performance.now() - startAt;
  logger.log(`End at: ${new Date().toISOString()}`);
  logger.log(`Delta time: ${parseAndFormatDeltaTime(deltaTime.toFixed(2))}`);
  return res;
};

module.exports = performLogsHOC;
