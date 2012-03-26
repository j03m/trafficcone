function testerVertical(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 104, 76, tc.constants.LIGHT_ACTION, 0, 254));
	sequence.push(new Frame(0, 0, 203, 76, tc.constants.LIGHT_ACTION, 76, 155));
	sequence.push(new Frame(0, 0, 358, 76, tc.constants.LIGHT_ACTION, 152, 0));
	return sequence;
}
