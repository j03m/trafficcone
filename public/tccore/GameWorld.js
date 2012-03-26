
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
        this.Style = tc.constants.GAME_WORLD_STYLE_2D;
    }

    this.Cells = [];
    for (var i = 0; i < this.x; i++) {
        var cols = [];
        this.Cells.push(cols);
    }
    
};



