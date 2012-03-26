function werewolfClaw(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 80, 137, tc.constants.LIGHT_ACTION, 0, 22));
	sequence.push(new Frame(0, 0, 96, 132, tc.constants.LIGHT_ACTION, 137, 6));
	sequence.push(new Frame(0, 0, 95, 121, tc.constants.LIGHT_ACTION, 269, 7));
	sequence.push(new Frame(0, 0, 95, 120, tc.constants.LIGHT_ACTION, 390, 7));
	sequence.push(new Frame(0, 0, 99, 118, tc.constants.LIGHT_ACTION, 510, 3));
	sequence.push(new Frame(0, 0, 99, 114, tc.constants.LIGHT_ACTION, 628, 3));
	sequence.push(new Frame(0, 0, 100, 127, tc.constants.LIGHT_ACTION, 742, 2));
	sequence.push(new Frame(0, 0, 101, 196, tc.constants.LIGHT_ACTION, 869, 1));
	sequence.push(new Frame(0, 0, 102, 183, tc.constants.LIGHT_ACTION, 1065, 0));
	sequence.push(new Frame(0, 0, 100, 183, tc.constants.LIGHT_ACTION, 1248, 2));
	sequence.push(new Frame(0, 0, 99, 194, tc.constants.LIGHT_ACTION, 1431, 3));
	sequence.push(new Frame(0, 0, 98, 175, tc.constants.LIGHT_ACTION, 1625, 4));
	sequence.push(new Frame(0, 0, 98, 130, tc.constants.LIGHT_ACTION, 1800, 4));
	sequence.push(new Frame(0, 0, 96, 117, tc.constants.LIGHT_ACTION, 1930, 6));
	return sequence;
}
