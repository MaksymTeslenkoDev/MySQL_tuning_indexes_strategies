/**
 * Formats a large integer with dots for better readability.
 * @param {number|string} value - The large integer to format.
 * @returns {string} The formatted string with dots.
 */
function formatWithDots(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Formats a large integer with underscores for better readability.
 * @param {number|string} value - The large integer to format.
 * @returns {string} The formatted string with underscores.
 */
function formatWithUnderscores(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_');
}

class Formater {
  static formatNumber(number, delimeter = 'underscore') {
    switch (delimeter) {
      case 'dot':
        return formatWithDots(number);
      case 'underscore':
        return formatWithUnderscores(number);
      default:
        return number;
    }
  }
}

module.exports = Formater;
