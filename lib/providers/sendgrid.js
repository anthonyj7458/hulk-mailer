var _ = require("lodash");
var request = require("request");
var Email = require("../email");
var BaseProvider = require("./baseProvider");
var BadRequestError = require("../errors/badRequestError");
var ParameterInvalidError = require("../errors/parameterInvalidError");
var ConfigurationInvalidError = require("../errors/configurationInvalidError");

function Sendgrid(config) {
  BaseProvider.call(this, "sendgrid", config, ["username", "password"]);

  this.apiUser = config.username;
  this.apiKey = config.password;
}

Sendgrid.prototype = Object.create(BaseProvider.prototype);
Sendgrid.prototype.constructor = Sendgrid;

Sendgrid.prototype._prepareFormData = function(email) {
  if(!(email instanceof Email))
    throw new ParameterInvalidError("`email` should be of an object of prototype HulkMailer.Email");
  return _.omitBy({
    api_user: this.apiUser,
    api_key: this.apiKey,
    from: email.getFrom(),
    "to[]": email.getTo(),
    "cc[]": email.getCc(),
    "bcc[]": email.getBcc(),
    subject: email.getSubject(),
    html: email.getHtml(),
    text: email.getText()
  }, _.isEmpty);
}

Sendgrid.prototype._prepareRequest = function(email) {
  return {
    method: "POST",
    url: "https://api.sendgrid.com/api/mail.send.json",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    form: this._prepareFormData(email),
    qsStringifyOptions: { arrayFormat: "repeat", encode: false }
  };
}

Sendgrid.prototype.send = function(email, done) {
  request(this._prepareRequest(email), function (err, response, body) {
    var error = null, success = false;
    if(err)
      error = err.message;
    if(body) {
      body = JSON.parse(body);
      if(body.message) {
        if(body.message === "success")
          success = true;
        if(body.message === "error" && _.isArray(body.errors)) {
          if(body.errors[0])
            error = new BadRequestError(body.errors[0]);
          if(body.errors[0] === "Bad username / password")
            error = new ConfigurationInvalidError(this.name);
        }
      }
    }
    done(error, success);
  }.bind(this));
}

module.exports = Sendgrid;
