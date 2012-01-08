var Seeker = function (movementState, foundState, rate) {
    this.movementState = movementState;
    this.foundState = foundState;
    this.rate = rate;
};

Seeker.prototype.execute = function (event, sprite, engine) {
    var point = { x: event.offsetX, y: event.offsetY };
    this.postTransExecute(point, sprite, engine);
};

Seeker.prototype.setFoundCallback = function (foundCallback) {
    this.foundCallBack = foundCallback;
}

Seeker.prototype.postTransExecute = function (point, sprite, engine) {

    //draw a line from start point (origin) to click                
    var endPoint = point;
    var model = engine.getWorldModel();
    var endCell = model.getWorldCellFromScreenCoord(endPoint.x, endPoint.y);


    var startCell = model.getWorldCellFromSprite(sprite);
    var cells = engine.getWorld().Cells;

    var path = astar.search(cells, startCell, endCell, model, undefined);
    if (path == undefined || path.length == 0) { return; }
    path = astar.smoothPath(path, sprite.getWidth(),  model);
    var pathPoints = astar.pathToPoints(path, model, sprite.getUpSpeed(), model.getIsoSpritePos(sprite)); //assumes all speeds are the same
    var originPoints = model.pathToOriginPoints(pathPoints);
    if (this.intervalId != undefined) {
        clearInterval(this.intervalId);
    }
    var movementState = this.movementState;
    var foundState = this.foundState;
    var counter = 0;
    var parentObj = this;
    this.intervalId = setInterval(function () {
        if (counter < pathPoints.length) {
            var nextPoint = originPoints[counter];
            var screenPoint = model.originPointToScreenCoord(nextPoint);
            sprite.setAtIsoPoint(screenPoint);
            sprite.setSpriteState(movementState);

            counter++;
        }
        else {
            sprite.setSpriteState(foundState);
            if (parentObj.foundCallBack != undefined) {
                parentObj.foundCallBack(sprite);
            }
            clearInterval(intervalId);
        }
    }, this.rate);
    var intervalId = this.intervalId;

};

