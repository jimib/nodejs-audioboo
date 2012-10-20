var fs = require('fs'),
	util = require('util'),
	crypto = require('crypto'),
	OAuth= require('oauth').OAuth;
	
var HOST = "http://api.audioboo.fm";
var FORMAT = ".json";
	
AudioBoo = exports.AudioBoo = function(options){
	//bind to the options
	this.options = options || {};
	
	if(options.access_key && options.access_secret){
		this.setAccessToken(options.access_key, options.access_secret);
	}
	
	if(options.app_key && options.app_secret){
		this.setAppToken(options.app_key, options.app_secret);
	}
	
	this.oa = new OAuth(HOST + "/oauth/request_token",
		                   HOST + "/oauth/access_token",
		                   options.app_key,
		                   options.app_secret,
		                   "1.0",
		                   null,
		                   "HMAC-SHA1");
}

AudioBoo.prototype.setAppToken = function(key, secret){
	this.oauth_app_token_key = key;
	this.oauth_app_token_secret = secret;
}

AudioBoo.prototype.setAccessToken = function(key, secret){
	this.oauth_access_token_key = key;
	this.oauth_access_token_secret = secret;
}

AudioBoo.prototype.getRequestToken = function(callback){
	this.oa.getOAuthRequestToken(callback);	
}

AudioBoo.prototype.getAccessToken = function(token, secret, verifier, cb){
	this.oa.getOAuthAccessToken(token, secret, verifier, cb);	
}

AudioBoo.prototype.getAuthorizationURL = function(oauth_token, callback){
	var url = HOST + "/oauth/authorize?oauth_token=" + oauth_token;
	callback(null, url);
}

AudioBoo.prototype.getResource = function(src, callback){
	/*function callback(error, data, response) {}*/
	this.oa.getProtectedResource(src, "GET", this.oauth_access_token_key, this.oauth_access_token_secret,  callback);
}

AudioBoo.prototype.getProtectedResource = function(src, callback){
	/*function callback(error, data, response) {}*/
	this.oa.getProtectedResource(src, "GET", this.oauth_access_token_key, this.oauth_access_token_secret,  callback);
}

AudioBoo.prototype.getClips = function(callback){
	this.getProtectedResource(HOST + "/audio_clips" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.getClips = function(callback){
	this.getProtectedResource(HOST + "/audio_clips" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.getFeaturedClips = function(callback){
	this.getProtectedResource(HOST + "/audio_clips/featured" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.getPopularClips = function(callback){
	this.getProtectedResource(HOST + "/audio_clips/popular" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.getTaggedClips = function(tag, callback){
	this.getProtectedResource(HOST + "/tag/"+tag+"/audio_clips" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.getUserClips = function(userId, callback){
	this.getProtectedResource(HOST + "/users/"+userId+"/audio_clips" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.getUserFollowedClips = function(userId, callback){
	this.getProtectedResource(HOST + "/users/"+userId+"/audio_clips/followed" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.getUsernameClips = function(username, callback){
	this.getProtectedResource(HOST + "/audio_clips" + FORMAT + "?username="+username, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.getCurrentUserClips = function(callback){
	this.getProtectedResource(HOST + "/account/audio_clips" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.getCurrentUserFollowedClips = function(callback){
	this.getProtectedResource(HOST + "/account/audio_clips/followed" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.getCurrentUserInbox = function(callback){
	this.getProtectedResource(HOST + "/account/inbox" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

AudioBoo.prototype.uploadAudio = function(fileAudio, fileImage, callback){
	var self = this;
	fs.readFile(fileImage, function(err, image){
		fs.readFile(fileAudio, function(err, audio){
			//build up the body
			var boundary = createBoundary();
			var contentType = 'multipart/form-data; boundary=' + boundary;
			var doubleDash = "--";
			var lineReturn = "\r\n";
		
			var body = "";
		
			body += doubleDash + boundary + lineReturn;
			body += "Content-Disposition: form-data; name=\"audio_clip[title]\"" + lineReturn;
			body += lineReturn;
			body += "NodeJs Sample Upload" + lineReturn;
		
		
			body += doubleDash + boundary + lineReturn;
			body += "Content-Disposition: form-data; name=\"audio_clip[tag_list]\"" + lineReturn;
			body += lineReturn;
			body += "NodeJs,Upload" + lineReturn;
		
			body += doubleDash + boundary + lineReturn;
			body += "Content-Disposition: form-data; name=\"audio_clip[uploaded_data]\"; filename=\""+fileName+"\"" + lineReturn;
			body += "Content-Type: audio/x-wav" + lineReturn;
			body += lineReturn;
			//add the file contents
			body += audio.toString('binary');
			body += lineReturn;
		
			
			if(image && false){
				//add the image
				body += doubleDash + boundary + lineReturn;
				body += "Content-Disposition: form-data; name=\"audio_clip[uploaded_image]\"; filename=\""+imageName+"\"" + lineReturn;
				body += "Content-Type: image/jpeg" + lineReturn;
				body += lineReturn;
				//add the file contents
				body += image.toString('binary');
				body += lineReturn;
			}
			
			
			//sign it off
			body += doubleDash + boundary + doubleDash;
			
			//need to now encode to generate the oauth_body_hash
			var data = {
				"oauth_body_hash" : self.oa._createSignature(body, oauth_access_token_secret)
			}
			
			//perform the request
			oa._performSecureRequest( self.oauth_access_token_key, self.oauth_access_token_secret, "POST", HOST + "/account/audio_clips.json", data, body, contentType
				,function(error, data, response){
					console.log("data: "+data);
					if(!error){
						data = parseData(data);
					}
					
					if(callback){
						callback(error, data);
					}
				}
			);
		});
	});
	
}


AudioBoo.prototype.getAudioClip = function(clipId, callback){
	this.getResource(HOST + "/audio_clips/"+clipId+".mp3", 
		function(error, data, response){
			//convert the data
			if(!error){
				
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}



//HELPER
function createBoundary()
{
	var boundary = "";
	var chars = "abcdefghiklmnopqrstuvwxyz";
		
	for (var i=0; i<32; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		boundary += chars.substring(rnum,rnum+1);
	}
	
	return boundary;
}

//internal helper method
function parseData(data){
	try{
	 	data = JSON.parse(data);
	}catch(err){
		console.log("Error parsing data: "+err);
	}
	return data;
}
