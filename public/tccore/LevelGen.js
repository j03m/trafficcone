
function genLevel(width, height, numberOfRooms, minCellsBetweenDoors, gameWorld) {

    //loop through the matrix and populate it with empty blocking cells
    for (var i = 0; i < width; i++) {
        for (var ii = 0; ii < height; ii++) {
            //set a cell using the worldCells sprite, randomly select one of the 25 frames in this sprite.
            gameWorld_setCell(gameWorld, i, ii, undefined, 0, tc.constants.GAME_WORLD_CELL_UNDERLAY, tc.constants.GAME_WORLD_CELL_BLOCK);
        }
    }

    //now generate rooms and connectors
    var rooms = rand(50);
    if (rooms < 5) { 
        rooms = 5;
    }
    for (var i = 0; i < numberOfRooms; i++) {
        //generate an x,y for the room                    
        var x = rand(width-2);
        var y = rand(height-2);

        //width/height
        var roomWidth = rand(width - 2);

        if (roomWidth + x > width - 2) { 
            
        }

    }
  

}