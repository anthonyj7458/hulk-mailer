var _ = require("lodash");
var EmailProviderManager = require("./lib/manager");

var manager;

function HulkMailer() {}

var isManagerCreated = function() {
  if(!manager)
    throw new Error("HulkMailer not initialized. Use HulkMailer.init(config)");
}

var addNewProvider = function(settings) {
  isManagerCreated();
  manager.registerProvider(settings);
};

HulkMailer.addNewProvider = addNewProvider;

HulkMailer.init = function(config) {
  if(!_.isArray(config) || !_.every(config, _.isObject)) {
    throw new Error("Invalid configuration object passed.");
  }
  manager = new EmailProviderManager();
  _.forEach(config, addNewProvider);
}

HulkMailer.send = function(email) {
  isManagerCreated();
  manager.send(email);
}

HulkMailer.Email = require("./lib/email");

module.exports = HulkMailer;
