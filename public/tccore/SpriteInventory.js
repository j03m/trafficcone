var USAGE_CELL = 0;
var USAGE_NPC = 1;
var USAGE_PC = 2;

var SpriteInventory = (function(){

	var defaultStates = {
	     "Death": "DT",
	     "Neutral": "NU",
	     "Walk": "WL",
	     "Run": "RN",
	     "GetHit": "GH",
	     "TownNeutral": "TN",
	     "TownWalk": "TW",
	     "Attack1": "A1",
	     "Attack2": "A2",
	     "Block": "BL",
	     "Cast": "SC",
	     "Throw": "TH",
	     "Kick": "KK",
	     "Skill1": "S1",
	     "Skill2": "S2",
	     "Skill3": "S3",
	     "Skill4": "S4",
	     "Skill5": "S4",
	     "Skill6": "S4",
	     "Skill7": "S4",
	     "Skill8": "S4",
	     "Dead": "DD",
	     "KnockBack": "GH"
	};
	var defaultParts = ["HD", "LA", "LG", "LH","RA", "RH", "SH", "TR"];
	var directions = ["North", "NorthEast", "East", "SouthEast", "South", "SouthWest", "West", "NorthWest"];
	var directionNum = [-1, -2, -3, -4, -5, -6, -7, -8];
	var inventory = {};

	//altar floor cells
	inventory["4d603af4-1199-4749-ba97-64872d597a32"] = {
	    definition: tc.constants.DOMAIN_PREFIX + "assets/Cells/Cells.js",
	    invocation: "altarCells_Sprite",
	    prefix: "altarCells",
	    type: tc.constants.GAME_WORLD_CELL_UNDERLAY,
	    blockType: tc.constants.GAME_WORLD_CELL_OPEN
	}

	//columns
	inventory["861ccffc-f797-40e1-a9de-9246545aa5d"] = {
	    usage: USAGE_CELL,
	    definition: tc.constants.DOMAIN_PREFIX + "assets/Cells/singleColumn.js",
	    invocation: "columnCell_Sprite",
	    prefix: "columnCell",
	    type: tc.constants.GAME_WORLD_CELL_OVERLAY,
	    blockType: tc.constants.GAME_WORLD_CELL_BLOCK
	}

	//zombie
	inventory["de558a04-b5df-4af4-b196-4393d732bb84"] = {
	    usage: USAGE_NPC,
	    prefix: "zombie",
	    speed: 3, //todo: Sprites should have attributes like strength, speed, weight etc
	    imagePath: tc.constants.DOMAIN_PREFIX + "assets/zombie/",
	    audioPath: tc.constants.DOMAIN_PREFIX + "assets/zombie/",
	    behavior:
		{
		    seek: "hero",
		    foundState: "attacking",
		    moveState: "walking",
		    leftGap: 10,
		    topGap: 10,
		    moveInterval: 100,
		    definition: tc.constants.DOMAIN_PREFIX + "tccore/behaviors/SpriteSeeker.js",
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
			{ row: 0, direction: tc.constants.SPRITE_DIRECTION_WEST, imageName: "zombie_0-0-0.png" },
			{ row: 0, direction: tc.constants.SPRITE_DIRECTION_NORTH_WEST, imageName: "zombie_0-0-1.png" },
			{ row: 0, direction: tc.constants.SPRITE_DIRECTION_NORTH, imageName: "zombie_0-0-2.png" },
			{ row: 0, direction: tc.constants.SPRITE_DIRECTION_NORTH_EAST, imageName: "zombie_0-0-3.png" },
			{ row: 0, direction: tc.constants.SPRITE_DIRECTION_EAST, imageName: "zombie_0-0-4.png" },
			{ row: 0, direction: tc.constants.SPRITE_DIRECTION_SOUTH_EAST, imageName: "zombie_0-0-5.png" },
			{ row: 0, direction: tc.constants.SPRITE_DIRECTION_SOUTH, imageName: "zombie_0-0-6.png" },
			{ row: 0, direction: tc.constants.SPRITE_DIRECTION_SOUTH_WEST, imageName: "zombie_0-0-7.png" }
		],

	    tileHeight: 130,
	    tileWidth: 128,
	    drawWidth: 40,
	    drawHeight: 60,
	    initialDirection: tc.constants.SPRITE_DIRECTION_SOUTH_WEST
	};

	//hero
	inventory["9e4a24cf-c760-43ec-abda-3ef2db22e2ab"] = {
	    usage: USAGE_PC,
	    prefix: "hero",
	    speed: 2,
	    imagePath: tc.constants.DOMAIN_PREFIX + "assets/hero/",
	    behavior:
		{
		    foundState: "normal",
		    moveState: "walking",
		    moveInterval: 100,
		    definition: tc.constants.DOMAIN_PREFIX + "tccore/behaviors/OriginSeeker.js",
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
			{ row: 0, direction: tc.constants.SPRITE_DIRECTION_WEST },
			{ row: 1, direction: tc.constants.SPRITE_DIRECTION_NORTH_WEST },
			{ row: 2, direction: tc.constants.SPRITE_DIRECTION_NORTH },
			{ row: 3, direction: tc.constants.SPRITE_DIRECTION_NORTH_EAST },
			{ row: 4, direction: tc.constants.SPRITE_DIRECTION_EAST },
			{ row: 5, direction: tc.constants.SPRITE_DIRECTION_SOUTH_EAST },
			{ row: 6, direction: tc.constants.SPRITE_DIRECTION_SOUTH },
			{ row: 7, direction: tc.constants.SPRITE_DIRECTION_SOUTH_WEST }
		],
	    tileHeight: 260,
	    tileWidth: 267,
	    drawWidth: 105,
	    drawHeight: 130,
	    initialDirection: tc.constants.SPRITE_DIRECTION_SOUTH_WEST,
	    chain: ["male_heavy.png", "male_longsword.png", "male_shield.png"]
	};


	inventory["fcd7e791-ebbf-49db-9466-41896e5da7c6"] = {
	    usage: USAGE_NPC,
	    definition: tc.constants.DOMAIN_PREFIX + "assets/werewolf/werewolf.js",
	    invocation: "werewolf_Sprite",
	    prefix: "werewolf"
	}

	inventory["f8652d7c-d850-45ca-a017-5af224a36962"] = {
	    usage: USAGE_NPC,
	    definition: tc.constants.DOMAIN_PREFIX + "assets/ninjaGirl/ninjaGirl.js",
	    invocation: "ninjaGirl_Sprite",
	    prefix: "ninjaGirl"
	}
	return{
			createCompositeSprite: function (engine, compositeDef, callBack) 
			{
				if (compositeDef.states == undefined)
				{
					compositeDef.states = defaultStates;
				}

				if (compositeDef.parts == undefined)
				{
					compositeDef.parts = defaultParts;
				}
	
				if(compositeDef.states.Neutral == undefined)
				{
					throw "State objects must define Neutral as a minimum state.";
				}

			    var sprite = new Sprite(compositeDef.name, compositeDef.states.Neutral, compositeDef.states.Neutral, engine);
				sprite.setup(engine);
	
				SpriteInventory.setupCompositeSprite(sprite, compositeDef);

			    sprite.setDirection(-4);
			    callBack(sprite);
			},
			setupCompositeSprite: function(sprite, compositeDef)
			{
				//create the initial folder
			    var charClass = compositeDef.characterClass; //for example AM

			  	var states = compositeDef.states;
			    var parts = compositeDef.parts;
				for (var state in states) 
				{
					var tempPath = SpriteInventory.makePath(["assets", charClass, compositeDef.movementClass, states[state]]);
					var count = 0;
					for (var i = 0; i < directions.length; i++) {
			 			var direction = directions[i];
						var actionTemp = state + direction;
						var imagePath = SpriteInventory.makePath([tc.constants.DOMAIN_PREFIX,tempPath,compositeDef.basePart,compositeDef[compositeDef.basePart],direction]) + compositeDef.imageExtension;
						var def = SpriteInventory.getDefs(compositeDef.actionDefs, compositeDef.movementClass, states[state], compositeDef.basePart, compositeDef[compositeDef.basePart], direction);
						sprite.easyDefineSequence(states[state], imagePath, def.rows, def.cols, def.frameHeight, def.frameWidth, 100, -1, undefined, undefined, directionNum[count]);
						//after def, chain all other body parts
						for (var ii = 0; ii < parts.length; ii++) {		
							var part = parts[ii];
							var partType = compositeDef[part];
							imagePath = SpriteInventory.makePath([tc.constants.DOMAIN_PREFIX,tempPath,  part, partType, direction]) + compositeDef.imageExtension;
							var subdef = SpriteInventory.getDefs(compositeDef.actionDefs, compositeDef.movementClass, states[state], part, partType, direction);
				
							//convert the definition for the chains to a sequence of frames.
							var sequence = [];
			
							var chainHeight = subdef.frameHeight;
							var chainWidth  = subdef.frameWidth;
							for (var row = 0; row < subdef.rows; row++) {
							    for (var col = 0; col < subdef.cols; col++) {
							        sequence.push(new Frame(row, col, chainHeight, chainWidth, -1));
					
							    }
							}
							sprite.chainToSequence(states[state], imagePath, directionNum[count], part, subdef, sequence);						
						}
			 			count++;
					}
				}
				sprite.setChainSortOrder(compositeDef.directionSortMap);
				return sprite;  
			},
			makePath: function (tokens)
			{
				var path = "";
				for (var i = 0; i < tokens.length; i++) {
					path += tokens[i];
					//if not last token
					if (i != tokens.length-1) { path+="/";}
		
				}
				return path;
			},
			getDefs: function (def, movementClass, action, part, type, direction)
			{
				var defaultToken = "default";
				var ary = [movementClass, action, part, type, direction];
				for(var i = 0; i<ary.length; i++)
				{
					var token = "";
					var subToken = "";
					for(var ii = 0; ii<ary.length-i; ii++)
					{
						token += ary[ii]; //form the token for the hash
						if (ii<ary.length-(i+1))
						{
							subToken+=ary[ii]; //form the sub token for the hash
						}
					}
					//finish the subtoken
					subToken+=defaultToken;
		
					if (def[token]!=undefined)
					{ 
						return SpriteInventory.checkDef(def[token]);
					}
					if (def[subToken]!=undefined)
					{ 
						return SpriteInventory.checkDef(def[subToken]);
					}
				}
	
				throw "Couldn't find a definition for: " + movementClass + " " + action + " " + part + " " + type + " " + direction;
		
			},
			checkDef: function (def)
			{
					if (def.rows == undefined && def.cols == undefined)
					{
						throw "Chain frame defs must define rows or cols"
					}
					if (def.rows == undefined) { def.rows =1;}
					if (def.cols == undefined) { def.cols =1;}
		
					return def;
			},
			TCSpriteFactory: function (spriteDef, nameOverride, engine, loadCallBack) 
			{
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

			        if (initialDirection == undefined) { initialDirection = tc.constants.SPRITE_DIRECTION_UNDEFINED; }

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
			},
			TCSpriteInventory: inventory

	}//end return;
})();




