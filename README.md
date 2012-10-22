nodejs-audioboo
================

Library for interacting with Audioboo

Add to your package.json file list of dependencies:
"audioboo" : "git://github.com/jimib/nodejs-audioboo.git#master"

Install using npm:
npm install -d

To use Audioboo's API you must create a set of consumer keys through your AudioBoo account.
AudioBoo > Settings > API Keys

Create a config file using the command line tool.

cd node_modules/audioboo

./index.js --configure

The application will take you through the authetication process and create a config file to be used by your application.

The config file is of the format if you want create it manually:
<pre>
{
	"consumer_key":"************************",
	"consumer_secret":"****************************************************************",
	"access_key":"************************",
	"access_secret":"****************************************************************"
}
</pre>

Save the config file and then load it in your application:

<pre>
//load the config file
var config = require("./audioboo.json");
//load the audioboo library
var libAudioBoo = require("audioboo");
//generate our api object
var api = new libAudioBoo.AudioBoo(config);
//now we can start requesting data and uploading audio
api.getCurrentUserClips(function(err, result){
  //retrieves the list of audio files on the account we configure the application to use
  console.log(result.body.audio_clips);
});
</pre>

An important part of Audioboo is being able to upload audio:

<pre>
//load the config file
var config = require("./audioboo.json");
//load the audioboo library
var libAudioBoo = require("audioboo");

var api = new libAudioBoo.AudioBoo(config);

var upload = new libAudioBoo.Upload("Sample Upload using NodeJs Audioboo Library", "/Users/Jimi/Desktop/001.mp3");
//optional - add an image
upload.addImage("/Users/Jimi/Desktop/favicon.png");
//optional
upload.setTags(["development", "nodejs", "audioboo", "jimib"]);
//optional
upload.setDescription("Example of uploading audio and image using nodejs-audioboo.\n View the github repo @ https://github.com/jimib/nodejs-audioboo");

//upload the package
api.upload(upload, function(err, result){
	console.log("error:", err);
	console.log("result:", result);
});
</pre>
