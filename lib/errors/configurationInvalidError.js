var ForbiddenError = require("./forbiddenError");

function ConfigurationInvalidError(name) {
  ForbiddenError.call(this, "Configurations for [" + name + "] is forbidden.", "CONFIG_INVALID");
}

ConfigurationInvalidError.prototype = Object.create(ForbiddenError.prototype);
ConfigurationInvalidError.prototype.constructor = ConfigurationInvalidError;

module.exports = ConfigurationInvalidError;
