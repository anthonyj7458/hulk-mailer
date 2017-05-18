function BaseProvider(config, params) {
  if (new.target === BaseProvider) {
    throw new Error('Cannot Create object of BaseProvider');
  }

  this._paramValidator(config, param);
}

BaseProvider.prototype._paramValidator = function(config, param) {
  _.forEach(params, function(param) {
    if(!config[param])
      throw new ParameterRequiredError(param);
    if(!_.isString(config[param]))
      throw new ParameterInvalidError(param + ' is invalid. should be a string.');
  });
}

module.exports = BaseProvider;
