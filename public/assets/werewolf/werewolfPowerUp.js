function werewolfPowerUp(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 108, 80, lightAction, 0, 10));
	sequence.push(new Frame(0, 0, 108, 71, lightAction, 80, 10));
	sequence.push(new Frame(0, 0, 115, 88, lightAction, 151, 3));
	sequence.push(new Frame(0, 0, 118, 78, lightAction, 239, 0));
	sequence.push(new Frame(0, 0, 118, 78, lightAction, 317, 0));
	sequence.push(new Frame(0, 0, 118, 78, lightAction, 395, 0));
	return sequence;
}
