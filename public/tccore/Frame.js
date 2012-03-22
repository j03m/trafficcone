var Frame = function (inRow, inCol, inSpriteHeight, inSpriteWidth, inTime, specificX, specificY) {

    this.spriteWidth = inSpriteWidth;
    this.spriteHeight = inSpriteHeight;
    this.row = inRow;
    this.col = inCol;
    this.time = inTime;
    this.x = this.col * this.spriteWidth;
    this.y = this.row * this.spriteHeight;


    if (specificX != undefined && specificX != null) {
        this.x = specificX;        
    }

    if (specificY != undefined && specificY != null) {
        this.y = specificY;
    }

    this.getFrameX = function () {
        //need to look at the size of the sprites
        //and the row column here and figure out where we are
        return this.x;
    }

    this.getFrameY = function () {
        //need to look at the size of the sprites
        //and the row column here and figure out where we are
        return this.y;
    }

    this.getFrameW = function () {
        //need to look at the size of the sprites
        //and the row column here and figure out where we are
        return this.spriteWidth;
    }

    this.getFrameH = function () {
        //need to look at the size of the sprites
        //and the row column here and figure out where we are
        return this.spriteHeight;
    }
}
