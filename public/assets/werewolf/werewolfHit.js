function werewolfHit(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 88, 86, tc.constants.LIGHT_ACTION, 0, 0));
	sequence.push(new Frame(0, 0, 88, 96, tc.constants.LIGHT_ACTION, 86, 0));
	sequence.push(new Frame(0, 0, 88, 96, tc.constants.LIGHT_ACTION, 182, 0));
	sequence.push(new Frame(0, 0, 88, 86, tc.constants.LIGHT_ACTION, 278, 0));
	sequence.push(new Frame(0, 0, 88, 96, tc.constants.LIGHT_ACTION, 364, 0));
	sequence.push(new Frame(0, 0, 88, 96, tc.constants.LIGHT_ACTION, 460, 0));
	return sequence;
}
