var util = require("util");
var audioboo = require("./../").AudioBoo;
var config = require("./.config.json");

//now try to use audioboo
var api = new audioboo(config);

/*
//GET THE ACCESS TOKEN - AFTER USING GET REQUEST TOKEN TO OBTAIN A TOKEN AND A SECRET - USE THEM WITH THE PIN TO CLEAR OUR APP
api.getAccessToken("6e86a62b508cd29c286ced8c", "8e4fe6c63d1c6bfa6e0340fecc16278bb06d907d961bd1c9ca294183753f0fe7", "119745", function(err, key, secret){console.log("err:",err);console.log("key:", key);console.log("secret:",secret);});

api.getRequestToken(function(err, token, secret){
	console.log("token&secret:", token, secret);
	//console.log("clips:", util.inspect(clips));
	api.getAuthorizationURL(token, function(err, url){
		console.log("url:",url);
	});
});
*/

api.getCurrentUserClips(function(err, clips){
	console.log("clips: ", util.inspect(clips.body.audio_clips));
});