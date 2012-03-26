function werewolfPowerUp(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 108, 80, tc.constants.LIGHT_ACTION, 0, 10));
	sequence.push(new Frame(0, 0, 108, 71, tc.constants.LIGHT_ACTION, 80, 10));
	sequence.push(new Frame(0, 0, 115, 88, tc.constants.LIGHT_ACTION, 151, 3));
	sequence.push(new Frame(0, 0, 118, 78, tc.constants.LIGHT_ACTION, 239, 0));
	sequence.push(new Frame(0, 0, 118, 78, tc.constants.LIGHT_ACTION, 317, 0));
	sequence.push(new Frame(0, 0, 118, 78, tc.constants.LIGHT_ACTION, 395, 0));
	return sequence;
}
