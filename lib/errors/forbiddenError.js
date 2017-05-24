var BaseError = require("./baseError");

function ForbiddenError(message, code) {
  BaseError.call(this, message, code || "FORBIDDEN", 401);
}

ForbiddenError.prototype = Object.create(BaseError.prototype);
ForbiddenError.prototype.constructor = ForbiddenError;

module.exports = ForbiddenError;
