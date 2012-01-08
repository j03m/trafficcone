var SpriteSeeker = function (movementState, foundState, rate, spriteToFind) {

    this.movementState = movementState;
    this.foundState = foundState;
    this.rate = rate;
    this.spriteToFind = spriteToFind;
}

SpriteSeeker.prototype.stopMove = function () {   
    this.stop = true;   
}

SpriteSeeker.prototype.setFoundCallback = function (foundCallback) {
    this.foundCallBack = foundCallback;
}

SpriteSeeker.prototype.execute = function (event, sprite, engine) {

    var model = engine.getWorldModel();
    var endCell = model.getWorldCellFromSprite(this.spriteToFind);
    var parentObj = this;
    if (this.counter == undefined || this.counter * sprite.getUpSpeed() > model.cellWidth * 2) {
        this.cleared = false;
        this.counter = 0;
        this.endCell = endCell;
        var startCell = model.getWorldCellFromSprite(sprite);
        var cells = engine.getWorld().Cells;
        var path = astar.search(cells, startCell, this.endCell, model, undefined);
        if (path != undefined && path.length > 0) {
            path = astar.smoothPath(path, sprite.getWidth(),model);
            this.pathPoints = astar.pathToPoints(path, model, sprite.getUpSpeed(), model.getIsoSpritePos(sprite)); //assumes all speeds are the same           
            this.currentOrigin = model.getOrigin();

        }
        else {
            if (parentObj.foundCallBack != undefined) {
                parentObj.foundCallBack(sprite);
            }
            sprite.isoFacePoint(model.getIsoSpritePos(this.spriteToFind)); //todo derive sprite direction
            sprite.setSpriteState(this.foundState);
        }

    }

    if (this.intervalId == undefined) {
        this.intervalId = setInterval(function () {


            if (parentObj.pathPoints != undefined && parentObj.counter < parentObj.pathPoints.length && !parentObj.stop) {                
                var nextPoint = parentObj.pathPoints[parentObj.counter];
                var screenPoint = model.adjustPointToOrigin(parentObj.currentOrigin, nextPoint);
                sprite.setAtIsoPoint(screenPoint);
                sprite.setSpriteState(parentObj.movementState);
                parentObj.counter++;
            }
            else {
                
                sprite.setSpriteState(parentObj.foundState);
                sprite.isoFacePoint(model.getIsoSpritePos(parentObj.spriteToFind));
                parentObj.counter = undefined;
                
            }
            parentObj.stop = false;

        }, this.rate);
        var intervalId = this.intervalId;
    }
};