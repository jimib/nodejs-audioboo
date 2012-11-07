var util = require("util");
var uuid = require("node-uuid");
var libAudioBoo = require("./../");

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
var api = new libAudioBoo.AudioBoo(config);
var id = new Date().getTime().toString();

console.log("id: ",id);

var upload = new libAudioBoo.Upload("/Users/Jimi/Desktop/001.mp3");
upload.setUUID(uuid.v4());
upload.setTitle("Sample Upload using new Audioboo NodeJs Library");
upload.addImage("/Users/Jimi/Desktop/favicon.png");
upload.setTags(["development", "nodejs", "audioboo", "jimib"]);
upload.setDescription("Example of uploading audio and image using nodejs-audioboo.\n\nAudio courtesy of HumbleMarket @ http://www.fact.co.uk/projects/the-humble-market-trade-secrets/ \nView the github repo @ https://github.com/jimib/nodejs-audioboo");

api.upload(upload, function(err, result){
	//show the errors - if any
	if(err)console.log("error:",err);
	//show the result - if any
	if(result)console.log("result:",util.inspect(result, false, 5, true));
});
