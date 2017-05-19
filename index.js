var _ = require("lodash");
var EmailProviderManager = require("./lib/manager");

var manager;

var isManagerCreated = function() {
  if(!manager)
    throw new Error("Manager should should be created first.");
}

var addNewProvider = function(settings) {
  isManagerCreated();
  manager.registerProvider(settings);
};

exports.addNewProvider = addNewProvider;

exports.init = function(config) {
  manager = new EmailProviderManager();
  _.forEach(config, addNewProvider);
}

exports.send = function(email) {
  isManagerCreated();
  manager.send(email);
}

exports.Email = require("./lib/email");
