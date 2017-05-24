var BadRequestError = require("./badRequestError");

function ParameterRequiredError(param) {
  BadRequestError.call(this, param + " is required.", "PARAM_REQUIRED");
}

ParameterRequiredError.prototype = Object.create(BadRequestError.prototype);
ParameterRequiredError.prototype.constructor = ParameterRequiredError;

module.exports = ParameterRequiredError;
