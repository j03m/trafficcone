function werewolfSnap(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 84, 121, lightAction, 0, 43));
	sequence.push(new Frame(0, 0, 119, 121, lightAction, 121, 8));
	sequence.push(new Frame(0, 0, 126, 127, lightAction, 242, 1));
	sequence.push(new Frame(0, 0, 127, 141, lightAction, 369, 0));
	sequence.push(new Frame(0, 0, 126, 123, lightAction, 510, 1));
	sequence.push(new Frame(0, 0, 127, 127, lightAction, 633, 0));
	sequence.push(new Frame(0, 0, 119, 123, lightAction, 760, 8));
	sequence.push(new Frame(0, 0, 89, 143, lightAction, 883, 38));
	return sequence;
}
