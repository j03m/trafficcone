var Sprite = function (inName, inNormalState, inInitialState, callBack, engine) {
    


	if (inName == null || inName == undefined) {
        throw "Traffic cone sprites must be named.";
    }
	

    //initializer is at the bottom of this mess.

    var normalState;
    var tempDate1 = new Date();
    var lastFrame = tempDate1.getTime();
    var omg = 0;
    var rotator = 0;
    var tempLastPlay = "";
    var tempcount = 0;
    var width=0;
    var height=0;
    var spriteRight;
    var spriteBottom;
    var newRight;
    var animationX;
    var animationY;
    var nextFrame;
    var actualWidth;
    var actualHeight;
    var firstFrame = false;
    var columns = 0;
    var rows = 0;
    var mainContext;
    var backContext;
    var animations = [];
    var lastSpriteState;
    var spriteState;
    var xpos = 0;
    var ypos = 0;
    var lastXpos = null;
    var lastYpos = null;
    var lastWidth = null;
    var lastHeight = null;
    var counter = 0;
    var sheets = new Object();
    var sheetCount = 0;
    var loadedImageCount = 0;
    var rightSpeed = 0;
    var upSpeed = 0;
    var downSpeed = 0;
    var leftSpeed = 0;
    var inSpeed = 0;
    var outSpeed = 0;
    var spriteXDirection = tc.constants.SPRITE_NORMAL;
    var spriteYDirection = tc.constants.SPRITE_NORMAL;
    var spriteIsoDirection = tc.constants.SPRITE_DIRECTION_UNDEFINED;
    var topBorderMoveStyle = "block";
    var bottomBorderMoveStyle = "block";
    var rightBorderMoveStyle = "block";
    var leftBorderMoveStyle = "block";
    var canvasHeight = 0;
    var canvasWidth = 0;
    var type;
    var topBorder;
    var bottomBorder;
    var leftBorder;
    var rightBorder;
    var idleSequenceName;
    var sounds = new Object();
    var scaleFactor = 0;
    var customDrawRoutine = undefined;
    var isWatched = false;
    var watchData = new Object();
    var engineRef = undefined;
    var visible = true;
    var drawRectOverridden = false;
    var innerWidth = undefined;
    var innerHeight = undefined;
    var chained = new Object();
    var loadCallBack = undefined;
    var isCompleteHolder = undefined;
    var delegatedDrawSprite = undefined;
    var setCounter = function (val) {
        counter = val;
    };

    this.getSpriteState = function () {
        return spriteState;
    };
    this.noAdjust = false;
    this.setFrame = setCounter,
    this.animationState = tc.constants.SPRITE_STATE_NONE,
	this.sortMap = undefined,
    this.getAnimationState = function () { return this.animationState; }
    this.setAnimationState = function (state) { this.animationState = state; }
    this.getNormalState = function () { return normalState; },
    this.delegateDraw = function (dSprite) {
        delegatedDrawSprite = dSprite;
    },
    this.getDelegatedDraw = function () {
        return delegatedDrawSprite;
    },
    this.setNormal = function () {
        if (normalState == null || normalState == undefined) {
            throw "Invalid normal state param!";
        }
        this.setSpriteState(normalState);
    },
    this.setNormalState = function (state) {
        if (state == null || state == undefined) {
            throw "Invalid normal state param!";
        }
        normalState = state;

    },
    this.setLoadedCallback = function (callBack) {
        loadCallBack = callBack;
    }
    this.setDirection = function (direction) {
        if (direction == undefined) {
            throw "Direction may not be undefined.";
        }

	//direction must be numeric
        if (isNaN(direction)) { throw "Direction must be numeric!"; }

        spriteIsoDirection = direction;
    },
    this.setInnerDrawRectOverride = function (width, height) {
        innerWidth = width;
        innerHeight = height;
        drawRectOverridden = true;
    },
    this.getInnerDrawRectOverride = function () {
        return {
            innerWidth: width,
            innerHeight: height,
            state: drawRectOverridden
        };
    },
    this.getDirection = function () {
        return spriteIsoDirection;
    },
    this.getEngineRef = function () {
        return engineRef;
    },

    this.getFrameCounter = function () { return counter; },
    this.actionPlayed = 0,
    this.setSpriteType = function (val) {
        type = val;
    },
    this.getSpriteType = function () {
        return type;
    },
    this.setCustomRoutine = function (routine) {
        customDrawRoutine = routine;
    },
    this.setWatcher = function (state, callBack, type) {
        watchData[state] = new Object();
        watchData[state]["callBack"] = callBack;
        if (type == undefined) {
            type = tc.constants.WATCH_TYPE_LAST_FRAME;
        }
        watchData[state]["type"] = type;
    },
    this.clearWatcher = function (state) {
        watchData[state] = undefined;
    },
    this.fastRound = function (val) {
        return (val + .5) | 0;
    },
    this.setAttributes = function (attributes) {
        if (attributes == undefined) { throw "The attributes object for setAttributes must be defined."; }
        if (attributes.speed == undefined) { throw "The attributes object must contain a definition for speed."; }
        this.setSpeed(attributes.speed);


    },
    this.onScreen = function () {
        if (this.getLeft() < 0 || this.getLeft() > canvasWidth) {
            return false;
        }

        if (this.getBottom() < 0 || this.getBottom() > canvasHeight) {
            return false;
        }

        return true;
    },
    this.setInvalidationRect = function (x, y, w, h) {

        lastXpos = this.fastRound(x);
        lastYpos = this.fastRound(y);
        lastWidth = this.fastRound(w);
        lastHeight = this.fastRound(h);

        if (isNaN(lastXpos)) {
            throw "X position is not numeric!";
        }

        if (isNaN(lastYpos)) {
            throw "Y position is not numeric!";
        }

        if (isNaN(lastHeight)) {
            throw "Height position is not numeric!";
        }

        if (isNaN(lastWidth)) {
            throw "Width position is not numeric!";
        }
    }
    this.setSpriteState = function (val, direction, force) {
        if (direction != undefined) {
            this.setDirection(direction);
            //otherwise, direction remains unaffected
        }



        if (val == spriteState) //if not change - exit
        {
            return;
        }
        else if (this.getSpriteState() == "") //if blank, set it
        {
            setCounter(0); //otherwise reset
            this.setInitialSpriteState(val);
            this.prep();
        }
        else if (animations[this.getDirection()][this.getSpriteState()].playCount == -1) //if infinite loop, set it
        {
            setCounter(0); //otherwise reset
            this.setInitialSpriteState(val);
            this.prep();

        }
        else if (this.animationState == tc.constants.SPRITE_STATE_DONE) // if the animation has played, set it
        {
            setCounter(0); //otherwise reset
            this.setInitialSpriteState(val);
            this.noAdjust = true;
            this.prep();
        }
        else if (force) {
            setCounter(0); //otherwise reset
            this.setInitialSpriteState(val);
            this.prep();
        }



    },
    this.setHeight = function (val) {
        if (isNaN(val) || val == null || val == undefined) {
            throw arguments.callee.toString() + " parameter is nonnumeric!";
        }
        height = val;
    },
    this.setWidth = function (val) {
        if (isNaN(val) || val == null || val == undefined) {
            throw arguments.callee.toString() + " parameter is nonnumeric!";
        }
        width = val;
    },
    this.setInitialSpriteState = function (val) {
        if (val == null || val == undefined) {
            throw arguments.callee.toString() + " parameter is undefined!";
        }
        spriteState = val;
    },
    this.setTopBorder = function (val) {
        if (isNaN(val) || val == null || val == undefined) {
            throw arguments.callee.toString() + " parameter is nonnumeric!";
        }
        topBorder = val;
    },
    this.getTopBorder = function () {
        return topBorder;
    },
    this.setBottomBorder = function (val) {
        if (isNaN(val) || val == null || val == undefined) {
            throw arguments.callee.toString() + " parameter is nonnumeric!";
        }
        bottomBorder = val;
    },
    this.getBottomBorder = function () {
        return bottomBorder;
    },
    this.setLeftBorder = function (val) {
        if (isNaN(val) || val == null || val == undefined) {
            throw arguments.callee.toString() + " parameter is nonnumeric!";
        }
        leftBorder = val;
    },
    this.getLeftBorder = function () {
        return leftBorder;
    },
    this.setRightBorder = function (val) {
        rightBorder = val;
    },
    this.getRightBorder = function () {
        return rightBorder;
    },
    //corresponds to the angle the sprite is facing.
    this.setSpriteXDirection = function (val) {
        spriteXDirection = val;
    },
    this.setSpriteYDirection = function (val) {
        spriteYDirection = val;
    },
    this.setTopBorderMoveStyle = function (val) {
        topBorderMoveStyle = val;
    },
    this.getTopBorderMoveStyle = function () {
        return topBorderMoveStyle;
    },
    this.setBottomBorderMoveStyle = function (val) {
        bottomBorderMoveStyle = val;
    },
    this.getLeftBorderMoveStyle = function () {
        return leftBorderMoveStyle;
    },
    this.setLeftBorderMoveStyle = function (val) {
        leftBorderMoveStyle = val;
    },
    this.getLeftBorderMoveStyle = function () {
        return leftBorderMoveStyle;
    },
    this.setLeftBorderMoveStyle = function (val) {
        leftBorderMoveStyle = val;
    },
    this.getBottomBorderMoveStyle = function () {
        return bottomBorderMoveStyle;
    },
    this.getSpriteXDirection = function () { return spriteXDirection; },
    this.getSpriteYDirection = function () { return spriteYDirection; },
    this.getCurrentAnimation = function () {
        return animations[this.getDirection()][this.getSpriteState()];
    },
    this.getAnimations = function () {
        return animations;
    }
    this.getRightSpeed = function () { return rightSpeed; },
    this.setRightSpeed = function (value) { rightSpeed = value; },
    this.getLeftSpeed = function () { return leftSpeed; },
    this.setLeftSpeed = function (value) { leftSpeed = value; },
    this.getUpSpeed = function () { return upSpeed; },
    this.setUpSpeed = function (value) { upSpeed = value; },
    this.getDownSpeed = function () { return downSpeed; },
    this.setDownSpeed = function (value) { downSpeed = value; },
    this.getInSpeed = function () { return inSpeed; },
    this.setInSpeed = function (value) { inSpeed = value; },
    this.getOutSpeed = function () { return outSpeed; },
    this.setOutSpeed = function (value) { outSpeed = value; },
    this.setTop = function (value) {
        this.setY(value);
    },
    this.setLeft = function (value) {
        this.setX(value);
    },
    this.setVisible = function (value) { visible = value; },
    this.getVisible = function () { return visible; },
    this.setSpeed = function (value) {
        if (isNaN(value) || value == null || value == undefined) {
            throw arguments.callee.toString() + " parameter is nonnumeric!";
        }
        this.setUpSpeed(value);
        this.setDownSpeed(value);
        this.setLeftSpeed(value);
        this.setRightSpeed(value);
        this.setInSpeed(value);
        this.setOutSpeed(value);
    },
    this.getAnimations = function () { return animations; },
    this.absoluteLeft = function () { return xpos; },
    this.absoluteRight = function () {        
        if (spriteRight == undefined || isNaN(spriteRight)) {
            this.calcRight();
        }
        return spriteRight;
    },
    this.absoluteTop = function () {
        return ypos;
    },
    this.absoluteBottom = function () {
        if (spriteBottom == undefined || isNaN(spriteBottom)) {
            this.calcBottom();
        }
        return spriteBottom;
    },
    this.chain = function (file) {
        var image;
        image = engineRef.addImage(file, this, this.sheetsLoaded);
        sheetCount++;
        chained[file] = image;

    },
    this.unchain = function (file) {
        delete chained[file];
    },
    this.getChainedImages = function () {
        return chained;
    }
    this.getWidth = function () {

        if (drawRectOverridden) {
            return innerWidth;
        }

        if (lastWidth == undefined && customDrawRoutine == undefined) {
            if (animations[this.getDirection()] != null && animations[this.getDirection()][this.getSpriteState()] != null && animations[this.getDirection()][this.getSpriteState()].frames[counter] != null) {
                return animations[this.getDirection()][this.getSpriteState()].frames[counter].getFrameW();
            }
            else {
                throw "Sprite " + this.name + " is in an invalid state, width cannot be determined.";
            }
        }
        else {
            return lastWidth;
        }
    },
    this.getHeight = function () {
        if (drawRectOverridden) {
            return innerHeight;
        }

        if (lastHeight == undefined && customDrawRoutine == undefined) {
            if (animations[this.getDirection()] != null && animations[this.getDirection()][this.getSpriteState()] != null && animations[this.getDirection()][this.getSpriteState()].frames[counter] != null) {
                return animations[this.getDirection()][this.getSpriteState()].frames[counter].getFrameH();
            }
            else {
                throw "Sprite " + this.name + " is in an invalid state, height cannot be determined.";
            }
        }
        else {
            return lastHeight;
        }
    },
    this.isLastFrame = function () {
        if (animations[this.getDirection()][this.getSpriteState()] == null) return false;
        if (counter >= animations[this.getDirection()][this.getSpriteState()].frames.length - 1) return true;
        return false;
    },
    this.setX = function (val) {
        if (isNaN(val) || val == null || val == undefined) {
            throw arguments.callee.toString() + " parameter is nonnumeric!";
        }

        xpos = val;
    },
    this.setY = function (val) {
        if (isNaN(val) || val == null || val == undefined) {
            throw arguments.callee.toString() + " parameter is nonnumeric!";
        }
        ypos = val;
    },
    this.adjustX = function (val) {
        if (isNaN(val) || val == null || val == undefined) {
            throw arguments.callee.toString() + " parameter is nonnumeric!";
        }
        xpos += val;
    },
    this.adjustY = function (val) {
        if (isNaN(val) || val == null || val == undefined) {
            throw arguments.callee.toString() + " parameter is nonnumeric!";
        }
        ypos += val;
    },
    this.moveOut = function () {
        scaleFactor--;
        this.moveUp();
    },
    this.moveIn = function () {
        scaleFactor++;
        this.moveDown();
    },
    this.CheckMove = function (type, speed) {

        return engineRef.allowMove(xpos, ypos, type, speed, this);

    },
    this.moveUp = function () {

        var speed = upSpeed;

        if (!engineRef.allowMove(xpos, ypos, "up", speed, this)) {
            return;
        }

        if (topBorderMoveStyle == "block" && ypos - upSpeed <= topBorder) {

            return false;
        }
        else if (topBorderMoveStyle == "wrap" && ypos - upSpeed <= topBorder) {

            return false;
        }

        ypos -= upSpeed;

        return true;
    },
    this.wireArrowKeys = function (idle, forward, back, up, down) {
        engineRef.addEventBehavior(engineRef.gameEvents.Idle, "", this, idle, null, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyDown, RIGHTARROW, this, forward, this.moveRight, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyDown, LEFTARROW, this, back, this.moveLeft, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyUp, RIGHTARROW, this, idle, null, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyUp, LEFTARROW, this, idle, null, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyDown, UPARROW, this, up, this.moveUp, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyDown, DOWNARROW, this, down, this.moveDown, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyUp, UPARROW, this, idle, null, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyUp, DOWNARROW, this, idle, null, tc.constants.playInfinite);
    },
    this.wireIsoArrowKeys = function (idle, forward, back, up, down) {
        engineRef.addEventBehavior(engineRef.gameEvents.Idle, "", this, idle, null, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyDown, RIGHTARROW, this, forward, function () { this.sprite.setDirection(tc.constants.SPRITE_DIRECTION_EAST); this.sprite.moveRight(); }, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyDown, LEFTARROW, this, back, function () { this.sprite.setDirection(tc.constants.SPRITE_DIRECTION_WEST); this.sprite.moveLeft(); }, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyUp, RIGHTARROW, this, idle, null, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyUp, LEFTARROW, this, idle, null, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyDown, UPARROW, this, up, function () { this.sprite.setDirection(tc.constants.SPRITE_DIRECTION_NORTH); this.sprite.moveUp(); }, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyDown, DOWNARROW, this, down, function () { this.sprite.setDirection(tc.constants.SPRITE_DIRECTION_SOUTH); this.sprite.moveDown(); }, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyUp, UPARROW, this, idle, null, tc.constants.playInfinite);
        engineRef.addEventBehavior(engineRef.gameEvents.KeyUp, DOWNARROW, this, idle, null, tc.constants.playInfinite);
    },
    this.moveDown = function () {

        var speed = downSpeed;

        if (!engineRef.allowMove(xpos, ypos, "down", speed, this)) {
            return;
        }

        if (bottomBorderMoveStyle == "block" && ypos + height + downSpeed >= bottomBorder) {
            return false;
        }
        else if (topBorderMoveStyle == "wrap" && ypos + height + downSpeed >= bottomBorder) {
            return false;
        }

        ypos += downSpeed;

        return true;
    },
    this.moveRight = function () {

        var speed = rightSpeed;

        if (!engineRef.allowMove(xpos, ypos, "right", speed, this)) {
            return;
        }

        if (rightBorderMoveStyle == "block" && xpos + width + speed >= rightBorder) {
            return false;
        }
        else if (topBorderMoveStyle == "wrap" && xpos + width + speed >= rightBorder) {
            return false;
        }

        xpos += speed;
    },
    this.moveLeft = function () {

        var speed = leftSpeed;

        if (!engineRef.allowMove(xpos, ypos, "left", speed, this)) {
            return;
        }

        if (leftBorderMoveStyle == "block" && xpos - speed <= leftBorder) {
            return false;
        }
        else if (topBorderMoveStyle == "wrap" && xpos - speed <= leftBorder) {
            return false;
        }

        xpos -= speed;


    },
    this.moveToVector = function (vector, style, state, direction) {
        this.setSpriteState(state);
        if (direction == undefined) {
            this.setVectorDirectional(vector, style);
        }
        else {
            this.setDirection(direction);
        }

        for (var i = 0; i < vector.data.length; i++) {
            var data = vector.data[i];
            var tempSpeed = 0;
            if (data.direction == "up") {
                tempSpeed = this.getUpSpeed();
                this.setUpSpeed(data.speed);
                this.moveUp();
                this.setUpSpeed(tempSpeed);
            }
            else if (data.direction == "down") {
                tempSpeed = this.getDownSpeed();
                this.setDownSpeed(data.speed);
                this.moveDown();
                this.setDownSpeed(tempSpeed);
            }
            else if (data.direction == "right") {
                tempSpeed = this.getRightSpeed();
                this.setRightSpeed(data.speed);
                this.moveRight();
                this.setRightSpeed(tempSpeed);
            }
            else if (data.direction == "left") {
                tempSpeed = this.getLeftSpeed();
                this.setLeftSpeed(data.speed);
                this.moveLeft();
                this.setLeftSpeed(tempSpeed);
            }
            else {
                throw "Valid directions are up, down, left right."
            }
        }
    },
    this.moveOrigin = function (screenPoint, originPoint) {
        this.setDirection(this.getIsoDirection(screenPoint));
        var engine = this.getEngineRef();
        var x = engine.getOriginX();
        var y = engine.getOriginY();

        this.getEngineRef().adjustOrigin("x", originPoint.x - x, this);
        this.getEngineRef().adjustOrigin("y", originPoint.y - y, this);
    },
    this.moveOriginToPoint = function (point) {
        this.setDirection(this.getIsoDirection(point));
        var engine = this.getEngineRef();
        var x = engine.getOriginX();
        var y = engine.getOriginY();

        //determine what this point is relative to the origin
        //the origin is the center of the screen
        var newOrigin = engine.getWorldModel().newOriginFromScreenCoords(point);

        this.getEngineRef().adjustOrigin("x", newOrigin.x - x, this);
        this.getEngineRef().adjustOrigin("y", newOrigin.y - y, this);
    },
    this.moveOriginToVector = function (vector, style, state, direction) {
        this.setSpriteState(state);
        if (direction == undefined) {
            this.setVectorDirectional(vector, style);
        }
        else {
            this.setDirection(direction);
        }
        for (var i = 0; i < vector.data.length; i++) {
            var data = vector.data[i];
            if (data.direction == "up") {

                this.getEngineRef().adjustOrigin("y", data.speed, this);
            }
            else if (data.direction == "down") {
                this.getEngineRef().adjustOrigin("y", data.speed * -1, this);
            }
            else if (data.direction == "right") {
                this.getEngineRef().adjustOrigin("x", data.speed * -1, this);
            }
            else if (data.direction == "left") {
                this.getEngineRef().adjustOrigin("x", data.speed, this);
            }
            else {
                throw "Valid directions are up, down, left right."
            }
        }
    },
    this.setVectorDirectional = function (vector, style) {

        if (style == tc.constants.GAME_WORLD_STYLE_2D) {
            this.setVectorDirectional2D(vector);
        }
        else {
            this.setVectorDirectionalIso(vector);
        }

    },
    this.setVectorDirectional2D = function (vector) {
        var up, down, left, right;
        for (var i = 0; i < vector.data.length; i++) {
            if (vector.data[i].direction == "up") { up = true; }
            if (vector.data[i].direction == "down") { down = true; }
            if (vector.data[i].direction == "left") { left = true; }
            if (vector.data[i].direction == "right") { right = true; }
        }

        if (left == true) {
            //invert
            this.setSpriteXDirection(tc.constants.SPRITE_INVERTED);
        }

        if (right == true) {
            this.setSpriteXDirection(tc.constants.SPRITE_NORMAL);
        }

        //we don't invert the y axis because this is mean for street fighter like 2d games
        //however, you can add code here if you have a shooter.
    },
    this.setVectorDirectionalIso = function (vector) {
        var up, down, left, right;
        for (var i = 0; i < vector.data.length; i++) {
            if (vector.data[i].direction == "up") { up = true; }
            if (vector.data[i].direction == "down") { down = true; }
            if (vector.data[i].direction == "left") { left = true; }
            if (vector.data[i].direction == "right") { right = true; }
        }
        /*    	 
        var tc.constants.SPRITE_DIRECTION_NORTH = "-1";
        var tc.constants.SPRITE_DIRECTION_NORTH_EAST = "-2";
        var tc.constants.SPRITE_DIRECTION_EAST = "-3";
        var tc.constants.SPRITE_DIRECTION_SOUTH_EAST = "-4";
        var tc.constants.SPRITE_DIRECTION_SOUTH = "-5";
        var tc.constants.SPRITE_DIRECTION_SOUTH_WEST = "-6";
        var tc.constants.SPRITE_DIRECTION_WEST = "-7";
        var tc.constants.SPRITE_DIRECTION_NORTH_WEST = "-8";
        */
        if (up && left) {
            this.setDirection(tc.constants.SPRITE_DIRECTION_NORTH_WEST);
            return;
        }

        if (up && right) {
            this.setDirection(tc.constants.SPRITE_DIRECTION_NORTH_EAST);
            return;
        }

        if (down && right) {
            this.setDirection(tc.constants.SPRITE_DIRECTION_SOUTH_EAST);
            return;
        }

        if (down && left) {
            this.setDirection(tc.constants.SPRITE_DIRECTION_SOUTH_WEST);
            return;
        }

        if (up) {
            this.setDirection(tc.constants.SPRITE_DIRECTION_NORTH);
            return;
        }

        if (right) {
            this.setDirection(tc.constants.SPRITE_DIRECTION_EAST);
            return;
        }

        if (down) {
            this.setDirection(tc.constants.SPRITE_DIRECTION_SOUTH);
            return;
        }

        if (left) {
            this.setDirection(tc.constants.SPRITE_DIRECTION_WEST);
            return;
        }

    },
    this.setup = function (gameEngine) {
        mainContext = gameEngine.getMainContext();
        backContext = gameEngine.getBackContext();
        backContextWidth = gameEngine.getBackContextWidth();
        backContextHeight = gameEngine.getBackContextHeight();
        canvasHeight = gameEngine.getCanvasHeight();
        canvasWidth = gameEngine.getCanvasWidth();
        engineRef = gameEngine;

    },
    this.sheetsLoaded = function () {
        //sheetsLoaded is fired as a callback off image. 
        //As such, "this" is the image. 
        //Earlier we set this.parent to our sprite.
        loadedImageCount++;
        // if (loadCallBack != undefined) {
        //         if (isCompleteHolder()) {
        //             loadCallBack(this.parent);
        //         }
        //     }
    },
    this.loadedSoFar = function () {
        return loadedImageCount;
    },
    this.isLoadComplete = function () {
        if (customDrawRoutine != undefined) {
            return true; //custom sprites have no load time - 
        }
        if (loadedImageCount == sheetCount) { return true; }
        var returnme = true;
        for (var sheet in sheets) {
            if (!sheets[sheet].complete) {
                return false;
            }
        }
        return true;
    },
    this.sheetsTotal = function () { return sheetCount; },
    this.addImage = function (file) {
        if (sheets[file] == undefined) {
            var image;
        	image = engineRef.addImage(file, this.sheetsLoaded);
            sheetCount++;
            sheets[file] = image;
        }
    },
    this.addSound = function (file) {
        if (sounds[file] == undefined) {
            var audio = engineRef.addSound(file, this.sheetsLoaded);
            sounds[file] = audio;
        }

    },

    this.getPlayCount = function () {
        if (animations[this.getDirection()] != null && animations[this.getDirection()][this.getSpriteState()] != null) {
            return animations[this.getDirection()][this.getSpriteState()].playCount;
        }
        else {
            return undefined;
        }
    },
    this.getSheet = function (val) {
        return sheets[val];
    },
    this.getSheets = function () {
        return sheets;
    },
    this.getSheetCount = function () {
        var count = 0;
        for (var sheet in sheets) {
            count++;
        }
        return count;
    },
    this.easyDefineSequence = function (sheetname, image, rows, cols, height, width, speed, playCount, anchorHor, anchorVer, direction) {
        var sequence = [];
        for (var row = 0; row < rows; row++) {
			for (var col = 0; col < cols; col++) {
                sequence.push(new Frame(row, col, height, width, speed));
            }
        }
        this.defineSequence(sheetname, image, sequence, playCount, anchorHor, anchorVer, direction);
    },
    this.defineSequence = function (sheetname, image, frames, playCount, anchorHor, anchorVer, direction) {
        if (direction == undefined) {
            direction = tc.constants.SPRITE_DIRECTION_UNDEFINED;
        }

        if (animations[direction] == undefined) {
            animations[direction] = new Object();
        }

        animations[direction][sheetname] = new Object();
        if (image != undefined) {
            this.addImage(image);
        }
        animations[direction][sheetname].sheet = sheets[image];
        animations[direction][sheetname].frames = frames;
        animations[direction][sheetname].playCount = playCount;

        if (anchorHor == undefined) {
            anchorHor = tc.constants.SPRITE_MOVEMENT_DIRECTION_FORWARD;
        }

        if (anchorVer == undefined) {
            anchorVer = tc.constants.SPRITE_MOVEMENT_DIRECTION_UP;
        }

        animations[direction][sheetname].anchorHorizontal = anchorHor;
        animations[direction][sheetname].anchorVertical = anchorVer;
    },
    this.chainToSequence = function (sheetname, image, direction, spritePart, partsDef, frames) {
        if (direction == undefined) {
            direction = tc.constants.SPRITE_DIRECTION_UNDEFINED;
        }

        if (animations[direction][sheetname] == undefined) {
            throw "Cannot chain to an undefined sequence.";
        }

        if (animations[direction][sheetname].chained == undefined) {
            animations[direction][sheetname].chained = [];
        }
        this.addImage(image);
        var chainDef = { "image": sheets[image], "part": spritePart, "def": partsDef, "frames": frames };
        //animations[direction][sheetname].chained.push(chainDef);
        animations[direction][sheetname].chained[spritePart] = chainDef;

    },
	this.unChainToSequence = function(sheetname, image, direction, spritePart)
	{
		 if (direction == undefined) {
	            direction = tc.constants.SPRITE_DIRECTION_UNDEFINED;
	        }

	        if (animations[direction][sheetname] == undefined) {
	            throw "Cannot unchain an undefined sequence.";
	        }
		
			if (animations[directions][sheetname].chained[spritePart] == undefined)
			{
				throw "Cannot unchain " + spritePart + ". This part was never chained.";
			}
			delete animations[directions][sheetname].chained[spritePart];
	},
    this.setSound = function (sheetname, sound) {

        this.addSound(sound);
        if (animations[tc.constants.SPRITE_DIRECTION_UNDEFINED] != undefined) {
            animations[tc.constants.SPRITE_DIRECTION_UNDEFINED][sheetname].sound = sounds[sound];
        }
        if (animations[tc.constants.SPRITE_DIRECTION_NORTH] != undefined) {
            animations[tc.constants.SPRITE_DIRECTION_NORTH][sheetname].sound = sounds[sound];
        }
        if (animations[tc.constants.SPRITE_DIRECTION_NORTH_EAST] != undefined) {
            animations[tc.constants.SPRITE_DIRECTION_NORTH_EAST][sheetname].sound = sounds[sound];
        }
        if (animations[tc.constants.SPRITE_DIRECTION_EAST] != undefined) {
            animations[tc.constants.SPRITE_DIRECTION_EAST][sheetname].sound = sounds[sound];
        }
        if (animations[tc.constants.SPRITE_DIRECTION_SOUTH_EAST] != undefined) {
            animations[tc.constants.SPRITE_DIRECTION_SOUTH_EAST][sheetname].sound = sounds[sound];
        }
        if (animations[tc.constants.SPRITE_DIRECTION_SOUTH] != undefined) {
            animations[tc.constants.SPRITE_DIRECTION_SOUTH][sheetname].sound = sounds[sound];
        }
        if (animations[tc.constants.SPRITE_DIRECTION_SOUTH_WEST] != undefined) {
            animations[tc.constants.SPRITE_DIRECTION_SOUTH_WEST][sheetname].sound = sounds[sound];
        }
        if (animations[tc.constants.SPRITE_DIRECTION_WEST] != undefined) {
            animations[tc.constants.SPRITE_DIRECTION_WEST][sheetname].sound = sounds[sound];
        }
        if (animations[tc.constants.SPRITE_DIRECTION_NORTH_WEST] != undefined) {
            animations[tc.constants.SPRITE_DIRECTION_NORTH_WEST][sheetname].sound = sounds[sound];
        }

    },
    this.defineSequenceWithSound = function (sheetname, image, sound, frames, playCount, anchorHor, anchorVer, direction) {
        if (direction == undefined) {
            direction = tc.constants.SPRITE_DIRECTION_UNDEFINED;
        }
        animations[direction][sheetname] = new Object();
        this.addImage(image);
        this.addSound(sound);
        animations[direction][sheetname].sheet = sheets[image];
        animations[direction][sheetname].sound = sounds[sound];
        animations[direction][sheetname].frames = frames;
        animations[direction][sheetname].playCount = playCount;
        if (anchorHor == undefined) {
            anchorHor = tc.constants.SPRITE_MOVEMENT_DIRECTION_FORWARD;
        }

        if (anchorVer == undefined) {
            anchorVer = tc.constants.SPRITE_MOVEMENT_DIRECTION_UP;
        }

        animations[direction][sheetname].anchorHorizontal = anchorHor;
        animations[direction][sheetname].anchorVertical = anchorVer;
    },
    //detailed define
    this.defineSequenceForExistingSheet = function (sheetname, name, frames, playCount, anchorHor, anchorVer, direction) {
        if (direction == undefined) {
            direction = tc.constants.SPRITE_DIRECTION_UNDEFINED;
        }
        animations[direction][name] = new Object();
        animations[direction][name].sheet = sheets[sheetname];
        animations[direction][name].frames = frames;
        animations[direction][name].playCount = playCount;
        animations[direction][name].sound = sounds[sheetname];
        if (anchorHor == undefined) {
            anchorHor = tc.constants.SPRITE_MOVEMENT_DIRECTION_FORWARD;
        }

        if (anchorVer == undefined) {
            anchorVer = tc.constants.SPRITE_MOVEMENT_DIRECTION_UP;
        }

        animations[direction][sheetname].anchorHorizontal = anchorHor;
        animations[direction][sheetname].anchorVertical = anchorVer;
    },
    this.hasCompleted = function () {
        //if my playCount has been set to something other then -1 or 0
        //then this indicates that the current animation must complete
        //before a new animation can be played. So, we check what counter        
        //is in reference to the number of frames and if this has not yet completed               
        if (this.getSpriteState() == "") { return true; } //if nothing is playing yet - then it has to be complete.
        if (animations[this.getDirection()][this.getSpriteState()] == null) { return true; }
        if (animations[this.getDirection()][this.getSpriteState()].playCount > 0) {
            if (counter >= animations[this.getDirection()][this.getSpriteState()].frames.length) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    },
    this.display = function () {


        if (delegatedDrawSprite != undefined) {
            delegatedDrawSprite.setTop(this.getTop());
            delegatedDrawSprite.setLeft(this.getLeft());
            delegatedDrawSprite.display();
            return;
        }

        //DRAW STEP 4 (Sort of) overrides our sprite stuff - allows you to draw right on the screen.        
        if (customDrawRoutine != undefined) {
            customDrawRoutine(this);
            return;
        }

        if (!this.isLoadComplete()) {
            return; //attempt to draw an unloaded sprite
        }


        if (animations[this.getDirection()] != null && animations[this.getDirection()][this.getSpriteState()] != null && animations[this.getDirection()][this.getSpriteState()].frames[counter] != null) {
            nextFrame = (tempDate1.getTime() - lastFrame >= animations[this.getDirection()][this.getSpriteState()].frames[counter].time);
        }
        else {
            nextFrame = false;
        }

        var shouldRun;
        var isNewAnimation;
        //if we're not playing anything all this goes to shit.
        if (this.getSpriteState() == "") {
            shouldRun = true;
            isNewAnimation = false;
            this.setSpriteState(getNormalState());
        }
        else {
            shouldRun = this.hasCompleted();
            isNewAnimation = (lastSpriteState != this.getSpriteState());
        }


        //if this is a new animation
        if (isNewAnimation) {
            //check if the current animation has completed
            if (shouldRun) {
                //if so - reset the counter
                setCounter(0);
                this.setAnimationState(tc.constants.SPRITE_STATE_START);
                this.draw();
            }
        }
        else {

            this.setAnimationState(tc.constants.SPRITE_STATE_DURING);
			
            this.draw();

            //if this is the final frame, set animation state        
            if (this.isLastFrame() && animations[this.getDirection()][this.getSpriteState()].playCount != -1) {
                this.setAnimationState(tc.constants.SPRITE_STATE_DONE);
            }

            //if the sprite has a watcher set, fire.
            if (watchData[spriteState] != undefined && nextFrame) {
                //check the type
                if (watchData[spriteState].type == tc.constants.WATCH_TYPE_LAST_FRAME) {
                    if (this.isLastFrame()) {
                        watchData[spriteState].callBack(this);
                    }
                }
                else if (watchData[spriteState].type == tc.constants.tc.constants.WATCH_TYPE_ALL_FRAME) {
                    watchData[spriteState].callBack(this);
                }
                else //watch value indicates frame to watch
                {
                    if (counter == watchData[spriteState].type) {
                        watchData[spriteState].callBack(this);
                    }
                }
            }

            if (this.isLastFrame() && animations[this.getDirection()][this.getSpriteState()].playCount != -1) {
                this.setNormal();
            }

        }

        lastSpriteState = this.getSpriteState();

    },
    this.invalidate = function (backSheet) {


        if (delegatedDrawSprite != undefined) {
            delegatedDrawSprite.setTop(this.getTop());
            delegatedDrawSprite.setLeft(this.getLeft());
            delegatedDrawSprite.invalidate();
            return;
        }

        if (isNaN(lastXpos) || isNaN(lastYpos) || isNaN(lastWidth) || isNaN(lastHeight) ||
            lastXpos == null || lastYpos == null || lastWidth == null || lastHeight == null) {
            return; //can't invalidate without dimensions, must be a custom draw sprite.
        }


        //DRAW STEP1: clear area around the current sprite
        //        if (this.getSpriteType() != tc.constants.GAME_WORLD_CELL_OVERLAY) {
        //            mainContext.clearRect(lastXpos, lastYpos, lastWidth, lastHeight);
        //        }

        //DRAW STEP2: Clear the whole back buffer so there is no dirt picked up
        //spriteContext.clearRect(0, 0, spriteContextWidth, spriteContextHeight);

        // draw the backdrop in over the area we jsut cleared
        if (engineRef == undefined) {
            throw "Set up was not called reference to game engine is undefined.";
        }

        // Nine arguments: the element, source (x,y) coordinates, source width and 
        // height (for cropping), destination (x,y) coordinates, and destination width 
        // and height (resize).                     
        if (lastXpos + lastWidth > canvasWidth) {
            lastXpos = canvasWidth - lastWidth;
        }

        if (lastXpos < 0) { lastXpos = 0; }

        if (lastYpos + lastHeight > canvasHeight) {
            lastYpos = canvasHeight - lastHeight;
        }

        if (lastYpos < 0) { lastYpos = 0; }


        //DRAW STEP3: replace the piece of the background our sprite is currently over        
        if (this.getSpriteType() != tc.constants.GAME_WORLD_CELL_OVERLAY) {
            var data = backContext.getImageData(lastXpos, lastYpos, lastWidth, lastHeight);
            mainContext.putImageData(data, lastXpos, lastYpos);
        }

    },
    this.prep = function (playName) {

        if (delegatedDrawSprite != undefined) {
            delegatedDrawSprite.setTop(this.getTop());
            delegatedDrawSprite.setLeft(this.getLeft());
            delegatedDrawSprite.prep();
            return;
        }


        if (playName != null) {
            this.setSpriteState(playName);
        }

        /*if (height > canvasHeight) {
        throw "Sprite height is greater then available context height.";
        }
        if (width > canvasWidth) {
        throw "Sprite width is greater then available context width.";
        }*/

        if (customDrawRoutine == undefined) {
            var ani = animations[this.getDirection()][this.getSpriteState()];

            if (ani == undefined) {
                throw "Animations for " + this.getSpriteState() + " do not exist in sprite: " + this.name;
            }

            if (counter > ani.frames.length) {
                throw "The requested frame for: " + this.name + " does not exist in sprite: " + this.name;
            }

            if (!drawRectOverridden) {
                width = ani.frames[counter].getFrameW();
                height = ani.frames[counter].getFrameH();
            }
            else {
                width = innerWidth;
                height = innerHeight;
            }

		
        }

        if (isNaN(width) || isNaN(height)) {
            return; //can't prep without dimensions, must be a custom draw sprite.
        }

        //apply the scale factor from movein/moveout for depth              
        actualWidth = width + scaleFactor;
        actualHeight = height + scaleFactor;

        //make sure our last positions aren't null
        if (lastXpos == null) {
            lastXpos = xpos;
        }
        if (lastYpos == null) {
            lastYpos = ypos;
        }
        if (lastHeight == null) {
            lastHeight = actualHeight;
            if (isNaN(lastHeight)) {
                throw "Height is not numeric!";
            }
        }
        if (lastWidth == null) {
            lastWidth = actualWidth;
            if (isNaN(lastWidth)) {
                throw "Width is not numeric!";
            }
        }

        //ypos = spriteBottom - actualHeight;
        if (customDrawRoutine == undefined) {
            var dimensions = this.getFrameDimensions(drawRectOverridden, innerWidth, innerHeight, animations[this.getDirection()][this.getSpriteState()].frames[counter]);
			width = dimensions.width;
			height = dimensions.height;
			animationX = dimensions.sourceX;
			animationY = dimensions.sourceY;

        }



    },
	this.getFrameDimensions = function(overRide, innerWidth, innerHeight, frame)
	{
		var dimensions = {};
		if (!overRide) {
            dimensions.sourceX = frame.getFrameX();
            dimensions.sourceY = frame.getFrameY();
			dimensions.width = frame.getFrameW();
			dimensions.height = frame.getFrameH();
        }
        else {
            //this sprite must have padding, (which is why we override the rect)
            //padding screws things up in the game - so to handle this we need to calculate the correct x,y of the sprite
            //based on the height/width override settings
			
	        dimensions.width = innerWidth;
	        dimensions.height = innerHeight;
	        
            var tempX = frame.getFrameX();
            var tempY = frame.getFrameY();
            var tempWidth = frame.getFrameW();
            var tempHeight = frame.getFrameH();
            dimensions.sourceX = tempX + Math.floor((tempWidth - innerWidth) / 2);
            dimensions.sourceY = tempY + Math.floor((tempHeight - innerHeight) / 2);
	
        
		}
	
		
		return dimensions;
		
	}
    this.calcRight = function () {
        if (delegatedDrawSprite != undefined) {
            actualWidth = delegatedDrawSprite.getWidth();
        }

        spriteRight = xpos + actualWidth;
        if (spriteRight == NaN) {
            throw "Invalid sprite calculation + state - calcRight.";
        }
    },
    this.calcBottom = function () {
        if (delegatedDrawSprite != undefined) {
            actualHeight = delegatedDrawSprite.getHeight();
        }
        
        spriteBottom = ypos + actualHeight;
        if (spriteBottom == NaN) {
            throw "Invalid sprite calculation + state - calcBottom .";
        }

    },
    this.getIsoDirection = function (point, accountForCellHeight) {

        var spriteX = this.getLeft() + this.getWidth() / 2;

        if (accountForCellHeight != undefined) {
            var spriteY = this.getBottom() - this.getEngineRef().getWorldModel().cellHeight / 2;
        }
        else {
            var spriteY = this.getBottom();
        }
        if (spriteX > point.x && spriteY < point.y) {
            return tc.constants.SPRITE_DIRECTION_SOUTH_WEST;
        }
        else if (spriteX > point.x && spriteY > point.y) {
            return tc.constants.SPRITE_DIRECTION_NORTH_WEST;
        }
        else if (spriteX < point.x && spriteY < point.y) {
            return tc.constants.SPRITE_DIRECTION_SOUTH_EAST;
        }
        else if (spriteX < point.x && spriteY > point.y) {
            return tc.constants.SPRITE_DIRECTION_NORTH_EAST;
        }
        else if (spriteY < point.y) { //south
            return tc.constants.SPRITE_DIRECTION_SOUTH;
        }
        else if (spriteY > point.y) { //north
            return tc.constants.SPRITE_DIRECTION_NORTH;
        }
        else if (spriteX > point.x) { //west
            return tc.constants.SPRITE_DIRECTION_WEST;
        }
        else if (spriteX < point.x) { //east
            return tc.constants.SPRITE_DIRECTION_EAST;
        }
        else {
            return this.getDirection();
        }
    },
    this.isoPointAtSprite = function (sprite) {

        var point = { "x": sprite.getLeft() + sprite.getWidth() / 2, "y": sprite.getBottom() };
        this.isoFacePoint(point);
    },
    this.isoFacePoint = function (point) {

        this.setDirection(this.getIsoDirection(point));
    },
    this.setPixel = function (imageData, x, y, r, g, b, a) {
        index = (x + y * imageData.width) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = a;
    },
    this.boxSprite = function (color) {
        this.doBox = true;
        this.boxColor = color;
    },
    this.unBoxSprite = function () {
        this.doBox = undefined;
    },
    this.highLight = function (fr, fg, fb, fa, tr, tg, tb, ta) {
        this.doHighLight = true;
        this.fR = fr;
        this.fG = fg;
        this.fB = fb;
        this.fA = fa;
        this.tR = tr;
        this.tG = tg;
        this.tB = tb;
        this.tA = ta;

    },
    this.unHighLight = function () {
        this.doHighLight = false;
    },
    this.setAtIsoPoint = function (point, accountForCellHeight) {
        this.setDirection(this.getIsoDirection(point, accountForCellHeight));
        this.setTop(point.y - this.getHeight());
        this.setLeft(point.x - this.getWidth() / 2);
    },
	this.setChainSortOrder = function(sortMap)
	{
		this.sortMap = sortMap;
	}
    this.draw = function () {


        var horScale = 0;
        var verScale = 0;
        //check the direction of the sprite
        //turn the backContext to this direction     
        var localState = this.getSpriteState();
        var direction = this.getDirection();
        if (localState == undefined) {
            throw "how can the sprite state be undefined in sprite" + this.name;
        }

        if (direction == undefined) {
            throw "sprite direction should not default to undefined in sprite" + this.name;
        }

        if (animations[direction][localState] == undefined) {
            throw "there is no animation for sprite state: " + localState + " in sprite: " + this.name;
        }

        if (counter == 0) {
            if (animations[direction][localState].sound != undefined && animations[direction][localState].sound != null) {
                animations[direction][localState].sound.play();
            }
        }

        mainContext.save();

        if (actualWidth > lastWidth) //motion
        {
            //if the motion of the sprite is foward and the sprite is inverted
            if (spriteXDirection == tc.constants.SPRITE_INVERTED && animations[direction][localState].anchorHorizontal == tc.constants.SPRITE_MOVEMENT_DIRECTION_FORWARD) //xpos must decrease by width dif
            {
                xpos -= (actualWidth - lastWidth);
            }

            //if the sprite is not inverted and the movement is backward, we also need to reduce our xpos
            if (spriteXDirection != tc.constants.SPRITE_INVERTED && animations[direction][localState].anchorHorizontal == tc.constants.SPRITE_MOVEMENT_DIRECTION_BACK) //xpos must decrease by width dif
            {
                xpos -= (actualWidth - lastWidth);
            }

            if (animations[direction][localState].anchorHorizontal == tc.constants.SPRITE_MOVEMENT_DIRECTION_CENTERED) {  //adjust the xpos 1/2 the width change
                xpos -= (actualWidth - lastWidth) / 2;
            }

        }
        else if (actualWidth < lastWidth) {
            if (spriteXDirection == tc.constants.SPRITE_INVERTED && animations[direction][localState].anchorHorizontal == tc.constants.SPRITE_MOVEMENT_DIRECTION_FORWARD) //xpos must be increased by the dif width
            {
                xpos += (lastWidth - actualWidth);

            }

            //if the sprite is not inverted and the movement is backward, we also need to reduce our xpos
            if (spriteXDirection != tc.constants.SPRITE_INVERTED && animations[direction][localState].anchorHorizontal == tc.constants.SPRITE_MOVEMENT_DIRECTION_BACK) //xpos must decrease by width dif
            {
                xpos += (lastWidth - actualWidth);
            }

            if (animations[direction][localState].anchorHorizontal == tc.constants.SPRITE_MOVEMENT_DIRECTION_CENTERED) {  //adjust the xpos 1/2 the width change
                xpos += (lastWidth - actualWidth) / 2;
            }
        }


        if (actualHeight > lastHeight) //motion
        {
            if (spriteYDirection != tc.constants.SPRITE_INVERTED && animations[direction][localState].anchorVertical == tc.constants.SPRITE_MOVEMENT_DIRECTION_UP) //ypos must decrease by width dif
            {
                ypos -= (actualHeight - lastHeight);
            }
        }
        else if (actualHeight < lastHeight) {
            if (spriteYDirection != tc.constants.SPRITE_INVERTED && animations[direction][localState].anchorVertical == tc.constants.SPRITE_MOVEMENT_DIRECTION_UP) //ypos must be decreased by the dif width
            {
                ypos += (lastHeight - actualHeight);
            }
        }


        this.calcRight();
        this.calcBottom();
	

        //calculate position differences and translations values if the sprite is inverted
        if (spriteXDirection == tc.constants.SPRITE_INVERTED || spriteYDirection == tc.constants.SPRITE_INVERTED) {
            if (spriteXDirection == tc.constants.SPRITE_INVERTED) {
                horScale = actualWidth;
            }
            if (spriteYDirection == tc.constants.SPRITE_INVERTED) {
                verScale = actualHeight;
            }
        }

        //DRAW STEP 4.5: don't lose our background, sprites can be behind us on the Y/Z axis (drawn in previous steps)
        //draw happens after invalidation.
        //so copy the maincontext for our position to the spriteContext where we'll be drawn
        //this is because another sprite could have been drawn already and we need to take
        //that into account        
        //var backImage = mainContext.getImageData(xpos, ypos, actualWidth, actualHeight);
        //spriteContext.putImageData(backImage, 0, 0);
        //now do the translation to flip this sprite image (note, this is our sprite, not background sprites)
        if (spriteXDirection == tc.constants.SPRITE_INVERTED || spriteYDirection == tc.constants.SPRITE_INVERTED) {
            mainContext.translate(horScale, verScale);
            mainContext.scale(spriteXDirection, spriteYDirection);
        }


        //save values for our next draw/clear/etc        
        this.setInvalidationRect(xpos, ypos, actualWidth, actualHeight);

        // draw the sprite over the backdrop we saved earlier
        // Nine arguments: the element, source (x,y) coordinates, source width and 
        // height (for cropping), destination (x,y) coordinates, and destination width 
        // and height (resize).   


        if (animations[direction][localState] == undefined) {
            throw "Seems there isn't an animation for state: " + localState + " in sprite " + this.name;
        }

        if (animations[direction][localState].sheet == undefined) {
            throw "Seems the animation image for state: " + localState + " in sprite " + this.name + " is undefined. Perhaps it's not loaded?";
        }

        if (animations[direction][localState].sheet.width < animationX + width) {
            console.log("The dimensions for animation: " + localState + " in sprite " + this.name + " would exceeed the width of the image.");
            width -= (animationX + width) - animations[direction][localState].sheet.width;
        }

        if (animations[direction][localState].sheet.height < animationY + height) {
            console.log("The dimensions for animation: " + localState + " in sprite " + this.name + " would exceeed the height of the image.");
            height -= (animationY + height) - animations[direction][localState].sheet.height;
        }



        //todo: translate current position to the inverted position
        var tempXpos = 0;
        var tempYpos = 0;

        if (spriteXDirection == tc.constants.SPRITE_INVERTED) {
            tempXpos = -xpos;
        }
        else {
            tempXpos = xpos;
        }

        if (spriteYDirection == tc.constants.SPRITE_INVERTED) {
            tempYpos = -ypos;
        }
        else {
            tempYpos = ypos;
        }


        if (animations[direction][localState].chained == undefined) {
            //DRAW STEP 5: Draw our image to our sprite canvas
            mainContext.drawImage(animations[direction][localState].sheet,
                                        animationX,
                                        animationY,
                                        width,
                                        height, tempXpos, tempYpos, actualWidth, actualHeight);

        }
        //global chain
        //DRAW STEP 6: if we have a global chain image, draw it
        for (var chainedImage in chained) {

            mainContext.drawImage(chained[chainedImage],
                                    animationX,
                                    animationY,
                                    width,
                                    height, tempXpos, tempYpos, actualWidth, actualHeight);

        }

        //per state/direction chain
        //DRAW STEP 7: if we have state/direction chains, draw them
        if (animations[direction][localState].chained != undefined) {
   
			//get sort order
	   		var sortOrder = this.sortMap[direction];
			if (sortOrder==undefined)
			{
				sortOrder = this.sortMap[tc.constants.SPRITE_DIRECTION_UNDEFINED];
				if (sortOrder == undefined)
				{
					throw "Sort order for this complex sprite could not be found.";
				}
				
				if (sortOrder.length == undefined)
				{
					throw "Chain sort map entries for composite sprites must be an array.";		
				}
				
			}
			
			//now that we have a sort order
			for(var i =0; i<sortOrder.length; i++)
			{
				var part = sortOrder[i];
				if (part == "base")
				{
					//if the part indicates "base", draw the main sheet
					//in theory, everything should just be a chain, but I added chains
					//after the main sheet stuff was in place. 
					mainContext.drawImage(animations[direction][localState].sheet,
									                              animationX,
									                              animationY,
									                              width,
									                              height, tempXpos, tempYpos, actualWidth, actualHeight);
				}
				else
				{
					
					//otherwise draw the chains
					var chainDef = animations[direction][localState].chained[part];
					if (chainDef == undefined)
					{
						throw "Composite Sprite part: " + part + " was not found. It seems your Chain Sort Map is out of whack.";
					}
					
					//before we can draw a chain, we have to consider that the
					//dimensions of a chained image can be different from the base, so we 
					//have to calculate the source position to draw from.
					//Todo: centralize this all in prep()
					//account for differing frame lengths (ie, main could be 9 frames, chain could be 3)
					var chainFrameCounter = 0;
					if (counter>chainDef.def.frames)
					{
						chainFrameCounter = chainDef.def.frames;
					}
					else
					{
						chainFrameCounter = counter;
					}
					
					var frame = chainDef.frames[chainFrameCounter];
					var dimensions = this.getFrameDimensions(chainDef.def.overRide, chainDef.def.innerWidth, chainDef.def.innerHeight, frame);
					var chainDrawPosX = tempXpos;
					var chainDrawPosY = tempYpos;
					
					if (chainDef.def.offsetX != undefined)
					{
						chainDrawPosX +=chainDef.def.offsetX;
					}
					if (chainDef.def.offsetY !=undefined)
					{
						chainDrawPosY += chainDef.def.offsetY;
					}

					mainContext.drawImage(chainDef.image,
														                  dimensions.sourceX,
									                                      dimensions.sourceY,
									                                      dimensions.width,
									                                      dimensions.height, chainDrawPosX, chainDrawPosY, dimensions.width, dimensions.height);
												
					
				
					
					// mainContext.drawImage(chainDef.image,
					// 				                  animationX,
					// 				                                      animationY,
					// 				                                      width,
					// 				                                      height, tempXpos, tempYpos, actualWidth, actualHeight);
				}
			}
			
     	}

        //if we are adding a highlight color (replacement of one color for another) do that
        //DRAW STEP 8: if we have state/direction chains, draw them
        if (this.doHighLight == true) {
            var imageData = mainContext.getImageData(tempXpos, tempYpos, actualWidth, actualHeight);
            for (y = 0; y < actualHeight; y++) {
                inpos = y * actualWidth * 4; // *4 for 4 ints per pixel                
                for (x = 0; x < actualWidth; x++) {
                    r = imageData.data[inpos++];
                    g = imageData.data[inpos++];
                    b = imageData.data[inpos++];
                    a = imageData.data[inpos++];

                    if (r == this.fR && g == this.fG && b == this.fB) {
                        imageData.data[inpos++] = this.tR;
                        imageData.data[inpos++] = this.tG;
                        imageData.data[inpos++] = this.tB;
                    }
                }
            }

            mainContext.putImageData(imageData, tempXpos, tempYpos);
        }

        //if we are boxing, do do
        //DRAW STEP 9: draw a box around the sprite
        if (this.doBox != undefined) {
            mainContext.fillStyle = this.boxColor;
            mainContext.lineWidth = 1;
            mainContext.strokeRect(tempXpos, tempYpos, actualWidth, actualHeight);

        }

        //mainContext the back context back to normal
        mainContext.restore();

        //draw the image from the spriteContext to the main context                
        //DRAW STEP 6: Yank our transformed sprite
        //tempImage = spriteContext.getImageData(0, 0, actualWidth, actualHeight);

        //DRAW STEP 7: Move it to the main view
        //mainContext.putImageData(tempImage, xpos, ypos);

        if (nextFrame) {
            counter++;
            lastFrame = tempDate1.getTime();
        }

        //check if counter has exceed the playback 
        if (counter >= animations[direction][localState].frames.length) {
            //of we are not a set play animation - reset, state remains the same so we loop
            if (animations[direction][localState].playCount <= 0) {
                setCounter(0);
            }
            else {
                //if I am a set play animation, flip back to idle
                this.setSpriteState(normalState);
                setCounter(0);
            }
        }
        tempDate1 = new Date();
    }

	if (engine != null && engine != undefined){
		this.setup(engine);
	}
    if (inNormalState == undefined) { inNormalState = inName; }
    if (inInitialState == undefined) { inInitialState = inName; }
    this.setInitialSpriteState(inInitialState);
    this.setNormalState(inNormalState);
    this.name = inName;
    this.setLoadedCallback(callBack);
    isCompleteHolder = this.isLoadComplete;
};

Sprite.prototype.animationState = this.animationState;
Sprite.prototype.getNormalState = this.getNormalState;
Sprite.prototype.setNormalState = this.setNormalState;

Sprite.prototype.getFrameCounter = this.getFrameCounter;
Sprite.prototype.actionPlayed = this.actionPlayed;
Sprite.prototype.setSpriteType = this.setSpriteType;
Sprite.prototype.getSpriteType = this.getSpriteType;
Sprite.prototype.setSpriteState = this.setSpriteState;
Sprite.prototype.setInitialSpriteState = this.setInitialSpriteState;
Sprite.prototype.getSpriteState = this.getSpriteState;
Sprite.prototype.setTopBorder = this.setTopBorder;
Sprite.prototype.getTopBorder = this.getTopBorder;
Sprite.prototype.setBottomBorder = this.setBottomBorder;
Sprite.prototype.getBottomBorder = this.getBottomBorder;
Sprite.prototype.setLeftBorder = this.setLeftBorder;
Sprite.prototype.getLeftBorder = this.getLeftBorder;
Sprite.prototype.setRightBorder = this.setRightBorder;
Sprite.prototype.getRightBorder = this.getRightBorder;
Sprite.prototype.setSpriteXDirection = this.setSpriteXDirection;
Sprite.prototype.setSpriteYDirection = this.setSpriteYDirection;
Sprite.prototype.setTopBorderMoveStyle = this.setTopBorderMoveStyle;
Sprite.prototype.getTopBorderMoveStyle = this.getTopBorderMoveStyle;
Sprite.prototype.setBottomBorderMoveStyle = this.setBottomBorderMoveStyle;
Sprite.prototype.getLeftBorderMoveStyle = this.getLeftBorderMoveStyle;
Sprite.prototype.setLeftBorderMoveStyle = this.setLeftBorderMoveStyle;
Sprite.prototype.getLeftBorderMoveStyle = this.getLeftBorderMoveStyle;
Sprite.prototype.setLeftBorderMoveStyle = this.setLeftBorderMoveStyle;
Sprite.prototype.getBottomBorderMoveStyle = this.getBottomBorderMoveStyle;
Sprite.prototype.getSpriteXDirection = this.getSpriteXDirection;
Sprite.prototype.getSpriteYDirection = this.getSpriteYDirection;
Sprite.prototype.getCurrentAnimation = this.getCurrentAnimation;
Sprite.prototype.getRightSpeed = this.getRightSpeed;
Sprite.prototype.setRightSpeed = this.setRightSpeed;
Sprite.prototype.getLeftSpeed = this.getLeftSpeed;
Sprite.prototype.setLeftSpeed = this.setLeftSpeed;
Sprite.prototype.getUpSpeed = this.getUpSpeed;
Sprite.prototype.setUpSpeed = this.setUpSpeed;
Sprite.prototype.getDownSpeed = this.getDownSpeed;
Sprite.prototype.setDownSpeed = this.setDownSpeed;
Sprite.prototype.getInSpeed = this.getInSpeed;
Sprite.prototype.setInSpeed = this.setInSpeed;
Sprite.prototype.getOutSpeed = this.getOutSpeed;
Sprite.prototype.setOutSpeed = this.setOutSpeed;
Sprite.prototype.setTop = this.setTop;
Sprite.prototype.setLeft = this.setLeft;
Sprite.prototype.getAnimations = this.getAnimations;
Sprite.prototype.getLeft = function () { return this.absoluteLeft(); };
Sprite.prototype.getTop = function () { return this.absoluteTop(); };
Sprite.prototype.getRight = function () { return this.absoluteRight(); };
Sprite.prototype.getBottom = function () { return this.absoluteBottom(); };
Sprite.prototype.absoluteLeft = this.absoluteLeft;
Sprite.prototype.absoluteRight = this.absoluteRight;
Sprite.prototype.absoluteTop = this.absoluteTop;
Sprite.prototype.absoluteBottom = this.absoluteBottom;
Sprite.prototype.getWidth = this.getWidth;
Sprite.prototype.getHeight = this.getHeight;
Sprite.prototype.isLastFrame = this.isLastFrame;
Sprite.prototype.setX = this.setX;
Sprite.prototype.setY = this.setY;
Sprite.prototype.adjustX = this.adjustX;
Sprite.prototype.adjustY = this.adjustY;
Sprite.prototype.moveRight = this.moveRight;
Sprite.prototype.moveLeft = this.moveLeft;
Sprite.prototype.moveUp = this.moveUp;
Sprite.prototype.moveDown = this.moveDown;
Sprite.prototype.moveIn = this.moveIn;
Sprite.prototype.moveOut = this.moveOut;
Sprite.prototype.setup = this.setup;
Sprite.prototype.sheetsLoaded = this.sheetsLoaded;
Sprite.prototype.loadedSoFar = this.loadedSoFar;
Sprite.prototype.isLoadComplete = this.isLoadComplete;
Sprite.prototype.sheetsTotal = this.sheetsTotal;
Sprite.prototype.addImage = this.addImage;
Sprite.prototype.addSound = this.addSound;
Sprite.prototype.easyDefineSequence = this.easyDefineSequence;
Sprite.prototype.getPlayCount = this.getPlayCount;
Sprite.prototype.getSheet = this.getSheet;
Sprite.prototype.getSheets = this.getSheets;
Sprite.prototype.defineSequence = this.defineSequence;
Sprite.prototype.defineSequenceWithSound = this.defineSequenceWithSound;
Sprite.prototype.defineSequenceForExistingSheet = this.defineSequenceForExistingSheet;
Sprite.prototype.hasCompleted = this.hasCompleted;
Sprite.prototype.display = this.display;
Sprite.prototype.indexHack = this.indexHack;
Sprite.prototype.invalidate = this.invalidate;
Sprite.prototype.prep = this.prep;
Sprite.prototype.draw = this.draw;
Sprite.prototype.actionPlayed = this.actionPlayed;
Sprite.prototype.setFrame = this.setFrame;
Sprite.prototype.setWidth = this.setWidth;
Sprite.prototype.setHeight = this.setHeight;
Sprite.prototype.setInvalidationRect = this.setInvalidationRect;
Sprite.prototype.wireArrowKeys = this.wireArrowKeys;
Sprite.prototype.CheckMove = this.CheckMove;
Sprite.prototype.setLoadedCallback = this.setLoadedCallback;
Sprite.prototype.setAttributes = this.setAttributes;
Sprite.prototype.setInnerDrawRectOverride = this.setInnerDrawRectOverride;
Sprite.prototype.getInnerDrawRectOverride = this.getInnerDrawRectOverride;
Sprite.prototype.getChainedImages = this.getChainedImages;
Sprite.prototype.getSheetCount = this.getSheetCount;
Sprite.prototype.getIsoDirection = this.getIsoDirection;
Sprite.prototype.isoFacePoint = this.isoFacePoint;
Sprite.prototype.isoPointAtSprite = this.isoPointAtSprite;
Sprite.prototype.chainToSequence = this.chainToSequence;
Sprite.prototype.boxSprite = this.boxSprite;
Sprite.prototype.unBoxSprite = this.unBoxSprite;
Sprite.prototype.delegateDraw = this.delegateDraw;    
Sprite.prototype.unChainToSequence = this.unChainToSequence;
Sprite.prototype.setChainSortOrder = this.setChainSortOrder;
