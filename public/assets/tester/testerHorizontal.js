function testerHorizontal(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 104, 76, tc.constants.LIGHT_ACTION, 0, 0));
	sequence.push(new Frame(0, 0, 104, 124, tc.constants.LIGHT_ACTION, 76, 0));
	sequence.push(new Frame(0, 0, 104, 262, tc.constants.LIGHT_ACTION, 200, 0));
	sequence.push(new Frame(0, 0, 104, 502, tc.constants.LIGHT_ACTION, 462, 0));
	sequence.push(new Frame(0, 0, 104, 218, tc.constants.LIGHT_ACTION, 964, 0));
	sequence.push(new Frame(0, 0, 104, 116, tc.constants.LIGHT_ACTION, 1182, 0));
	return sequence;
}
