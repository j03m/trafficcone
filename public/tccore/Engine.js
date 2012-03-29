//This chunk thanks to http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();


var Engine =
    function (mainCanvas, backgroundCanvas) {
        isapplemobile = DetectAppleMobile();
		self = this;
		canvas = mainCanvas;
        context = canvas.getContext("2d");
        backCanvas = backgroundCanvas;
        backContext = backCanvas.getContext("2d");
        canvas.onblur = eventHandler;
        canvas.onfocus = eventHandler;
        canvas.onfocusin = eventHandler;
        canvas.onfocusout = eventHandler;
        canvas.onload = eventHandler;
        canvas.onresize = eventHandler;
        canvas.onscroll = eventHandler;
        canvas.onunload = eventHandler;
        canvas.onclick = eventHandler;
        canvas.ondblclick = eventHandler;
        canvas.onmousedown = eventHandler;
        canvas.onmouseup = eventHandler;
        canvas.onmousemove = eventHandler;
        canvas.onmouseover = eventHandler;
        canvas.onmouseout = eventHandler;
        canvas.onmouseenter = eventHandler;
        canvas.onmouseleave = eventHandler;
        canvas.onchange = eventHandler;
        canvas.onselect = eventHandler;
        canvas.onsubmit = eventHandler;
        document.onkeydown = eventHandler;
        document.onkeypress = eventHandler;
        document.onkeyup = eventHandler;
        canvas.onerror = eventHandler;
        document.ontouchstart = eventHandler;
        document.ontouchend = eventHandler;
        document.ontouchmove = eventHandler;
    },
	self,
	texture,
    sceneBackDropDrawn = false,
    isapplemobile,
    behaviors = [],
    eventQ = [],
    sprites = new Object(),
    spriteArray = [],
    overlayArray = [],
    overlayRedrawArray = [],
    overlayMap = new Object(),
    canvas,
    context,
    ignoreShift = [],
	gameImages = new Object(),
	gameSounds = new Object(),
    spriteCanvas,   
    backCanvas,
    backContext,
    nowPlaying,
    currentEvent,
    intervalId = 0,
    idleEvent,
    backDropSprite,
    collisionHandler,
    collisionAugment =0,
    lastPlay,
    loopHook,
    gameWorld,
    gameWorldModel,
    cameraXCell=0,
    cameraYCell = 0,
    currentXMovement,
    currentYMovement,
    microx =0,
    microy =0,
	gameLoopHook,
	startTime = null,
	endTime,
	frameCount=0,   
	frameDebug = true,
	frameMessage = "",
	
    eventHandler = function (event) {

        if (isapplemobile) {
            // event.preventDefault();
        }

        if (event == null || event == undefined) {
            return;
        }

        //check if the event is handled by us - if not just toss it, there is no need to add it to the eventq
        if (behaviors != null) {

            if (event.type == null) {
                return null;
            }

            if (behaviors[event.type] == null) {
                return null;
            }
        }
        else {
            return null; //no behaviors at all, add some? :(
        }

	//check that the event is not a duplicate keydown event. 
	if (event.type == "keydown")
	{		
		if (this.lastEvent != undefined)
		{
			var stamp = new Date();
			stamp = stamp.getTime();			
			if (this.lastEvent.keyCode == event.keyCode && stamp - this.lastLogged < 35)
			{
				//toss it				
				return;
				
			}
		}
	}

        if (event != null) {
            this.lastEvent = event;
            var time = new Date();
            time = time.getTime();
            this.lastLogged = time;
            var temp = TranslateUIEventToGameEvent(event);         
	    eventQ.push(temp);
              
        }
    },
    getLoader = function()
    {
    	return this.Loader;
    },
    setLoader = function(loader)
    {
    	this.Loader = loader;
    },
    TranslateUIEventToGameEvent = function(event)
    {
        var returnme;
        if (event.type == "keydown" || event.type == "keyup")
        {
            returnme = new GameEvent(event.type, event.keyCode, event);
        }
        else
        {
            //reserved to be expanded - clicks, moves etc
            returnme = new GameEvent(event.type, "", event);
        }

        return returnme;
    },
    getCurrentEvent=function()
    {
        //pop an event off the stack, if there are no events
        //we say the game engine and our sprites are in the idleState
        if (eventQ.length > 0)
        {
            return eventQ.pop();
        }
        else
        {        
			return idleEvent;         
        }

    },
    innerClearCurrentEvent = function () {
        currentEvent = idleEvent;
    }
    getBehaviorsForEvent = function (eventType) {
        return behaviors[eventType];
    },
    IsMatch = function (key, event) {
        if (key.eventData == undefined) {
            key.eventData = "";
        }
        if (event.eventData == undefined) {
            event.eventData = "";
        }
        return event.eventData == key.eventData;
    },
    CheckBorders = function (mySprite) {
        //check if our sprite's top <= 0 (top border)
        var borderColision;

        if (mySprite.absoluteTop() <= 0) {
            borderCollision = new GameEvent(tc.constants.gameEvents.BorderCollisionTop, mySprite.name);
            eventQ.push(borderCollision);

        }

        //check if our sprites left <= 0  (left border)
        if (mySprite.absoluteLeft() <= 0) {
            borderCollision = new GameEvent(tc.constants.gameEvents.BorderCollisionLeft, mySprite.name);
            eventQ.push(borderCollision);
        }

        //check if our sprite's left + width >= right border
        if (mySprite.absoluteRight() >= canvas.width) {
            borderCollision = new GameEvent(tc.constants.gameEvents.BorderCollisionRight, mySprite.name);
            eventQ.push(borderCollision);

        }

        if (mySprite.absoluteBottom() >= canvas.height) {
            borderCollision = new GameEvent(tc.constants.gameEvents.BorderCollisionBottom, mySprite.name);
            eventQ.push(borderCollision);
        }

    },
    DoPlayAction = function (behavior, innerEvent) {

        //determine, based on the sprites state if we should execute the action function for this behavior
        //a sprite has a "state" and a state has a begin, during and end.
        //an action should be executed if:
        //a) The sprites play type is play infinite         
        //b) If not, if the sprite's state is begining or during
        //c) The number of actions that are to be played have not been past
        var engineRef = undefined;
        if (behavior.sprite != null && behavior.sprite != undefined) {
            engineRef = behavior.sprite.getEngineRef();
            if (!DonePlaying(behavior)) {
                if (behavior.actionClass != null) {
				
                    if (behavior.actionClass.execute != null) {
                        behavior.actionClass.execute(innerEvent, behavior.sprite, engineRef);
                    }
                    else {
                        behavior.actionClass(innerEvent, behavior.sprite, engineRef);
                    }

                    if (behavior.sprite.getPlayCount() != tc.constants.playInfinite) {
                        behavior.sprite.actionPlayed++;
                    }
                }
            }
            else if (DonePlaying(behavior)) {
                behavior.sprite.actionPlayed = 0;
                //innerClearCurrentEvent();
            }
        }
        else {
            if (behavior.sprite != undefined) {
                engineRef = behavior.sprite.getEngineRef();
            }
            if (behavior.actionClass.execute != null) {

                behavior.actionClass.execute(innerEvent, behavior.sprite, engineRef);
            }
            else {
                behavior.actionClass(innerEvent, behavior.sprite, engineRef);
            }

            //innerClearCurrentEvent();
        }
    },
    DonePlaying = function (behavior) {
        if (behavior.actionPlayCount == -1) return false;

        if (behavior.sprite.actionPlayed >= behavior.actionPlayCount) {
            return true;
        }
        else {
            return false;
        }

    },
    CheckCollision = function (currentSprite, otherSprite) {
        //if our x position overlaps
        if (currentSprite.absoluteLeft() < otherSprite.absoluteRight() &&
            currentSprite.absoluteRight() > otherSprite.absoluteLeft()) {
            if (currentSprite.absoluteTop() < otherSprite.absoluteBottom() && currentSprite.absoluteBottom() > otherSprite.absoluteTop()) {
                return true;
            }
        }
        return false;
    },
    innerCheckEventPosition = function (eventX, eventY) {
        for (var obj in spriteArray) {
            var currentSprite = spriteArray[obj];
            if (currentSprite.absoluteLeft() < eventX && currentSprite.absoluteRight() > eventX) {
                if (currentSprite.absoluteTop() < eventY && currentSprite.absoluteBottom() > eventY) {
                    return currentSprite;
                }
            }
        }
    },
    HandleNpcActions = function () {
        var eventBehaviors = getBehaviorsForEvent(tc.constants.gameEvents.NPC);
        if (eventBehaviors == null) return; //no npcs
        for (var i = 0; i < eventBehaviors.length; i++) {
            //get a specific behavior from the list of behaviors
            var behavior = eventBehaviors[i];

            //play the sprite animation for this behavior
            DoPlayAction(behavior); //<--importat mod before animations        
        }

    },
    HandleUserInputActions = function () {
        currentEvent = getCurrentEvent();

        //get the behaviors for this event
        var eventBehaviors = getBehaviorsForEvent(currentEvent.type);

        var foundSequenceForEvent = false;

        //if there are behaviors for this event - 
        if (eventBehaviors != null) {
            //loop through the behaviors

			for (var i = 0; i < eventBehaviors.length; i++) {

                //get a specific behavior from the list of behaviors
                var behavior = eventBehaviors[i];

                //check to see if this behavior matches the data associated with this event.
                //behaviors consist of a type and a descriptor (eventData)
                //eventData must match (event data may often be things like keycode)
                if (IsMatch(behavior, currentEvent)) {
                    foundSequenceForEvent = true;
                    if (behavior.sprite != null && behavior.sprite != undefined) {
                        //check if this behavior matches the current behavior - and another behavior is not being interupted by Idle
                        if (behavior.sprite.getSpriteState() != behavior.animation && currentEvent.type != this.tc.constants.gameEvents.Idle) {
                            //reset the play action count                            
                            behavior.sprite.setSpriteState(behavior.animation); //changing the state causes the sprite's animation to change.
                        }
                    }
                    //play the sprite animation for this behavior
                 
					DoPlayAction(behavior, currentEvent.innerEvent);
                }
                //                else {
                //                    DoPlayAction(behavior, currentEvent.innerEvent);
                //                }
            }
        }

        return foundSequenceForEvent;

    },
    /* Less than 0: Sort "a" to be a lower index than "b"
    Zero: "a" and "b" should be considered equal, and no sorting performed.
    Greater than 0: Sort "b" to be a lower index than "a".*/
    Sort = function (a, b) {
        if (gameWorld == undefined) {
            return a["absoluteTop"]() - b["absoluteTop"]();
        }
        else if (gameWorld.Style == tc.constants.GAME_WORLD_STYLE_2D) {
            return a["absoluteTop"]() - b["absoluteTop"]();
        }
        else { //all other styles are isometric, which means
            return a.getBottom() - b.getBottom();
        }

    },
    getInvalidatedScene = function (tempArry) {
        for (var obj1 in overlayRedrawArray) {
            var sprite = overlayRedrawArray[obj1];
            tempArry.push(sprite); //put the sprite in question
            populate(tempArry, sprite);
        }
    },
    populate = function (tempArry, sprite) {
        var overlap = overlayMap[sprite.name];
        if (overlap != undefined) { //if I don't overlap with anyone
            for (var i = 0; i < overlap.length; i++) { //push all of the sprites this sprite overlaps with
                if (overlap[i].name != sprite.name) {
                    if (!contains(tempArry, overlap[i].name)) {
                        var bottom = overlap[i].getBottom();
                        var top = overlap[i].getTop();
                        var right = overlap[i].getRight();
                        var left = overlap[i].getLeft();
                        var height = overlap[i].getHeight();
                        if (bottom > 0 && //bottom is below lowest y
                            top < (canvas.height) && //top is above lrgst y
                            right > 0 && //right is on screen
                            left < canvas.width) //if visible                         
                        {
                            tempArry.push(overlap[i]);
                            populate(tempArry, overlap[i]);
                        }
                    }
                }
            }
        }
    },
    contains = function (array, spriteName) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].name == spriteName) {
                return true;
            }
        }

        return false;
    },
    getSortedSpriteArray = function () {

        //figure out exactly what sprites have to be redrawn
        var tempArry = [];
        getInvalidatedScene(tempArry);

        //merge the sprites we have to redraw with our game sprites
        tempArry = spriteArray.concat(tempArry);

        tempArry.sort(Sort); //get the right sort order for all sprites that need to be redrawn (Backdrop included)

        return tempArry;
    },
    Draw = function () {

        var tempArry = getSortedSpriteArray();

        overlayRedrawArray = []; //clear

        //first - we have to get rid of all the sprites and restore the backdrops
        for (var obj in tempArry) {           
                tempArry[obj].prep();
                tempArry[obj].invalidate();
        }

        //draw them
        for (var obj1 in tempArry) {
            //don't draw teh sprite if it was marked for removal
            if (tempArry[obj1].removeMe == true) {
                var removalCallback = tempArry[obj1].removalCallback;
                actualRemoveSprite(tempArry[obj1].name);
                if (removalCallback != undefined) {
                    removalCallback();
                }
            }
            else {

                if (tempArry[obj1].getVisible()) {
                    tempArry[obj1].display();                    
                }
            }
        }
    },
    actualRemoveSprite = function (inName) {
        var tempSprite = sprites[inName];
        if (tempSprite == undefined) {
            return;
        }
        var pos = this.findSpriteArrayPosition(inName);
        spriteArray.splice(pos, 1);
        delete sprites[inName];
    },
    findSpriteArrayPosition = function (inName) {
        for (var sprite in spriteArray) {
            if (spriteArray[sprite].name == inName) {
                return sprite;
            }
        }

        throw "The sprite: " + inName + " could not be found.";

    },
    takeBackGroundSnapShot = function () {
        var data = context.getImageData(0, 0, canvas.width, canvas.height);
        backContext.putImageData(data, 0, 0);
    },
    drawBackDrop = function () {
        backContext.clearRect(0, 0, canvas.width, canvas.height);
        if (backDropSprite != undefined) {
            backDropSprite.prep();
            backDropSprite.display();
            takeBackGroundSnapShot();
            return true;
        }
        else if (gameWorld != undefined) {
            drawVisibleGameWorld();
            takeBackGroundSnapShot();
            return true;
        }
        else {
            return false;
        }

    },
    drawVisibleGameWorld = function () {
        if (gameWorld == undefined) {
            throw "Gameworld may not be undefined.";
        }

        if (gameWorld.Style == tc.constants.GAME_WORLD_STYLE_2D) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            backCanvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
			if (texture != undefined)
			{
				drawTexture();
			}
            draw2DWorld();
        }
        else if (gameWorld.Style == tc.constants.GAME_WORLD_STYLE_ISOMETRIC) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            backCanvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            if (texture != undefined)
			{
				drawTexture();
			}
			drawMock3DWorld();
        }
        else if (gameWorld.Style == tc.constants.GAME_WORLD_STYLE_ISOMETRIC_GRID_TEST) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            backCanvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            drawMock3DGrid();
        }
    },
	drawTexture = function(){
		var ctx = self.getMainContext();
		var ptrn = ctx.createPattern(texture, 'repeat');
		ctx.fillStyle = ptrn;
		ctx.fillRect(0,0,self.getCanvasWidth(), self.getCanvasHeight())
	},
	setUnderlayTexture = function(image)
	{
		texture = new Image();
		texture.src = image;
	},
	clearUnderlayTexture = function()
	{
		texture = undefined;
	},
    drawMock3DWorld = function () {
        //this calculates the number of cells current visible around the origin      
        var visibleCells = gameWorldModel.getAllVisibleCells();
        var totalX = Math.abs(visibleCells.startCell.x - visibleCells.endCell.x) + 1;
        var totalY = Math.abs(visibleCells.startCell.y - visibleCells.endCell.y) + 1;

        var iniX = visibleCells.startCell.x;
        var iniY = visibleCells.startCell.y;

        //we need to convert this to a position in our game world.


        var deltaX;
        var deltaY;
        if (iniX > visibleCells.endCell.x) {
            deltaX = -1;
        }
        else {
            deltaX = 1;
        }

        if (iniY > visibleCells.endCell.y) {
            deltaY = -1;
        }
        else {
            deltaY = 1;
        }

        var incX = iniX;
        var incY = iniY;
        var overlays = [];
        for (var i = 0; i <= totalX; i++) {
            for (var ii = 0; ii <= totalY; ii++) {

                //convert to world cell to get the correct sprite
                var worldCellPos = gameWorldModel.getWorldCellFromVisibleCell(incX, incY);

                //cells that live outside of the game area do not exist really so don't attempt to draw them.
                //todo: at some point, we'll have to enforce this in the world editor.
                if (worldCellPos.x > 0 && worldCellPos.y > 0 && worldCellPos.x < gameWorld.x && worldCellPos.y < gameWorld.y) {
                    //get the cell from the gameworld data
                    var cell = gameWorld.Cells[worldCellPos.x][worldCellPos.y];
                    if (cell != undefined) {
                        if (cell.Type == tc.constants.GAME_WORLD_CELL_UNDERLAY) {
                            var cellSprite = cell.Sprite;
                            if (cellSprite != undefined) {
                                                                              //we also need to calculate the draw position of this cell's sprite. 
                                                                              var cellDrawPoints = gameWorldModel.placeSpriteInCenterOfWorldCell(worldCellPos.x, worldCellPos.y, cellSprite);
                                                                              cellSprite.setFrame(cell.Frame);                               
                                                                              cellSprite.prep();
                                                                              cellSprite.display();
                                                                          
                                                                          }
                        }
                        else {
                            overlays.push(cell);
                        }
                    }

                }
                incY = incY + deltaY;
            }
            incX = incX + deltaX;
            incY = iniY;
        }

        overlayArray = []; //create a new
        for (var i = 0; i < overlays.length; i++) {
            var cell = overlays[i];
            var cellSprite = cell.Sprite;
            if (cellSprite != undefined) {
                cellSprite.setSpriteType(tc.constants.GAME_WORLD_CELL_OVERLAY);
                gameWorldModel.placeSpriteInCenterOfWorldCell(cell.x, cell.y, cellSprite);
                cellSprite.setFrame(cell.Frame);
                cellSprite.prep();
                cellSprite.display();
                overlayArray.push(cellSprite);

            }
        }

        makeOverLayMap();


    },
	addImage = function(file, callback){
		//check to see if this image has been created
		var image = gameImages[file];
		if (image==undefined)
		{
			image = new Image();
            image.onload = callback;
            image.src = file;
			gameImages[file] = image;
		}
		
		return image;	
	},
	addSound = function(file, callback){
		//check to see if this image has been created
		var sound = gameSounds[file];
		if (sound ==undefined)
		{
			sound = new Audio();
            sound.onload = callback;
            sound.src = file;
			gameSounds[file] = sound;
		}	
		return sound;	
	},
    getOverLayMap = function () {
        return overlayMap;
    },
    makeOverLayMap = function () {
        overlayArray.sort(Sort); //sort overlays once
        overlayMap = new Object();
        //todo: write unit test to support collision structure 
        //todo: debug overlay z-order issue
        //build background collision structure
        for (var i = 0; i < overlayArray.length; i++) {
            var mySprite = overlayArray[i];
            for (var ii = 0; ii < overlayArray.length; ii++) {
                if (i != ii) {
                    if (mySprite.name != overlayArray[ii].name) {
                        var result = CheckCollision(mySprite, overlayArray[ii]);
                        if (result) {
                            //if we have overlapping sprites, build our map
                            if (overlayMap[mySprite.name] == undefined) {
                                overlayMap[mySprite.name] = [];
                            }
                            if (overlayMap[mySprite.name].indexOf(overlayArray[ii]) == -1) {
                                overlayMap[mySprite.name].push(overlayArray[ii]);
                            }
                        }
                    }
                }
            }
        }
    },
    drawMock3DGrid = function () {
        var visibleCells = gameWorldModel.getAllVisibleCells();
        var totalX = Math.abs(visibleCells.startCell.x - visibleCells.endCell.x) + 1;
        var totalY = Math.abs(visibleCells.startCell.y - visibleCells.endCell.y) + 1;
        var iniX = visibleCells.startCell.x;
        var iniY = visibleCells.startCell.y;
        var deltaX;
        var deltaY;
        if (iniX > visibleCells.endCell.x) {
            deltaX = -1;
        }
        else {
            deltaX = 1;
        }

        if (iniY > visibleCells.endCell.y) {
            deltaY = -1;
        }
        else {
            deltaY = 1;
        }

        var incX = iniX;
        var incY = iniY;

        for (var i = 0; i <= totalX; i++) {
            for (var ii = 0; ii <= totalY; ii++) {
                //todo: implement draw with sprite
                var worldCell = gameWorldModel.getWorldCellFromVisibleCell(incX, incY);
                if (gameWorld.Cells[worldCell.x] != undefined) {
                    if (gameWorld.Cells[worldCell.x][worldCell.y] != undefined) {
                        if (gameWorld.Cells[worldCell.x][worldCell.y].BlockType != tc.constants.GAME_WORLD_CELL_OPEN) {
                            this.drawIsoCellBorders(incX, incY, true);
                        }
                        else {
                            this.drawIsoCellBorders(incX, incY, false);
                        }
                    }
                }
                incY = incY + deltaY;
            }
            incX = incX + deltaX;
            incY = iniY;
        }
    },
    drawIsoCellBorders = function (cellX, cellY, fill) {

        var cellPoints = gameWorldModel.getCellBoundaries(cellX, cellY);
        context.beginPath();
        context.strokeStyle = "gray";
        context.moveTo(cellPoints.point1.x, cellPoints.point1.y);
        context.lineTo(cellPoints.point2.x, cellPoints.point2.y);
        context.lineTo(cellPoints.point3.x, cellPoints.point3.y);
        context.lineTo(cellPoints.point4.x, cellPoints.point4.y);
        context.lineTo(cellPoints.point1.x, cellPoints.point1.y);

        if (fill) {
            context.fill();
        }
        else {
            context.stroke();
        }
        context.closePath();

    }
    draw2DWorld = function () {

        //determine the number of cells that can occupy the current visible port.
        var cellsAcross = Math.round(canvas.width / gameWorld.CellWidth);
        var cellsDown = Math.round(canvas.height / gameWorld.CellHeight);

        //now determine where the camera is and draw the cells around it. Assume the camera
        //is the center of the view port (the canvas)
        var startXCell = Math.round(cameraXCell - (cellsAcross / 2));
        var startYCell = Math.round(cameraYCell - (cellsDown / 2));

        if (startXCell < 0) {
            startXCell = 0;
        }
        if (startYCell < 0) {
            startYCell = 0;
        }
        if (startXCell > gameWorld.x) {
            startXCell = gameWorld.x;
        }

        if (startYCell > gameWorld.y) {
            startYCell = gameWorld.y;
        }


        var cellxPos = 0;
        var cellyPos = 0;
        var cellWidth = gameWorld.CellWidth;
        var cellHeight = gameWorld.CellHeight;
        var cells = gameWorld.Cells;

        for (var i = startXCell; i < startXCell + cellsAcross; i++) {
            for (var ii = startYCell; ii < startYCell + cellsDown; ii++) {
                var cell = cells[i];
                if (cell != undefined) {
                    cell = cell[ii];
                    if (cell != undefined) {
                        //if sprite is not undefined,
                        var cellSprite = cell.Sprite;
                        if (cellSprite != undefined) {
                            //draw sprite
                            var pos = gameWorldModel.getGameCellXY(i, ii);
                            cellSprite.setTop(pos.y);
                            cellSprite.setLeft(pos.x);
                            cellSprite.setFrame(cell.Frame);
                            cellSprite.prep();
                            cellSprite.display();
                        }
                    }
                    else {
                        context.clearRect(cellxPos, cellyPos, cellWidth, cellHeight);
                    }

                }
            }
        }
    };

    Engine.prototype = {
		gameEvents:tc.constants.gameEvents,
		setCamera: function (x, y) {
            sceneBackDropDrawn = false;
            
            cameraXCell = Math.floor(x);
            cameraYCell = Math.floor(y);
            if (gameWorldModel == null) {
                throw "using the camera without setting a gameworld is not supported.";
            }
            gameWorldModel.update(cameraXCell, cameraYCell, canvas.width, canvas.height);
        },
        allowMove: function (x, y, type, speed, sprite) {
            var buffer = 10;
            speed += buffer;
            if (sprite == undefined) {
                throw "Critical error, allowMove requires a sprite to check.";
            }

            if (sprite.getWidth == undefined) {
                if (sprite.sprite == undefined) {
                    throw "Critical error, allowMove requires that the caller is a sprite or contains a sprite.";
                }
                sprite = sprite.sprite;
            }

            //if the world isn't defined, it's open movement
            if (gameWorld == undefined) {
                return true;
            }

            //on the otherhand, if it is defined, then we need to check if the cell we're about the move into is an artifact
            //if it is, we block this move. 
            var cell;
            var cell2;
            var cell3; //only used in iso
            if (gameWorld.Style == tc.constants.GAME_WORLD_STYLE_2D) {
                //get the current cell based on the x,y of the sprite moving

                if (type == "right") {
                    cell = gameWorldModel.getGameCellAtPosition(x + speed + sprite.getWidth(), y);
                }

                if (type == "left") {
                    cell = gameWorldModel.getGameCellAtPosition(x - speed, y);
                }

                if (type == "up") {
                    cell = gameWorldModel.getGameCellAtPosition(x, y - speed);
                    cell2 = gameWorldModel.getGameCellAtPosition(x + sprite.getWidth(), y - speed);

                }

                if (type == "down") {
                    cell = gameWorldModel.getGameCellAtPosition(x, y + speed + sprite.getHeight());
                    cell2 = gameWorldModel.getGameCellAtPosition(x + sprite.getWidth(), y + speed + sprite.getHeight());
                }

                return this.checkCell(cell) && this.checkCell(cell2);

            }
            else {  //other styles are isometric, do the same calculations using the isometric game model


                if (type == "right") {

                    cell = gameWorldModel.getWorldCellFromScreenCoord(x + speed + sprite.getWidth(), sprite.absoluteBottom());
                    cell2 = gameWorldModel.getWorldCellFromScreenCoord(x + speed, sprite.absoluteBottom());
                    cell3 = gameWorldModel.getWorldCellFromScreenCoord(x + speed + sprite.getWidth() / 2, sprite.absoluteBottom());
                }

                if (type == "left") {

                    cell = gameWorldModel.getWorldCellFromScreenCoord(x - speed, sprite.absoluteBottom());
                    cell2 = gameWorldModel.getWorldCellFromScreenCoord((x - speed) + sprite.getWidth(), sprite.absoluteBottom());
                    cell3 = gameWorldModel.getWorldCellFromScreenCoord((x - speed) + sprite.getWidth() / 2, sprite.absoluteBottom());
                }

                if (type == "up") {

                    cell = gameWorldModel.getWorldCellFromScreenCoord(x, sprite.absoluteBottom() - speed);
                    cell2 = gameWorldModel.getWorldCellFromScreenCoord(x + sprite.getWidth(), sprite.absoluteBottom() - speed);
                    cell3 = gameWorldModel.getWorldCellFromScreenCoord(x + sprite.getWidth() / 2, sprite.absoluteBottom() - speed);

                }

                if (type == "down") {

                    cell = gameWorldModel.getWorldCellFromScreenCoord(x, sprite.absoluteBottom() + speed);
                    cell2 = gameWorldModel.getWorldCellFromScreenCoord(x + sprite.getWidth(), sprite.absoluteBottom() + speed);
                    cell3 = gameWorldModel.getWorldCellFromScreenCoord(x + sprite.getWidth() / 2, sprite.absoluteBottom() + speed);
                }


                return this.checkCell(cell) && this.checkCell(cell2) && this.checkCell(cell3);

            }

        },
        checkCell: function (cell) {

            if (cell == undefined) {
                return true; //if the cell doesn't exist, all the move
            }

            //if it's an artifact block the move
            if (cell.x < 0 || cell.y < 0) {
                return;
            }

            if (gameWorld.Style == tc.constants.GAME_WORLD_STYLE_2D) {
                cell = gameWorld.Cells[cell.x][cell.y];
            }
            else {
                cell = gameWorld.Cells[cell.x][cell.y];
            }


            if (cell == undefined) {
                return true; //if the cell doesn't exist, all the move
            }

            //if the cell does exist, check if it is an artifact
            if (cell.BlockType == tc.constants.GAME_WORLD_CELL_BLOCK) {
                return false; //block
            }

            return true;

        },
        adjustCameraX: function (x) {
            sceneBackDropDrawn = false;
            cameraXCell += x;
            if (gameWorldModel == null) {
                throw "using the camera without setting a gameworld is not supported.";
            }
            gameWorldModel.update(cameraXCell, cameraYCell, canvas.width, canvas.height);
        },
        adjustCameraY: function (y) {
            sceneBackDropDrawn = false;
            cameraYCell += y;
            if (gameWorldModel == null) {
                throw "using the camera without setting a gameworld is not supported.";
            }
            gameWorldModel.update(cameraXCell, cameraYCell, canvas.width, canvas.height);
        },
        adjustOrigin: function (directional, speed, exception) {
            this.adjustSpritesToOrigin(directional, speed, exception);
            if (directional == "x") {
                gameWorldModel.setOriginX(gameWorldModel.getOriginX() + speed);
            }
            if (directional == "y") {
                gameWorldModel.setOriginY(gameWorldModel.getOriginY() + speed);
            }
            sceneBackDropDrawn = false;
        },
        setOriginX: function (val) {
            gameWorldModel.setOriginX(val);
            sceneBackDropDrawn = false;
        },
        setOriginY: function (val) {
            gameWorldModel.setOriginY(val);
            sceneBackDropDrawn = false;
        },
        getOriginX: function () {
            return gameWorldModel.originX;
        },
        getOriginY: function () {
            return gameWorldModel.originY;
        },
        animateCameraX: function (x, speed) {
            if (currentXMovement != undefined) {
                clearInterval(currentXMovement.id);
            }

            currentXMovement =
    		{
    		    cellDistance: Math.abs(x),
    		    pixelDistance: Math.abs(x) * gameWorld.CellWidth,
    		    direction: x / Math.abs(x),
    		    speed: speed,
    		    interval: 10,
    		    id: 0,
    		    counter: 0,
    		    engine: this
    		};

            currentXMovement.id = setInterval(function () {
                //if the movement is not done
                if (currentXMovement.counter < currentXMovement.pixelDistance) {
                    //increment the counter
                    currentXMovement.counter++;
                    //check if we've moved the distance of a cell                    
                    var originMod = currentXMovement.direction * currentXMovement.speed;
                    currentXMovement.engine.adjustSpritesToOrigin("x", originMod);
                    gameWorldModel.setOriginX(gameWorldModel.getOriginX() + originMod);
                    sceneBackDropDrawn = false;

                    //adjust sprites to origin
                    currentXMovement.engine.adjustSpritesToOrigin();

                }
                else {
                    clearInterval(currentXMovement.id);
                }
            }, currentXMovement.interval);
        },
        animateCameraY: function (y, speed) {

            if (currentYMovement != undefined) {
                clearInterval(currentYMovement.id);
            }

            currentYMovement =
    		{
    		    cellDistance: Math.abs(y),
    		    pixelDistance: Math.abs(y) * gameWorld.CellHeight,
    		    direction: y / Math.abs(y),
    		    interval: 10,
    		    speed: speed,
    		    id: 0,
    		    counter: 0,
    		    engine: this
    		};

            currentYMovement.id = setInterval(function () {
                //if the movement is not done
                if (currentYMovement.counter < currentYMovement.pixelDistance) {
                    //increment the counter
                    currentYMovement.counter++;
                    //check if we've moved the distance of a cell
                    var originMod = currentYMovement.direction * currentYMovement.speed;
                    currentYMovement.engine.adjustSpritesToOrigin("y", originMod);
                    gameWorldModel.setOriginY(gameWorldModel.getOriginY() + originMod);
                    sceneBackDropDrawn = false;

                }
                else {
                    clearInterval(currentYMovement.id);
                }
            }, currentYMovement.interval);
        },
        adjustSpritesToOrigin: function (directional, modification, exception) {
            //todo: exlude current player
            var oldOriginY = gameWorldModel.getOriginY();
            var oldOriginX = gameWorldModel.getOriginX();
            var newOriginY = gameWorldModel.getOriginY() + modification;
            var newOriginX = gameWorldModel.getOriginX() + modification;
            var diffX = newOriginX - oldOriginX;
            var diffY = newOriginY - oldOriginY;
            for (var obj in spriteArray) {
                if (spriteArray[obj] != exception && ignoreShift.indexOf(spriteArray[obj]) == -1) {
                    if (directional == "y") {
                        spriteArray[obj].setTop(spriteArray[obj].getTop() + diffY);
                    }

                    if (directional == "x") {
                        spriteArray[obj].setLeft(spriteArray[obj].getLeft() + diffX);
                    }
                }
            }



        },
        setWorld: function (world) {
            gameWorld = world;
            if (gameWorld.Style == tc.constants.GAME_WORLD_STYLE_2D) {
                gameWorldModel = new GameWorldModel2D(world, cameraXCell, cameraYCell, this.getCanvasWidth(), this.getCanvasHeight());
            }
            else if (gameWorld.Style == tc.constants.GAME_WORLD_STYLE_ISOMETRIC) {
                gameWorldModel = new GameWorldModelIso(world, cameraXCell, cameraYCell, this.getCanvasWidth(), this.getCanvasHeight());
            }
            else if (gameWorld.Style == tc.constants.GAME_WORLD_STYLE_ISOMETRIC_GRID_TEST) {
                gameWorldModel = new GameWorldModelIso(world, cameraXCell, cameraYCell, this.getCanvasWidth(), this.getCanvasHeight());
            }
            else {
                throw "Gameworld must have a known style type, 2d or isometric.";
            }

            //after setting the gameworld, all overlay sprites need to be pulled into another array

            sceneBackDropDrawn = false;
        },
        getWorld: function () {
            return gameWorld;
        },
        getWorldModel: function () {
            return gameWorldModel; //
        },
        markBackDropRedraw: function () {
            sceneBackDropDrawn = false;
        },
        pushEvent: function (val) {
            eventHandler(val);
        },
        setCollisionHandler: function (val) {
            collisionHandler = val;
        },
        setBackDrop: function (val) {
            sceneBackDropDrawn = false;
            if (val != undefined) {
                val.setSpriteType("backdrop");
            }
            backDropSprite = val;
        },
        getBackContextWidth: function () {
            return backCanvas.width;
        },
        getBackContextHeight: function () {
            return backCanvas.height;
        },
        getCanvasWidth: function () {
            return canvas.width;
        },
        getCanvasHeight: function () {
            return canvas.height;
        },
        removeSprite: function (inName, callBack) {

            //mark the sprite for removal
            var tempSprite = sprites[inName];
            if (tempSprite == undefined) {
                return;
            }
            sprites[inName].removeMe = true;
            sprites[inName].removalCallback = callBack;
        },
        defineSprite: function (sprite) {
            if (sprite == undefined) {
                throw "sprites must not be undefined.";
            }
            if (sprites[sprite.name] != undefined) {
                return; //remove sprite first? maybe throw an exception here?
            }
            spriteArray.push(sprite);
            sprites[sprite.name] = sprite;
        },
        getSprites: function () {
            return sprites;
        },
        clear: function () {
            this.getMainContext().clearRect(0, 0, canvas.width, canvas.height);
            this.getBackContext().clearRect(0, 0, canvas.width, canvas.height);
            behaviors = [];
            eventQ = [];
            sprites = new Object();
            spriteArray = [];
            overlayArray = [];
            overlayRedrawArray = [];

        },
        getSprite: function (inName) {
            return sprites[inName];
        },
        CheckEventPosition: function (eventX, eventY) {
            return innerCheckEventPosition(eventX, eventY);
        },
        setGameLoopHook: function (loopHook) {
            gameLoopHook = loopHook;
        },
        modEventBehavior: function (eventName, eventData, sprite, animationName, actionClass, actionPlayCount) {
            var eventBehaviors = getBehaviorsForEvent(eventName);

            //if there are behaviors for this event - 
            if (eventBehaviors != null) {
                //loop through the behaviors
                for (var i = 0; i < eventBehaviors.length; i++) {
                    if (eventBehaviors[i].eventData == eventData) //if the meta code matches - replace the event
                    {
                        behaviors[eventName][i] = {
                            eventData: eventData,
                            sprite: sprite,
                            animation: animationName,
                            actionClass: actionClass,
                            actionPlayCount: actionPlayCount
                        };
                        break; //found it.
                    }

                }
            }
        },
        removeEventBehavior: function (eventName, sprite) {
            if (sprite == null) {
                behaviors[eventName] = null;
            }
            else {
                var eventBehaviors = getBehaviorsForEvent(eventName);
                if (eventBehaviors == null) return; //no mappings
                for (var i = 0; i < eventBehaviors.length; i++) {
                    //get a specific behavior from the list of behaviors
                    var behavior = eventBehaviors[i];
                    if (behavior.sprite == sprite) {  //my sprite equals the sprite in question
                        //remove
                        behaviors[eventName].splice(i,1);
                    }
                }
            }
        },
        addEventBehavior: function (eventName, eventData, sprite, animationName, actionClass, actionPlayCount) {

            if (behaviors[eventName] == null) {
                behaviors[eventName] = [];
            }

            if (actionPlayCount == undefined) {
                actionPlayCount = 1;
            }

            var eventNameEntries = behaviors[eventName].length;
            behaviors[eventName][eventNameEntries] = {
                eventData: eventData,
                sprite: sprite,
                animation: animationName,
                actionClass: actionClass,
                actionPlayCount: actionPlayCount,
                actionPlayed: 0
            };
        },
        getMainContext: function () {
            return canvas.getContext("2d");
        },

        getBackContext: function () {
            return backCanvas.getContext("2d");
        },
        stop: function () {
            clearInterval(intervalId);
        },                       
        play: function () {
            idleEvent = new GameEvent(tc.constants.gameEvents.Idle, "");
            eventHandler(TranslateUIEventToGameEvent(idleEvent));
            //intervalId = setInterval(this.gameLoop, 15);

			requestAnimFrame(self.gameLoop);

            if (frameDebug == true) {
                canvas.textBaseline = "top";
                canvas.font = "bold 12px sans-serif";
                setInterval(this.updateFrameCountDiv, 15);
            }
        },
        
        wireArrowScan: function(modCallback)
        {
	    if (this.scanMovement == undefined)
	    {
	    	this.scanMovement = {};
	    	
	    	var origUpSpeed = 10;
		var origDownSpeed= -10;
		var origLeftSpeed = 10;
	    	var origRightSpeed = -10;
	    	var maxVelocity = 80;
	    	
	    	var upSpeed = origUpSpeed;
	    	var downSpeed= origDownSpeed;
	    	var leftSpeed = origLeftSpeed;
	    	var rightSpeed = origRightSpeed;
	    	
	    	var up = new RepeatingAction(	function(){ ga.adjustOrigin("y", upSpeed, undefined);},
	    	function(){ if (upSpeed < maxVelocity) upSpeed *= 2; },
	    	function(){ upSpeed = origUpSpeed; },
	    	3,100);
	    	
	    	var down = new RepeatingAction(	function(){ ga.adjustOrigin("y", downSpeed, undefined);},
	    	function(){ if (downSpeed > (maxVelocity*-1)) downSpeed *= 2; },
	    	function(){ downSpeed = origDownSpeed; },
	    	3,100);
	    	
	    	var left = new RepeatingAction(	function(){ ga.adjustOrigin("x", leftSpeed, undefined);},
	    	function(){ if (leftSpeed < maxVelocity) leftSpeed *= 2; },
	    	function(){ leftSpeed = origLeftSpeed; },
	    	3,100);
	    	
	    	var right = new RepeatingAction(function(){ ga.adjustOrigin("x", rightSpeed, undefined);},
	    	function(){ if (rightSpeed > (maxVelocity*-1)) rightSpeed *= 2; },
	    	function(){ rightSpeed = origRightSpeed; },
	    	3,100);
	    	
	    	this.scanMovement["up"] = up;
	    	this.scanMovement["down"] = down;
	    	this.scanMovement["left"] = left;
	    	this.scanMovement["right"] = right;
	    }
	    
	    var self = this;
	    //KeyDown
	    this.addEventBehavior(tc.constants.gameEvents.KeyDown, UPARROW, undefined, undefined, function (e) {
		self.scanMovement["up"].start();
		self.scanMovement["down"].stop();
		self.scanMovement["left"].stop();
		self.scanMovement["right"].stop();
		modCallback();
	    });

	    this.addEventBehavior(tc.constants.gameEvents.KeyDown, RIGHTARROW, undefined, undefined, function (e) {
		self.scanMovement["up"].stop();
		self.scanMovement["down"].stop();
		self.scanMovement["left"].stop();
		self.scanMovement["right"].start();
		modCallback();
	    });

	    this.addEventBehavior(tc.constants.gameEvents.KeyDown, DOWNARROW, undefined, undefined, function (e) {		
		self.scanMovement["up"].stop();
		self.scanMovement["down"].start();
		self.scanMovement["left"].stop();
		self.scanMovement["right"].stop();
		modCallback();
	    });


	    this.addEventBehavior(tc.constants.gameEvents.KeyDown, LEFTARROW, undefined, undefined, function (e) {
		self.scanMovement["up"].stop();
		self.scanMovement["down"].stop();
		self.scanMovement["left"].start();
		self.scanMovement["right"].stop();
		modCallback();
	    });

	    
	    //KeyUp
	    this.addEventBehavior(tc.constants.gameEvents.KeyUp, UPARROW, undefined, undefined, function (e) {
		self.scanMovement["up"].stop();	    
		modCallback();
	    });
	    this.addEventBehavior(tc.constants.gameEvents.KeyUp, RIGHTARROW, undefined, undefined, function (e) {
		self.scanMovement["right"].stop();	    
		modCallback();
	    });
	    this.addEventBehavior(tc.constants.gameEvents.KeyUp, DOWNARROW, undefined, undefined, function (e) {		
		self.scanMovement["down"].stop();	    
		modCallback();
	    });
	   
	    this.addEventBehavior(tc.constants.gameEvents.KeyUp, LEFTARROW, undefined, undefined, function (e) {
		self.scanMovement["left"].stop();	    
		modCallback();
	    });
	    
	    
        
        },
        updateFrameCountDiv: function () {
            if (document.getElementById("frameDebug") != undefined) {
                document.getElementById("frameDebug").innerText = frameMessage;
            }
        },
        clearCurrentEvent: function () {
            innerClearCurrentEvent();
        },
        gameLoop: function () {

            if (frameDebug == true) {
                if (startTime == null) {
                    startTime = new Date();
                }
                frameCount++;

                if (frameCount >= 25) {
                    endTime = new Date();
                    var time = ((endTime.getTime() - startTime.getTime()) / 1000);
                    frameMessage = frameCount / time + " frames per second";
                    startTime = null;
                    frameCount = 0;
                }
            }

	    if (gameLoopHook!=undefined)
	    {
	    	gameLoopHook();
	    }

            if (!sceneBackDropDrawn) {
                sceneBackDropDrawn = drawBackDrop();
            }

            if (loopHook != undefined) {
                loopHook();
            }

            if (this.firstrun == undefined) {
                Draw();
                this.firstrun = true;
            }

            var foundSequenceForEvent = HandleUserInputActions();

            //loop through all sprites
            //clear the rects for all sprites
            //restore the background for all sprites
            //sort sprites by absoluteTop (lowest first)
            //draw all sprites - using backdrop as background


            if (!foundSequenceForEvent) {
                //if we didn't find a sequence, return to idle state
                currentEvent = idleEvent;
            }

            HandleNpcActions();

            //check for border and sprite collisions collision - create a border collision 
            //loop through sprites, check if any are border collided
            var tempArray = spriteArray.concat(overlayArray);
            var normalSpriteCollide = false;
            overlayRedrawArray = [];
            for (var i = 0; i < tempArray.length; i++) {
                var mySprite = tempArray[i];

                //check for collisions only if this isn't a background sprite - but we will still check for collisions with background
                //sprites, because in some cases they'll require redraw - mock3d and isometeric
                if (mySprite.getSpriteType() != tc.constants.GAME_WORLD_CELL_OVERLAY) {
                    //check if the sprite is at a give border, if so raise a border collision event.
                    CheckBorders(mySprite);

                    //check if the sprite is colliding with any other sprite - this includes overlay background sprites which
                    //will only be drawn if invalidated.                
                    for (var ii = 0; ii < tempArray.length; ii++) {
                        if (mySprite.name != tempArray[ii].name) {
                            var result = CheckCollision(mySprite, tempArray[ii]);
                            if (result) {
                                if (tempArray[ii].getSpriteType() == tc.constants.GAME_WORLD_CELL_OVERLAY) {
                                    overlayRedrawArray.push(tempArray[ii]);
                                }

                                normalSpriteCollide = true;
                                if (collisionHandler != null && collisionHandler != undefined) {
                                    collisionHandler(mySprite, tempArray[ii]);
                                }
                            }
                        }
                    }
                }
            }

            if (!normalSpriteCollide) {
                overlayRedrawArray = []; //cl
            }

            Draw();
			requestAnimFrame(self.gameLoop);
        },
        handleChanges: function (changes) {
            //we get an array of changes from the server
            //spin through them and adjust the world accordingly
            for (var i = 0; i < chantc.constants.gameEvents.length; i++) {
                //depending on the type of change we can only handle certain actions
                var change = changes[i];
                if (change.eventType == CELL_CHANGE) {
                    this.handleCellChange(change);
                }

                if (change.eventType == ADD_SPRITE) {
                    this.handleSpriteAddition(change);
                }
            }
        },
        handleCellChange: function (change) {
            //how to handle a cell change
            //update the sprite and values based on the what is in the sprite inventory
            var spriteEntry = TCSpriteInventory[change.spriteId];
            if (spriteEntry == undefined) {
                throw "Server sprite entry: " + change.spriteId + " does not exist in this games inventory.";
            }
            else {
                //todo: Do we need to do anything special with definition?
                if (this.getLoader() == undefined) { this.setLoader(new Loader(this)); }
                this.getLoader().quickLoadSprite(spriteEntry.definition, spriteEntry.invocation, spriteEntry.prefix, this, function (sprite) {
                    //once the sprite is loaded, 
                    gameWorld.Cells[change.x][change.y].Sprite = sprite;
                    gameWorld.Cells[change.x][change.y].Type = spriteEntry.type;
                    gameWorld.Cells[change.x][change.y].BlockType = spriteEntry.blockType;
                    gameWorld.Cells[change.x][change.y].Frame = 0;
                    sceneBackDropDrawn = false;
                });
            }
        },
        handleSpriteAddition: function (change) {
            //how to handle a sprite addition
            //update the sprite and values based on the what is in the sprite inventory
            var spriteEntry = TCSpriteInventory[change.spriteId];
            if (this.getLoader() == undefined) { this.setLoader(new Loader(this)); }

            if (spriteEntry.definition != undefined) {
                this.getLoader().quickLoadSprite(spriteEntry.definition, spriteEntry.invocation, spriteEntry.prefix, this, function (sprite) {
                    //use the game model to put the sprite in the correct place
                    if (gameWorld.Style == tc.constants.GAME_WORLD_STYLE_2D) {
                        var cellPos = gameWorldModel.getGameCellXY(change.x, change.y);
                        sprite.setTop(cellPos.y);
                        sprite.setLeft(cellPos.x);
                    }
                    else //isometric
                    {
                        gameWorldModel.placeSpriteInWorldCell(change.x, change.y, sprite);
                    }

                    //set sprite attributes
                    sprite.setAttributes(spriteEntry);

                    //if this sprite is an npc, it should have a behavior
                    if (spriteEntry.behavior != undefined) {
                        this.engine.attachBehavior(spriteEntry.behavior, sprite);
                    }




                    this.engine.defineSprite(sprite);
                });
            }
            else {
                var sprite = TCSpriteFactory(spriteEntry, undefined, this, undefined);
                //set sprite attributes
                sprite.setAttributes(spriteEntry);

                //if this sprite is an npc, it should have a behavior
                if (spriteEntry.behavior != undefined) {
                    this.attachBehavior(spriteEntry.behavior, sprite);
                }

                this.defineSprite(sprite);
            }
        },
        ignoreOriginShift: function (sprite) {
            ignoreShift.push(sprite);
        },
        attachBehavior: function (behavior, sprite) {
            //load the behavior script
            loadScript(behavior.definition,
				function () {
				    //after load, invoke the class
				    var ai = eval("new " + behavior.constructor);
				    //attach the class to the sprite for npc pulse
				    engine.addEventBehavior(behavior.eventType, "", sprite, behavior.startState, ai, tc.constants.playInfinite);
				}
			);
        }
        
    };

Engine.prototype.getLoader = this.getLoader;
Engine.prototype.setLoader = this.setLoader;
Engine.prototype.CheckCollision = this.CheckCollision;
Engine.prototype.makeOverLayMap = this.makeOverLayMap;
Engine.prototype.getOverLayMap = this.getOverLayMap;
Engine.prototype.getSortedSpriteArray = this.getSortedSpriteArray;
Engine.prototype.addImage = this.addImage;
Engine.prototype.addSound = this.addSound;
Engine.prototype.setUnderlayTexture = this.setUnderlayTexture;
Engine.prototype.clearUnderlayTexture = this.clearUnderlayTexture;