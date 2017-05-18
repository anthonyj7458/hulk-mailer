var chai = require("chai");
var config = require("../config");
var Email = require("../../lib/email");
var BaseProvider = require("../../lib/providers/baseProvider");
var Mailgun = require("../../lib/providers/mailgun");

var provider, email;

describe("Mailgun", function() {

  before(function() {
    email = new Email(config.email);
  });

  describe("new Mailgun()", function() {
    it("should raise error if config is not passed", function(done) {
      try {
        provider = new Mailgun();
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("Settings for mailgun is required. is required.");
        done();
      }
    });

    it("should raise error if apiKey is not passed", function(done) {
      try {
        provider = new Mailgun({});
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("apiKey is required.");
        done();
      }
    });

    it("should raise error if apiKey is not string", function(done) {
      try {
        provider = new Mailgun({ apiKey: {} });
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("apiKey should be a string.");
        done();
      }
    });

    it("should raise error if domain is not passed", function(done) {
      try {
        provider = new Mailgun({ apiKey: "xyz" });
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("domain is required.");
        done();
      }
    });

    it("should raise error if domain is not string", function(done) {
      try {
        provider = new Mailgun({ apiKey: "xyz", domain: {} });
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("domain should be a string.");
        done();
      }
    });

    it("should raise error if apiKey does not start with key-", function(done) {
      try {
        provider = new Mailgun({ apiKey: "xyz", domain: "xyz" });
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("apiKey should start with key-");
        done();
      }
    });

    it("should create provider object", function(done) {
      provider = new Mailgun(config.providers.mailgun);
      chai.expect(provider).to.be.instanceof(Mailgun);
      chai.expect(provider).to.be.instanceof(BaseProvider);
      chai.expect(provider).to.respondTo("_prepareFormData");
      chai.expect(provider).to.respondTo("_prepareRequest");
      chai.expect(provider).to.respondTo("send");
      chai.expect(provider).to.have.property("name", "mailgun");
      chai.expect(provider).to.have.property("apiKey", "key-imagined");
      chai.expect(provider).to.have.property("domain", "sandboxed.domain.mailgun.org");
      done();
    });
  });

  describe("_prepareFormData()", function() {
    it("should raise error on not providing email", function(done) {
      try {
        provider._prepareFormData();
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("`email` should be of an object of prototype HulkMailer.Email");
        done();
      }
    });

    it("should return form data in JS object", function(done) {
      var formdata = provider._prepareFormData(email);
      chai.expect(formdata).to.be.a("object");
      chai.expect(formdata).to.include.keys("from", "to", "subject", "text");
      chai.expect(formdata).to.not.include.keys("html", "cc", "bcc");
      chai.expect(formdata.from).to.equal("<anthonyj7458@gmail.com>");
      chai.expect(formdata.to).to.equal("<anthonyj7458@gmail.com>");
      chai.expect(formdata.subject).to.equal("Hello Joseph Anthony");
      chai.expect(formdata.text).to.equal("Congratulations Joseph Anthony, you just sent an email!");
      done();
    });
  });

  describe("_prepareRequest()", function() {
    it("should return options JS object for request.js", function(done) {
      var request = provider._prepareRequest(email);
      chai.expect(request).to.be.a("object");
      chai.expect(request).to.include.keys("method", "url", "auth", "headers", "form");
      chai.expect(request).to.not.include.keys("body", "json");
      chai.expect(request.method).to.equal("POST");
      chai.expect(request.url).to.equal("https://api.mailgun.net/v3/sandboxed.domain.mailgun.org/messages");
      chai.expect(request.auth).to.be.a("object");
      chai.expect(request.auth).to.include.keys("user", "pass");
      chai.expect(request.auth).to.not.include.keys("sendImmediately");
      chai.expect(request.auth.user).to.equal("api");
      chai.expect(request.auth.pass).to.equal("key-imagined");
      chai.expect(request.headers).to.be.a("object");
      chai.expect(request.headers).to.include.keys("Content-Type");
      chai.expect(request.headers["Content-Type"]).to.equal("application/x-www-form-urlencoded");
      chai.expect(request.form).to.be.a("object");
      chai.expect(request.form).to.include.keys("from", "to", "subject", "text");
      chai.expect(request.form).to.not.include.keys("html", "cc", "bcc");
      chai.expect(request.form.from).to.equal("<anthonyj7458@gmail.com>");
      chai.expect(request.form.to).to.equal("<anthonyj7458@gmail.com>");
      chai.expect(request.form.subject).to.equal("Hello Joseph Anthony");
      chai.expect(request.form.text).to.equal("Congratulations Joseph Anthony, you just sent an email!");
      done();
    });
  });

  describe("send()", function() {
    it("should send email", function(done) {
      provider.send(email, function(error, data) {
        if(error)
          return done(error);
        return done();
      });
    });
  });
});
