

var GameWorldModelIso = function (gameWorld, cameraX, cameraY, canvasWidth, canvasHeight, cellWidth, cellHeight) {
    this.gameWorld = gameWorld;
    this.update(cameraX, cameraY, canvasWidth, canvasHeight);

    if (cellWidth != undefined) {
        this.cellWidth = cellWidth;
    }
    else {
        this.cellWidth = gameWorld.CellWidth;
    }

    if (cellHeight != undefined) {
        this.cellHeight = cellHeight;
    }
    else {
        this.cellHeight = gameWorld.CellHeight;
    }
};

//todo: write unit tests for getVis cells + getCell
GameWorldModelIso.prototype = {
    update: function (cameraX, cameraY, canvasWidth, canvasHeight) {
        this.cameraX = Math.round(cameraX);
        this.cameraY = Math.round(cameraY);
        this.canvasWidth = Math.round(canvasWidth);
        this.canvasHeight = Math.round(canvasHeight);

        //initially set the origin to the center of the screen        
        this.originX = Math.round(canvasWidth / 2);
        this.originY = Math.round(canvasHeight / 2);

    },
    setOriginX: function (x) {
        this.originX = x;
    },
    setOriginY: function (y) {
        this.originY = y;
    },
    getOriginX: function () {
        return this.originX;
    },
    getOriginY: function () {
        return this.originY;
    },
    getOrigin: function () {
        return { "x": this.originX, "y": this.originY };
    },
    adjustPointToOrigin: function (oldOrigin, point) {
        var diffX = oldOrigin.x - point.x;
        var diffY = oldOrigin.y - point.y;
        return { "x": this.originX - diffX, "y": this.originY - diffY };
    },
    pathToOriginPoints: function (points) {
        var originPoints = [];
        originPoints.length = points.length;
        for (var i = 0; i < points.length; i++) {
            originPoints[i] = this.newOriginFromScreenCoords(points[i]);
        }
        return originPoints;
    },
    newOriginFromScreenCoords: function (point) {

        var distanceFromCenterX = this.canvasWidth / 2 - point.x;
        var distanceFromCenterY = this.canvasHeight / 2 - point.y;

        var newOriginX = ga.getOriginX() + distanceFromCenterX;
        var newOriginY = ga.getOriginY() + distanceFromCenterY;

        return { "x": newOriginX, "y": newOriginY };
    },
    originPointToScreenCoord: function (originPoint) {
        var xDiff = this.getOriginX() - originPoint.x;
        var yDiff = this.getOriginY() - originPoint.y;
        var centerX = this.canvasWidth / 2;
        var centerY = this.canvasHeight / 2;
        return { "x": centerX + xDiff, "y": centerY + yDiff };
    },
    //-------------------------------------------------------------
    //-- getAllVisible: Returns the boundaries of the drawing surface in Cells
    //-- Returns: [[CellMinX,CellMinY],[CellMaxX,CellMaxY]] 
    //-----------------------------------------------------------
    getAllVisibleCells: function () {
        var visibleX = [];
        var visibleY = [];

        var aFrom = this.getCell(this.cellWidth * -1, this.cellHeight * -1);
        visibleX.push(aFrom.x);
        visibleY.push(aFrom.y);

        aFrom = this.getCell(0, this.canvasHeight);
        visibleX.push(aFrom.x);
        visibleY.push(aFrom.y);

        aFrom = this.getCell(this.canvasWidth, 0);
        visibleX.push(aFrom.x);
        visibleY.push(aFrom.y);

        aFrom = this.getCell(this.canvasWidth + this.cellWidth, this.canvasHeight + this.cellHeight);
        visibleX.push(aFrom.x);
        visibleY.push(aFrom.y);

        var rsX = this.min(visibleX);
        var rsY = this.min(visibleY);
        var rs2X = this.max(visibleX);
        var rs2Y = this.max(visibleY);

        return { "startCell": { "x": rsX, "y": rsY }, "endCell": { "x": rs2X, "y": rs2Y} };

    },
    getIsoSpritePos: function (sprite) {
        return { "x": Math.round(sprite.getLeft() + sprite.getWidth() / 2), "y": Math.round(sprite.getBottom()) };
    },
    getSortCellOfSprite: function (sprite) {
        if (sprite.getSpriteType() == tc.constants.GAME_WORLD_CELL_OVERLAY) {
            //treat overlays differently
            //middle of tile space
            return this.getWorldCellFromScreenCoord(sprite.getLeft() + sprite.getWidth() / 2, sprite.getBottom() - this.cellHeight / 2);
        }
        else {
            return this.getWorldCellFromScreenCoord(sprite.getLeft() + sprite.getWidth() / 2, sprite.getBottom());
        }
    },
    getRandomWorldCell: function () {
        var xCell = Math.floor(Math.random() * this.gameWorld.Cells.length);
        var yCell = Math.floor(Math.random() * this.gameWorld.Cells[0].length);
        return { "x": xCell, "y": yCell };

    },
    getRandomUnblockedWorldCell: function(){
    	var cell = this.getRandomWorldCell();
        if (this.gameWorld.Cells[cell.x][cell.y] == 1) //space
        {
        	return cell;
        }
        else
        {
        	return this.getRandomUnblockedWorldCell();
        }
    },
    getRandomOnScreenCell: function () {
        var range = this.getAllVisibleCells();
        var minVal = range.startCell.x;
        var maxVal = range.endCell.x;
        var xCell = Math.floor(minVal + (Math.random() * (maxVal - minVal)));
        minVal = range.startCell.y;
        maxVal = range.endCell.y;
        var yCell = Math.floor(minVal + (Math.random() * (maxVal - minVal)));
        return { "x": xCell, "y": yCell };

    },
    getRandomOnScreenCellWorldValues: function () {
        var range = this.getAllVisibleCells();
        var minVal = range.startCell.x;
        var maxVal = range.endCell.x;
        var xCell = Math.floor(minVal + (Math.random() * (maxVal - minVal)));
        minVal = range.startCell.y;
        maxVal = range.endCell.y;
        var yCell = Math.floor(minVal + (Math.random() * (maxVal - minVal)));
        return { "x": xCell + this.cameraX, "y": yCell + this.cameraY };

    },
    getVisibleCellFromWorldCell: function (cellX, cellY) {
        var worldX = cellX - this.cameraX;
        var worldY = cellY - this.cameraY;
        return { "x": worldX, "y": worldY };
    },
    getWorldCellFromVisibleCell: function (cellX, cellY) {
        var worldX = cellX + this.cameraX;
        var worldY = cellY + this.cameraY;
        return { "x": worldX, "y": worldY };
    },
    getWorldCellFromScreenCoord: function (screenX, screenY) {
        var pos = this.getCell(screenX, screenY);
        pos.x = pos.x + this.cameraX;
        pos.y = pos.y + this.cameraY;
        return pos;
    },
    getCell: function (screenX, screenY) {

        var screenLocationX = screenX - this.originX;
        var screenLocationY = this.originY - screenY;

        var ym = (2 * screenLocationY - screenLocationX) / 2;

        var xm = screenLocationX + ym;
        var tw = this.cellWidth;
        var th = this.cellHeight;

        if (xm > 0) {
            xm = xm + tw / 2
        }
        else {
            xm = xm - tw / 2;
        }

        if (ym > 0) {
            ym = ym + th / 2
        }
        else {
            ym = ym - th / 2
        }

        var ty = this.rightFloor(ym / th);
        var tx = this.rightFloor(xm / tw);

        return { "x": -tx, "y": -ty };
    },
    rightFloor: function (v) {
        if (v < 0) {
            return (Math.ceil(v));
        } else {
            return (Math.floor(v));
        }
    },
    getCellDrawPoints: function (theCellX, theCellY) {

        //get the position of the cell if we were to draw it as a grid
        var points = this.getCellBoundaries(theCellX, theCellY);

        var draw = this.getWorldCellDrawDimensions(theCellX, theCellY);

        //now, we know that the top of the cell is half of the drawwidth, so 
        //backing up from there will give us the left
        var left = points.point2.x - (draw.width / 2);

        //we also know the left point is half of the draw height, so we can back up from there
        var top = points.point1.y - (draw.height / 2);

        return { "x": left, "y": top };

    },
    getWorldCellFromVisibleCellPos: function (theCellX, theCellY) {
        var worldPos = this.getWorldCellFromVisibleCell(theCellX, theCellY);
        return this.gameWorld.Cells[worldPos.x][worldPos.y];
    },
    getWorldCellDrawDimensions: function (theCellX, theCellY) {
        var cell = this.getWorldCellFromVisibleCellPos(theCellX, theCellY);
        var drawWidth = this.cellWidth * 2;
        var drawHeight = this.cellHeight;
        if (cell != undefined) {
            var sprite = cell.Sprite;
            if (sprite != undefined) {
                drawWidth = sprite.getWidth();
                drawHeight = sprite.getHeight();
            }
        }

        return { "width": drawWidth, "height": drawHeight };
    },
    getCellCenter: function (theCellX, theCellY) {
        //get the position of the cell if we were to draw it as a grid
        var points = this.getCellBoundaries(theCellX, theCellY);

        var left = points.point4.x;
        var top = points.point4.y + (points.point2.y - points.point4.y);

        return { "x": left, "y": top };
    },
    getWorldCellCenter: function (theCellX, theCellY) {
        //get the position of the cell if we were to draw it as a grid
        var cell = this.getVisibleCellFromWorldCell(theCellX, theCellY);
        var points = this.getCellBoundaries(cell.x, cell.y);
        var left = points.point4.x;
        var top = points.point4.y + ((points.point2.y - points.point4.y) / 2);

        return { "x": left, "y": top };
    },
    placeSpriteInWorldCell: function (worldCellX, worldCellY, sprite) {
        //determine the center position of 250,250
        var cell = this.getVisibleCellFromWorldCell(worldCellX, worldCellY);
        var cellPos = this.getCellBoundaries(cell.x, cell.y);

        sprite.setLeft(cellPos.point4.x);
        sprite.setTop(cellPos.point4.y);
    },
    getWorldCellFromSprite: function (sprite) {
        /*var x = sprite.getLeft() + sprite.getWidth() / 2;
        var y = sprite.getBottom();*/

        var x = sprite.getLeft() + sprite.getWidth() / 2;
        var y = sprite.getBottom();

        var worldCell = this.getWorldCellFromScreenCoord(x, y);
        return worldCell;
    },
  
    placeSpriteInCenterOfWorldCell: function (worldCellX, worldCellY, sprite) {
        //determine the center position of 250,250
        var cell = this.getVisibleCellFromWorldCell(worldCellX, worldCellY);
        var cellPos = this.getCellBoundaries(cell.x, cell.y);
        sprite.prep(); //just in case?
        sprite.setTop((cellPos.point2.y - this.cellHeight / 2) - sprite.getHeight());
        sprite.setLeft(cellPos.point4.x - (sprite.getWidth() / 2));

    },
    getCenterOfWorldCell: function (worldCellX, worldCellY, sprite) {
        //determine the center position of 250,250
        var cell = this.getVisibleCellFromWorldCell(worldCellX, worldCellY);
        var cellPos = this.getCellBoundaries(cell.x, cell.y);
        var xPos = cellPos.point4.x - (sprite.getWidth() / 2);
        var yPos = (cellPos.point4.y - sprite.getHeight()) + this.cellHeight;
        return { x: Math.round(xPos), y: Math.round(yPos) };

    },
    getAbsoluteCenterOfWorldCell: function (worldCellX, worldCellY) {
        //determine the center position of 250,250
        var cell = this.getVisibleCellFromWorldCell(worldCellX, worldCellY);
        var cellPos = this.getCellBoundaries(cell.x, cell.y);
        var xPos = cellPos.point4.x;
        var yPos = cellPos.point4.y + this.cellHeight / 2;
        return { x: Math.round(xPos), y: Math.round(yPos) };

    },
    getCellBoundaries: function (theCellX, theCellY) {
        
		//cell points are calculated from the right of a diamond clockwise, so right, bottom, left, top
		
		var aOffset = { "offsetX": (this.cellWidth * -1) / 2, "offsetY": (this.cellHeight * -1) / 2 };
        var aCell = { "x": theCellX, "y": theCellY };
        var p1 = this.getScreenCoords(aCell, aOffset);

        aOffset = { "offsetX": (this.cellWidth) / 2, "offsetY": (this.cellHeight * -1) / 2 };
        var p2 = this.getScreenCoords(aCell, aOffset);

        aOffset = { "offsetX": (this.cellWidth) / 2, "offsetY": (this.cellHeight) / 2 };
        var p3 = this.getScreenCoords(aCell, aOffset);

        aOffset = { "offsetX": (this.cellWidth * -1) / 2, "offsetY": (this.cellHeight) / 2 };
        var p4 = this.getScreenCoords(aCell, aOffset);

        return { "point1": p1, "point2": p2, "point3": p3, "point4": p4 };
    },
    getScreenCoords: function (Cell, offset) {
        var posX = Cell.x * this.cellWidth + offset.offsetX;
        var posZ = Cell.y * this.cellHeight - offset.offsetY;
        var xCart = (posX - posZ)
        var yCart = (posX + posZ) / 2;
        var rX = -xCart + this.originX;
        var rY = +yCart + this.originY;
        return { "x": Math.floor(rX), "y": Math.floor(rY) };
    },
    getDrawCoords: function (cellX, cellY) {
        var posX = cellX * this.cellWidth;
        var posZ = cellY * this.cellHeight;
        var xCart = (posX - posZ)
        var yCart = (posX + posZ) / 2;
        var rX = -xCart + this.originX;
        var rY = +yCart + this.originY;
        return { "x": Math.floor(rX), "y": Math.floor(rY) };
    },
    max: function (val) {
        var max = val[0];
        var len = val.length;
        for (var i = 1; i < len; i++) if (val[i] > max) max = val[i];
        return max;
    },
    min: function (val) {
        var min = val[0];
        var len = val.length;
        for (var i = 1; i < len; i++) if (val[i] < min) min = val[i];
        return min;
    }
};

//Server side use for node.js
if (typeof exports !== 'undefined') {
	exports.getIsoModel = function(gameWorld, cameraX, cameraY, canvasWidth, canvasHeight, cellWidth, cellHeight)
	{
	    var gameWorldObj = {};
	    gameWorldObj.Cells  = gameWorld; //hack because this was written for clientside originally. sorry time is short :/
	    
	    return new GameWorldModelIso(gameWorldObj, cameraX, cameraY, canvasWidth, canvasHeight, cellWidth, cellHeight);			
	}		
	
	exports.update = GameWorldModelIso.prototype.update;
	exports.getAllVisibleCells = GameWorldModelIso.prototype.getAllVisibleCells;
	exports.getSortCellOfSprite = GameWorldModelIso.prototype.getSortCellOfSprite;
	exports.getRandomOnScreenCel = GameWorldModelIso.prototype.getRandomOnScreenCel;
	exports.getRandomOnScreenCellWorldValues = GameWorldModelIso.prototype.getRandomOnScreenCellWorldValues;
	exports.getVisibleCellFromWorldCell = GameWorldModelIso.prototype.getVisibleCellFromWorldCell;
	exports.getWorldCellFromVisibleCell = GameWorldModelIso.prototype.getWorldCellFromVisibleCell;
	exports.getWorldCellFromScreenCoord = GameWorldModelIso.prototype.getWorldCellFromScreenCoord;
	exports.getCell = GameWorldModelIso.prototype.getCell;
	exports.rightFloor = GameWorldModelIso.prototype.rightFloor;
	exports.getCellDrawPoints = GameWorldModelIso.prototype.getCellDrawPoints;
	exports.getWorldCellFromVisibleCellPos = GameWorldModelIso.prototype.getWorldCellFromVisibleCellPos;
	exports.getWorldCellDrawDimensions = GameWorldModelIso.prototype.getWorldCellDrawDimensions;
	exports.getCellCenter = GameWorldModelIso.prototype.getCellCenter;
	exports.getWorldCellCenter = GameWorldModelIso.prototype.getWorldCellCenter;
	exports.placeSpriteInWorldCell = GameWorldModelIso.prototype.placeSpriteInWorldCell;
	exports.placeSpriteInCenterOfWorldCell = GameWorldModelIso.prototype.placeSpriteInCenterOfWorldCell;
	exports.getCellBoundaries = GameWorldModelIso.prototype.getCellBoundaries;
	exports.getScreenCoords = GameWorldModelIso.prototype.getScreenCoords;
	exports.getDrawCoords = GameWorldModelIso.prototype.getDrawCoords;
	exports.getWorldCellFromScreenCoord = GameWorldModelIso.prototype.getWorldCellFromScreenCoord;
}