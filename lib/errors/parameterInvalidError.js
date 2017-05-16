var BaseError = require('./baseError');

function ParameterInvalidError(message) {
  BaseError.call(this, message, 404);
}

ParameterInvalidError.prototype = Object.create(BaseError.prototype);
ParameterInvalidError.prototype.constructor = ParameterInvalidError;

module.exports = ParameterInvalidError;