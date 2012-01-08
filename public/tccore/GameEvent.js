

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
}
