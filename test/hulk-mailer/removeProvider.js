var chai = require('chai');
var config = require('../config');
var HulkMailer = require('../../index');
var ParameterInvalidError = require("../../lib/errors/parameterInvalidError");
var ParameterRequiredError = require("../../lib/errors/parameterRequiredError");

describe('HulkMailer.removeProvider()', function() {
  it('should provide valid configurations', function(done) {
    try {
      HulkMailer.removeProvider();
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(ParameterRequiredError);
      chai.expect(error).to.have.property("code", "PARAM_REQUIRED");
      chai.expect(error.message).to.be.equal("name is required.");
      done();
    }
  });

  it('should provide valid configurations', function(done) {
    try {
      HulkMailer.removeProvider({});
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(ParameterInvalidError);
      chai.expect(error).to.have.property("code", "PARAM_INVALID");
      chai.expect(error.message).to.be.equal("Name should be a vaild string.");
      done();
    }
  });

  it('should provide valid configurations', function(done) {
    try {
      HulkMailer.removeProvider('xyz');
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(ParameterInvalidError);
      chai.expect(error).to.have.property("code", "PARAM_INVALID");
      chai.expect(error.message).to.be.equal("No provider for xyz is found.");
      done();
    }
  });

  it('should remove provider', function(done) {
    HulkMailer.removeProvider(config.new_provider.name);
    done();
  });
});
