var GameWorldModel2D = function (gameWorld, cameraX, cameraY, canvasWidth, canvasHeight) {
    this.gameWorld = gameWorld;
    this.cellHeight = this.gameWorld.CellHeight;
    this.cellWidth = this.gameWorld.CellWidth;
    this.update(cameraX, cameraY, canvasWidth, canvasHeight);
};

GameWorldModel2D.prototype = {
    update: function (cameraX, cameraY, canvasWidth, canvasHeight) {
        this.cameraX = cameraX;
        this.cameraY = cameraY;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.initValues(); //initializes the visible cells array
    },
    getGameCellAtPosition: function (x, y) {
        //gets the cell coordinates - note this is where the cell is on the screen NOT the game cell cooridates
        var onscreenCell = this.getOnScreenCellAtPosition(x, y);

        //translate this cell into the actual world cell using the camera and top left cached values
        var diffx = this.topLeftCellX + onscreenCell.x;
        var diffy = this.topLeftCellY + onscreenCell.y;
        if (this.gameWorld.Cells[diffx] != undefined) {
            return this.gameWorld.Cells[diffx][diffy];
        }
        else {
            return undefined;
        }
    },
    //a function to take an x,y and get me a reference to the on screen cell position
    getOnScreenCellAtPosition: function (x, y) {
        var cellX = Math.floor(x / this.cellWidth);
        var cellY = Math.floor(y / this.cellHeight);
        return { "x": cellX, "y": cellY };
    },
    //a function to take an onscreen cell position and get me it's x,y
    getOnScreenCellXY: function (x, y) {
        var cellXpos = x * this.cellWidth;
        var cellYpos = y * this.cellHeight;
        return { "x": cellXpos, "y": cellYpos };
    },
    //a function to take a game cell position and return me it's x,y        
    getGameCellXY: function (x, y) {
        var cellsFromTopLeftX = (x - this.topLeftCellX);
        var cellsFromTopLeftY = y - this.topLeftCellY;

        var cellXpos = cellsFromTopLeftX * this.cellWidth;
        var cellYpos = cellsFromTopLeftY * this.cellHeight;
        return { "x": cellXpos, "y": cellYpos };

    },
    initValues: function () {
        this.cellsOnScreenX = Math.round(this.canvasWidth / this.cellWidth);
        this.cellsOnScreenY = Math.round(this.canvasHeight / this.cellHeight);

        //treat the camera position as the center cell
        this.topLeftCellX = Math.round(this.cameraX - (this.cellsOnScreenX / 2));
        this.topLeftCellY = Math.round(this.cameraY - (this.cellsOnScreenY / 2));

        if (this.topLeftCellX < 0) {
            this.topLeftCellX = 0;
        }

        if (this.topLeftCellY < 0) {
            this.topLeftCellY = 0;
        }
    }
};