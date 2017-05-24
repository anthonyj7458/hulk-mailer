var _ = require("lodash");
var request = require("request");
var Email = require("../email");
var BaseProvider = require("./baseProvider");
var BadRequestError = require("../errors/badRequestError");
var ParameterInvalidError = require("../errors/parameterInvalidError");
var ActivationRequiredError = require("../errors/activationRequiredError");
var ConfigurationInvalidError = require("../errors/configurationInvalidError");

function Mailgun(config) {
  BaseProvider.call(this, "mailgun", config, ["apiKey", "domain"]);
  
  if(!_.startsWith(config.apiKey, "key-"))
    throw new ParameterInvalidError("apiKey should start with key-");

  this.apiKey = config.apiKey;
  this.domain = config.domain;
}

Mailgun.prototype = Object.create(BaseProvider.prototype);
Mailgun.prototype.constructor = Mailgun;

Mailgun.prototype._prepareFormData = function(email) {
  if(!(email instanceof Email))
    throw new ParameterInvalidError("`email` should be of an object of prototype HulkMailer.Email");
  return _.omitBy({
    from: "<" + email.getFrom() + ">",
    to: _.chain(email.getTo()).map(mail => "<" + mail + ">").join(",").value(),
    cc: _.chain(email.getCc()).map(mail => "<" + mail + ">").join(",").value(),
    bcc: _.chain(email.getBcc()).map(mail => "<" + mail + ">").join(",").value(),
    subject: email.getSubject(),
    html: email.getHtml(),
    text: email.getText()
  }, _.isEmpty);
}

Mailgun.prototype._prepareRequest = function(email) {
  return {
    method: "POST",
    url: "https://api.mailgun.net/v3/" + this.domain + "/messages",
    auth: { user: "api", pass: this.apiKey },
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    form: this._prepareFormData(email),
    json: true
  };
}

Mailgun.prototype.send = function(email, done) {
  request(this._prepareRequest(email), function (err, response, body) {
    var error = null, success = false;
    if(err)
      error = err.message;
    if(body) {
      if(body.message) {
        if(body.message === "Queued. Thank you.")
          success = true;
        if(_.includes(body.message, "Please activate your Mailgun account."))
          error = new ActivationRequiredError(this.name);
      }
    }
    if(!success && !error) {
      if(response.statusCode === 401)
        error = new ConfigurationInvalidError(this.name);
      else if(response.statusCode/100 >= 4)
        error = new BadRequestError(body.message || "Incorrect Request.");
    }
    done(error, success);
  }.bind(this));
}

module.exports = Mailgun;
