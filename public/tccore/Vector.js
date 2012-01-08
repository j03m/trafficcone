var Vector = function(startPos, seekPos, sprite) 
{
    this.startPos = startPos;
    this.seekPos = seekPos;
    this.data = [];
	this.sprite = sprite;
    
    //check if I will overrun it, if so just put me there			
	this.directions = this.getDirectional(startPos.x, startPos.y, seekPos.x, seekPos.y);
	
	
	var tempSpeed = 0;
	var holdSpeed = 0;					
	for(var direction in this.directions)
	{
		var direction = this.directions[direction];
		if (direction == "left")
		{
			holdSpeed = sprite.getLeftSpeed();
			//if my left move puts me past the mark, taper my speed
			if (startPos.x - holdSpeed < seekPos.x)
			{
				tempSpeed =  startPos.x - seekPos.x;
			}
			else
			{
				tempSpeed =  holdSpeed;
			}
																										
		}
		else
		if (direction == "right")
		{
			holdSpeed = sprite.getRightSpeed();
			//if my left move puts me past the mark, taper my speed
			if (startPos.x + holdSpeed > seekPos.x)
			{
				tempSpeed =  seekPos.x - startPos.x;
			}
			else
			{
				tempSpeed =  holdSpeed;
			}
															
		}
		else
		if (direction == "up")
		{
			holdSpeed = sprite.getUpSpeed();
			//if my left move puts me past the mark, taper my speed
			if (startPos.y - holdSpeed < seekPos.y)
			{
				tempSpeed =  startPos.y - seekPos.y;
			}
			else
			{
				tempSpeed =  holdSpeed;
			}
							
		}
		else
		if (direction == "down")
		{
			holdSpeed = sprite.getDownSpeed();
			//if my left move puts me past the mark, taper my speed
			if (startPos.y + holdSpeed > seekPos.y)
			{
				tempSpeed =  seekPos.y - startPos.y;
			}
			else
			{
				tempSpeed =  holdSpeed;
			}
			
										
		}
		else
		{
			throw "Valid directions are up, down, right, left.";
		}
		
		this.data.push({"direction":direction, "speed":tempSpeed});
	}
};

Vector.prototype =
{
    data: this.data,
    getDirectional: function (myLeft, myTop, seekLeft, seekTop, style) {
        var returnme = [];
        //plot a path from me to seek, move in that direction
        if (seekLeft < myLeft) //seek it so my left
        {
            returnme.push("left");
        }

        if (seekLeft > myLeft) //seek is to my right
        {
            returnme.push("right");
        }

        if (seekTop < myTop) {
            returnme.push("up");
        }

        if (seekTop > myTop) {
            returnme.push("down");
        }

        return returnme;
    }
};
