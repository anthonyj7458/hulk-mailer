var _ = require("lodash");
var EmailProviderManager = require("./lib/manager");

var manager;

var isManagerCreated = function() {
  if(!manager)
    throw new Error("HulkMailer not initialized. Use HulkMailer.init(config)");
}

var addNewProvider = function(settings) {
  isManagerCreated();
  manager.registerProvider(settings);
};

exports.addNewProvider = addNewProvider;

exports.init = function(config) {
  if(!_.isArray(config) || !_.every(config, _.isObject)) {
    throw new Error("Invalid configuration object passed.");
  }
  manager = new EmailProviderManager();
  _.forEach(config, addNewProvider);
}

exports.send = function(email) {
  isManagerCreated();
  manager.send(email);
}

exports.Email = require("./lib/email");
