var vows = require('vows');
var assert = require('assert');
var serverEngine = require('../serverCore');
var messages = require('../messages');
var mocks = require('../mocks');
var requestMsgs  = require('../public/tccore/requestMessages');
var toggle = require('./toggle');
var gblName = "joe";
var redisData = require("../redisData");
var worldId = "omgthisisatestworldidthatimadeup";
var callback;
var self;
toggle.toggle(function(){
	
	vows.describe('Server Core - movement').addBatch({	
		
		
		'when a new player sends a move message': 
		{
			topic: function(){
 				self = this;
				serverEngine.setUpdateToAll(logUpdateAll);
				serverEngine.setUpdate(function(err, msg){
					serverEngine.setUpdate(logUpdate);
					var msg = requestMsgs.moveRequestMsg(gblName, 90, 34, 400, 300,mocks.getMockClient());
					callback = self.callback;			
					serverEngine.enqueue(msg);
					setTimeout(function(){
						callback();
					},1000);								
				});
				initializePlayerInWorld(); //sends the init message

			},
			'it should send different streams of data to the player vs other players': function(err, msg)
			{
				console.log("callback");								
				
			},
			teardown: function()
			{
				tearDownPlayerInWorld();	
			}
		}		
	}).run();	

});	


function logUpdateAll(err, msg)
{
	console.log("All: " + JSON.stringify(msg));
}

function logUpdate(err, msg)
{
	console.log("Mover: " + JSON.stringify(msg));
}

function initializePlayerInWorld()
{
	
	serverEngine.start();														
	var msg = requestMsgs.initRequestMsg(gblName,mocks.getMockClient());			
	serverEngine.enqueue(msg);
}

function tearDownPlayerInWorld()
{
	
	redisData.removeWorldPlayer(worldId, gblName, function(err, result){
			if (err) throw err;
			console.log("teardown 1 complete.");
			redisData.removePlayer(gblName, function(err, result){
				if (err) throw err;
				console.log("teardown 2 complete.");
			});
	});	
}