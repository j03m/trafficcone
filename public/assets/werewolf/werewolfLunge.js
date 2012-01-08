function werewolfLunge(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 53, 159, lightAction, 0, 27));
	sequence.push(new Frame(0, 0, 52, 224, lightAction, 159, 28));
	sequence.push(new Frame(0, 0, 55, 202, lightAction, 383, 25));
	sequence.push(new Frame(0, 0, 63, 146, lightAction, 585, 17));
	sequence.push(new Frame(0, 0, 62, 168, lightAction, 731, 18));
	sequence.push(new Frame(0, 0, 80, 231, lightAction, 899, 0));
	sequence.push(new Frame(0, 0, 75, 206, lightAction, 1130, 5));
	sequence.push(new Frame(0, 0, 75, 216, lightAction, 1336, 5));
	sequence.push(new Frame(0, 0, 62, 133, lightAction, 1552, 18));
	sequence.push(new Frame(0, 0, 63, 123, lightAction, 1685, 17));
	return sequence;
}
