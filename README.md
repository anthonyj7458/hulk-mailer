# hulk-mailer

## Installation 
```shell
$ npm i --save hulk-mailer
```

## Why Hulk Mailer?

Hulk Mailer minimizes the email delivery failures by allowing one to configure multiple Email Service Providers(ESPs). It manages all the email delivery by switching between ESPs depending on their availability and behaviour.

## Which ESPs are supported?
Currently four providers are supported: Mailgun, Mandrill, Sendgrid, SES.

## Configuration

Configure Email Service Providers.
```js
const config = [
  {
    name: "ironman",
    provider: "mailgun",
    apiKey: "key-imagined",
    domain: "sandboxed.domain.mailgun.org"
  },
  {
    name: "thor",
    provider: "mandrill",
    apiKey: "sandboxedkey"
  },
  {
    name: "hawkeye",
    provider: "sendgrid",
    username: "sandboxed",
    password: "sandboxedkey"
  },
  {
    name: "captainamerica",
    provider: "ses",
    accessKeyId: "sandboxedkey",
    secretAccessKey: "sandboxedAccesskey",
    region: "us-east-1"
  }
]
```

You can configure multiple accounts of same provider.
```js
const config = [
  {
    name: "ironman",
    provider: "mandrill",
    apiKey: "sandboxedkey",
  },
  {
    name: "hawkeye",
    provider: "mandrill",
    apiKey: "sandboxedkey2"
  }
]
```

Initialize your config.
```js
var HulkMailer = require('hulk-mailer');
HulkMailer.init(config);
```

Add a new Provider on the fly.
```js
HulkMailer.addNewProvider( {
  name: "loki",
  provider: "mandrill",
  apiKey: "sandboxedkey",
});
```
