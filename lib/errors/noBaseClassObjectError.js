var BaseError = require('./baseError');

function NoBaseClassObjectError(message) {
  BaseError.call(this, message, "NO_BASE_CLASS_OBJECT");
}

NoBaseClassObjectError.prototype = Object.create(BaseError.prototype);
NoBaseClassObjectError.prototype.constructor = NoBaseClassObjectError;

module.exports = NoBaseClassObjectError;
