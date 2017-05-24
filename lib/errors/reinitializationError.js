var InternalServerError = require("./internalServerError");

function ReInitializationError(message) {
  InternalServerError.call(this, message, "RE_INITIALIZED");
}

ReInitializationError.prototype = Object.create(InternalServerError.prototype);
ReInitializationError.prototype.constructor = ReInitializationError;

module.exports = ReInitializationError;
