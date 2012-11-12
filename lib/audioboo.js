var fs = require('fs'),
	util = require('util'),
	crypto = require('crypto'),
	OAuth= require('oauth').OAuth;
	
var Audio = require("./audio");
	
var HOST = "http://api.Audioboo.fm";
var FORMAT = ".json";
	
Audioboo = exports.Audioboo = function(options){
	//bind to the options
	this.options = options || {};
	
	if(options.access_key && options.access_secret){
		this.setAccessToken(options.access_key, options.access_secret);
	}
	
	if(options.consumer_key && options.consumer_secret){
		this.setConsumerToken(options.consumer_key, options.consumer_secret);
	}
	
	this.oa = new OAuth(HOST + "/oauth/request_token",
		                   HOST + "/oauth/access_token",
		                   options.consumer_key,
		                   options.consumer_secret,
		                   "1.0",
		                   null,
		                   "HMAC-SHA1");
		
}

Audioboo.prototype.setConsumerToken = function(key, secret){
	this.oauth_consumer_token_key = key;
	this.oauth_consumer_token_secret = secret;
}

Audioboo.prototype.setAccessToken = function(key, secret){
	this.oauth_access_token_key = key;
	this.oauth_access_token_secret = secret;
}

Audioboo.prototype.getRequestToken = function(callback){
	this.oa.getOAuthRequestToken(callback);	
}

Audioboo.prototype.getAccessToken = function(token, secret, verifier, cb){
	this.oa.getOAuthAccessToken(token, secret, verifier, cb);	
}

Audioboo.prototype.getAuthorizationURL = function(oauth_token, callback){
	var url = HOST + "/oauth/authorize?oauth_token=" + oauth_token;
	callback(null, url);
}

Audioboo.prototype.getResource = function(src, callback){
	/*function callback(error, data, response) {}*/
	this.oa.getProtectedResource(src, "GET", this.oauth_access_token_key, this.oauth_access_token_secret,  callback);
}

Audioboo.prototype.deleteResource = function(src, callback){
	this.oa.getProtectedResource(src, "DELETE", this.oauth_access_token_key, this.oauth_access_token_secret,  callback);
}

Audioboo.prototype.getProtectedResource = function(src, callback){
	/*function callback(error, data, response) {}*/
	this.oa.getProtectedResource(src, "GET", this.oauth_access_token_key, this.oauth_access_token_secret,  callback);
}

Audioboo.prototype.getClipDetails = function(id, callback){
	this.getProtectedResource(HOST + "/audio_clips/" + id + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}else{
				console.log("error: "+error);
			}
			//callback
			if(callback){
				callback(error, data);
			}
		}
	);
}

Audioboo.prototype.getClips = function(callback){
	this.getProtectedResource(HOST + "/audio_clips" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data ? data.audio_clips : data, data ? data.totals : data);
			}
		}
	);
}

Audioboo.prototype.getFeaturedClips = function(callback){
	this.getProtectedResource(HOST + "/audio_clips/featured" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data ? data.audio_clips : data, data ? data.totals : data);
			}
		}
	);
}

Audioboo.prototype.getPopularClips = function(callback){
	this.getProtectedResource(HOST + "/audio_clips/popular" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data ? data.audio_clips : data, data ? data.totals : data);
			}
		}
	);
}

Audioboo.prototype.getTaggedClips = function(tag, callback){
	this.getProtectedResource(HOST + "/tag/"+tag+"/audio_clips" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data ? data.audio_clips : data, data ? data.totals : data);
			}
		}
	);
}

Audioboo.prototype.getUserClips = function(userId, callback){
	this.getProtectedResource(HOST + "/users/"+userId+"/audio_clips" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data ? data.audio_clips : data, data ? data.totals : data);
			}
		}
	);
}

Audioboo.prototype.getUserFollowedClips = function(userId, callback){
	this.getProtectedResource(HOST + "/users/"+userId+"/audio_clips/followed" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data ? data.audio_clips : data, data ? data.totals : data);
			}
		}
	);
}

Audioboo.prototype.getUsernameClips = function(username, callback){
	this.getProtectedResource(HOST + "/audio_clips" + FORMAT + "?username="+username, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data ? data.audio_clips : data, data ? data.totals : data);
			}
		}
	);
}

Audioboo.prototype.getCurrentUserClips = function(callback){
	this.getProtectedResource(HOST + "/account/audio_clips" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(error){
				callback(error);
			}else{
				data = parseData(data);
				if(data && data.body && data.body.audio_clips){
					data.body.audio_clips = Audio.parse(data.body.audio_clips);
				}
				callback(null, data ? data.audio_clips : data, data ? data.totals : data);
			}
		}
	);
}

Audioboo.prototype.getCurrentUserFollowedClips = function(callback){
	this.getProtectedResource(HOST + "/account/audio_clips/followed" + FORMAT, 
		function(error, data, response){
			//convert the data
			if(!error){
				data = parseData(data);
			}
			//callback
			if(callback){
				callback(error, data ? data.audio_clips : data, data ? data.totals : data);
			}
		}
	);
}

Audioboo.prototype.getCurrentUserInbox = function(callback){
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

Audioboo.prototype.upload = function(upload, callback){
	var self = this;
	
	upload.export(function(err, bodyUpload, contentTypeUpload){
		if(err){
			callback("Error exporting upload:\n\t"+err);
		}else{
			//Create a signature to authenticate the body we are sending
			var data = {
				"oauth_body_hash" : self.oa._createSignature(bodyUpload, self.oauth_access_token_secret)
			}

			//perform the request
			self.oa._performSecureRequest( 	self.oauth_access_token_key, 
											self.oauth_access_token_secret, 
											"POST", 
											HOST + "/account/audio_clips.json", 
											data, 
											bodyUpload, 
											contentTypeUpload,
											//handle the result
											function(error, data, response){

												data = parseData(data);

												if(callback){
													callback(error, data);
												}
											}
			);
		}
	});
}

Audioboo.prototype.update = function(clipId, update, callback){
	var self = this;
	
	update.export(function(err, bodyUpload, contentTypeUpload){
		if(err){
			callback("Error exporting upload:\n\t"+err);
		}else{
			//Create a signature to authenticate the body we are sending
			var data = {
				"oauth_body_hash" : self.oa._createSignature(bodyUpload, self.oauth_access_token_secret)
			}

			//perform the request
			self.oa._performSecureRequest( 	self.oauth_access_token_key, 
											self.oauth_access_token_secret, 
											"PUT", 
											HOST + "/audio_clips/"+clipId+".json", 
											data, 
											bodyUpload, 
											contentTypeUpload,
											//handle the result
											function(error, data, response){
												console.log("data: ", data);
												//data = parseData(data);

												if(callback){
													callback(error, data);
												}
											}
			);
		}
	});
}

Audioboo.prototype.getAudioClip = function(clipId, callback){
	this.getResource(HOST + "/audio_clips/"+clipId + FORMAT, 
		function(error, data, response){
			//convert the data
			var data = parseData(data);
			
			//callback
			if(callback){
				callback(error, data ? data.audio_clip : data);
			}
		}
	);
}

Audioboo.prototype.deleteAudioClip = function(clipId, callback){
	this.deleteResource(HOST + "/audio_clips/"+clipId + FORMAT, 
		function(error, response){
			//convert the data
			var success;
			var body = parseResponseforBody(response);
			
			if(error){
				success = false;
			}else{
				success = body && body.deleted ? true : false;
			}
			
			//callback
			if(callback){
				callback(error, success);
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

function getFile(path, callback){
	//try to load the file
	try{
		fs.readFile(path, callback);
	}catch(err){
		callback(err);
	}
}

//internal helper method
function parseData(data){
	try{
		data = JSON.parse(data);
		data = data && data.body ? data.body : data;
	}catch(err){
		console.log("Error parsing data: "+err);
	}
	return data;
}

function parseResponseforBody(response){
	var body = null;
	try{
		body = JSON.parse(response).body;
	}catch(err){
		console.log("Error parsing data: "+err);
	}
	return body;
}
