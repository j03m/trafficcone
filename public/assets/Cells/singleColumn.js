function columnCell_Sprite(ga, name, loadCallBack)
{
    if (name == undefined) { 
        name ="columnCell";
    }
    var sprite = new Sprite(name, "columnCell", "columnCell",loadCallBack, ga);
    sprite.setup(ga);
    sprite.easyDefineSequence("columnCell", tc.constants.DOMAIN_PREFIX + "assets/Cells/column.png", 1, 1, 352, 160, 0, tc.constants.playInfinite);
    return sprite;
}


function shortColumnCell_Sprite(ga, name, loadCallBack)
{
    if (name == undefined) { 
        name ="columnCell";
    }
    var sprite = new Sprite(name, "columnCell", "columnCell",loadCallBack, ga);
    sprite.setup(ga);
    sprite.easyDefineSequence("columnCell", tc.constants.DOMAIN_PREFIX + "assets/Cells/shortcolumn.png", 1, 1, 352, 160, 0, tc.constants.playInfinite);
    return sprite;
}

function emptyCell_Sprite(ga, name, loadCallBack) {
    if (name == undefined) {
        name = "columnCell";
    }
    var sprite = new Sprite(name, "columnCell", "columnCell", loadCallBack, ga);
    sprite.setup(ga);
    sprite.easyDefineSequence("columnCell", undefined, 1, 1, 352, 160, 0, tc.constants.playInfinite);
    return sprite;
}