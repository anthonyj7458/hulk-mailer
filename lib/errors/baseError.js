function BaseError(message, code, status) {
  if (this.constructor.name === "BaseError") {
    throw new Error("Cannot Create object of BaseError");
  }

  Error.call(this);

  this.setCode(code);
  this.setStatus(status);
  this.setMessage(message);
  this.stack = (new Error(this.getMessage())).stack;
}

BaseError.prototype = Object.create(Error.prototype);
BaseError.prototype.constructor = BaseError;

BaseError.prototype.getCode = function() {
  return this.code;
}

BaseError.prototype.setCode = function(code) {
  return this.code = code;
}

BaseError.prototype.getStatus = function() {
  return this.status;
}

BaseError.prototype.setStatus = function(status) {
  return this.status = status;
}

BaseError.prototype.getMessage = function() {
  return this.message;
}

BaseError.prototype.setMessage = function(message) {
  return this.message = message;
}

module.exports = BaseError;
