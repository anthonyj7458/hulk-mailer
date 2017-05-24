var BaseError = require("./baseError");

function BadRequestError(message, code) {
  BaseError.call(this, message, code || "BAD_REQUEST", 400);
}

BadRequestError.prototype = Object.create(BaseError.prototype);
BadRequestError.prototype.constructor = BadRequestError;

module.exports = BadRequestError;
