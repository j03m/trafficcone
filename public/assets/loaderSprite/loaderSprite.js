function loaderSprite(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 0, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 450, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 900, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 1350, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 1800, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 2250, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 2700, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 3150, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 3600, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 4050, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 4500, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 4950, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 5400, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 5850, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 6300, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 6750, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 7200, 0));
	sequence.push(new Frame(0, 0, 450, 450, lightAction, 7650, 0));
	return sequence;
}


function loaderSprite_Sprite(ga){
    var sprite = new Sprite("loaderSprite");
	sprite.setup(ga);
	sprite.defineSequence("loaderSprite", "/assets/loaderSprite/loaderSprite.jpg", loaderSprite(), playInfinite);
	return sprite;
}
