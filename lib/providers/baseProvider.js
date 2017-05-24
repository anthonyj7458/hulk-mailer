var _ = require("lodash");
var NoBaseClassObjectError = require("../errors/noBaseClassObjectError");
var ParameterInvalidError = require("../errors/parameterInvalidError");
var ParameterRequiredError = require("../errors/parameterRequiredError");

function BaseProvider(provider, config, params) {
  if (this.constructor.name === "BaseProvider") {
    throw new NoBaseClassObjectError(this.constructor.name);
  }

  this.provider = provider;
  this._paramValidator(config, params);
  this.name = config.name;
}

BaseProvider.prototype._paramValidator = function(config, params) {
  if(!config)
    throw new ParameterRequiredError("Settings for " + this.provider);
  _.forEach(params, function(param) {
    if(!config[param])
      throw new ParameterRequiredError(param);
    if(!_.isString(config[param]))
      throw new ParameterInvalidError(param + " should be a string.");
  });
}

module.exports = BaseProvider;
