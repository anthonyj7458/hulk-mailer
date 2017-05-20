var BaseError = require('./baseError');

function ReInitializationError(message) {
  BaseError.call(this, message, "RE_INITIALIZED");
}

ReInitializationError.prototype = Object.create(BaseError.prototype);
ReInitializationError.prototype.constructor = ReInitializationError;

module.exports = ReInitializationError;
