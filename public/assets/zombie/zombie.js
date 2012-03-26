function zombie_Sprite(ga, name, loadCallBack) {
    var template = SpriteInventory.TCSpriteInventory["de558a04-b5df-4af4-b196-4393d732bb84"];
    var zombie = SpriteInventory.TCSpriteFactory(template, name, ga, loadCallBack);           
    return zombie;
}
