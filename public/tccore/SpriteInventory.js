var USAGE_CELL = 0;
var USAGE_NPC = 1;
var USAGE_PC = 2;

var BEHAVIOR_SMART_SEEK = 0;

if (typeof exports !== 'undefined') {
    exports.inventory = TCSpriteInventory;
    var worldValues = require("./GameWorld");
    var constants = require("./NotConstants");
    var GAME_WORLD_STYLE_2D = worldValues.GAME_WORLD_STYLE_2D;
    var GAME_WORLD_STYLE_ISOMETRIC = worldValues.GAME_WORLD_STYLE_ISOMETRIC;
    var GAME_WORLD_STYLE_ISOMETRIC_GRID_TEST = worldValues.GAME_WORLD_STYLE_ISOMETRIC_GRID_TEST;
    var GAME_WORLD_CELL_BLOCK = worldValues.GAME_WORLD_CELL_BLOCK;
    var GAME_WORLD_CELL_UNDERLAY = worldValues.GAME_WORLD_CELL_UNDERLAY;
    var GAME_WORLD_CELL_OVERLAY = worldValues.GAME_WORLD_CELL_OVERLAY;
    var GAME_WORLD_CELL_OPEN = worldValues.GAME_WORLD_CELL_OPEN;
    var DOMAIN_PREFIX = constants.DOMAIN_PREFIX
    exports.USAGE_CELL = USAGE_CELL;
    exports.USAGE_NPC = USAGE_NPC;
    exports.USAGE_PC = USAGE_PC;
    exports.BEHAVIOR_SMART_SEEK = BEHAVIOR_SMART_SEEK;

    //todo: these should really pull from sprite, should change but sprite isn't really ready for server use :(
    var SPRITE_DIRECTION_UNDEFINED = "0";
    var SPRITE_DIRECTION_NORTH = "-1";
    var SPRITE_DIRECTION_NORTH_EAST = "-2";
    var SPRITE_DIRECTION_EAST = "-3";
    var SPRITE_DIRECTION_SOUTH_EAST = "-4";
    var SPRITE_DIRECTION_SOUTH = "-5";
    var SPRITE_DIRECTION_SOUTH_WEST = "-6";
    var SPRITE_DIRECTION_WEST = "-7";
    var SPRITE_DIRECTION_NORTH_WEST = "-8";


}

/*
var compositeDef = {
"class":"AM",
"weaponClass":"BOW",
"head":"CAP",
"torso":"HVY",
"leg":"HVY",
"rightArm":"HVY",
"leftArm":"HVY",
"rightHand":"HXB",
"leftHand":"HXB",
"shield":"BUC",
"s1":undefined
};
*/

function createCompositSprite(engine, compositeDef, callBack) {
    var sprite = new Sprite(compositeDef.name, "NU", "NU", engine);
    sprite.setup(ga);

    var states = {
//        "Death": "DT",
        "Neutral": "NU",
        "Walk": "WL",
        "Run": "RN",
        "GetHit": "GH",
        "TownNeutral": "TN",
        "TownWalk": "TW",
        "Attack1": "A1",
        //"Attack2": "A2",
        //"Block": "BL",
        "Cast": "SC",
//        "Throw": "TH",
//        "Kick": "KK",
//        "Skill1": "S1",
//        "Skill2": "S2",
//        "Skill3": "S3",
//        "Skill4": "S4",
//        "Skill5": "S4",
//        "Skill6": "S4",
//        "Skill7": "S4",
//        "Skill8": "S4",
//        "Dead": "DD",
        "KnockBack": "GH"
    };

    /*var SPRITE_DIRECTION_UNDEFINED = "0";
    var SPRITE_DIRECTION_NORTH = "-1";
    var SPRITE_DIRECTION_NORTH_EAST = "-2";
    var SPRITE_DIRECTION_EAST = "-3";
    var SPRITE_DIRECTION_SOUTH_EAST = "-4";
    var SPRITE_DIRECTION_SOUTH = "-5";
    var SPRITE_DIRECTION_SOUTH_WEST = "-6";
    var SPRITE_DIRECTION_WEST = "-7";
    var SPRITE_DIRECTION_NORTH_WEST = "-8";
    */

    var directions = ["North", "NorthEast", "East", "SouthEast", "South", "SouthWest", "West", "NorthWest"];
    var directionNum = [-1, -2, -3, -4, -5, -6, -7, -8];

    var parts = ["HD", "LA", "LG", "LH","RA", "RH", "SH"];

    //create the initial folder
    var tclass = compositeDef.tokenClass; //for example AM
    var frameDef = DOMAIN_PREFIX + "assets/" + compositeDef.tokenClass + compositeDef.weaponClass + ".js";   //for example AMBOW.js
    loadScript(frameDef, function () {

        for (var state in states) {
            var tempPath = tclass + states[state] + compositeDef.weaponClass; //For example AMA1BOW
            var action = tclass + states[state] + compositeDef.weaponClass + "TR" + compositeDef.TR; //for example: AMA1BOWTRHVYWest (amazon, attack 1, bow, torso, heavy, facing west)
            var count = 0;
            for (var i = 0; i < directions.length; i++) {
                var direction = directions[i];
                var actionTemp = action + direction;
                var imagePath = DOMAIN_PREFIX + "assets/" +
                                    tempPath + "/TR" + "/" +
                                    compositeDef.TR + "/" + direction + ".png";
                var def = eval(actionTemp);

                //function (sheetname, image, rows, cols, height, width, speed, playCount, anchor, direction) {
                sprite.easyDefineSequence(states[state], imagePath, 1, def.frames, def.frameHeight, def.frameWidth, 100, -1, undefined, undefined, directionNum[count]);

                //after def, chain all other body parts
                for (var ii = 0; ii < parts.length; ii++) {

                    var part = parts[ii];
                    var partDef = compositeDef[part];
                    imagePath = DOMAIN_PREFIX + "assets/" +
                                    tempPath + "/" + part + "/" + partDef
                                    + "/" + direction + ".png";
                    
                    //function (sheetname, image, direction, spritePart, partsDef)
                    var subaction = tclass + states[state] + compositeDef.weaponClass + part + compositeDef[part]; //for example: AMA1BOWTRHVYWest (amazon, attack 1, bow, torso, heavy, facing west)
                    var subdef = eval(subaction + direction);
                    sprite.chainToSequence(states[state], imagePath, directionNum[count], part, subdef);
                }

                count++;
            }

        }
        sprite.setDirection(-4);
        callBack(sprite);
    });

    

}

//creates a sprite from a template
function TCSpriteFactory(spriteDef, nameOverride, engine, loadCallBack) {
    var name = nameOverride;
    if (nameOverride == undefined) {
        name = spriteDef.prefix;
    }

    if (engine == undefined) { throw "All sprites require a reference to the engine."; }
    if (spriteDef == undefined) { throw "Factory requires a sprite definition."; }
    if (name == undefined) { throw "Your sprite def should define a prefix, or you should provide a name override."; }

    if (spriteDef.definition == undefined) {

        if (spriteDef.neutralState == undefined) { throw "SpriteDef template must defined neutral state"; }
        if (spriteDef.states == undefined) { throw "A sprite def should have states defined. "; }
        if (spriteDef.rowDirectionMap == undefined) { throw "A sprite should have a row direction map."; }

        //grab some variables so we're not tracing the graph.
        var states = spriteDef.states;
        var tileWidth = spriteDef.tileWidth;
        var tileHeight = spriteDef.tileHeight;
        var imagePath = spriteDef.imagePath;
        var audioPath = spriteDef.audioPath;
        var initialDirection = spriteDef.initialDirection;

        if (initialDirection == undefined) { initialDirection = SPRITE_DIRECTION_UNDEFINED; }

        //create a new sprite       
        var sprite = new Sprite(name, spriteDef.neutralState, spriteDef.neutralState, loadCallBack, engine);

        //define animation sequences as defined by the spritedefinition template
        for (var state in states) {
            state = states[state];

            //Each cardinal isometric direction can have it's own animation sequence.
            for (var row in spriteDef.rowDirectionMap) {
                direction = spriteDef.rowDirectionMap[row];
                var sequence = [];
                var start = state.columnRange.start;
                var end = state.columnRange.end;
                if (start != end) {
                    //create the frames
                    for (var i = start; i < end; i++) {
                        sequence.push(new Frame(direction.row, i, tileHeight, tileWidth, state.speed));
                    }
                }
                else {
                    sequence.push(new Frame(direction.row, 0, tileHeight, tileWidth, state.speed));
                }

                var imageName;

                //an image name can be defined by the state, or the row (depending on how you break up your image, or not)
                //if we defined it by state, use that
                if (state.imageName != undefined) {
                    imageName = state.imageName;
                } //otherwise we needed to have defined it in the row direction map - if we didn't it an error
                else if (direction.imageName != undefined) {
                    imageName = direction.imageName;
                }
                else {
                    throw "Seem you don't have an image for this sprite defined...";
                }


                //tell the sprite about the sequence
                sprite.defineSequence(state.name, imagePath + imageName, sequence, state.playState, undefined, undefined, direction.direction);
                if (state.sound != undefined) {
                    sprite.addSound(state.name, audioPath + state.sound);
                }
            }
        }

        //set the initial direction
        sprite.setDirection(initialDirection);

        //handle image chains if the sprite has them defined.    
        var chain = spriteDef.chain;
        if (chain != undefined) //chaining is optional
        {
            for (var i = 0; i < chain.length; i++) {
                sprite.chain(imagePath + chain[i]);
            }
        }

        //set draw values
        if (spriteDef.drawWidth != undefined && spriteDef.drawHeight != undefined) {
            sprite.setInnerDrawRectOverride(spriteDef.drawWidth, spriteDef.drawHeight);
        }

        if (spriteDef.speed != undefined) {
            sprite.setSpeed(spriteDef.speed);
        }

        //set up the engine reference
        sprite.setup(engine);

        return sprite;
    }
    else {

        return eval(spriteDef.invocation + "(engine, name, loadCallBack);");

    }

}


var TCSpriteInventory = {};

//altar floor cells
TCSpriteInventory["4d603af4-1199-4749-ba97-64872d597a32"] = {
    definition: DOMAIN_PREFIX + "assets/Cells/Cells.js",
    invocation: "altarCells_Sprite",
    prefix: "altarCells",
    type: GAME_WORLD_CELL_UNDERLAY,
    blockType: GAME_WORLD_CELL_OPEN
}

//columns
TCSpriteInventory["861ccffc-f797-40e1-a9de-9246545aa5d"] = {
    usage: USAGE_CELL,
    definition: DOMAIN_PREFIX + "assets/Cells/singleColumn.js",
    invocation: "columnCell_Sprite",
    prefix: "columnCell",
    type: GAME_WORLD_CELL_OVERLAY,
    blockType: GAME_WORLD_CELL_BLOCK
}

//zombie
TCSpriteInventory["de558a04-b5df-4af4-b196-4393d732bb84"] = {
    usage: USAGE_NPC,
    prefix: "zombie",
    speed: 3, //todo: Sprites should have attributes like strength, speed, weight etc
    imagePath: DOMAIN_PREFIX + "assets/zombie/",
    audioPath: DOMAIN_PREFIX + "assets/zombie/",
    behavior:
	{
	    seek: "hero",
	    foundState: "attacking",
	    moveState: "walking",
	    leftGap: 10,
	    topGap: 10,
	    moveInterval: 100,
	    definition: DOMAIN_PREFIX + "tccore/behaviors/SpriteSeeker.js",
	    constructor: "SpriteSeeker(behavior.moveState, behavior.foundState)",
	    eventType: "NPC",
	    startState: "normal"
	},
    states:
	{
	    normal:
		{
		    name: "normal",
		    columnRange: { start: 0, end: 3 },
		    playState: -1,
		    sound: "neutral1.mp3",
		    speed: 200
		},
	    walking:
		{
		    name: "walking",
		    columnRange: { start: 4, end: 11 },
		    playState: -1,
		    sound: "neutral6.mp3",
		    speed: 200
		},
	    attacking:
		{
		    name: "attacking",
		    columnRange: { start: 12, end: 21 },
		    playState: 1,
		    sound: "attack6.mp3",
		    speed: 100
		},
	    hit:
		{
		    name: "hit",
		    columnRange: { start: 21, end: 24 },
		    playState: 1,
		    sound: "gethit1.mp3",
		    speed: 300
		},
	    headsplode:
		{
		    name: "headsplode",
		    sound: "death2.mp3",
		    columnRange: { start: 30, end: 37 },
		    playState: 1,
		    speed: 300
		},
	    dead:
		{
		    name: "dead",
		    sound: "death2.mp3",
		    columnRange: { start: 24, end: 29 },
		    playState: 1,
		    speed: 300
		}
	},
    neutralState: "normal",
    rowDirectionMap:
	[
		{ row: 0, direction: SPRITE_DIRECTION_WEST, imageName: "zombie_0-0-0.png" },
		{ row: 0, direction: SPRITE_DIRECTION_NORTH_WEST, imageName: "zombie_0-0-1.png" },
		{ row: 0, direction: SPRITE_DIRECTION_NORTH, imageName: "zombie_0-0-2.png" },
		{ row: 0, direction: SPRITE_DIRECTION_NORTH_EAST, imageName: "zombie_0-0-3.png" },
		{ row: 0, direction: SPRITE_DIRECTION_EAST, imageName: "zombie_0-0-4.png" },
		{ row: 0, direction: SPRITE_DIRECTION_SOUTH_EAST, imageName: "zombie_0-0-5.png" },
		{ row: 0, direction: SPRITE_DIRECTION_SOUTH, imageName: "zombie_0-0-6.png" },
		{ row: 0, direction: SPRITE_DIRECTION_SOUTH_WEST, imageName: "zombie_0-0-7.png" }
	],

    tileHeight: 130,
    tileWidth: 128,
    drawWidth: 40,
    drawHeight: 60,
    initialDirection: SPRITE_DIRECTION_SOUTH_WEST
};

//hero
TCSpriteInventory["9e4a24cf-c760-43ec-abda-3ef2db22e2ab"] = {
    usage: USAGE_PC,
    prefix: "hero",
    speed: 2,
    imagePath: DOMAIN_PREFIX + "assets/hero/",
    behavior:
	{
	    foundState: "normal",
	    moveState: "walking",
	    moveInterval: 100,
	    definition: DOMAIN_PREFIX + "tccore/behaviors/OriginSeeker.js",
	    constructor: "OriginSeeker(behavior.moveState, behavior.foundState)",
	    eventType: "mousedown",
	    startState: "normal"
	},
    states:
	{
	    normal:
		{
		    name: "normal",
		    columnRange: { start: 0, end: 0 },
		    imageName: "male_base.png",
		    playState: -1,
		    speed: 200
		},
	    walking:
		{
		    name: "walking",
		    columnRange: { start: 0, end: 4 },
		    imageName: "male_base.png",
		    playState: 1,
		    speed: 200
		},
	    attacking:
		{
		    name: "attacking",
		    columnRange: { start: 4, end: 6 },
		    imageName: "male_base.png",
		    playState: 1,
		    speed: 100
		},
	    bow:
		{
		    name: "bow",
		    columnRange: { start: 5, end: 5 },
		    imageName: "male_base.png",
		    playState: 1,
		    speed: 100
		},
	    hit:
		{
		    name: "hit",
		    columnRange: { start: 6, end: 6 },
		    imageName: "male_base.png",
		    playState: 1,
		    speed: 100
		},
	    dead:
		{
		    name: "dead",
		    columnRange: { start: 7, end: 7 },
		    imageName: "male_base.png",
		    playState: -1,
		    speed: 300
		}
	},
    neutralState: "normal",
    rowDirectionMap:
	[
		{ row: 0, direction: SPRITE_DIRECTION_WEST },
		{ row: 1, direction: SPRITE_DIRECTION_NORTH_WEST },
		{ row: 2, direction: SPRITE_DIRECTION_NORTH },
		{ row: 3, direction: SPRITE_DIRECTION_NORTH_EAST },
		{ row: 4, direction: SPRITE_DIRECTION_EAST },
		{ row: 5, direction: SPRITE_DIRECTION_SOUTH_EAST },
		{ row: 6, direction: SPRITE_DIRECTION_SOUTH },
		{ row: 7, direction: SPRITE_DIRECTION_SOUTH_WEST }
	],
    tileHeight: 260,
    tileWidth: 267,
    drawWidth: 105,
    drawHeight: 130,
    initialDirection: SPRITE_DIRECTION_SOUTH_WEST,
    chain: ["male_heavy.png", "male_longsword.png", "male_shield.png"]
};


TCSpriteInventory["fcd7e791-ebbf-49db-9466-41896e5da7c6"] = {
    usage: USAGE_NPC,
    definition: DOMAIN_PREFIX + "assets/werewolf/werewolf.js",
    invocation: "werewolf_Sprite",
    prefix: "werewolf"
}

TCSpriteInventory["f8652d7c-d850-45ca-a017-5af224a36962"] = {
    usage: USAGE_NPC,
    definition: DOMAIN_PREFIX + "assets/ninjaGirl/ninjaGirl.js",
    invocation: "ninjaGirl_Sprite",
    prefix: "ninjaGirl"
}


