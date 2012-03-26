function MakeIsoMetricGameWorld(worldSize, texture)
{
	var ga = new Engine(document.getElementById("gamescreen"), document.getElementById("backbuffer2"));
	var columns = (worldSize*worldSize) * .048;

    //tell the engine our gameworld will consist of a 250x250 grid of 73,73 cells
    var gameWorld = new GameWorld(worldSize, worldSize, 73, 73, tc.constants.GAME_WORLD_STYLE_ISOMETRIC);
  	worldCells = altarCells_Sprite(ga);
	worldCells.setup(ga);
	column = columnCell_Sprite(ga, "column");


	if (texture== undefined)
	{
    	//loop through the matrix and populate it with cells
	    for (var i = 0; i < worldSize; i++) {
	        for (var ii = 0; ii < worldSize; ii++) {
	            //set a cell using the worldCells sprite, randomly select one of the 25 frames in this sprite.
	            gameWorld.Cells[i][ii] = new Cell(worldCells, getRand(5), tc.constants.GAME_WORLD_CELL_UNDERLAY, tc.constants.GAME_WORLD_CELL_OPEN, i, ii); 
	        }
	    }
	}
    else
	{
		ga.setUnderlayTexture("../assets/Cells/alter-fs-small-txt.png");
		//loop through the matrix and populate it with cells
	    for (var i = 0; i < worldSize; i++) {
	        for (var ii = 0; ii < worldSize; ii++) {
	            //set a cell using the worldCells sprite, randomly select one of the 25 frames in this sprite.
	            gameWorld.Cells[i][ii] = new Cell(undefined, undefined, tc.constants.GAME_WORLD_CELL_UNDERLAY, tc.constants.GAME_WORLD_CELL_OPEN, i, ii); 
	        }
	    }
	}


	for (var i = 0; i < columns; i++) {
		var xx = getRand(worldSize);
		var yy = getRand(worldSize);
		
        gameWorld.Cells[xx][yy] = new Cell(columnCell_Sprite(ga, "column" + i),0, tc.constants.GAME_WORLD_CELL_OVERLAY, tc.constants.GAME_WORLD_CELL_BLOCK, xx, yy);
    }

    ga.setWorld(gameWorld);
    ga.setCamera(worldSize/2, worldSize/2);
	
	return ga;
}