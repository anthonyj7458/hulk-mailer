var BaseError = require("./baseError");

function InternalServerError(message, code) {
  BaseError.call(this, message, code || "INTERNAL_SERVER_ERROR", 500);
}

InternalServerError.prototype = Object.create(BaseError.prototype);
InternalServerError.prototype.constructor = InternalServerError;

module.exports = InternalServerError;
