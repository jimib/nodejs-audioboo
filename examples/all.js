var util = require("util");
var audioboo = require("./../").AudioBoo;
var config = require("./audioboo.json");

//USE THE AUDIOBOO COMMAND LINE TOOL TO CONFIGURE AND CREATE audioboo.json
//try './indexjs --help'

//now try to use audioboo
var api = new audioboo(config);

api.getCurrentUserClips(function(err, result){
	
});