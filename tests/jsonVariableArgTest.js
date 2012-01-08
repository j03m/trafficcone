var assert = require('assert');
var test = {
	"this":"value",
	"this1":"value1",

}

var var1 = "name1";
var var2 = "name2";

var test2 = {
	var1:"value",
	var2:"value1"
}

console.log(test["this"]);
assert.equal(test["this"], "value");
console.log(test2["name1"]);
assert.equal(test2["name1"], "value");