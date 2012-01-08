function ninjaGirlNeutral(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 92, 80, lightAction, 0, 0));
	sequence.push(new Frame(0, 0, 91, 80, lightAction, 80, 1));
	sequence.push(new Frame(0, 0, 90, 80, lightAction, 160, 2));
	sequence.push(new Frame(0, 0, 89, 80, lightAction, 240, 3));
	sequence.push(new Frame(0, 0, 89, 80, lightAction, 320, 3));
	sequence.push(new Frame(0, 0, 90, 80, lightAction, 400, 2));
	sequence.push(new Frame(0, 0, 91, 80, lightAction, 480, 1));
	sequence.push(new Frame(0, 0, 92, 80, lightAction, 560, 0));
	return sequence;
}
