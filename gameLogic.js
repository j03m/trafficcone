/*
*
*	Main game loop
*
*
*/
exports gameLoop = function(sendUpdate, sendUpdateToAll)
{
	//as we receive messages we have to pull them off the queue
	//todo: replace with priority queue? 
	var msg = msgQueue.shift();
	var players = self.getPlayers();
	if (msg != undefined) {
	    if (msg.type == "move") {
		console.log("received message type move.");
		self.handleMove(msg, function (returnMsg) {
		    //set the state of the sprite in question
		    players[returnMsg.uniqueId].state = returnMsg.state;
		    players[returnMsg.uniqueId].path = returnMsg.path;
		    players[returnMsg.uniqueId].moveCount = 0;
		});
	    }
	    else if (msg.type == "init") {
		
	    }
	}

	for (var player in players) { //
	    player = players[player];
	    if (player.state == "seek" && player.path != undefined) { //
		player.moveCount++;
		if (player.moveCount < player.path.length) {

		    player.x = player.path[player.moveCount].x;
		    player.y = player.path[player.moveCount].y;
		    sendUpdateToAll({ "type": "move", "uniqueId": player.uniqueId, "x": player.x, "y": player.y });
		}
		else if (player.moveCount == player.path.length) {
		    //the move is done, restore state
		    sendUpdateToAll({ "type": "chg", "uniqueId": player.uniqueId, "state": "normal" });
		    player.path = undefined;
		}
	    }

	}
}


/*
*
*	Handle Movement Messages
*
*
*/

//what do I need to process a move?
	//The player should send me some session key only he has
	//From there I should grab:
		//the world chunk the user is in
		//the players in that world chunk
		//the objects in that world chunk
        //check where the click is - open cell, player or obj
        
    var world = .getWorldAroundPlayer(msg.uniqueId, ring, function(data){
	    var worldModel = worldModelFactory.getIsoModel(data.world, 125, 125, screenWidth, screenHeight, cellWidth, cellHeight);
	    var players = dungeons.getPlayers(data.worldId, ring, function(data){
		    worldModel.originX = msg.originX;
		    worldModel.originY = msg.originY;

		    var sprite = players[msg.uniqueId];
		    if (sprite == undefined) {
			//can move something that doesn't exist
			throw "Msg from: " + msg.client.user.clientId + " sent a sprite id that doesn't exist: " + msg.uniqueId;
		    }

		    var startCell;

		    if (sprite.x == undefined) {
			startCell = {};
			startCell.x = sprite.cellX;
			startCell.y = sprite.cellY;
		    }
		    else {
			startCell = worldModel.getWorldCellFromScreenCoord(sprite.x, sprite.y);
		    }
		    var endCell = worldModel.getWorldCellFromScreenCoord(msg.x, msg.y);

		    var returnMsg = {};
		    returnMsg.uniqueId = msg.uniqueId;
		    returnMsg.type = "mov";

		    console.log("startCell: " + startCell.x + "," + startCell.y);
		    console.log("endCell: " + endCell.x + "," + endCell.y);

		    console.log("searching...");
		    var path = astar.search(world, startCell, endCell, worldModel, undefined);

		    if (path == undefined || path.length == 0) {
			console.log("no path found...");
			console.log("path defined: " + (path != undefined));
			returnMsg.state = "found";
			doneFunc(returnMsg);
			return;
		    }

		    console.log("smoothing path");
		    path = astar.smoothPath(path, sprite.width, worldModel);

		    console.log("path to points");
		    var pathPoints = astar.pathToPoints(path, worldModel, sprite.speed, { "x": sprite.x, "y": sprite.y });
		    returnMsg.state = "seek";
		    returnMsg.path = pathPoints;
		    console.log("returning path");
		    doneFunc(returnMsg);		    		   
	    });
    });
*/