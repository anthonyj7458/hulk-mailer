var chai = require("chai");
var config = require("../config");
var Email = require("../../lib/email");
var BaseProvider = require("../../lib/providers/baseProvider");
var Sendgrid = require("../../lib/providers/sendgrid");

var provider;

describe("Sendgrid", function() {

  describe("new Sendgrid()", function() {
    it("should raise error if config is not passed", function(done) {
      try {
        provider = new Sendgrid();
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("Settings for sendgrid is required. is required.");
        done();
      }
    });

    it("should raise error if username is not passed", function(done) {
      try {
        provider = new Sendgrid({});
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("username is required.");
        done();
      }
    });

    it("should raise error if username is not string", function(done) {
      try {
        provider = new Sendgrid({ username: {} });
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("username should be a string.");
        done();
      }
    });

    it("should raise error if password is not passed", function(done) {
      try {
        provider = new Sendgrid({ username: "xyz" });
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("password is required.");
        done();
      }
    });

    it("should raise error if password is not string", function(done) {
      try {
        provider = new Sendgrid({ username: "xyz", password: {} });
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("password should be a string.");
        done();
      }
    });

    it("should create provider object", function(done) {
      provider = new Sendgrid(config.providers.sendgrid);
      chai.expect(provider).to.be.instanceof(Sendgrid);
      chai.expect(provider).to.be.instanceof(BaseProvider);
      chai.expect(provider).to.respondTo("_prepareFormData");
      chai.expect(provider).to.respondTo("_prepareRequest");
      chai.expect(provider).to.respondTo("send");
      chai.expect(provider).to.have.property("name", "sendgrid");
      chai.expect(provider).to.have.property("apiKey", "sandboxedkey");
      chai.expect(provider).to.have.property("apiUser", "sandboxed");
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
      var email = new Email({
        "from": "anthonyj7458@gmail.com",
        "to": ["anthonyj7458@gmail.com", "anthonyj7458+1@gmail.com"],
        "cc": ["anthonyj7458+2@gmail.com"],
        "subject": "Hello Joseph Anthony",
        "text": "Congratulations Joseph Anthony, you just sent an email!"
      });
      var formdata = provider._prepareFormData(email);
      chai.expect(formdata).to.be.a("object");
      chai.expect(formdata).to.include.keys("api_key", "api_user", "from", "to[]", "cc[]", "subject", "text");
      chai.expect(formdata).to.not.include.keys("html", "bcc[]");
      chai.expect(formdata.api_key).to.equal("sandboxedkey");
      chai.expect(formdata.api_user).to.equal("sandboxed");
      chai.expect(formdata.from).to.equal("anthonyj7458@gmail.com");
      chai.expect(formdata["to[]"]).to.be.a("Array");
      chai.expect(formdata["to[]"]).to.have.length(2);
      chai.expect(formdata["to[]"][0]).to.be.equal("anthonyj7458@gmail.com");
      chai.expect(formdata["to[]"][1]).to.be.equal("anthonyj7458+1@gmail.com");
      chai.expect(formdata["cc[]"]).to.be.a("Array");
      chai.expect(formdata["cc[]"]).to.have.length(1);
      chai.expect(formdata["cc[]"][0]).to.be.equal("anthonyj7458+2@gmail.com");
      chai.expect(formdata.subject).to.equal("Hello Joseph Anthony");
      chai.expect(formdata.text).to.equal("Congratulations Joseph Anthony, you just sent an email!");
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
      chai.expect(request).to.include.keys("method", "url", "headers", "form", "qsStringifyOptions");
      chai.expect(request).to.not.include.keys("body", "json");
      chai.expect(request.method).to.equal("POST");
      chai.expect(request.url).to.equal("https://api.sendgrid.com/api/mail.send.json");
      chai.expect(request.headers).to.be.a("object");
      chai.expect(request.headers).to.include.keys("Content-Type");
      chai.expect(request.headers["Content-Type"]).to.equal("application/x-www-form-urlencoded");
      chai.expect(request.form).to.be.a("object");
      chai.expect(request.form).to.include.keys("api_key", "api_user", "from", "to[]", "cc[]", "subject", "text");
      chai.expect(request.form).to.not.include.keys("html", "bcc[]");
      chai.expect(request.form.api_key).to.equal("sandboxedkey");
      chai.expect(request.form.api_user).to.equal("sandboxed");
      chai.expect(request.form.from).to.equal("anthonyj7458@gmail.com");
      chai.expect(request.form["to[]"]).to.be.a("Array");
      chai.expect(request.form["to[]"]).to.have.length(2);
      chai.expect(request.form["to[]"][0]).to.be.equal("anthonyj7458@gmail.com");
      chai.expect(request.form["to[]"][1]).to.be.equal("anthonyj7458+1@gmail.com");
      chai.expect(request.form["cc[]"]).to.be.a("Array");
      chai.expect(request.form["cc[]"]).to.have.length(1);
      chai.expect(request.form["cc[]"][0]).to.be.equal("anthonyj7458+2@gmail.com");
      chai.expect(request.form.subject).to.equal("Hello Joseph Anthony");
      chai.expect(request.form.text).to.equal("Congratulations Joseph Anthony, you just sent an email!");
      chai.expect(request.qsStringifyOptions).to.be.a("object");
      chai.expect(request.qsStringifyOptions).to.include.keys("arrayFormat", "encode");
      chai.expect(request.qsStringifyOptions.arrayFormat).to.equal("repeat");
      chai.expect(request.qsStringifyOptions.encode).to.equal(false);
      done();
    });
  });

  describe("send()", function() {
    it("should send email", function(done) {
      var email = new Email({
        "from": "anthonyj7458@gmail.com",
        "to": ["anthonyj7458@gmail.com", "anthonyj7458+1@gmail.com"],
        "cc": ["anthonyj7458+2@gmail.com"],
        "subject": "Hello Joseph Anthony",
        "text": "Congratulations Joseph Anthony, you just sent an email!"
      });
      provider.send(email, function(error, data) {
        if(error)
          return done(error);
        return done();
      });
    });
  });
});
