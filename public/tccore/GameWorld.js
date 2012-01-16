var GAME_WORLD_STYLE_2D = 0;
var GAME_WORLD_STYLE_ISOMETRIC = -1;
var GAME_WORLD_STYLE_ISOMETRIC_GRID_TEST = -2;
var GAME_WORLD_CELL_BLOCK = 0;
var GAME_WORLD_CELL_UNDERLAY = -1;
var GAME_WORLD_CELL_OVERLAY = -2;
var GAME_WORLD_CELL_OPEN = -3;


//Server side use for node.js
if (typeof exports !== 'undefined') {
	exports.getWorld = function(cellx, celly, cellWidth, cellHeight, style)
	{
		return new GameWorld(cellx,celly,cellWidth,cellHeight, style);			
	}	
	exports.setCell = gameWorld_setCell;
	exports.GAME_WORLD_STYLE_2D = GAME_WORLD_STYLE_2D;
	exports.GAME_WORLD_STYLE_ISOMETRIC = GAME_WORLD_STYLE_ISOMETRIC;
	exports.GAME_WORLD_STYLE_ISOMETRIC_GRID_TEST = GAME_WORLD_STYLE_ISOMETRIC_GRID_TEST;
	exports.GAME_WORLD_CELL_BLOCK = GAME_WORLD_CELL_BLOCK;
	exports.GAME_WORLD_CELL_UNDERLAY = GAME_WORLD_CELL_UNDERLAY;
	exports.GAME_WORLD_CELL_OVERLAY = GAME_WORLD_CELL_OVERLAY;
	exports.GAME_WORLD_CELL_OPEN = GAME_WORLD_CELL_OPEN;
}



var Cell = function (sprite, frame, drawtype, blocktype, x, y, spriteId) {
    this.SpriteId = spriteId;
    this.Sprite = sprite;
    this.Frame = frame;
    this.Type = drawtype;
    this.BlockType = blocktype;
    this.x = x;
    this.y = y;
};



var GameWorld =
function (cellx, celly, cellWidth, cellHeight, style) {
    this.x = cellx;
    this.y = celly;
    this.CellWidth = cellWidth;
    this.CellHeight = cellHeight;    
    this.Style = style;
    if (this.Style == undefined) {
        this.Style = GAME_WORLD_STYLE_2D;
    }

    this.Cells = [];
    for (var i = 0; i < this.x; i++) {
        var cols = [];
        this.Cells.push(cols);
    }
    
};



