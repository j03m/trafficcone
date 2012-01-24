

var GameEventTypes = function () {

    this.NPC = "NPC";
    this.Idle = "idle";
    this.KeyDown = "keydown";
    this.KeyUp = "keyup";
    this.TouchStart = "touchstart";
    this.TouchEnd = "touchend";
    this.TouchMove = "touchmove";
    this.MouseDown = "mousedown";
    this.MouseUp = "mouseup";
    this.MouseMove = "mousemove";
    this.MouseClick = "mouseclick";
    this.BorderCollisionLeft = "borderCollisionLeft";
    this.BorderCollisionRight = "borderCollisionRight";
    this.BorderCollisionTop = "borderCollisionTop";
    this.BorderCollisionBottom = "borderCollisionBottom";
}

var GameEvent = function (eventType, descriptor, innerEvent)
{
    this.type = eventType;
    this.eventData = descriptor;
    this.innerEvent = innerEvent;
	//little hack because I use offsetX everywhere under the assumption that this 
	//would be okay in firefox, but firefox 9 uses clientX. I will make a wider
	//event handler to centralize this stuff.
	if (this.innerEvent != undefined && this.innerEvent.offsetX == undefined && this.innerEvent.clientX != undefined)
	{
		this.innerEvent.offsetX = this.innerEvent.clientX;
		this.innerEvent.offsetY = this.innerEvent.clientY;
	}
}
