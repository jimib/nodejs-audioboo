var util = require("util");
var audioboo = require("./../").Audioboo;
var config = require("./audioboo.json");

//USE THE AUDIOBOO COMMAND LINE TOOL TO CONFIGURE AND CREATE audioboo.json
//try './indexjs --help'

var config = require("./audioboo.json");
/*
./audioboo.json contains my personal consumer_keys but is of the following format if you want create it manually

{
	"consumer_key":"************************",
	"consumer_secret":"****************************************************************",
	"access_key":"************************",
	"access_secret":"****************************************************************"
}

access_key and access_secret are only required if you want to access a specific account
*/

//now try to use audioboo
var api = new audioboo(config);

api.getCurrentUserClips(function(err, result){
	//show the errors - if any
	if(err)console.log("error:",err);
	//show the result - if any
	if(result)console.log("result:",util.inspect(result, false, 5, true));
});