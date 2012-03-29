function altarCells_Sprite(ga, name, loadCallBack) {
	var sprite = new Sprite("altarCells", "altarCells", "altarCells", loadCallBack, ga);
	sprite.easyDefineSequence("altarCells", tc.constants.DOMAIN_PREFIX + "assets/Cells/alter-fs-small.png", 1, 5, 79, 160, 0, tc.constants.playInfinite);
	return sprite;
}

function caveCells_Sprite(ga, name, loadCallBack) {
	var sprite = new Sprite("caveCells", "caveCells", "caveCells", loadCallBack, ga);
	sprite.easyDefineSequence("caveCells", tc.constants.DOMAIN_PREFIX + "assets/Cells/cavedr-fs.png", 1, 5, 79, 160, 0, tc.constants.playInfinite);
	return sprite;
}

