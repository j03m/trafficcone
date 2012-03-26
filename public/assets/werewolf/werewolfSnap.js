function werewolfSnap(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 84, 121, tc.constants.LIGHT_ACTION, 0, 43));
	sequence.push(new Frame(0, 0, 119, 121, tc.constants.LIGHT_ACTION, 121, 8));
	sequence.push(new Frame(0, 0, 126, 127, tc.constants.LIGHT_ACTION, 242, 1));
	sequence.push(new Frame(0, 0, 127, 141, tc.constants.LIGHT_ACTION, 369, 0));
	sequence.push(new Frame(0, 0, 126, 123, tc.constants.LIGHT_ACTION, 510, 1));
	sequence.push(new Frame(0, 0, 127, 127, tc.constants.LIGHT_ACTION, 633, 0));
	sequence.push(new Frame(0, 0, 119, 123, tc.constants.LIGHT_ACTION, 760, 8));
	sequence.push(new Frame(0, 0, 89, 143, tc.constants.LIGHT_ACTION, 883, 38));
	return sequence;
}
