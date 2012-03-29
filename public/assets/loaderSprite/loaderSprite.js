function loaderSprite(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 0, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 450, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 900, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 1350, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 1800, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 2250, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 2700, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 3150, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 3600, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 4050, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 4500, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 4950, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 5400, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 5850, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 6300, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 6750, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 7200, 0));
	sequence.push(new Frame(0, 0, 450, 450, tc.constants.LIGHT_ACTION, 7650, 0));
	return sequence;
}


function loaderSprite_Sprite(ga){
    var sprite = new Sprite("loaderSprite");
	sprite.setup(ga);
	sprite.defineSequence("loaderSprite", "/assets/loaderSprite/loaderSprite.jpg", loaderSprite(), tc.constants.playInfinite);
	return sprite;
}
