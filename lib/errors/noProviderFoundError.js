var BaseError = require('./baseError');

function NoProviderFoundError(message) {
  BaseError.call(this, message, "NO_PROVIDER");
}

NoProviderFoundError.prototype = Object.create(BaseError.prototype);
NoProviderFoundError.prototype.constructor = NoProviderFoundError;

module.exports = NoProviderFoundError;
