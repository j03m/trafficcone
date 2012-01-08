var redisData = require("./redisData");
var messages = require("./messages");
var ring = require("./redisRing");
var worldModelFactory = require("./public/tccore/GameWorldModelIso");
var dungeon = require("./dungeon");
var mocks = require("./mocks");
var msgQueue = [];
var screenWidth = 800;
var screenHeight = 600;
var cellWidth = 73;
var cellHeight = 73;
var astar = require("./public/tccore/pathfinding/astar").getAstar() ;
var DATABASE = "sharedscreen";
var players = {};

//load the conf
var redisConf;
var self = this;
ring.initClientsSync("/Users/josephm/Dropbox/Code/trafficcone/redisMaster.conf", DATABASE);
redisData.setRing(ring);

//todo this should become a priority queue at some point
var msgQueue = [];


var sendUpdateToAll; //function for broadcasting messages
var sendUpdate; //function for sending targetted message

exports.start = function () {    
    //game loop
    console.log("Engine loop started. ");
    process.nextTick(self.gameLoop);
}

exports.setUpdateToAll = function (updateMethod) {
    console.log("sendUpdateToAll set. ");
    sendUpdateToAll = updateMethod;
}

exports.setUpdate = function (updateMethod) {
    console.log("sendUpdate set. ");
    sendUpdate = updateMethod;
}



//todo this should become a priority queue at some point
exports.enqueue = function (msg) {
    console.log("Message enqueued");
    if (msg.type == undefined) {
	throw "Message does not define a type"; //todo: do something smarter here, can't crash because a client sends garbage!
    }

    msgQueue.push(msg);
}

/***
	Main game loop
***/
exports.gameLoop = function()
{
	//as we receive messages we have to pull them off the queue	
	
	var msg = msgQueue.shift(); //todo: replace with priority queue? 
	
	if (msg != undefined) {
	    if (msg.type == messages.move) {
		console.log("received message type move.");
		handleMove(msg, function (returnMsg) {
		    //set the state of the sprite in question		    
		    players[returnMsg.name].state = returnMsg.state;
		    players[returnMsg.name].path = returnMsg.path;
		    players[returnMsg.name].moveCount = 0;
		});
	    }
	    else if (msg.type == messages.init)
	    {
	    	console.log("initialization requested.");
	    	initialize(msg,function(newMsg){			
			//send an update to the client in question
			sendUpdate(undefined, newMsg);					
			sendUpdateToAll(undefined, messages.playerJoinMsg(newMsg.player)); 
		});
	    	
	    }
	}
	else
	{
		//console.log(".");
	}
	pulse();
	updatePlayers(players)
	process.nextTick(self.gameLoop);
}

/*** 
	Initializes a new player
		gets a player id
		read the hashmap for a player
		get the world the player is in, fetch it
		return the world and the player to the client
		render
***/

function initialize(msg, callback)
{
	
	var playerid = redisData.getPlayerSession(msg.sessionId);	
	
	//if the player's session doesn't exist
	if (playerid == undefined)
	{
		//todo: create a message indicating redirect to main
		throw "Not implemented.";
	}
	
	redisData.getPlayer(playerid, function(err, result)
	{
		var player= result;
		var worldid;
		if (err)
		{
			console.log("getPlayer failed - " + err);
			throw err;
		}
		else if (player == undefined)
		{
			console.log("getPlayer failed result undefined.");		
						
			//fetch the world,
			worldid = mocks.getStartWorld();
			getWorld(worldid, function(result){				
				var worldModel = getWorldModel(result.worldArray);
				var def = mocks.getRandomPlayerDef(playerid, worldModel);
				var worldRes = result;	
				redisData.makePlayer(playerid, def, function(err, result){				
					if (err) throw err;	
					var playerRes = result;
					redisData.addWorldPlayer(worldid, playerid, playerRes.player, function(err, result)
					{																	
						//construct message, call callback										
						playerRes.player.worldid = worldid;
						callback(messages.initResponseMsg(playerRes.player, worldRes, msg.client));					

					});
				});
			});
			
		}
		else //player exists
		{
			//add player to world
			if (player.worldId == undefined)
			{
				player.worldId = mocks.getStartWorld();
			}
			worldid = player.worldId;			
			redisData.addWorldPlayer(worldid, playerid, player, function(err, result)
			{
				if (err) throw err;					
				//fetch the world,
				getWorld(worldid, function(world){
					if (err) throw err;												
					//construct message, call callback										
					callback(messages.initResponseMsg(player,world, msg.client));					
				});									
			});			
		}
											
	});
}







/***
	Updates all players - todo: mature to visible players only
***/
function updatePlayers(players)
{
	for (var player in players) { //
	    player = players[player];
	    if (player.state == "seek" && player.path != undefined) { //
		player.moveCount++;
		if (player.moveCount < player.path.length) {

		    player.x = player.path[player.moveCount].x;
		    player.y = player.path[player.moveCount].y;		
		    redisData.setPlayerProperty(player.name, "x", player.x, function(){});			
		    redisData.setPlayerProperty(player.name, "y", player.y, function(){});			
		    sendUpdateToAll(undefined, messages.getMoveResponseMsg(player));
		}
		else if (player.moveCount == player.path.length) {
		    //the move is done, restore state
		    console.log("path done.");
		    sendUpdateToAll(undefined, messages.getStateChangeResponseMsg(player));
		    player.path = undefined;
		}
	    }

	}
}


/***
	handles movement server side
***/
function handleMove(msg, callback)
{
	
	var playerid = redisData.getPlayerSession(msg.sessionId);

	redisData.getPlayer(playerid, function(err, result)
	{
		if (err){
			throw err;
		}
		 
		if (result == undefined)
		{
			throw "unknown player.";
		}
		
		var player = result;		
		redisData.getWorld(player.worldId, function(err, result)
		{
			var world = result;
			if (err)
			{
				console.log("Failed to get world - " + err);
				return;
			}		
			else
			{
				if (result == undefined) //virgin code			
				{
					throw("world doesn't exist, ignore.");
					
				}
				else
				{
					players[player.name] = player;
					findPath(msg, player, world, callback);
				}
			}
		});
		
	});
}


/***
	path finder todo: refactor
***/
function findPath(msg, player, world, callback)
{
  	//we need a worldmodel to path find
  	var worldModel = getWorldModel(world);
  	worldModel.originX = msg.originX;
	worldModel.originY = msg.originY;

	var sprite = player;
	if (sprite == undefined) {
		//can move something that doesn't exist
		throw "Msg from: " + msg.client.user.clientId + " sent a sprite id that doesn't exist: " + msg.uniqueId;
	}

	var startCell;
	var endCell;
	
	startCell = worldModel.getWorldCellFromScreenCoord(sprite.x, sprite.y);	
	endCell = worldModel.getWorldCellFromScreenCoord(msg.x, msg.y);

	console.log("startCell: " + startCell.x + "," + startCell.y);
	console.log("endCell: " + endCell.x + "," + endCell.y);

	console.log("searching...");
	var path = astar.search(world, startCell, endCell, worldModel, undefined);

	if (path == undefined || path.length == 0) {
		console.log("no path found...");
		console.log("path defined: " + (path != undefined));
		msg = messages.extendMoveMsg(msg, player.name, undefined);
		msg.type = "mov";
		msg.state = "found";
		callback(msg);
		return;
	}

	console.log("smoothing path");
	path = astar.smoothPath(path, sprite.width, worldModel);

	console.log("path to points");
	var pathPoints = astar.pathToPoints(path, worldModel, sprite.speed, { "x": sprite.x, "y": sprite.y });
	
	console.log("returning path");	
	msg = messages.extendMoveMsg(msg, player.name, pathPoints);
	
	callback(msg);		
}

/***
	gets a world instance
	
***/
function getWorld(worldId, callback)
{
	//single hard coded game id for now, will update to support modifiable worlds
	
	var returnMsg = {};
	
	redisData.getWorldAll(worldId, function(err, result)
	{
		if (err)
		{
			console.log("Failed to get world - " + err);
			throw err;
		}		
		else
		{
			//if (result[redisData.WORLD][0] == undefined) //virgin code
			if (true)
			{
				//create the world
				var world = dungeon.getDungeon();
				redisData.setWorld(worldId, world, function(err, result){
					if (err)
					{
						console.log("Couldn't set the world - " + err);
						throw err;
					}
					else
					{
						redisData.getWorldAll(worldId, function(err, result)
						{
							if (err)
							{
								console.log("Couldn't get after set the world - " + err);
								throw err;
							}		
							else
							{
								if (result[redisData.WORLD][0] == undefined)
								{
									console.log("Couldn't get after set the world - no error, world undefined.");
									throw err;
								}
								returnMsg = prepWorldReturn(result);
								callback(returnMsg);	
							}
						});
					}
					
				});
			}
			else
			{
				returnMsg = prepWorldReturn(result);
				callback(returnMsg);
			}
			
		}
	});
	
		
}





function prepWorldReturn(msg)
{	
	return {"worldArray":msg.world[0],"players":players,"objects":msg.objects[0] };
}


function getWorldModel(world)
{
	return worldModelFactory.getIsoModel(world, world.length/2, world[0].length/2, 800, 600, 75, 75);
}
exports.getWorldModel = getWorldModel;

//game logic.
function pulse()
{
	//
}
