var chai = require('chai');
var config = require('../config');
var HulkMailer = require('../../index');
var NotInitializedError = require("../../lib/errors/notInitializedError");
var ReInitializationError = require("../../lib/errors/reinitializationError");
var ParameterInvalidError = require("../../lib/errors/parameterInvalidError");

describe('HulkMailer.init()', function() {
  it('should provide valid configurations', function(done) {
    try {
      HulkMailer.init();
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(ParameterInvalidError);
      chai.expect(error).to.have.property("code", "PARAM_INVALID");
      chai.expect(error.message).to.be.equal("Invalid configuration object passed.");
      done();
    }
  });

  it('should provide valid configurations', function(done) {
    try {
      HulkMailer.init({});
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(ParameterInvalidError);
      chai.expect(error).to.have.property("code", "PARAM_INVALID");
      chai.expect(error.message).to.be.equal("Invalid configuration object passed.");
      done();
    }
  });

  it('should provide valid configurations', function(done) {
    try {
      HulkMailer.init(["xyz"]);
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(ParameterInvalidError);
      chai.expect(error).to.have.property("code", "PARAM_INVALID");
      chai.expect(error.message).to.be.equal("Invalid configuration object passed.");
      done();
    }
  });

  it('should provide valid configurations', function(done) {
    try {
      HulkMailer.init([9]);
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(ParameterInvalidError);
      chai.expect(error).to.have.property("code", "PARAM_INVALID");
      chai.expect(error.message).to.be.equal("Invalid configuration object passed.");
      done();
    }
  });

  it('should initialize HulkMailer before use', function(done) {
    try {
      HulkMailer.addNewProvider();
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(NotInitializedError);
      chai.expect(error).to.have.property("code", "NOT_INITIALIZED");
      chai.expect(error.message).to.be.equal("HulkMailer not initialized. Use HulkMailer.init(config)");
      done();
    }
  });

  it('should initialize HulkMailer before use', function(done) {
    try {
      HulkMailer.removeProvider();
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(NotInitializedError);
      chai.expect(error).to.have.property("code", "NOT_INITIALIZED");
      chai.expect(error.message).to.be.equal("HulkMailer not initialized. Use HulkMailer.init(config)");
      done();
    }
  });

  it('should initialize HulkMailer before use', function(done) {
    try {
      HulkMailer.send();
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(NotInitializedError);
      chai.expect(error).to.have.property("code", "NOT_INITIALIZED");
      chai.expect(error.message).to.be.equal("HulkMailer not initialized. Use HulkMailer.init(config)");
      done();
    }
  });

  it('should initialize HulkMailer', function(done) {
    HulkMailer.init(config.email_providers);
    done();
  });

  it('should not re-initialize HulkMailer', function(done) {
    try {
      HulkMailer.init(config.email_providers);
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(ReInitializationError);
      chai.expect(error).to.have.property("code", "RE_INITIALIZED");
      chai.expect(error.message).to.be.equal("Mailer Already initialized.");
      done();
    }
  });
});
