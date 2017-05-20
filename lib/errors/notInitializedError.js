var BaseError = require('./baseError');

function NotInitializedError(message) {
  BaseError.call(this, message, "NOT_INITIALIZED");
}

NotInitializedError.prototype = Object.create(BaseError.prototype);
NotInitializedError.prototype.constructor = NotInitializedError;

module.exports = NotInitializedError;
