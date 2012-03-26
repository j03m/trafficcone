function werewolfDead(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 88, 86, tc.constants.LIGHT_ACTION, 0, 4));
	sequence.push(new Frame(0, 0, 88, 96, tc.constants.LIGHT_ACTION, 86, 4));
	sequence.push(new Frame(0, 0, 88, 96, tc.constants.LIGHT_ACTION, 182, 4));
	sequence.push(new Frame(0, 0, 88, 86, tc.constants.LIGHT_ACTION, 278, 4));
	sequence.push(new Frame(0, 0, 88, 96, tc.constants.LIGHT_ACTION, 364, 4));
	sequence.push(new Frame(0, 0, 88, 96, tc.constants.LIGHT_ACTION, 460, 4));
	sequence.push(new Frame(0, 0, 77, 131, tc.constants.LIGHT_ACTION, 556, 15));
	sequence.push(new Frame(0, 0, 67, 121, tc.constants.LIGHT_ACTION, 687, 25));
	sequence.push(new Frame(0, 0, 67, 121, tc.constants.LIGHT_ACTION, 808, 25));
	sequence.push(new Frame(0, 0, 78, 118, tc.constants.LIGHT_ACTION, 929, 14));
	sequence.push(new Frame(0, 0, 92, 108, tc.constants.LIGHT_ACTION, 1047, 0));
	sequence.push(new Frame(0, 0, 32, 191, tc.constants.LIGHT_ACTION, 1155, 60));
	sequence.push(new Frame(0, 0, 43, 157, tc.constants.LIGHT_ACTION, 1346, 49));
	sequence.push(new Frame(0, 0, 34, 188, tc.constants.LIGHT_ACTION, 1503, 58));
	return sequence;
}
