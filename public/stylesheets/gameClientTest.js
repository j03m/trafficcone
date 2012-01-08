var ga;
var worldCells;
var column;
var zom;
var zom2;


function gameWorld_setCell(gameWorld, i, ii, sprite, frame, type, blockType) {
    gameWorld[i][ii].Sprite = sprite;
    gameWorld[i][ii].Frame = frame;
    gameWorld[i][ii].Type = type;
    gameWorld[i][ii].BlockType = blockType;

}

$(document).ready(function () {
    ga = new Engine(document.getElementById("gamescreen"), document.getElementById("backbuffer2"));

    //tell the engine our gameworld will consist of a 250x250 grid of 160,79 cells
    var gameWorld = new GameWorld(250, 250, 73, 73, GAME_WORLD_STYLE_ISOMETRIC);
    worldCells = altarCells_Sprite(ga);
    worldCells.setup(ga);

    //loop through the matrix and populate it with cells
    for (var i = 0; i < 250; i++) {
        for (var ii = 0; ii < 250; ii++) {
            //set a cell using the worldCells sprite, randomly select one of the 25 frames in this sprite.
            gameWorld.setCell(i, ii, worldCells, getRand(25), GAME_WORLD_CELL_UNDERLAY, GAME_WORLD_CELL_OPEN);
        }
    }

    ga.setWorld(gameWorld);
    ga.setCamera(125,125);

    var gameWorldModel = ga.getWorldModel();

    var hero = hero_Sprite(ga);
    hero.setSpeed(3);
    hero.setInnerDrawRectOverride(105, 130);
    gameWorldModel.placeSpriteInWorldCell(250, 250, hero);
    ga.defineSprite(hero);


    zom = zombie_Sprite(ga);
    zom.setSpeed(1);
    zom.setInnerDrawRectOverride(40, 60);
    gameWorldModel.placeSpriteInWorldCell(250, 251, zom);
    ga.defineSprite(zom);


    zom2 = zombie_Sprite(ga, "zombo");
    zom2.setSpeed(1);
    zom2.setInnerDrawRectOverride(40, 60);
    gameWorldModel.placeSpriteInWorldCell(250, 252, zom2);
    ga.defineSprite(zom2);

    column = columnCell_Sprite(ga);
    for (var i = 0; i < 10; i++) {
        var cell = gameWorldModel.getRandomOnScreenCellWorldValues();
        if (cell.x != 250) {
            gameWorld_setCell(gameWorld, cell.x, cell.y, columnCell_Sprite(ga, "column" + i), 0, GAME_WORLD_CELL_OVERLAY, GAME_WORLD_CELL_BLOCK);
        }
    }


    //var ms = new MindlessSeek(hero, "attacking", "walking", 10, 10);
    var ss = new SmartSeek(hero, "attacking", "walking", 1, 1, 100);
    var ss2 = new SmartSeek(hero, "attacking", "walking", 1, 1, 100);

    ga.addEventBehavior(ga.gameEvents.NPC, "", zom, "walking", ss, playInfinite);
    ga.addEventBehavior(ga.gameEvents.NPC, "", zom2, "walking", ss2, playInfinite);
    //ga.addEventBehavior(ga.gameEvents.NPC, "", zom2, "walking", ss, playInfinite);


    //todo: sounds -> need a post method attachSound
    //todo: clean up path finding
    //todo: implement health, iso collision
    //todo: spawn points

    //Find or buy high end sprites
    //todo: world builder
    //todo: persistence - world, player, character
    //todo: create a randomly generated fully scalable version of rogue


    hero.wireIsoArrowKeys("normal", "walking", "walking", "walking", "walking");

    var intervalid = setInterval(function () {
        if (column.isLoadComplete() && hero.isLoadComplete() && zom.isLoadComplete() && worldCells.isLoadComplete()) {
            ga.play();
            clearInterval(intervalid);
        }
    });
});

function getRand(max) {
    return Math.floor(Math.random() * max);
}