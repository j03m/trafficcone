function werewolfHit(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 88, 86, lightAction, 0, 0));
	sequence.push(new Frame(0, 0, 88, 96, lightAction, 86, 0));
	sequence.push(new Frame(0, 0, 88, 96, lightAction, 182, 0));
	sequence.push(new Frame(0, 0, 88, 86, lightAction, 278, 0));
	sequence.push(new Frame(0, 0, 88, 96, lightAction, 364, 0));
	sequence.push(new Frame(0, 0, 88, 96, lightAction, 460, 0));
	return sequence;
}
