var InternalServerError = require("./internalServerError");

function NoProviderFoundError() {
  InternalServerError.call(this, "No Provider Found.", "NO_PROVIDER");
}

NoProviderFoundError.prototype = Object.create(InternalServerError.prototype);
NoProviderFoundError.prototype.constructor = NoProviderFoundError;

module.exports = NoProviderFoundError;
