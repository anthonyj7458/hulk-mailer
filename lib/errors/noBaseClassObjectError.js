var InternalServerError = require("./internalServerError");

function NoBaseClassObjectError(name) {
  InternalServerError.call(this, "Cannot create object of " + name + ".", "NO_BASE_CLASS_OBJECT");
}

NoBaseClassObjectError.prototype = Object.create(InternalServerError.prototype);
NoBaseClassObjectError.prototype.constructor = NoBaseClassObjectError;

module.exports = NoBaseClassObjectError;
