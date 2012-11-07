#!/usr/local/bin/node
exports.AudioBoo = require("./lib/audioboo").AudioBoo;
exports.Audio = require("./lib/audio").Audio;
exports.Upload = require("./lib/upload").Upload;
exports.Update = require("./lib/upload").Update;
exports.Url = require("./lib/audio").Url;
exports.User = require("./lib/audio").User;

var HELP = "help", VERSION = "version", CONFIGURE = "configure";
//check if this is being run as a command
if(module.parent == null){
	//are there any arguments
	var util = require("util");
	var args = process.argv.length > 2 ? process.argv.slice(2) : []; 
	var options = {};
	var prevOption;
	args.forEach(function(arg){
		var option;
		if(arg.indexOf("--") == 0){
			option = arg.substr(2);
			switch(option){
				case "h":
				case HELP:
					option = HELP;
					break;
					
				case "v":
				case VERSION:
					option = VERSION;
					break;
					
				case "c":
				case CONFIGURE:
					option = CONFIGURE;
					break;
				
				default:
				
					break;
			}
			
			options[option] = true;
		}else{

		}		
	});
	
	if(options[HELP]){
		//display help
		console.log("\nTo configure audioboo try 'audioboo --"+CONFIGURE+"'\n");
	}
	
	if(options[VERSION]){
		//display the current version
		console.log("Version: 0.0.1");
	}
	
	if(options[CONFIGURE]){
		//guide user through configuration with audioboo
		configureAudioBoo(function(err, config){
			saveConfig(config);
		});
	}
}

function configureAudioBoo(cb)
{
	var util = require("util");
	var prompt = require("prompt");
	
	cb = typeof cb == "function" ? cb : function(){};
	//prompt the user for the consumer key and secret
	prompt.start();
	var config = {};
	//DEFINE THE SCHEMA FOR GETTING THE INFO USING PROMPT
	var schema = {
		properties : {
			consumer_key : {
				description : "consumer api key",
				required : true
			},
			consumer_secret : {
				description : "consumer api secret",
				required : true
			},
			configure_access : {
				description : "Configure to use an account? [y/n]",
				pattern : /y|n/,
				message : "Enter only y or n",
				required : true
			}
		}
	}
	console.log("Log into AudioBoo and generate a consumer key and secret:");
	//GET THE ESSENTIAL INFORMATION AND FIND OUT IF THEY WANT TO USE A SPECIFIC ACCOUNT
	prompt.get(schema, function(err, result){
		if(err){
			console.log("\nSorry, something went wrong... ", err,"\n\n");
		}else{
			//remember the result
			config.consumer_key = result.consumer_key;
			config.consumer_secret = result.consumer_secret;
			if(result.configure_access == 'y'){
				//configure audioboo to a specific account
				configureAudioBooAccountAccess(config, cb);
			}else{
				//save what we have
				cb(null,config);
			}
		}
	});
}

function configureAudioBooAccountAccess(config, cb){
	var util = require("util");
	var prompt = require("prompt");
	
	cb = typeof cb == "function" ? cb : function(){};
	
	//START prompt
	prompt.start();
	var api = new exports.AudioBoo(config);
	
	//GET THE REQUEST TOKEN
	api.getRequestToken(function(err, token, secret){
		if(err)return cb(err);
		//WE NEED AN AUTHORIZATION URL
		api.getAuthorizationURL(token, function(err, url){
			if(err)return cb(err);
			console.log("Authorise Audioboo with your account:");
			console.log(url);

			//CONFIGURE FOR ACCOUNT ACCESS
			var schema = {
				properties : {
					pin : {
						description : "Enter pin",
						required : true
					}
				}
			}

			prompt.get(schema, function(err, result){
				if(err)return cb(err);
				var pin = result.pin;
				//using the pin obtained we authenticate the access code
				api.getAccessToken(token, secret, pin, function(err, access_key, access_secret){
					//ADD THIS INFO TO THE CONFIG FILE
					config.access_key = access_key;
					config.access_secret = access_secret;
					return cb(err, config);
				});
			});
		});
	});
}

function saveConfig(config, cb){
	var util = require("util");
	var prompt = require("prompt");
	var fs = require("fs");
	var path = require("path");
	
	cb = typeof cb == "function" ? cb : function(){};

	prompt.start();
	
	var dir = __dirname;
	
	var schema = {
		properties : {
			dir : {
				description : "save output to\n"+dir,
				required: false
			}
		}
		
	}
	
	//FIND OUT WHERE THEY WANT US TO SAVE THE CONFIG FILE
	prompt.get(schema, function(err, result){
		dir = result.dir == "" ? dir : result.dir;
		//check that this exists and is a directory
		fs.stat(dir, function(err, stat){
			if(!stat.isDirectory())err = "That is not a directory";
			
			if(err){
				console.log(err);
				saveConfig(config, cb);
			}else{
				//write the file out
				fs.writeFile(path.join(dir, "audioboo.json"), JSON.stringify(config), function(err) {
				    if(err){console.log("Error whilst saving file: "+err);}
					cb(err);
				});
			}
		});
	});
}