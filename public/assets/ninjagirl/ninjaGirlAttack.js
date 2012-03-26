function ninjaGirlAttack(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 90, 90, tc.constants.LIGHT_ACTION, 0, 79));
	sequence.push(new Frame(0, 0, 94, 83, tc.constants.LIGHT_ACTION, 90, 75));
	sequence.push(new Frame(0, 0, 94, 77, tc.constants.LIGHT_ACTION, 173, 75));
	sequence.push(new Frame(0, 0, 113, 73, tc.constants.LIGHT_ACTION, 250, 56));
	sequence.push(new Frame(0, 0, 169, 146, tc.constants.LIGHT_ACTION, 323, 0));
	sequence.push(new Frame(0, 0, 150, 141, tc.constants.LIGHT_ACTION, 469, 19));
	sequence.push(new Frame(0, 0, 93, 111, tc.constants.LIGHT_ACTION, 610, 76));
	sequence.push(new Frame(0, 0, 84, 78, tc.constants.LIGHT_ACTION, 721, 85));
	sequence.push(new Frame(0, 0, 85, 76, tc.constants.LIGHT_ACTION, 799, 84));
	sequence.push(new Frame(0, 0, 87, 78, tc.constants.LIGHT_ACTION, 875, 82));
	sequence.push(new Frame(0, 0, 89, 81, tc.constants.LIGHT_ACTION, 953, 80));
	sequence.push(new Frame(0, 0, 91, 80, tc.constants.LIGHT_ACTION, 1034, 78));
	return sequence;
}
