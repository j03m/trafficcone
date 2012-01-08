function test2DCells_Sprite(ga) {
    var sprite = new Sprite("testCells", "testCells", "testCells");
    sprite.setup(ga);
    sprite.easyDefineSequence("testCells", DOMAIN_PREFIX + "assets/Cells/testCells.png", 1, 4, 96, 96, 0, playInfinite);
    return sprite;
}