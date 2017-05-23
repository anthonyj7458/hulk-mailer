var _ = require("lodash");
var AWS = require("aws-sdk");
var Email = require("../email");
var BaseProvider = require("./baseProvider");
var ParameterInvalidError = require("../errors/parameterInvalidError");

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
  this.ses.sendEmail(this._prepareRequest(email), function(error, body) {
    var result = { error: null, success: false };
    if(error)
      result.error = error.message;
    if(body.MessageId)
      result.success = true;
    done(result);
  });
}

module.exports = SES;
