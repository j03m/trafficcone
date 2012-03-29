function DefaultPowerSequence(){
	var sequence = [];
	sequence.push(new Frame(0, 0, 64, 64, tc.constants.LIGHT_ACTION, 0, 0));
	return sequence;
}

function getPowerSprite(ga, spriteName){
	var sprite = new Sprite(spriteName);
	sprite.setup(ga);
	sprite.defineSequence(spriteName, "/assets/powers/" + spriteName + ".gif", DefaultPowerSequence(), tc.constants.playInfinite);
	return sprite;
}
