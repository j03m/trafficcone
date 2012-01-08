require('tty').setRawMode(true);    
var stdin = process.openStdin();

exports.toggle = function(fireThis)
{
	if (process.argv.indexOf("debug")!=-1)
	{
		console.log("debug flag found, press any key to start or rerun. Press 'ctrl-c' to cancel out!");
		stdin.on('keypress', function (chunk, key) {						
			if (key.name == 'c' && key.ctrl == true)
			{
				process.exit();
			}
			fireThis();					
		});
	}
	else
	{
		fireThis();
	}
}