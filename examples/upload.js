var util = require("util");
var audioboo = require("./../").AudioBoo;
var config = require("./audioboo.json");

//USE THE AUDIOBOO COMMAND LINE TOOL TO CONFIGURE AND CREATE audioboo.json
//try './indexjs --help'

//now try to use audioboo
var api = new audioboo(config);

api.uploadAudio("/Users/Jimi/Desktop/001.mp3", null, function(err, result){
	console.log("error:", err);
	console.log("result:", result);
});