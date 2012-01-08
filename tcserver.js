//todo:
//* add redis instead of using local ram
//* add cluster support
/*During gameplay, the client sends the following
commands to the server unreliably:
	move forward, up, sideways
	change orientation
	button presses
	impulse
	time between this command and the last*/
//* multiple players wher each is at an origin (add player id param for now)
    //* player name param
    //* world id
//* facebook sign-in and multiple games/maps by id
//* admin controls
//* fog of war
//* roll attachment, rightclick menus


/**
* Module dependencies.
*/

var sys = require("sys");
var express = require('express');
var app = module.exports = express.createServer();
var http = require('http');
var serverEngine = require('./serverCore');

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});


app.get('/', function (req, res) {
    res.render('index', {
	locals: {
	    title: 'Express'
	}
    });
});

app.listen(8089);

// ***************
//NowJS component
// ***************
var nowjs = require("now");
var everyone = nowjs.initialize(app);

everyone.on("connect", function () {
    console.log("Joined: " + this.user.clientId);
});

everyone.on("disconnect", function () {
    console.log("Left: " + this.user.clientId);
});


// ***************
// Fire up the engine
// ***************
serverEngine.start();
serverEngine.setUpdate(sendUpdate);
serverEngine.setUpdateToAll(sendUpdateToAll);

// ***************
// Engine callbacks
// todo: modify to send partial updates only to the players that can see this update.
// ***************
function sendUpdateToAll(err, msg) {
    //todo: only target groups based on room/game shard/visibility    
    everyone.now.receiveMessage(msg);
}

function sendUpdate(err, msg) {    
    msg.client.now.receiveMessage(msg);
}

// ***************
// Now method for receiving client events
// ***************
everyone.now.distributeMessage = function (message) {
    console.log("client: " + this.user.clientId + " sent message " + message);
    if (message == undefined) return;
    message = JSON.parse(message);
    message.client = this;
    serverEngine.enqueue(message); 
};

everyone.now.makePlayer = function(name)
{
	console.log("client: " + this.user.clientId + " joined as " + name);
	var message = {};
	message.client = this;
	message.type = "makePlayer";
	message.name = name;
	serverEngine.enqueue(message);
}


function getRand(max) {
    return Math.floor(Math.random() * max);
}
