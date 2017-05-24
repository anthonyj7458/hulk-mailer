var _ = require("lodash");
var AWS = require("aws-sdk");
var Email = require("../email");
var BaseProvider = require("./baseProvider");
var BadRequestError = require("../errors/badRequestError");
var ParameterInvalidError = require("../errors/parameterInvalidError");
var ConfigurationInvalidError = require("../errors/configurationInvalidError");

function SES(config) {
  BaseProvider.call(this, "ses", config, ["accessKeyId", "secretAccessKey", "region"]);

  this.ses = new AWS.SES({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
  });
}

SES.prototype = Object.create(BaseProvider.prototype);
SES.prototype.constructor = SES;

SES.prototype._prepareRequest = function(email) {
  if(!(email instanceof Email))
    throw new ParameterInvalidError("`email` should be of an object of prototype HulkMailer.Email");
  return _.omitBy({
    Destination: _.omitBy({
      BccAddresses: email.getBcc(),
      CcAddresses: email.getCc(),
      ToAddresses: email.getTo()
    }, _.isEmpty),
    Message: {
      Body: _.omitBy({
        Html: _.omitBy({ Data: email.getHtml() }, _.isEmpty),
        Text: _.omitBy({ Data: email.getText() }, _.isEmpty)
      }, _.isEmpty),
      Subject: _.omitBy({ Data: email.getSubject() }, _.isEmpty)
    },
    Source: email.getFrom()
  }, _.isEmpty);
}

SES.prototype.send = function(email, done) {
  this.ses.sendEmail(this._prepareRequest(email), function(err, body) {
    var error = null, success = false;
    if(err) {
      error = new BadRequestError(err.message);
      if(_.includes(err.message, "Inaccessible host:") || err.message === "The security token included in the request is invalid.")
        error = new ConfigurationInvalidError(this.name);
    }
    if(!error && body && body.MessageId)
      success = true;
    done(error, success);
  }.bind(this));
}

module.exports = SES;
