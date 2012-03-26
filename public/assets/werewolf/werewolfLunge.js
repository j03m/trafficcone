function werewolfLunge(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 53, 159, tc.constants.LIGHT_ACTION, 0, 27));
	sequence.push(new Frame(0, 0, 52, 224, tc.constants.LIGHT_ACTION, 159, 28));
	sequence.push(new Frame(0, 0, 55, 202, tc.constants.LIGHT_ACTION, 383, 25));
	sequence.push(new Frame(0, 0, 63, 146, tc.constants.LIGHT_ACTION, 585, 17));
	sequence.push(new Frame(0, 0, 62, 168, tc.constants.LIGHT_ACTION, 731, 18));
	sequence.push(new Frame(0, 0, 80, 231, tc.constants.LIGHT_ACTION, 899, 0));
	sequence.push(new Frame(0, 0, 75, 206, tc.constants.LIGHT_ACTION, 1130, 5));
	sequence.push(new Frame(0, 0, 75, 216, tc.constants.LIGHT_ACTION, 1336, 5));
	sequence.push(new Frame(0, 0, 62, 133, tc.constants.LIGHT_ACTION, 1552, 18));
	sequence.push(new Frame(0, 0, 63, 123, tc.constants.LIGHT_ACTION, 1685, 17));
	return sequence;
}
