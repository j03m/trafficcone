function werewolfTear(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 94, 134, lightAction, 0, 10));
	sequence.push(new Frame(0, 0, 101, 128, lightAction, 134, 3));
	sequence.push(new Frame(0, 0, 104, 152, lightAction, 262, 0));
	sequence.push(new Frame(0, 0, 102, 145, lightAction, 414, 2));
	sequence.push(new Frame(0, 0, 102, 152, lightAction, 559, 2));
	sequence.push(new Frame(0, 0, 98, 148, lightAction, 711, 6));
	sequence.push(new Frame(0, 0, 94, 121, lightAction, 859, 10));
	sequence.push(new Frame(0, 0, 89, 120, lightAction, 980, 15));
	return sequence;
}
