



go("1","2","3", function(){ console.log("callback fired.");});
function go()
{
	console.log("go args: " + arguments[0],arguments[1],arguments[2]);
	var args = arguments;
	var origCall = args[3];
	args[3] = function() {
		console.log("augmented!");
		origCall();
	};
	
	console.log();
	findLove.apply(this, args);
	var obj = {};
	obj["findLoveObj"]=findLove;
	obj["findLoveObj"]();
	
	
}

function findLove()
{
	console.log("findlove name: " + arguments.callee.name);
	console.log("findlove args: " + arguments[0],arguments[1],arguments[2]);
	arguments[3]();
}