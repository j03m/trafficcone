RepeatingAction = function(action, accelerateFunct, resetFunc, accelerateAfter, interval)
{
	this.action = action;
	this.interval = interval;
	this.accelerateCount = 0;
	this.accelerateFunct = accelerateFunct;
	this.resetFunc = resetFunc;
	this.accelerateAfter = accelerateAfter;
}

RepeatingAction.prototype.start = function()
{
	if (!this.started)
	{
		this.started = true;
		this.id = setInterval(this.action,this.interval);
	}
	else
	{
		this.accelerateCount++;
		if (this.accelerateCount > this.accelerateAfter)
		{
			this.accelerateFunct();
			this.accelerateCount=0;
		}
	}
}

RepeatingAction.prototype.stop = function()
{
	if (this.started)
	{
		clearInterval(this.id);
		this.resetFunc();
		this.started = false;
	}
}

RepeatingAction.prototype.isStarted = function()
{
	return this.started;
}