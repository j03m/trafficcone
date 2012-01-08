function bob()
{
	console.log("Phys: " + arguments.callee.name);
}


var bob1 = function()
{
	console.log("var: " + arguments.callee.name);
	console.log("var, hack: " + arguments.callee.parentName);	
}


bob();
bob1.name = "bob1";
bob1.parentName = "bob1";
bob1();


