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
})).callsArgWith(1, null, {
  ResponseMetadata: { RequestId: '62935efb-3f88-11j7-a572-5742dc1b00c2' },
  MessageId: '0100015c20850vb0-29191a9b-91f9-4e4c-9b44-ee3192dff7b9-000000'
});