var HashRing = require('hash_ring');
var redis = require("redis");    
var redisClients = {};		
var ring;
var redisConf;

var self = this;

exports.initClientsSync = function(configFile, database)
{
	var data = require("fs").readFileSync(configFile);
	this.initClients(data, database);
}

exports.initClients = function(config, database)
{
	
	if (config == undefined) throw "config must be a correctly formatted json string. Please see the docs for more info. Your string: " + config;
	
	var ringInput = {};
	
	//parse the config (json, obviously)
	redisConf = JSON.parse(config);	
	
	
	//loop through the instances in the config file, create clients and create a hashRing based on the instance names
	if (redisConf.instances.length<=0) throw "Atleast one instance is required.";
	for(var i =0; i<redisConf.instances.length; i++)
	{
		var instance = redisConf.instances[i];
		//ignore slaves, we're not intested
		if (instance.slaveof == undefined) 
		{
			//create the client
			var redisClient = redis.createClient(instance.port, instance.ip);
			
			//set the redis database based on the param
			redisClient.select(redisConf.databases[database]);
			redisClients[instance.name] = redisClient;
			redisClients[instance.name].name = instance.name;
			redisClients[instance.name].ip = instance.ip;
			redisClients[instance.name].port = instance.port;
			if (instance.weight == undefined)
			{
				ringInput[instance.name] = 1;
			}
			else
			{
				ringInput[instance.name] = instance.weight;
			}
		}		
	}

	ring = new HashRing(ringInput); //create a hashring for sharding
	
	
	//inherit all methods from the client into redisRing
	var supportedMethods = [
		"append","auth","bgrewriteaof ","bgsave ","blpop","brpop","brpoplpush","dbsize ","decr","decrby","del","discard ","echo",
		"exec ","exists","expire","expireat","flushall ","flushdb ","get","getbit","getrange","getset","hdel","hexists","hget",
		"hgetall","hincrby","hkeys","hlen","hmget","hmset","hset","hsetnx","hvals","incr","incrby","info ","keys","lastsave ",
		"lindex","linsert","llen","lpop","lpush","lpushx","lrange","lrem","lset","ltrim","mget","monitor ","move","mset","msetnx",
		"multi ","object","persist","ping ","psubscribe","publish","punsubscribe","quit ","randomkey ","rename","renamenx","rpop",
		"rpoplpush","rpush","rpushx","sadd","save ","scard","sdiff","sdiffstore","select","set","setbit","setex","setnx","setrange",
		"shutdown ","sinter","sinterstore","sismember","slaveof","slowlog","smembers","smove","sort","spop","srandmember","srem",
		"strlen","subscribe","sunion","sunionstore","sync ","ttl","type","unsubscribe","unwatch ","watch","zadd","zcard","zcount",
		"zincrby","zinterstore","zrange","zrangebyscore","zrank","zrem","zremrangebyrank","zremrangebyscore","zrevrange","zrevrangebyscore",
		"zrevrank","zscore","zunionstore"];
	
	for(var i =0; i<supportedMethods.length; i++)	
	{
		exports[supportedMethods[i]] = function()		
		{
			var client = getClient(arguments[0]);
			executeClientCommand(client, arguments.callee.invokeName, arguments);
		}
		exports[supportedMethods[i]].invokeName = supportedMethods[i];				
	}			
}

exports.getNumberOfClients = function()
{
	var size = 0;
	for (var key in redisClients) {
		size++;
	}
	return size;
}

exports.getClients = function()
{
	return redisClients;
}





function getClient(key)
{
	var instance = ring.getNode(key);		
	var client = redisClients[instance];
	return client;
}


function executeClientCommand(client, method, args)
{
	var origCallBack = args[args.length-1];
	args[args.length-1]= function(err, result)
	{
		origCallBack(err, result, client.name, client.ip, client.port);
	}
	client[method].apply(client,args);
}

