function testerVertical(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 104, 76, lightAction, 0, 254));
	sequence.push(new Frame(0, 0, 203, 76, lightAction, 76, 155));
	sequence.push(new Frame(0, 0, 358, 76, lightAction, 152, 0));
	return sequence;
}


function testerHorizontal(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 104, 76, lightAction, 0, 0));
	sequence.push(new Frame(0, 0, 104, 124, lightAction, 76, 0));
	sequence.push(new Frame(0, 0, 104, 262, lightAction, 200, 0));
	sequence.push(new Frame(0, 0, 104, 502, lightAction, 462, 0));
	sequence.push(new Frame(0, 0, 104, 218, lightAction, 964, 0));
	sequence.push(new Frame(0, 0, 104, 116, lightAction, 1182, 0));
	return sequence;
}


function tester_Sprite(ga){
	var sprite = new Sprite("tester");
	sprite.setup(ga);
	sprite.defineSequence("tester", "/assets/tester/testerVertical.png", testerVertical(), playInfinite);
	sprite.defineSequence("testerVertical", "/assets/tester/testerHorizontal.png", testerHorizontal(), playInfinite);
	return sprite;
}
