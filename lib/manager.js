var _ = require('lodash');
var providers = require('require-dir')('./providers');
var ReInitializationError = require("./errors/reinitializationError");
var ParameterInvalidError = require("./errors/parameterInvalidError");
var ParameterRequiredError = require("./errors/parameterRequiredError");
var NoProviderFoundError = require("./errors/noProviderFoundError");

var singleton = false;

function EmailProviderManager() {
  if(singleton)
    throw new ReInitializationError("Mailer Already initialized.");
  singleton = true;
  this.providerMap = {};
  this.priority = [];
}

EmailProviderManager.prototype.registerProvider = function(settings) {
  if(!_.isObject(settings))
    throw new ParameterInvalidError("Invalid configuration object passed.");
  if(!settings.name)
    throw new ParameterRequiredError("name");
  if(!settings.provider)
    throw new ParameterRequiredError("provider");
  if(!providers[settings.provider])
    throw new ParameterInvalidError("Unknown provider passed.");
  if(this.providerMap[settings.name])
    throw new ParameterInvalidError("Name " + settings.name + " is already taken for a provider.");
  this.providerMap[settings.name] = new providers[settings.provider](_.omit(settings, 'provider', 'name'));
  this.priority.push(settings.name);
}

EmailProviderManager.prototype.removeProvider = function(name) {
  if(!name)
    throw new ParameterRequiredError("name");
  if(!_.isString(name))
    throw new ParameterInvalidError("Name should be a vaild string.");
  if(!this.providerMap[name])
    throw new ParameterInvalidError("No provider for " + name + " is found.");
  delete this.providerMap[name];
  _.pull(this.priority, name);
}

EmailProviderManager.prototype.send = function(email) {
}

module.exports = EmailProviderManager;
