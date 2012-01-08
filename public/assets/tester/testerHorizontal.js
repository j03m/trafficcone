function testerHorizontal(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 104, 76, lightAction, 0, 0));
	sequence.push(new Frame(0, 0, 104, 124, lightAction, 76, 0));
	sequence.push(new Frame(0, 0, 104, 262, lightAction, 200, 0));
	sequence.push(new Frame(0, 0, 104, 502, lightAction, 462, 0));
	sequence.push(new Frame(0, 0, 104, 218, lightAction, 964, 0));
	sequence.push(new Frame(0, 0, 104, 116, lightAction, 1182, 0));
	return sequence;
}
