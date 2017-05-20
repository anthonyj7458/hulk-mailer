var BaseError = require('./baseError');

function ParameterInvalidError(message) {
  BaseError.call(this, message, "PARAM_INVALID");
}

ParameterInvalidError.prototype = Object.create(BaseError.prototype);
ParameterInvalidError.prototype.constructor = ParameterInvalidError;

module.exports = ParameterInvalidError;