var self = this;
exports.init = "init";
exports.joined = "joined";
exports.move = "move";
exports.change = "chg";
exports.initResponseMsg = function(player, world, client)
{
	return {"type":self.init, "player":player, "world": world, "client":client}
}


exports.playerJoinMsg = function(player)
{
	return { "type":self.joined, "player":player };	
}

exports.extendMoveMsg = function(msg, name, pathPoints)
{
	msg.state = "seek";
	msg.path = pathPoints;
	msg.type = self.move;
	msg.name = name;
	return msg;
}


exports.getMoveResponseMsg = function(player)
{
	return { "type": self.move, "name": player.name, "x": player.x, "y": player.y };
}

exports.getStateChangeResponseMsg = function(player, state)
{
	return { "type": self.change, "name": player.name, "state": state }
}