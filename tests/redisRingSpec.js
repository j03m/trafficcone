var ring = require("../redisRing");
var assert = require('assert');
var fs = require("fs");

require('tty').setRawMode(true);    
var stdin = process.openStdin();

stdin.on('keypress', function (chunk, key) {
 
	fs.readFile("../redisMaster.conf", function (err, data) 
	{
		if (err) { throw "Could not start the tests. Could not read redisMaster.conf. Error: " + err; }	
		console.log("running redis client ring tests");
		ring.initClients(data, "sharedscreen");
		var confObj = JSON.parse(data); 

		//TEST: should have a list of redis clients = to what is in my config, but not slaves
		var masters = countMasters(confObj );
		console.log(ring.getNumberOfClients(),masters);
		assert.equal(ring.getNumberOfClients(),masters);
		console.log("redis ring 0 pass...");


		//TEST: should be able to set and get data from the same instance based a specific key"
		var key ="tests:thisworldissobeautiful"; 	
		var theValue =  "oh,yes. yes it is";	
		ring.set(key ,theValue, function(err, result,setInstanceName, setInstanceIp, setInstancePort)
		{				
			assert.equal(err, undefined);
			assert.equal(result, 'OK');
			
			console.log("set result: " + result);
			console.log("set instance: " + setInstanceName);

			ring.get(key, function(err, result, instanceName, instanceIp, instancePort)
			{
				console.log("get instance: " + setInstanceName);
				console.log("get result: " + result);
				assert.equal(result, theValue);
				assert.equal(instanceName,setInstanceName);
				assert.equal(instanceIp,setInstanceIp);
				assert.equal(instancePort,setInstancePort);				
				console.log("redis ring 1 pass...");

				var results = [];
				var passed = true;
				var counter = 0;
				for(var i = 0;i<confObj.instances.length; i++)
				{
					var rand = Math.floor(Math.random() * 10000000);
					var theKey = "test:counters:" + rand;				
					ring.set(theKey, rand, function(err, result, instanceName, instanceIp, instancePort)
					{										
						console.log("value: " + theKey + " placed at instance: " + instanceName);
						counter++;
					});
				}	
				
				//todo: get hash to work
				
				//set a hash value
				var key ="tests:thisworldissobeautiful:hash"; 
				
				ring.hmset(key, "world", "value1", "players", "value2", function(err, result, instanceName, instanceIp, instancePort)
				{
					if (err!= undefined) { throw err; }
					if (result!= 'OK') {throw "hmset didn't return OK";}
					ring.hget(key, "world", function(err, result)
					{
						if (err!= undefined) { throw err; }
						if (result != "value1") { throw "hget returned an invalid result.";}
						ring.hget(key, "players", function(err, result)
						{	
							if (err!= undefined) { throw err; }
							if (result != "value2") { throw "hget returned an invalid result.";}
							ring.hgetall(key, function(err, result)
							{	
								if (err!= undefined) { throw err; }
								if (result["world"] != "value1") { throw "hgetall returned an invalid result.";}
								if (result["players"] != "value2") { throw "hgetall returned an invalid result.";}
								
								if (counter!= confObj.instances.length)
								{
									throw "Some sets didn't return....?";
								}
								else
								{
									console.log("redis ring 2 pass...");
								}
																								
								console.log("redis ring 3 pass...");

							});	
						});
					});
				});
				
				
				//hmset with hash
				var testSet = {};
				testSet["world"] = "value1";
				testSet["players"] = "value2";
				ring.hmset(key + "anotherKey", testSet ,function(err, result, instanceName, instanceIp, instancePort)
				{
					if (err!= undefined) { throw err; }
					if (result!= 'OK') {throw "hmset didn't return OK";}
					ring.hgetall(key + "anotherKey", function(err, result)
					{
						if (err!= undefined) { throw err; }
						if (result["world"] != "value1") { throw "hgetall from hash returned an invalid result.";}
						if (result["players"] != "value2") { throw "hgetall from hash returned an invalid result.";}
						console.log("redis ring 4 pass...");
						process.exit();
					});						
				});

			});
		});





		//todo: tear down?

		/*it("should throw an exception if I pass in no data", function(){

		});*/

	});
});

function countMasters(confObj )
{
	var returnme = 0;
	for(var i =0; i<confObj.instances.length; i++)
	{
		if (confObj.instances[i].slaveof == undefined)
		{
			returnme++;
		}
	}
	
	return returnme;
}