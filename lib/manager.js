var _ = require('lodash');
var providers = require('require-dir')('./providers');

var singleton = false;

function EmailProviderManager() {
  if(singleton)
    throw new Error("Mailer Already initialize.");
  singleton = true;
  this.providerMap = {};
  this.priority = [];
}

EmailProviderManager.prototype.getProvider = function(name) {
  return this.providerMap[name];
}

EmailProviderManager.prototype.registerProvider = function(settings) {
  if(!settings.name)
    throw new Error("Name required for adding a new Provider.");
  if(!providers[settings.provider])
    throw new Error("Unknown provider passed.");
  if(this.providerMap[settings.name])
    throw new Error("Name " + settings.name + " is already taken for a provider.");
  this.providerMap[settings.name] = new providers[settings.provider](_.omit(settings, 'provider', 'name'));
  this.priority.push(settings.name);
}

EmailProviderManager.prototype.send = function(email) {
}

module.exports = EmailProviderManager;
