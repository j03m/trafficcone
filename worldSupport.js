var dungeons = require('./dungeon');
var redis = require('./redisData');
exports.generateWorld = function(callback)
{
	//generate
	callback(world);
}

exports.generateWorldKey = function(callback)
{
	//generate
	callback(key);
}

exports.generateWorldAndKey = function(callback)
{
	this.generateWorld(function(world)
	{
		this.generateKey(function(key)
		{
			callback(world,key);
		});
	});
}

exports.generateAndStoreWorld = function (callback)
{
	this.generateWorld(function(world))
	{
		this.generateKey(function(key))
		{
			redis.setWorld(key, world, undefine, undefined, callback);	
		}
	}
}

