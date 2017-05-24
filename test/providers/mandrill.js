var _ = require("lodash");
var chai = require("chai");
var config = require("../config");
var Email = require("../../lib/email");
var BaseProvider = require("../../lib/providers/baseProvider");
var Mandrill = require("../../lib/providers/mandrill");
var ForbiddenError = require("../../lib/errors/forbiddenError");
var BadRequestError = require("../../lib/errors/badRequestError");
var ParameterInvalidError = require("../../lib/errors/parameterInvalidError");
var ParameterRequiredError = require("../../lib/errors/parameterRequiredError");
var ConfigurationInvalidError = require("../../lib/errors/configurationInvalidError");

var provider;

describe("Mandrill", function() {
  describe("new Mandrill()", function() {
    it("should raise error if config is not passed", function(done) {
      try {
        provider = new Mandrill();
        done("the test case should fail");
      } catch(error) {
        chai.expect(error).to.be.instanceof(Error);
        chai.expect(error).to.be.instanceof(BadRequestError);
        chai.expect(error).to.be.instanceof(ParameterRequiredError);
        chai.expect(error).to.have.property("status", 400);
        chai.expect(error).to.have.property("code", "PARAM_REQUIRED");
        chai.expect(error.message).to.be.equal("Settings for mandrill is required.");
        done();
      }
    });

    it("should raise error if apiKey is not passed", function(done) {
      try {
        provider = new Mandrill({});
        done("the test case should fail");
      } catch(error) {
        chai.expect(error).to.be.instanceof(Error);
        chai.expect(error).to.be.instanceof(BadRequestError);
        chai.expect(error).to.be.instanceof(ParameterRequiredError);
        chai.expect(error).to.have.property("status", 400);
        chai.expect(error).to.have.property("code", "PARAM_REQUIRED");
        chai.expect(error.message).to.be.equal("apiKey is required.");
        done();
      }
    });

    it("should raise error if apiKey is not string", function(done) {
      try {
        provider = new Mandrill({ apiKey: {} });
        done("the test case should fail");
      } catch(error) {
        chai.expect(error).to.be.instanceof(Error);
        chai.expect(error).to.be.instanceof(BadRequestError);
        chai.expect(error).to.be.instanceof(ParameterInvalidError);
        chai.expect(error).to.have.property("status", 400);
        chai.expect(error).to.have.property("code", "PARAM_INVALID");
        chai.expect(error.message).to.be.equal("apiKey should be a string.");
        done();
      }
    });

    it("should create provider object", function(done) {
      provider = new Mandrill(config.email_providers[1]);
      chai.expect(provider).to.be.instanceof(Mandrill);
      chai.expect(provider).to.be.instanceof(BaseProvider);
      chai.expect(provider).to.respondTo("_prepareToField");
      chai.expect(provider).to.respondTo("_prepareFormData");
      chai.expect(provider).to.respondTo("_prepareRequest");
      chai.expect(provider).to.respondTo("send");
      chai.expect(provider).to.have.property("name", "thor");
      chai.expect(provider).to.have.property("provider", "mandrill");
      chai.expect(provider).to.have.property("apiKey", "sandboxedkey");
      done();
    });
  });

  describe("_prepareToField()", function() {
    it("should return formatted `to` field(for type=to) as required by mandrill", function(done) {
      var to = provider._prepareToField(["anthonyj7458@gmail.com", "anthonyj7458+1@gmail.com"], "to");
      chai.expect(to).to.be.a("Array");
      chai.expect(to).to.have.length(2);
      chai.expect(to[0]).to.be.a("object");
      chai.expect(to[0]).to.include.keys("email", "type");
      chai.expect(to[0].email).to.equal("anthonyj7458@gmail.com");
      chai.expect(to[0].type).to.equal("to");
      chai.expect(to[1]).to.be.a("object");
      chai.expect(to[1]).to.include.keys("email", "type");
      chai.expect(to[1].email).to.equal("anthonyj7458+1@gmail.com");
      chai.expect(to[1].type).to.equal("to");
      done();
    });

    it("should return formatted `to` field(for type=cc) as required by mandrill", function(done) {
      var to = provider._prepareToField(["anthonyj7458+2@gmail.com"], "cc");
      chai.expect(to).to.be.a("Array");
      chai.expect(to).to.have.length(1);
      chai.expect(to[0]).to.be.a("object");
      chai.expect(to[0]).to.include.keys("email", "type");
      chai.expect(to[0].email).to.equal("anthonyj7458+2@gmail.com");
      chai.expect(to[0].type).to.equal("cc");
      done();
    });

    it("should return formatted `to` field(for type=bcc) as required by mandrill", function(done) {
      var to = provider._prepareToField(["anthonyj7458+3@gmail.com"], "bcc");
      chai.expect(to).to.be.a("Array");
      chai.expect(to).to.have.length(1);
      chai.expect(to[0]).to.be.a("object");
      chai.expect(to[0]).to.include.keys("email", "type");
      chai.expect(to[0].email).to.equal("anthonyj7458+3@gmail.com");
      chai.expect(to[0].type).to.equal("bcc");
      done();
    });
  });

  describe("_prepareFormData()", function() {
    it("should raise error on not providing email", function(done) {
      try {
        provider._prepareFormData();
        done("the test case should fail");
      } catch(error) {
        chai.expect(error).to.be.instanceof(Error);
        chai.expect(error).to.be.instanceof(BadRequestError);
        chai.expect(error).to.be.instanceof(ParameterInvalidError);
        chai.expect(error).to.have.property("status", 400);
        chai.expect(error).to.have.property("code", "PARAM_INVALID");
        chai.expect(error.message).to.be.equal("`email` should be of an object of prototype HulkMailer.Email");
        done();
      }
    });

    it("should return form data in JS object", function(done) {
      var email = new Email({
        "from": "anthonyj7458@gmail.com",
        "to": ["anthonyj7458@gmail.com", "anthonyj7458+1@gmail.com"],
        "cc": ["anthonyj7458+2@gmail.com"],
        "subject": "Hello Joseph Anthony",
        "text": "Congratulations Joseph Anthony, you just sent an email!"
      });
      var formdata = provider._prepareFormData(email);
      chai.expect(formdata).to.be.a("object");
      chai.expect(formdata).to.include.keys("key", "message");
      chai.expect(formdata.key).to.equal("sandboxedkey");
      chai.expect(formdata.message).to.be.a("object");
      chai.expect(formdata.message).to.include.keys("from_email", "to", "subject", "text");
      chai.expect(formdata.message).to.not.include.keys("html", "cc", "bcc");
      chai.expect(formdata.message.from_email).to.equal("anthonyj7458@gmail.com");
      chai.expect(formdata.message.to).to.be.a("Array");
      chai.expect(formdata.message.to).to.have.length(3);
      chai.expect(formdata.message.to[0]).to.be.a("object");
      chai.expect(formdata.message.to[0]).to.include.keys("email", "type");
      chai.expect(formdata.message.to[0].email).to.equal("anthonyj7458@gmail.com");
      chai.expect(formdata.message.to[0].type).to.equal("to");
      chai.expect(formdata.message.to[1]).to.be.a("object");
      chai.expect(formdata.message.to[1]).to.include.keys("email", "type");
      chai.expect(formdata.message.to[1].email).to.equal("anthonyj7458+1@gmail.com");
      chai.expect(formdata.message.to[1].type).to.equal("to");
      chai.expect(formdata.message.to[2]).to.be.a("object");
      chai.expect(formdata.message.to[2]).to.include.keys("email", "type");
      chai.expect(formdata.message.to[2].email).to.equal("anthonyj7458+2@gmail.com");
      chai.expect(formdata.message.to[2].type).to.equal("cc");
      chai.expect(formdata.message.subject).to.equal("Hello Joseph Anthony");
      chai.expect(formdata.message.text).to.equal("Congratulations Joseph Anthony, you just sent an email!");
      done();
    });
  });

  describe("_prepareRequest()", function() {
    it("should return options JS object for request.js", function(done) {
      var email = new Email({
        "from": "anthonyj7458@gmail.com",
        "to": ["anthonyj7458@gmail.com", "anthonyj7458+1@gmail.com"],
        "cc": ["anthonyj7458+2@gmail.com"],
        "subject": "Hello Joseph Anthony",
        "text": "Congratulations Joseph Anthony, you just sent an email!"
      });
      var request = provider._prepareRequest(email);
      chai.expect(request).to.be.a("object");
      chai.expect(request).to.include.keys("method", "url", "headers", "form");
      chai.expect(request).to.not.include.keys("body", "json");
      chai.expect(request.method).to.equal("POST");
      chai.expect(request.url).to.equal("https://mandrillapp.com/api/1.0/messages/send.json");
      chai.expect(request.headers).to.be.a("object");
      chai.expect(request.headers).to.include.keys("Content-Type");
      chai.expect(request.headers["Content-Type"]).to.equal("application/x-www-form-urlencoded");
      chai.expect(request.form).to.be.a("object");
      chai.expect(request.form.message).to.include.keys("from_email", "to", "subject", "text");
      chai.expect(request.form.message).to.not.include.keys("html", "cc", "bcc");
      chai.expect(request.form.message.from_email).to.equal("anthonyj7458@gmail.com");
      chai.expect(request.form.message.to).to.be.a("Array");
      chai.expect(request.form.message.to).to.have.length(3);
      chai.expect(request.form.message.to[0]).to.be.a("object");
      chai.expect(request.form.message.to[0]).to.include.keys("email", "type");
      chai.expect(request.form.message.to[0].email).to.equal("anthonyj7458@gmail.com");
      chai.expect(request.form.message.to[0].type).to.equal("to");
      chai.expect(request.form.message.to[1]).to.be.a("object");
      chai.expect(request.form.message.to[1]).to.include.keys("email", "type");
      chai.expect(request.form.message.to[1].email).to.equal("anthonyj7458+1@gmail.com");
      chai.expect(request.form.message.to[1].type).to.equal("to");
      chai.expect(request.form.message.to[2]).to.be.a("object");
      chai.expect(request.form.message.to[2]).to.include.keys("email", "type");
      chai.expect(request.form.message.to[2].email).to.equal("anthonyj7458+2@gmail.com");
      chai.expect(request.form.message.to[2].type).to.equal("cc");
      chai.expect(request.form.message.subject).to.equal("Hello Joseph Anthony");
      chai.expect(request.form.message.text).to.equal("Congratulations Joseph Anthony, you just sent an email!");
      done();
    });
  });

  describe("send()", function() {
    it("should forbid if incorrect configurations passed", function(done) {
      var invalidProvider = new Mandrill(_.chain(config.email_providers[1]).clone().assign({ "apiKey": "key-incorrect" }).value());
      var email = new Email({
        "from": "anthonyj7458@gmail.com",
        "to": "anthonyj7458+1@gmail.com",
        "subject": "Hello Joseph Anthony",
        "text": "Congratulations Joseph Anthony, you just sent an email!"
      });
      invalidProvider.send(email, function(error, success) {
        chai.expect(error).to.be.instanceof(Error);
        chai.expect(error).to.be.instanceof(ForbiddenError);
        chai.expect(error).to.be.instanceof(ConfigurationInvalidError);
        chai.expect(error).to.have.property("code", "CONFIG_INVALID");
        chai.expect(error).to.have.property("status", 401);
        chai.expect(error.message).to.be.equal("Configurations for [thor] is forbidden.");
        chai.expect(success).to.equal(false);
        done();
      });
    });

    it("should send Email", function(done) {
      var email = new Email({
        "from": "anthonyj7458@gmail.com",
        "to": ["anthonyj7458@gmail.com", "anthonyj7458+1@gmail.com"],
        "cc": ["anthonyj7458+2@gmail.com"],
        "subject": "Hello Joseph Anthony",
        "text": "Congratulations Joseph Anthony, you just sent an email!"
      });
      provider.send(email, function(error, success) {
        chai.expect(error).to.equal(null);
        chai.expect(success).to.equal(true);
        done();
      });
    });
  });
});