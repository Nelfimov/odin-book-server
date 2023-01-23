/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Custom error to handle JSON responses.
 */
function MyError(this: any, message: string, status: number): void {
  this.message = message;
  this.status = status ?? 500;
  this.stack = new Error().stack;
}

MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

export default MyError;
