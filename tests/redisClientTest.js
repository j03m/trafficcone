var redis = require("redis");    
var redisClient = redis.createClient("9000", "127.0.0.1");
redisClient.set("hellolovely", "wowthisworks", function(err, val){
	console.log("set error if any: " + err);
	console.log ("set value: " + val);
	
	redisClient.get("hellolovely", function(err, val){
		console.log("set error if any: " + err);
		console.log ("set value: " + val);
	});
});