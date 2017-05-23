var sinon = require('sinon');
var Email = require("../../lib/email");
var SES = require("../../lib/providers/ses");

var awsSESStub = sinon.stub(SES.prototype, 'send');

awsSESStub.withArgs(new Email({
  "from": "anthonyj7458@gmail.com",
  "to": ["anthonyj7458@gmail.com", "anthonyj7458+1@gmail.com"],
  "cc": ["anthonyj7458+2@gmail.com"],
  "subject": "Hello Joseph Anthony",
  "text": "Congratulations Joseph Anthony, you just sent an email!"
})).callsArgWith(1, {
  error: null,
  success: true
});
