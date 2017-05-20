var _ = require("lodash");
var EmailProviderManager = require("./lib/manager");
var NotInitializedError = require("./lib/errors/notInitializedError");
var ParameterInvalidError = require("./lib/errors/parameterInvalidError");

var manager;

function HulkMailer() {}

var isInitialized = function() {
  if(!manager)
    throw new NotInitializedError("HulkMailer not initialized. Use HulkMailer.init(config)");
}

var addNewProvider = function(settings) {
  isInitialized();
  manager.registerProvider(settings);
};

var removeProvider = function(name) {
  isInitialized();
  manager.removeProvider(name);
};

HulkMailer.addNewProvider = addNewProvider;

HulkMailer.removeProvider = removeProvider;

HulkMailer.init = function(config) {
  if(!_.isArray(config) || !_.every(config, _.isObject)) {
    throw new ParameterInvalidError("Invalid configuration object passed.");
  }
  manager = new EmailProviderManager();
  _.forEach(config, addNewProvider);
}

HulkMailer.send = function(email, sent) {
  isInitialized();
  manager.send(email, sent);
}

HulkMailer.Email = require("./lib/email");

module.exports = HulkMailer;
