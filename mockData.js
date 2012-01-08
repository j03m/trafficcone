//todo: replace all of these methods with methods that pull from data shard
//todo: what the hell is a shard id :)

worldModelFactory = require("./public/tccore/GameWorldModelIso");

var shardId;
var world;
var worldModel;
var objects;
var players;
var screenWidth = 800;
var screenHeight = 600;
var cellWidth = 73;
var cellHeight = 73;

function getRand(max) {
    return Math.floor(Math.random() * max);
}

exports.start = function () {

    //internal use later for loading from db
    shardId = 1;
    worldWidth = 250;
    worldHeight = 250;

    //the world 
    world = this.makeWorld(shardId);

    //calculations
    worldModel = this.makeWorldModel();

    //objects in the world
    objects = this.makeObjects();

    //players in the world
    players = this.makePlayers();


}

exports.getPlayers = function () { return players; }
exports.getObjects = function () { return objects; }
exports.getWorld = function () { return world; }
exports.getWorldModel = function () { return worldModel; }
exports.getShardId = function () { return shardId; }

exports.makePlayers = function () {
    var players = {};
    
    players["joe"] = { "spriteId": "de558a04-b5df-4af4-b196-4393d732bb84",
        "type": "player",
        "uniqueId": "joe",
        "cellX": 125,
        "cellY": 125,
        "width": 40,
        "height": 60,
        "speed": 5
    };

    players["denis"] = { 
         "compositeDef":{
                    "tokenClass": "AM",
                    "weaponClass": "BOW",
                    "HD": "CAP",
                    "TR": "HVY",
                    "LG": "HVY",
                    "RA": "HVY",
                    "LA": "HVY",
                    "RH": "PIK",
                    "LH": "LBB",
                    "SH": "BUC",
                    "S1": undefined,
                    "name": "denis"
        },
        "type": "player",
        "uniqueId": "denis",
        "cellX": 126,
        "cellY": 126,
        "width": 40,
        "height": 60,
        "speed": 5
    };

    return players;
}

exports.makeObjects = function () {
    var objects = {};
    for (var i = 0; i < 0; i++) {
        objects["zombie" + i] = { "spriteId": "de558a04-b5df-4af4-b196-4393d732bb84",
            "type": "npc",
            "uniqueId": "zombie" + i,
            "x": getRand(worldWidth),
            "y": getRand(worldHeight),
            "width": 40,
            "height": 60,
            "speed":5
            
        };
    }

    return objects;
}

exports.makeWorld = function () {
    var worldArray = [];
    for (var i = 0; i < worldWidth; i++) {
        worldArray.push([]);
        for (var ii = 0; ii < worldHeight; ii++) {
            worldArray[i].push(1);       
        }
    }

    for (var i = 0; i < 3000; i++) {
        worldArray[getRand(worldWidth)][getRand(worldHeight)] = 0;
    }

    return worldArray;
}

exports.makeWorldModel = function () {
    return worldModelFactory.getIsoModel(world, 125, 125, screenWidth, screenHeight, cellWidth, cellHeight);
}