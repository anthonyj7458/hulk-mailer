var chai = require('chai');
var config = require('../config');
var Email = require("../../lib/email");
var HulkMailer = require('../../index');
var ParameterInvalidError = require("../../lib/errors/parameterInvalidError");

describe('HulkMailer.send()', function() {
  it("should raise error on not providing email", function(done) {
    try {
      HulkMailer.send();
      done("the test case should fail");
    } catch(error) {
      chai.expect(error).to.be.instanceof(Error);
      chai.expect(error).to.be.instanceof(ParameterInvalidError);
      chai.expect(error).to.have.property("code", "PARAM_INVALID");
      chai.expect(error.message).to.be.equal("`email` should be of an object of prototype HulkMailer.Email");
      done();
    }
  });

  it('should send Email', function(done) {
    var email = new Email({
      "from": "anthonyj7458@gmail.com",
      "to": "anthonyj7458@gmail.com",
      "subject": "Hello Joseph Anthony",
      "text": "Congratulations Joseph Anthony, you just sent an email!"
    });
    HulkMailer.send(email, function(error, success) {
      if(error)
        return done(error);
      chai.expect(success).to.equal(true);
      return done();
    });
  });
});