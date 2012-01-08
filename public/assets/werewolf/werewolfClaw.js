function werewolfClaw(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 80, 137, lightAction, 0, 22));
	sequence.push(new Frame(0, 0, 96, 132, lightAction, 137, 6));
	sequence.push(new Frame(0, 0, 95, 121, lightAction, 269, 7));
	sequence.push(new Frame(0, 0, 95, 120, lightAction, 390, 7));
	sequence.push(new Frame(0, 0, 99, 118, lightAction, 510, 3));
	sequence.push(new Frame(0, 0, 99, 114, lightAction, 628, 3));
	sequence.push(new Frame(0, 0, 100, 127, lightAction, 742, 2));
	sequence.push(new Frame(0, 0, 101, 196, lightAction, 869, 1));
	sequence.push(new Frame(0, 0, 102, 183, lightAction, 1065, 0));
	sequence.push(new Frame(0, 0, 100, 183, lightAction, 1248, 2));
	sequence.push(new Frame(0, 0, 99, 194, lightAction, 1431, 3));
	sequence.push(new Frame(0, 0, 98, 175, lightAction, 1625, 4));
	sequence.push(new Frame(0, 0, 98, 130, lightAction, 1800, 4));
	sequence.push(new Frame(0, 0, 96, 117, lightAction, 1930, 6));
	return sequence;
}
