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
Save the config file and then load it in your application:

//load the config file
var config = require("./audioboo.json");
//load the audioboo library
var audioboo = require("audioboo").AudioBoo;
//generate our api object
var api = new audioboo(config);

//now we can start requesting data and uploading audio
api.getCurrentUserClips(function(err, result){
  //retrieves the list of audio files on the account we configure the application to use
  console.log(result.body.audio_clips);
});

//or upload a file
api.uploadAudio("/path/to/audio.mp3", "/path/to/image.png", function(err, result){
  //uploads the file to audioboo
  console.log("result:", result);
});
