var vows = require('vows');
var assert = require('assert');
var serverEngine = require('../serverCore');
var messages = require('../messages');
var mocks = require('../mocks');
var requestMsgs  = require('../public/tccore/requestMessages');
var toggle = require('./toggle');
var gblName = "joe";
var redisData = require("../redisData");
toggle.toggle(function(){
	var worldId = "omgthisisatestworldidthatimadeup";

	vows.describe('Server Core - new player init').addBatch({	
		
		
		//init - 
		//	 gets a player id
		//	 read the hashmap for a player
		//	 get the world the player is in, fetch it
		//	 return the world and the player to the client
		//	 render
		'when a new player sends a join/init message': 
		{
			topic: function(){
				serverEngine.setUpdate(this.callback); //expectation is that sendupdateall is called. This will throw error if invoked
				serverEngine.setUpdateToAll(function(){});	
				serverEngine.start();														
				var msg = requestMsgs.initRequestMsg(gblName,mocks.getMockClient());			
				serverEngine.enqueue(msg);

			},
			'it should send an update to all other players': function(err, msg)
			{
				assert.notEqual(msg,undefined);								
				assert.equal(msg.type,messages.init);								
				assert.notEqual(msg.player,undefined);								
				assert.notEqual(msg.world,undefined);								
				assert.notEqual(msg.client,undefined);								
				
			},
			'it should return the same client id we supplied': function(err, msg)
			{
				assert.equal(msg.client.user.clientid,mocks.getMockClient().user.clientid);												
			},
			'it should return the name we supplied': function(msg)
			{
				assert.equal(msg.player.name, gblName);												
			},
			'it should return a full composite descriptor': function(err, msg)
			{
				assert.notEqual(msg.player.compositeDef, undefined);				
				assert.notEqual(msg.player.compositeDef.tokenClass, undefined);				
				assert.notEqual(msg.player.compositeDef.weaponClass, undefined);				
				assert.notEqual(msg.player.compositeDef.HD, undefined);				
				assert.notEqual(msg.player.compositeDef.TR, undefined);				
				assert.notEqual(msg.player.compositeDef.LG, undefined);				
				assert.notEqual(msg.player.compositeDef.RA, undefined);				
				assert.notEqual(msg.player.compositeDef.LA, undefined);				
				assert.notEqual(msg.player.compositeDef.RH, undefined);				
				assert.notEqual(msg.player.compositeDef.LH, undefined);				
				assert.notEqual(msg.player.compositeDef.SH, undefined);		
				assert.equal(msg.player.speed, 5);
				assert.equal(msg.player.compositeDef.name, gblName);				
			},
			'it should provide us a location at the center of the view port': function(err, msg)
			{
				assert.equal(msg.player.x,400);
				assert.equal(msg.player.y,300);				
			},
			'it should provide us a world cell location for the player (random)': function(err, msg)
			{
				assert.notEqual(msg.player.cellX,undefined);
				assert.notEqual(msg.player.cellY,undefined);
			},
			'it should provide us a world instance': function(err, msg)
			{
				assert.equal(msg.world.worldArray.length,31);
				assert.equal(msg.world.worldArray[0].length,31);
			},
			teardown : function (topic) { 
				redisData.removeWorldPlayer(worldId, gblName, function(err, result){
					if (err) throw err;
					console.log("teardown 1 complete.");
					redisData.removePlayer(gblName, function(err, result){
						if (err) throw err;
						console.log("teardown 2 complete.");
					});
				});								
			}
		}
		
		
	}).run();



	vows.describe('Server Core 2 - existing player init').addBatch({	
		'when an existing player send the join/init message':
		{
		
			topic: function(){
				serverEngine.setUpdate(this.callback); //expectation is that sendupdateall is called. This will throw error if invoked
				serverEngine.setUpdateToAll(function(){});	
				serverEngine.start();		
				
				//add a player
				redisData.makePlayer(gblName, mocks.getRandomPlayerDef(gblName), function(err, result)
				{
					var msg = requestMsgs.initRequestMsg(gblName,mocks.getMockClient());			
					serverEngine.enqueue(msg);

				});				

			},
			'*it should send an update to all other players': function(err, msg)
			{
				assert.notEqual(msg,undefined);								
				assert.equal(msg.type,messages.init);								
				assert.notEqual(msg.player,undefined);								
				assert.notEqual(msg.world,undefined);								
				assert.notEqual(msg.client,undefined);								

			},
			'*it should return the same client id we supplied': function(err, msg)
			{
				assert.equal(msg.client.user.clientid,mocks.getMockClient().user.clientid);												
			},
			'*it should return the name we supplied': function(msg)
			{
				assert.equal(msg.player.name, gblName);												
			},
			'*it should return a full composite descriptor': function(err, msg)
			{
				assert.notEqual(msg.player.compositeDef, undefined);				
				assert.notEqual(msg.player.compositeDef.tokenClass, undefined);				
				assert.notEqual(msg.player.compositeDef.weaponClass, undefined);				
				assert.notEqual(msg.player.compositeDef.HD, undefined);				
				assert.notEqual(msg.player.compositeDef.TR, undefined);				
				assert.notEqual(msg.player.compositeDef.LG, undefined);				
				assert.notEqual(msg.player.compositeDef.RA, undefined);				
				assert.notEqual(msg.player.compositeDef.LA, undefined);				
				assert.notEqual(msg.player.compositeDef.RH, undefined);				
				assert.notEqual(msg.player.compositeDef.LH, undefined);				
				assert.notEqual(msg.player.compositeDef.SH, undefined);	
				assert.equal(msg.player.speed, 5);
				assert.equal(msg.player.compositeDef.name, gblName);				
			},
			'*it should provide us a location at the center of the view port': function(err, msg)
			{
				assert.equal(msg.player.x,400);
				assert.equal(msg.player.y,300);				
			},
			'*it should provide us a world cell location for the player (random)': function(err, msg)
			{
				assert.notEqual(msg.player.cellX,undefined);
				assert.notEqual(msg.player.cellY,undefined);
			},
			'*it should provide us a world instance': function(err, msg)
			{
				assert.equal(msg.world.worldArray.length,31);
				assert.equal(msg.world.worldArray[0].length,31);
			},
			teardown : function (topic) { 
				redisData.removeWorldPlayer(worldId, gblName, function(err, result){
					if (err) throw err;
					console.log("teardown 3 complete.");
					redisData.removePlayer(gblName, function(err, result){
						if (err) throw err;
						console.log("teardown 4 complete.");
					});
				});								
			}
		
		}

	}).run();


	

	
});