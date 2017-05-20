var chai = require("chai");
var BaseProvider = require("../../lib/providers/baseProvider");

var provider;

describe("BaseProvider", function() {

  describe("new BaseProvider()", function() {
    it("should raise error if config is not passed", function(done) {
      try {
        provider = new BaseProvider();
        done("the test case should fail");
      } catch(error) {
        chai.expect(error.message).to.be.equal("Cannot create object of BaseProvider.");
        done();
      }
    });
  });
});
