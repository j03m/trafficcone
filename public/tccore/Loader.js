var Loader = function (inEngine) {
	engine = inEngine;

},
loaderSpriteName,
mainAnimation,
loadCallBack,
intervalId,
loadingSprites = [],
engine,
srcDocs = [],
mainLoader = function () {
	for (var i = 0; i < loadingSprites.length; i++) {
		if (!loadingSprites[i].isLoadComplete()) {
			return;
		}
	}

	//right thing to do here?
	clearInterval(intervalId);
	for (var ii = 0; ii < loadingSprites.length; ii++) {
		if (loadingSprites[ii].getSpriteType() != "backdrop") {
			engine.defineSprite(loadingSprites[ii]);
		}
	}
	engine.markBackDropRedraw();
	loadCallBack();
	engine.removeSprite(loaderSpriteName);
};
Loader.prototype = {
    setLoaderAnimation: function (sprite) {
        mainAnimation = sprite;
        loaderSpriteName = sprite.name;
        engine.defineSprite(sprite);
        engine.play();
    },
    queueSprite: function (sprite) {
        loadingSprites.push(sprite);
    },
    queueDef: function (def, inventory, callBack) {
        loadScript(def.definition, function () {
            var sprite = TCSpriteFactory(def, def.prefix, engine, callBack);
            theLoader.queueSprite(sprite);
        });
    },
    spriteFromScript: function (src, spriteLoadFunction, spriteName, callback) {
        var theSprite;
        srcDocs.push(src);
        loadScript(src, function () {
            theSprite = eval(spriteLoadFunction + "(engine, spriteName, function() { callBack(theSprite); })");
            callback(theSprite);

        });
    },
    quickLoadSprite: function (src, spriteLoadFunction, spriteName, engine, callBack) {
        if (srcDocs.indexOf(src) == -1) {
            var theSprite;
            loadScript(src, function () {
                theSprite = eval(spriteLoadFunction + "(engine, spriteName, function() { callBack(theSprite); })");
                srcDocs.push(src);
            });
        } else {
            //sprite smart caches
            theSprite = eval(spriteLoadFunction + "(engine, spriteName, function() { callBack(theSprite); })");

        }
    },
    startCheck: function (interval, callback) {
        loadCallBack = callback;
        intervalId = setInterval(mainLoader, interval);
    }
};

