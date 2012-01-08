var redisData = require('../redisData');
var redisRing = require('../redisRing');
var mocks = require('../mocks');
var toggle = require('./toggle');

toggle.toggle(function(){

	var vows = require('vows'),
	assert = require('assert');

	redisRing.initClientsSync("../redisMaster.conf","sharedscreen");
	redisData.setRing(redisRing);

	//create a world
	//create some players
	//create some objects
	var world = [0,1,2,3,4,5,6];
	var players = {"joe":"mike", "adam":"riley"};
	var objects = {"redis":"node", "test":{"whatever":"else"}};
	var worldkey = "testing:redisData:testWorld";
	var somePlayerKey = "newPlayer1";
	var somePlayerKey2 = "newPlayer2";

	vows.describe('Redis Mass Data Storage').addBatch({	
		'when storing data ': 
		{
			topic: function(){
				redisData.setWorldAll(worldkey, world, players, objects, this.callback);
			},
			'it should result in a callback with data': function(err, result)
			{				
				assert.equal(err, undefined);
				assert.equal(result[redisData.WORLD][0], 'OK');
				assert.equal(result[redisData.PLAYERS][0], 'OK');
				assert.equal(result[redisData.OBJECTS][0], 'OK');
			},		
			'when retrieving a world set':
			{
				
				topic: function(){					
					redisData.getWorld(worldkey, this.callback);
				},				
				'it should result in a successful callback with the world previously set': function(err, result)
				{
					
					assert.equal(err, undefined);
					assert.notEqual(result, undefined);									
					checkWorld(result);
				}			
			},
			'when retrieving players set':
			{
				topic: function(){
					redisData.getWorldPlayers(worldkey, this.callback);
				},				
				'it should result in a successful callback with the players previously set': function(err, result)
				{
				
					assert.equal(err, undefined);
					var players = result;
					assert.notEqual(players, undefined);
					checkPlayers(players);			
				}			
			},
			'when retrieving objects set':
			{
				topic: function(){
					redisData.getWorldObjects(worldkey, this.callback);
				},				
				'it should result in a successful callback with the objects previously set': function(err, result)
				{
					
					assert.equal(err, undefined);
					var objects = result;
					assert.notEqual(objects , undefined);
					checkObjects(objects);			
				}			
			},
			'when doing a global get':
			{
				topic: function(){
					redisData.getWorldAll(worldkey, this.callback);
				},				
				'it should result in a successful callback with the objects previously set': function(err, result)
				{
					
					assert.equal(err, undefined);					
					assert.notEqual(result, undefined);
					checkWorld(result[redisData.WORLD][0]);
					checkPlayers(result[redisData.PLAYERS][0]);
					checkObjects(result[redisData.OBJECTS][0]);
				}			
			},
			"when doing a global get for a key that doesn't exist":
			{
				topic: function(){
					redisData.getWorldAll("thiskeyisfake", this.callback);
				},				
				'it should result in a successful callback with undefined objects': function(err, result)
				{					
					assert.equal(err, undefined);					
					assert.notEqual(result, undefined);
					assert.equal(result[redisData.WORLD][0], undefined);
					assert.equal(result[redisData.PLAYERS]["joe"],undefined);
					assert.equal(result[redisData.OBJECTS]["redis"],undefined);
					
				}			
			}
		},
		teardown : function (topic) { 

			redisData.removeWorldPlayer(worldkey, somePlayerKey, function(err, result){
				if (err) throw err;
				console.log("teardown 1 complete.");
			});
			redisData.removePlayer(somePlayerKey, function(err, result){
				if (err) throw err;
				console.log("teardown 2 complete.");
			});					
		}
		
	}).run();


	vows.describe('Redis Player Add/Remove/Retrieve').addBatch({	
		'When adding a player to a world': 
		{
			topic: function(){
				redisData.addWorldPlayer(worldkey, somePlayerKey, {"someobject":"somevalue"}, this.callback);	
			},
			'we should get success': function(err, result)
			{
				assert.equal(err, undefined);
				assert.notEqual(result, undefined);
			},
			'we should be able to now retrieve that user, so when we call getWorldplayer':
			{
				topic: function()
				{
					redisData.getWorldPlayer(worldkey, somePlayerKey, this.callback);
				
				},
				'we should get the player':function(err, result)
				{
					assert.equal(err, undefined);
					assert.notEqual(result, undefined);
					assert.equal(result.someobject, "somevalue");
				}
			},
			'we should also be able to grab the player and see the world id set correctly':
			{
				topic: function()
				{
					redisData.getPlayer(somePlayerKey, this.callback);
				},
				'we should get the player and check the world id': function(err, result)
				{
					assert.equal(err, undefined);
					assert.equal(result.worldId,worldkey);
				}
			},
			'after that, we should be able to remove the player successfull - when call removeWorldPlayer':
			{
				topic: function()
				{
					redisData.removeWorldPlayer(worldkey, somePlayerKey, this.callback);
				},
				'we should get a positive response':function(err, result)
				{
					assert.equal(err, undefined);
					assert.notEqual(result,undefined);					
				},
				'we should now not find the user':
				{
					topic: function()
					{
						redisData.getWorldPlayer(worldkey, somePlayerKey, this.callback)
					},
					'a call to getWorldPlayer should result in no result':function(err, result)
					{
						assert.equal(err, undefined)
						assert.equal(result,undefined);					
					}
					
				}
			}
			
		},
		'When generally adding a player':
		{
			topic: function(){
				redisData.makePlayer(somePlayerKey2, mocks.getTestPlayerDef(somePlayerKey2), this.callback);	
			},
			'we should get success': function(err, result)
			{
				assert.equal(err, undefined);
				assert.notEqual(result, undefined);
			},
			'we should be able to read the result': function(err, result)
			{
				assert.notEqual(result.result, 	undefined);
			},
			'we should be able to read the player': function(err, result)
			{
				var player = result.player;
				assert.equal(err, undefined);
				assert.equal(player.name, somePlayerKey2);
				assert.equal(player.x, 20);
				assert.equal(player.y, 30);
				assert.equal(player.cellX, 40);
				assert.equal(player.cellY, 50);
				assert.equal(player.speed, 5);
				assert.notEqual(player.compositeDef, undefined);
				assert.equal(player.compositeDef["someobject"], "somevalue");
			},
			'we should be able to read it back':
			{
				topic:function(){
					redisData.getPlayer(somePlayerKey2, this.callback);				
				},
				'reading it back should not fail':function(err, result)
				{
					assert.equal(err, undefined);
					assert.equal(result.name, somePlayerKey2);
					assert.equal(result.x, 20);
					assert.equal(result.y, 30);
					assert.equal(result.cellX, 40);
					assert.equal(result.cellY, 50);
					assert.equal(result.speed, 5);
					assert.notEqual(result.compositeDef, undefined);
					assert.equal(result.compositeDef["someobject"], "somevalue");
					
				}
			},
			'we should be able to delete it':
			{
				topic: function(){
					redisData.removePlayer(somePlayerKey2, this.callback);
				},
				'and get a success message':function(err, result)
				{
					assert.equal(err, undefined);
					assert.notEqual(result, undefined);					
				},
				'but subsequent reads':
				{
					topic:function(){
						redisData.getPlayer(somePlayerKey2, this.callback);
					},
					'should fail':function(err, result)
					{
						assert.equal(err, undefined);
						assert.equal(result, undefined);
						
					}
				}
				
			}
		},
		teardown:function (topic) { 
			redisData.removePlayer(somePlayerKey2, function(err, result){
				if (err) throw err;
				console.log("teardown 3 complete.");
			});											
		}
		
	}).run();

	function checkWorld(result)
	{
		assert.equal(result[0],0);
		assert.equal(result[1],1);
		assert.equal(result[2],2);
		assert.equal(result[3],3);
		assert.equal(result[4],4);
		assert.equal(result[5],5);
		assert.equal(result[6],6);				
	}

	function checkPlayers(players)
	{
		assert.equal(players["joe"],"mike");
		assert.equal(players["adam"],"riley");	
	}

	function checkObjects(objects)
	{
		assert.equal(objects["redis"],"node");
		assert.equal(objects["test"].whatever,"else");	
	}


});

