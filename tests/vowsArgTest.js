var vows = require('vows');
var assert = require('assert');
var shouldCount = 0;
var doSomethingCount = 0;
vows.describe('Testing vows this.callback').addBatch({	
	'When the this.callback is invoked': 
	{
		topic: function(){
			doSomething(this.callback);
		},
		'should get all expected args': function(param1, param2, param3)
		{
			console.log("should 1");
			assert.equal(param1,"param1");					
			assert.equal(param2,"param2");
			assert.equal(param3,"param3");
			shouldCount++;
		},
		'should get all expected args again?': function(param1, param2, param3)
		{
			console.log("should 2");
			assert.equal(param1,"param1");					
			assert.equal(param2,"param2");
			assert.equal(param3,"param3");
			shouldCount++;
		},
		'should invoke all cases, but doSomething should only be called once': function(param1, param2, param3)
		{
			assert.equal(shouldCount,2);
			assert.equal(doSomethingCount,1);
		}
	}
}).run();


function doSomething(callBack)
{
	console.log("doSomething was invoked...");
	doSomethingCount++;
	callBack("param1", "param2", "param3");
	callBack("param1", "param2", "param3");
	callBack("param1", "param2", "param3");
	callBack("param1", "param2", "param3");
}
