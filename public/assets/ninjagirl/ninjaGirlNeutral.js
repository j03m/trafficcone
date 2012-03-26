function ninjaGirlNeutral(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 92, 80, tc.constants.LIGHT_ACTION, 0, 0));
	sequence.push(new Frame(0, 0, 91, 80, tc.constants.LIGHT_ACTION, 80, 1));
	sequence.push(new Frame(0, 0, 90, 80, tc.constants.LIGHT_ACTION, 160, 2));
	sequence.push(new Frame(0, 0, 89, 80, tc.constants.LIGHT_ACTION, 240, 3));
	sequence.push(new Frame(0, 0, 89, 80, tc.constants.LIGHT_ACTION, 320, 3));
	sequence.push(new Frame(0, 0, 90, 80, tc.constants.LIGHT_ACTION, 400, 2));
	sequence.push(new Frame(0, 0, 91, 80, tc.constants.LIGHT_ACTION, 480, 1));
	sequence.push(new Frame(0, 0, 92, 80, tc.constants.LIGHT_ACTION, 560, 0));
	return sequence;
}
