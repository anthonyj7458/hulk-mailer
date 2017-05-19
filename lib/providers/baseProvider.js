var _ = require("lodash");
var ParameterInvalidError = require("../errors/parameterInvalidError");
var ParameterRequiredError = require("../errors/parameterRequiredError");

function BaseProvider(name, config, params) {
  if (new.target === BaseProvider) {
    throw new Error("Cannot Create object of BaseProvider");
  }

  this.name = name;
  this._paramValidator(config, params);
}

BaseProvider.prototype._paramValidator = function(config, params) {
  if(!config)
    throw new ParameterRequiredError("Settings for " + this.name);
  _.forEach(params, function(param) {
    if(!config[param])
      throw new ParameterRequiredError(param);
    if(!_.isString(config[param]))
      throw new ParameterInvalidError(param + " should be a string.");
  });
}

module.exports = BaseProvider;
