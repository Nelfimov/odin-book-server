/**
 * Custom error to handle JSON responses.
 * @param {string} message Message to display.
 * @param {number} status HTTP status response.
 */
function MyError(message, status) {
  this.message = message;
  this.status = status || 500;
  this.stack = (new Error()).stack;
}

MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

export default MyError;
