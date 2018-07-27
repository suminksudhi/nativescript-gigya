var Gigya = require("nativescript-gigya").Gigya;
var gigya = new Gigya();

describe("greet function", function() {
    it("exists", function() {
        expect(gigya.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(gigya.greet()).toEqual("Hello, NS");
    });
});