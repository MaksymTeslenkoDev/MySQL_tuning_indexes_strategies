'use strict';

/**
 * Converts a duration in milliseconds to an object containing minutes, seconds, and milliseconds.
 * @param {number} milliseconds - The duration in milliseconds.
 * @returns {Object} An object with the parsed time in minutes, seconds, and milliseconds.
 */
function parseDeltaTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const millis = Math.floor(milliseconds % 1000);

  return {
    minutes,
    seconds,
    millis,
  };
}

/**
 * Formats the parsed time into a string.
 * @param {Object} parsedTime - The parsed time object containing minutes, seconds, and milliseconds.
 * @returns {string} A formatted string representing the duration.
 */
function formatParsedTime(parsedTime) {
  const { minutes, seconds, millis } = parsedTime;
  return `${minutes}m ${seconds}s ${millis}ms`;
}

/**
 * Utility function to parse and format delta time.
 * @param {number|string} deltaTime - The duration in milliseconds (can be a number or string).
 * @returns {string} The formatted duration in minutes, seconds, and milliseconds.
 */
function parseAndFormatDeltaTime(deltaTime) {
  const milliseconds = parseFloat(deltaTime);
  const parsedTime = parseDeltaTime(milliseconds);
  return formatParsedTime(parsedTime);
}

module.exports = {
  parseAndFormatDeltaTime
}
