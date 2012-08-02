//nodejs webserver
var sys = require("sys");
var express = require('express');
var app = module.exports = express.createServer();
var http = require('http');

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
