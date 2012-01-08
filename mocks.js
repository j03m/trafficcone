exports.getRandomPlayerDef = function(name,worldModel)
{
	var randomPlayerDef= {};
	
	
	randomPlayerDef.compositeDef = {
						"tokenClass": "AM",
						"weaponClass": "BOW",
						"HD": "CAP",
						"TR": "HVY",
						"LG": "HVY",
						"RA": "HVY",
						"LA": "HVY",
						"RH": "PIK",
						"LH": "LBB",
						"SH": "BUC",
						"S1": undefined,
						"name": name
					    };
	randomPlayerDef.x = worldModel==undefined ? 400 : worldModel.canvasWidth/2;
	randomPlayerDef.y = worldModel==undefined ? 300 : worldModel.canvasHeight/2;
	var cell = worldModel== undefined ? 14 : worldModel.getRandomUnblockedWorldCell();
	randomPlayerDef.cellX = cell.x;
	randomPlayerDef.cellY = cell.y;	
	randomPlayerDef.name = name;
	randomPlayerDef.speed = 5;
	return randomPlayerDef;			

}

exports.getTestPlayerDef = function(id)
{
	var randomPlayerDef= {};
	
	randomPlayerDef.name = id;
	randomPlayerDef.compositeDef = {"someobject":"somevalue"};
	randomPlayerDef.x = 20;
	randomPlayerDef.y = 30;	
	randomPlayerDef.cellX = 40;
	randomPlayerDef.cellY = 50;	
	randomPlayerDef.speed = 5;
	return randomPlayerDef;	
}

var gblGameId = "singlegameid";
exports.getStartWorld = function()
{
	return gblGameId;
}

exports.getMockClient = getMockClient;
function getMockClient()
{

	return {"user":{"clientid":12345}};
}

