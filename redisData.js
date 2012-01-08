var ring = undefined;
var self = this;
var async = require('async');

var WORLD = "world";
var PLAYERS = "players";
var OBJECTS = "objects";

var WORLDPLAYERS = "world:players";
var PLAYERID = "player:data";
var PLAYER_PROPERTY_WORLD_ID = "worldId";

exports.WORLD = WORLD;
exports.WORLDPLAYERS= WORLDPLAYERS;
exports.PLAYERS= PLAYERS;
exports.OBJECTS = OBJECTS;
exports.PLAYERID = PLAYERID;

if (JSON.safeParse ==undefined)
{
	JSON.safeParse = function(input)
	{	
		if (input!=undefined) 
		{ 
			return JSON.parse(input); 
		}
		else
		{
			return undefined;
		}
	}
}
/*************************************************/
/*************************************************/
/** Admin bulk set
/*************************************************/
/*************************************************/
exports.setWorldAll = function(key, worldArray, players, objects, userCallback)
{
	if (key == undefined) { throw "requires a key!"}
	if (worldArray == undefined) throw "Must supply a world.";
	if (worldArray.length == 0) throw "Must supply a world with height > 0.";
	if (worldArray[0].length == 0) throw "Must supply a world with width > 0.";
	
	async.parallel({
		"world":function(callback)
		{
			self.setWorld(key, worldArray, callback);

		},
		"players":function(callback)
		{
			self.setWorldPlayers(key, players, callback);
		},
		"objects":function(callback)
		{
			self.setWorldObjects(key, objects, callback);
		},
	
	},
	function(err, result)
	{
		userCallback(err, result);
	});			
}


/*************************************************/
/*************************************************/
/** Admin bulk get
/*************************************************/
/*************************************************/
exports.getWorldAll = function(key, userCallback)
{
	if (key == undefined) { throw "requires a key!"}	
	async.parallel({
		"world":function(callback)
		{
			self.getWorld(key,callback);

		},
		"players":function(callback)
		{
			self.getWorldPlayers(key, callback);
		},
		"objects":function(callback)
		{
			self.getWorldObjects(key, callback);
		},
	
	},
	function(err, result)
	{
		userCallback(err, result);
	});			
}


/*************************************************/
/*************************************************/
/** World Get/Set				**/
/*************************************************/
/*************************************************/
exports.setWorld = function(key, value, callback)
{
	if (key == undefined) { throw "requires a key!"; }
	var worldkey = self.getWorldKey(key);
	ring.set(worldkey, JSON.stringify(value), callback);
}

exports.getWorld = function(key, callback)
{
	if (key == undefined) { throw "requires a key!"}	
	var worldKey = self.getWorldKey(key);
	ring.get(worldKey, function(err, result, instanceName, instanceIp, instancePort){
		callback(err, JSON.safeParse(result), instanceName, instanceIp, instancePort);
	});
}

/*************************************************/
/*************************************************/
/** Players Get/Set/Add/Remove			**/
/** Player is a hashset of property		**/
/*************************************************/
/*************************************************/
exports.getWorldPlayers= function(key, callback)
{
	if (key == undefined) { throw "requires a key!"}
	var pk = self.getWorldPlayersKey(key);
	ring.hgetall(pk, function(err, result, instanceName, instanceIp, instancePort)
	{
		
		if (err==undefined && result != undefined)
		{
			result = self.convertMapToObjects(result);
		}
		callback(err, result, instanceName, instanceIp, instancePort);
	});
}

exports.setWorldPlayers = function(key, value, callback)
{
	if (key == undefined) { throw "requires a key!"}
	if (value == undefined) { throw "cannot set players to undefined!"}	
	var playerskey = self.getWorldPlayersKey(key);
	value = self.convertMapToJSON(value);	
	ring.hmset(playerskey, value, function(err, result, instanceName, instanceIp, instancePort){
		result = self.convertMapToObjects(result);		
		callback(err, result, instanceName, instanceIp, instancePort);
	});
}

exports.addWorldPlayer= function(worldid, playerid, playerdata, callback)
{
	if (worldid == undefined) { throw "requires a worldid";}
	if (playerid == undefined) { throw "requires a playerid";}
	if (playerdata == undefined) { throw "um, let's not set empty player data. Use removeWorldPlayer instead."; }
	var playerskey = self.getWorldPlayersKey(worldid);
	ring.hset(playerskey, playerid, JSON.stringify(playerdata), function(err, result, instanceName, instanceIp, instancePort){		
		
		if (err!=undefined)
		{
			console.log("Add world player failed, could not continue: " + err);
			throw err;
		}
		self.setPlayerProperty(playerid, PLAYER_PROPERTY_WORLD_ID, worldid, callback);			
	});
	
}

exports.getWorldPlayer = function(worldid, playerid, callback)
{
	if (worldid == undefined) { throw "requires a worldid";}
	if (playerid == undefined) { throw "requires a playerid";}	
	var playerskey = self.getWorldPlayersKey(worldid);
	ring.hget(playerskey, playerid, function(err, result, instanceName, instanceIp, instancePort){		
		callback(err, JSON.safeParse(result), instanceName, instanceIp, instancePort);
	});	
}

exports.removeWorldPlayer = function(worldid, playerid, callback)
{
	if (worldid == undefined) { throw "requires a worldid";}
	if (playerid == undefined) { throw "requires a playerid";}	
	var playerskey = self.getWorldPlayersKey(worldid);
	ring.hdel(playerskey, playerid, function(err, result, instanceName, instanceIp, instancePort){		
		if (err!=undefined)
		{
			console.log("Remove World Player failed, could not continue." + err);
			throw err;
		}
		self.setPlayerProperty(playerid, PLAYER_PROPERTY_WORLD_ID, undefined, callback);								
	});
}

exports.getPlayer=function(playerid, callback)
{
	var singlePlayerKey = self.getPlayerKey(playerid);
	ring.hgetall(singlePlayerKey, function(err, result, instanceName, instanceIp, instancePort){		
		
		//hgetall returns an empty object if the key isn't found
		//to keep things consistent force it to return undefined when this happens
		if (!self.isEmpty(result))
		{
			result.compositeDef = JSON.safeParse(result.compositeDef);
		}
		else
		{
			result = undefined;
		}
		
		callback(err, result, instanceName, instanceIp, instancePort);
	});
}

exports.removePlayer = function(playerid, callback)
{
	var singlePlayerKey = self.getPlayerKey(playerid);
	ring.del(singlePlayerKey, function(err, result, instanceName, instanceIp, instancePort){		
		callback(err, result, instanceName, instanceIp, instancePort);
	});

}

exports.makePlayer = function(playerid,playerDef,callback)
{
	
	playerDef.compositeDef = JSON.stringify(playerDef.compositeDef);
	var singlePlayerKey = self.getPlayerKey(playerid);	
	ring.hmset(singlePlayerKey, playerDef, function(err, result, instanceName, instanceIp, instancePort){
		var makePlayerResult = {};
		makePlayerResult.result = result;
		playerDef.compositeDef = JSON.parse(playerDef.compositeDef);
		makePlayerResult.player = playerDef;		
		callback(err, makePlayerResult, instanceName, instanceIp, instancePort);
	});
	
}

exports.setPlayerProperty = function (playerid, propertyid, propertyValue, callback)
{
	var singlePlayerKey = self.getPlayerKey(playerid);
	ring.hset(singlePlayerKey,propertyid, propertyValue, function(err, result, instanceName, instanceIp, instancePort){
		callback(err, result, instanceName, instanceIp, instancePort);
	});	
}

exports.getPlayerSession = function(sessionid )
{
	//todo: actually implement this w/ callback
	if (sessionid ==undefined) {
		throw "sessionid cannot be undefined!";
	}
	return sessionid;
}


/*************************************************/
/*************************************************/
/** Objects Get/Set				**/
/*************************************************/
/*************************************************/
exports.getWorldObjects= function(key, callback)
{
	if (key == undefined) { throw "requires a key!"}
	var ok = self.getWorldObjectsKey(key);
	ring.hgetall(ok, function(err, result, instanceName, instanceIp, instancePort){
		if (err==undefined && result != undefined)
		{
			result = self.convertMapToObjects(result);
		}
		callback(err, result, instanceName, instanceIp, instancePort);
	});
}

exports.setWorldObjects = function(key, value, callback)
{
	if (key == undefined) { throw "requires a key!"}
	if (value == undefined) { throw "cannot set objects to undefined!"}
	var objectskey = self.getWorldObjectsKey(key);
	value = self.convertMapToJSON(value);

	ring.hmset(objectskey, value,  function(err, result, instanceName, instanceIp, instancePort){				
		callback(err, result, instanceName, instanceIp, instancePort);		
	});

}


/*************************************************/
/*************************************************/
/** Misc **/
/*************************************************/
/*************************************************/

exports.convertMapToJSON = function(value)
{
	for(var object in value)
	{
		if (typeof value[object] == "object")
		{
			value[object] = JSON.stringify(value[object]);
		}
	}	
	return value;
}

exports.convertMapToObjects = function(value)
{
	for(var object in value)
	{		
		try{
			value[object]  = JSON.safeParse(value[object]);
		}
		catch(e)
		{
		
		}
						
	}
	return value;
}

exports.getWorldKey = function(key)
{
	return WORLD+":"+key;
}

exports.getWorldPlayersKey= function(key)
{
	return WORLDPLAYERS+":"+key;
}

exports.getPlayerKey= function(playerid)
{
	return PLAYERID +":"+playerid;
}

exports.getWorldObjectsKey = function(key)
{
	return OBJECTS+":"+key;
}

exports.setRing = function(redisRing)
{
	ring=redisRing;
}

exports.isEmpty = function(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}