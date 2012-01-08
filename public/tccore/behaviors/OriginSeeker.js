var OriginSeeker = function (movementState, foundState, attackState, rate) {
    this.movementState = movementState;
    this.foundState = foundState;
    this.attackState = attackState;
    this.rate = rate;
};

OriginSeeker.prototype.execute = function (event, sprite, engine) {
    var point = { x: event.offsetX, y: event.offsetY };
    this.postTransExecute(point, sprite, engine);
};

OriginSeeker.prototype.setTarget = function (sprite) {
    this.seekSprite = sprite;
}

OriginSeeker.prototype.stopMove = function () {
    var date = new Date();
    if (this.lastStop == undefined || this.lastStop - date.getTime() > 10) {
        this.lastStop = date.getTime();
        this.stop = true;
    }
}

OriginSeeker.prototype.setFoundCallback = function (foundCallback) {
    this.foundCallBack = foundCallback;
}

OriginSeeker.prototype.postTransExecute = function (point, sprite, engine) {

    this.stop = false;
    var counter = 0;
    var movementState = this.movementState;
    var foundState = this.foundState;
    var attackState = this.attackState;

    //draw a line from start point (origin) to click                
    var model = engine.getWorldModel();
    var endPoint = point;
    if (this.seekSprite != undefined) {
        endPoint = model.getIsoSpritePos(this.seekSprite);
        if (engine.CheckCollision(this.seekSprite, sprite)) {
            sprite.setSpriteState(attackState);
            sprite.isoFacePoint(model.getIsoSpritePos(this.seekSprite));
            return;
        }

    }

    var endCell = model.getWorldCellFromScreenCoord(endPoint.x, endPoint.y);
    this.endCell = endCell;

    var cells = engine.getWorld().Cells;

    if (this.intervalId != undefined) {
        clearInterval(this.intervalId);
    }
    var parentObj = this;
    var startCell = model.getWorldCellFromSprite(sprite);
    var path = astar.search(cells, startCell, parentObj.endCell, model, undefined);
    if (path == undefined || path.length == 0) {
        if (this.seekSprite != undefined) {
            sprite.setSpriteState(attackState);
            sprite.isoFacePoint(model.getIsoSpritePos(this.seekSprite));
        }
        else {
            sprite.setSpriteState(foundState);
        }
        clearInterval(intervalId);
        return;
    }
    path = astar.smoothPath(path, sprite.getWidth(),model);
    var pathPoints = astar.pathToPoints(path, model, sprite.getUpSpeed(), model.getIsoSpritePos(sprite)); //assumes all speeds are the same        
    if (pathPoints == undefined || pathPoints.length < 0) {
        if (this.seekSprite != undefined) {
            sprite.setSpriteState(attackState);
            sprite.isoFacePoint(model.getIsoSpritePos(this.seekSprite));
        }
        else {
            sprite.setSpriteState(foundState);
        }

        clearInterval(intervalId);
        return;
    }

    //convert the path to origin points
    var originPoints = model.pathToOriginPoints(pathPoints);

    this.intervalId = setInterval(function () {
        if (counter >= originPoints.length || parentObj.stop == true) {
            parentObj.stop = false;
            if (parentObj.seekSprite != undefined) {
                sprite.isoFacePoint(model.getIsoSpritePos(parentObj.seekSprite));
                sprite.setSpriteState(attackState);
            }
            else {
                sprite.setSpriteState(foundState);
                if (parentObj.foundCallBack != undefined) {
                    parentObj.foundCallBack(sprite);
                }
            }
            clearInterval(intervalId);
            return;
        }

        var nextPoint = originPoints[counter];
        var screenPoint = model.originPointToScreenCoord(nextPoint);
        sprite.moveOrigin(screenPoint, nextPoint);
        sprite.setSpriteState(movementState);
        counter++;

    }, 100);
    var intervalId = this.intervalId;

};

