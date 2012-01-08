
var BGSprite = function (name, drawSprite, x, y, w, h) {
    this.drawSprite = drawSprite;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
};

BGSprite.prototype.getLeft = function () { return this.x;  };
BGSprite.prototype.getTop = function () { return this.y; };
BGSprite.prototype.getRight = function () { return this.x+this.drawSprite.getWidth(); };
BGSprite.prototype.getBottom = function () { return this.y + this.drawSprite.getHeight(); };

BGSprite.prototype.getWidth = function () { return this.drawSprite.getWidth(); };
BGSprite.prototype.getHeight = function () { return this.drawSprite.getHeight(); };

BGSprite.prototype.absoluteLeft = function () { return this.x; };
BGSprite.prototype.absoluteTop = function () { return this.y; };
BGSprite.prototype.absoluteRight = function () { return this.getRight(); };
BGSprite.prototype.absoluteBottom = function () { return this.getBottom(); };

BGSprite.prototype.setTop = function (top) { return this.y = top };
BGSprite.prototype.setLeft = function (left) { return this.x = left };

BGSprite.prototype.setSpriteType = function (type) {
    this.drawSprite.setSpriteType(type);
},
BGSprite.prototype.getSpriteType = function () {
    return this.drawSprite.getSpriteType();
},
BGSprite.prototype.setFrame = function (frame) {
    this.drawSprite.setFrame(frame);
}
BGSprite.prototype.prep = function () {
    this.drawSprite.setTop(this.y);
    this.drawSprite.setLeft(this.x);
    this.drawSprite.prep();
};
BGSprite.prototype.invalidate= function () {
    this.drawSprite.setTop(this.y);
    this.drawSprite.setLeft(this.x);
    this.drawSprite.invalidate();
};

BGSprite.prototype.display = function () {
    this.drawSprite.setTop(this.y);
    this.drawSprite.setLeft(this.x);
    this.drawSprite.display();
};

BGSprite.prototype.getVisible = function () {
    return this.drawSprite.getVisible();
};
