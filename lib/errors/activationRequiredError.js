var ForbiddenError = require("./forbiddenError");

function ActivationRequiredError(name) {
  ForbiddenError.call(this, "Account not activated [" + name + "].", "ACTIVATION_REQUIRED");
}

ActivationRequiredError.prototype = Object.create(ForbiddenError.prototype);
ActivationRequiredError.prototype.constructor = ActivationRequiredError;

module.exports = ActivationRequiredError;
