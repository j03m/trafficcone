function lightning() {
    var sequence = [];
    sequence.push(new Frame(0, 0, 143, 132, lightAction, 0, 81));
    sequence.push(new Frame(0, 0, 224, 242, lightAction, 132, 0));
    sequence.push(new Frame(0, 0, 224, 207, lightAction, 374, 0));
    sequence.push(new Frame(0, 0, 224, 191, lightAction, 581, 0));
    sequence.push(new Frame(0, 0, 224, 150, lightAction, 772, 0));
    return sequence;
}


function ShockEffect_Sprite(ga) {
    var sprite = new Sprite("ShockEffect");
    sprite.setup(ga);
    sprite.defineSequence("ShockEffect", "/assets/effects/lightning.png", lightning(), 1);
    return sprite;
}
