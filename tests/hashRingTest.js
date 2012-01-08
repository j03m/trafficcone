var HashRing = require('hash_ring');
var obj = {};
obj["A"] = 1;
obj["B"] = 1;
obj["C"] = 1;
var ring = new HashRing(obj);
var instance = ring.getNode("hi to the world");
console.log(instance);