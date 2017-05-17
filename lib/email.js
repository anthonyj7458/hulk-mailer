var _ = require("lodash");
var emailValidator = require("email-validator");
var ParameterRequiredError = require("./errors/parameterRequiredError");
var ParameterInvalidError = require("./errors/parameterInvalidError");

function Email(email) {
  this.email = _.pick(email, "from", "to", "cc", "bcc", "subject", "html", "text");
  this.validateEmail();
}

Email.prototype.validateEmail = function() {
  this.isValidEmail(this.email.from);
  _.forEach(["from", "to", "subject"], this.isPresent.bind(this));    // from, to and subject should be present
  _.forEach(["to", "cc", "bcc"], this.containEmails.bind(this));      // should be an email or a list of email
  this.isValidString("subject");
  this.haveValidBody("html", "text");
}

Email.prototype.isValidEmail = function(email) {
  if(!emailValidator.validate(email))
    throw new ParameterInvalidError("Invalid email " + email);
}

Email.prototype.isPresent = function(param) {
  if(!this.email[param])
    throw new ParameterRequiredError(param);
}

Email.prototype.haveValidBody = function() {
  if(_.chain(this.email).pick(arguments).every(_.isEmpty).value())
    throw new ParameterRequiredError("Either of " +  _.join(arguments, " or "));
  _.forEach(arguments, this.isValidString.bind(this));
}

Email.prototype.isValidString = function(param) {
  if(this.email[param] && !_.isString(this.email[param]))
    throw new ParameterInvalidError(param + " should be a string.");
}

Email.prototype.containEmails = function(param) {
  if(!this.email[param])
    return;

  if(_.isString(this.email[param]))
    this.email[param] = [this.email[param]];

  if(!_.isArray(this.email[param]))
    throw new ParameterInvalidError("field " + param + " should be an email or a list of emails");

  _.forEach(this.email[param], this.isValidEmail);
}

Email.prototype.getFrom = function() {
  return this.email.from;
}

Email.prototype.getTo = function() {
  return this.email.to;
}

Email.prototype.getCc = function() {
  return this.email.cc;
}

Email.prototype.getBcc = function() {
  return this.email.bcc;
}

Email.prototype.getSubject = function() {
  return this.email.subject;
}

Email.prototype.getHtml = function() {
  return this.email.Html;
}

Email.prototype.getText = function() {
  return this.email.text;
}

module.exports = Email;
