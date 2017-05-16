function BaseError(message, status) {
  Error.call(this);

  this.status = status;
  this.message = message;
  this.stack = (new Error()).stack;
}

BaseError.prototype = Object.create(Error.prototype);
BaseError.prototype.constructor = BaseError;

module.exports = BaseError;