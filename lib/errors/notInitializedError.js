var InternalServerError = require("./internalServerError");

function NotInitializedError(message) {
  InternalServerError.call(this, message, "NOT_INITIALIZED");
}

NotInitializedError.prototype = Object.create(InternalServerError.prototype);
NotInitializedError.prototype.constructor = NotInitializedError;

module.exports = NotInitializedError;
