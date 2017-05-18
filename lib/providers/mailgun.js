var _ = require("lodash");
var request = require("request");
var Email = require("../email");
var BaseProvider = require("./baseProvider");
var ParameterInvalidError = require("../errors/parameterInvalidError");

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
    form: this._prepareFormData(email)
  };
}

Mailgun.prototype.send = function(email, done) {
  request(this._prepareRequest(email), function (error, response, body) {
    done(error, body);
  });
}

module.exports = Mailgun;
