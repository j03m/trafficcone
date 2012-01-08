
var move = "move";
var init = "init";

function initRequestMsg(sessionId, client)
{
	return {"type":init,"sessionId":sessionId, "client": client}
}


function moveRequestMsg(sessionId, offsetX, offsetY, originX, originY, client)
{
	return { "type": move,
	    	 "sessionId": sessionId,
	    	 "x": offsetX,
	   	 "y": offsetY,
	   	 "originX": originX,
	    	 "originY": originY
	};

}


if (exports!=undefined)
{
	exports.initRequestMsg = initRequestMsg;
	exports.moveRequestMsg = moveRequestMsg;
	exports.move = move;
	exports.init = init;
}
else
{
}