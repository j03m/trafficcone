function werewolfTear(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 94, 134, tc.constants.LIGHT_ACTION, 0, 10));
	sequence.push(new Frame(0, 0, 101, 128, tc.constants.LIGHT_ACTION, 134, 3));
	sequence.push(new Frame(0, 0, 104, 152, tc.constants.LIGHT_ACTION, 262, 0));
	sequence.push(new Frame(0, 0, 102, 145, tc.constants.LIGHT_ACTION, 414, 2));
	sequence.push(new Frame(0, 0, 102, 152, tc.constants.LIGHT_ACTION, 559, 2));
	sequence.push(new Frame(0, 0, 98, 148, tc.constants.LIGHT_ACTION, 711, 6));
	sequence.push(new Frame(0, 0, 94, 121, tc.constants.LIGHT_ACTION, 859, 10));
	sequence.push(new Frame(0, 0, 89, 120, tc.constants.LIGHT_ACTION, 980, 15));
	return sequence;
}
