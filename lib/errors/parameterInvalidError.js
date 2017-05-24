var BadRequestError = require("./badRequestError");

function ParameterInvalidError(message) {
  BadRequestError.call(this, message, "PARAM_INVALID");
}

ParameterInvalidError.prototype = Object.create(BadRequestError.prototype);
ParameterInvalidError.prototype.constructor = ParameterInvalidError;

module.exports = ParameterInvalidError;
