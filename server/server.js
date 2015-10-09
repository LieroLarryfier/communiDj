//community dj

//track liste, upvote button
//socket.io, node.js

//server: mplayer, directorylist von liedern

var http = require("http");
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require('body-parser');
var mm = require('musicmetadata');
var async = require('async');

var app = express();
 
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
/*to access the posted data from client using request body*/
app.post('/post', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
	playFile(req.body.songVote);
	res.send("succesfully voted for " + req.body.songVote);
    
});

var dir = path.join(__dirname, 'music');
var jsonDir = path.join(__dirname, 'public/music');
console.log("dir: " + dir);


var tempFiles = fs.readdirSync(dir);
var songs = [];

async.each(tempFiles, function(file, callback) {
	console.log("file: " + file);
	var parser = mm(fs.createReadStream(path.join(dir,file)), function(err, tags) {
		if (err) {
                     console.warn("Error reading %s: %j", file, err);
		} else {
			var song = {name: tags["title"], artist: tags["artist"], filename: file};
			songs.push(song);
			console.log(JSON.stringify(song));
			callback();
		}
	});
	}, function (err) {
		if (err) {
			console.log(err);
		} else {
			fs.writeFile(path.join(jsonDir, 'songs.json'),	JSON.stringify(songs));
		}
	});

http.createServer(app).listen(3000, function () {
    console.log("Express server listening on port 3000");
});

var spawn = require( 'child_process' ).spawn;
var mplayer;

mplayer = spawn( 'mplayer', [ '-slave', '-novideo', '-idle', '-quiet' , path.join(dir, tempFiles[0]) ] );
mplayer.on( 'exit', function () { console.log( 'EXIT.' ); } );

// obviously you'll want something smarter than just logging...
mplayer.stdout.on('data', function (data) { console.log('mplayer stdout: ' + data); });
mplayer.stderr.on('data', function (data) { console.log('mplayer stderr: ' + data); });

function playFile(filename) {
	var playFile = path.join(dir, filename);
	var regex = /\\/g;
	var regexedPlayFile = playFile.replace(regex, "\\\\");
    console.log( 'PLAY:' + regexedPlayFile );
    mplayer.stdin.write( 'loadfile \'' + regexedPlayFile + '\' 0 \n' );
}
