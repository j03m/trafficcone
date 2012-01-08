function werewolfDead(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 88, 86, lightAction, 0, 4));
	sequence.push(new Frame(0, 0, 88, 96, lightAction, 86, 4));
	sequence.push(new Frame(0, 0, 88, 96, lightAction, 182, 4));
	sequence.push(new Frame(0, 0, 88, 86, lightAction, 278, 4));
	sequence.push(new Frame(0, 0, 88, 96, lightAction, 364, 4));
	sequence.push(new Frame(0, 0, 88, 96, lightAction, 460, 4));
	sequence.push(new Frame(0, 0, 77, 131, lightAction, 556, 15));
	sequence.push(new Frame(0, 0, 67, 121, lightAction, 687, 25));
	sequence.push(new Frame(0, 0, 67, 121, lightAction, 808, 25));
	sequence.push(new Frame(0, 0, 78, 118, lightAction, 929, 14));
	sequence.push(new Frame(0, 0, 92, 108, lightAction, 1047, 0));
	sequence.push(new Frame(0, 0, 32, 191, lightAction, 1155, 60));
	sequence.push(new Frame(0, 0, 43, 157, lightAction, 1346, 49));
	sequence.push(new Frame(0, 0, 34, 188, lightAction, 1503, 58));
	return sequence;
}
