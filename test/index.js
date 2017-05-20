require('./fixtures');

require('./providers/baseProvider');
require('./providers/mailgun');
require('./providers/mandrill');
require('./providers/sendgrid');
require('./providers/ses');
require('./hulk-mailer/init');
require('./hulk-mailer/addNewProvider');
require('./hulk-mailer/removeProvider');
require('./hulk-mailer/send');
