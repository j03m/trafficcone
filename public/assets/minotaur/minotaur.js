function minotaurNeutralWest() {
    var sequence = [];
    sequence.push(new Frame(0, 0, 130, 130, 200));
    sequence.push(new Frame(0, 1, 130, 130, 200));
    sequence.push(new Frame(0, 2, 130, 130, 200));
    sequence.push(new Frame(0, 3, 130, 130, 200));
    sequence.push(new Frame(0, 2, 130, 130, 200));
    sequence.push(new Frame(0, 1, 130, 130, 200));
    sequence.push(new Frame(0, 0, 130, 130, 200));
    return sequence;
}

function minotaurNeutralNorthWest() {
    var sequence = [];
    sequence.push(new Frame(1, 0, 130, 130, 200));
    sequence.push(new Frame(1, 1, 130, 130, 200));
    sequence.push(new Frame(1, 2, 130, 130, 200));
    sequence.push(new Frame(1, 3, 130, 130, 200));
    sequence.push(new Frame(1, 2, 130, 130, 200));
    sequence.push(new Frame(1, 1, 130, 130, 200));
    sequence.push(new Frame(1, 0, 130, 130, 200));
    return sequence;
}

function minotaurNeutralNorth() {
    var sequence = [];
    sequence.push(new Frame(2, 0, 130, 130, 200));
    sequence.push(new Frame(2, 1, 130, 130, 200));
    sequence.push(new Frame(2, 2, 130, 130, 200));
    sequence.push(new Frame(2, 3, 130, 130, 200));
    sequence.push(new Frame(2, 2, 130, 130, 200));
    sequence.push(new Frame(2, 1, 130, 130, 200));
    sequence.push(new Frame(2, 0, 130, 130, 200));
    return sequence;
}


function minotaurNeutralNorthEast() {
    var sequence = [];
    sequence.push(new Frame(3, 0, 130, 130, 200));
    sequence.push(new Frame(3, 1, 130, 130, 200));
    sequence.push(new Frame(3, 2, 130, 130, 200));
    sequence.push(new Frame(3, 3, 130, 130, 200));
    sequence.push(new Frame(3, 2, 130, 130, 200));
    sequence.push(new Frame(3, 1, 130, 130, 200));
    sequence.push(new Frame(3, 0, 130, 130, 200));
    return sequence;
}


function minotaurNeutralEast() {
    var sequence = [];
    sequence.push(new Frame(4, 0, 130, 130, 200));
    sequence.push(new Frame(4, 1, 130, 130, 200));
    sequence.push(new Frame(4, 2, 130, 130, 200));
    sequence.push(new Frame(4, 3, 130, 130, 200));
    sequence.push(new Frame(4, 2, 130, 130, 200));
    sequence.push(new Frame(4, 1, 130, 130, 200));
    sequence.push(new Frame(4, 0, 130, 130, 200));
    return sequence;
}

function minotaurNeutralSouthEast() {
    var sequence = [];
    sequence.push(new Frame(5, 0, 130, 130, 200));
    sequence.push(new Frame(5, 1, 130, 130, 200));
    sequence.push(new Frame(5, 2, 130, 130, 200));
    sequence.push(new Frame(5, 3, 130, 130, 200));
    sequence.push(new Frame(5, 2, 130, 130, 200));
    sequence.push(new Frame(5, 1, 130, 130, 200));
    sequence.push(new Frame(5, 0, 130, 130, 200));
    return sequence;
}

function minotaurNeutralSouth() {
    var sequence = [];
    sequence.push(new Frame(6, 0, 130, 130, 200));
    sequence.push(new Frame(6, 1, 130, 130, 200));
    sequence.push(new Frame(6, 2, 130, 130, 200));
    sequence.push(new Frame(6, 3, 130, 130, 200));
    sequence.push(new Frame(6, 2, 130, 130, 200));
    sequence.push(new Frame(6, 1, 130, 130, 200));
    sequence.push(new Frame(6, 0, 130, 130, 200));
    return sequence;
}

function minotaurNeutralSouthWest() {
    var sequence = [];
    sequence.push(new Frame(7, 0, 130, 130, 200));
    sequence.push(new Frame(7, 1, 130, 130, 200));
    sequence.push(new Frame(7, 2, 130, 130, 200));
    sequence.push(new Frame(7, 3, 130, 130, 200));
    sequence.push(new Frame(7, 2, 130, 130, 200));
    sequence.push(new Frame(7, 1, 130, 130, 200));
    sequence.push(new Frame(7, 0, 130, 130, 200));
    return sequence;
}


function minotaur_Sprite(ga, name) {
    if (name == undefined) {
        name = "minotaur"
    }
    var sprite = new Sprite(name, "minotaurNeutral", "minotaurNeutral");
    sprite.setup(ga);
    sprite.defineSequence("minotaurNeutral", "/assets/minotaur/minotaur_alpha.png", minotaurNeutralWest(), tc.constants.playInfinite, undefined, undefined, tc.constants.SPRITE_DIRECTION_WEST);
    sprite.defineSequence("minotaurNeutral", "/assets/minotaur/minotaur_alpha.png", minotaurNeutralNorthWest(), tc.constants.playInfinite, undefined, undefined, tc.constants.SPRITE_DIRECTION_NORTH_WEST);
    sprite.defineSequence("minotaurNeutral", "/assets/minotaur/minotaur_alpha.png", minotaurNeutralNorth(), tc.constants.playInfinite, undefined, undefined, tc.constants.SPRITE_DIRECTION_NORTH);
    sprite.defineSequence("minotaurNeutral", "/assets/minotaur/minotaur_alpha.png", minotaurNeutralNorthEast(), tc.constants.playInfinite, undefined, undefined, tc.constants.SPRITE_DIRECTION_NORTH_EAST);
    sprite.defineSequence("minotaurNeutral", "/assets/minotaur/minotaur_alpha.png", minotaurNeutralEast(), tc.constants.playInfinite, undefined, undefined, tc.constants.SPRITE_DIRECTION_EAST);
    sprite.defineSequence("minotaurNeutral", "/assets/minotaur/minotaur_alpha.png", minotaurNeutralSouthEast(), tc.constants.playInfinite, undefined, undefined, tc.constants.SPRITE_DIRECTION_SOUTH_EAST);
    sprite.defineSequence("minotaurNeutral", "/assets/minotaur/minotaur_alpha.png", minotaurNeutralSouth(), tc.constants.playInfinite, undefined, undefined, tc.constants.SPRITE_DIRECTION_SOUTH);
    sprite.defineSequence("minotaurNeutral", "/assets/minotaur/minotaur_alpha.png", minotaurNeutralSouthWest(), tc.constants.playInfinite, undefined, undefined, tc.constants.SPRITE_DIRECTION_WEST);
    sprite.setDirection(tc.constants.SPRITE_DIRECTION_SOUTH_EAST);
    return sprite;
}
