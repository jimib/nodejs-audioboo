var fs = require("fs");
var path = require("path");
var util = require("util");

var Upload = module.exports.Upload = function(){
	var self = this;
	this.properties = {};
}

var Update = module.exports.Update = function(){
	Upload.call(this);
}

util.inherits(Update, Upload);

Upload.prototype.setUUID = function(uuid){
	this.properties["audio_clip[uuid]"] = uuid;
}

Upload.prototype.setTitle = function(title){
	this.properties["audio_clip[title]"] = title;
}

Upload.prototype.setDescription = function(description){
	this.properties["audio_clip[description]"] = description;
}

Upload.prototype.setRecordedAt = function(recorded_at){
	this.properties["audio_clip[recorded_at]"] = recorded_at;
}

Upload.prototype.setLocation = function(latitude, longitude, accurary){
	this.properties["audio_clip[location_latitude]"] = latitude;
	this.properties["audio_clip[location_longitude]"] = longitude;
	if(accuracy){
		this.properties["audio_clip[location_accuracy]"] = accuracy;
	}else{
		delete this["audio_clip[location_accuracy]"];
	}
}

Upload.prototype.setTags = function(tags){
	if(typeof tags == "string"){
		//convert to an array
		tags = [tags];
	}
	
	//convert the tags array into a list
	var strTags = "";
	tags.forEach(function(tag){
		if(strTags.length > 0){
			strTags += " , "			
		}
		strTags += "\""+tag+"\"";
	});
	
	this.properties["audio_clip[tag_list]"] = strTags;
}

Upload.prototype.addAudio = function(srcAudio){
	this.srcAudio = srcAudio;
}

Upload.prototype.addImage = function(srcImage){
	this.srcImage = srcImage;
}

Upload.prototype.export = function(cb){
	var self = this;
	//load the image
	getFile(self.srcImage, function(errImage, image){
		//load the audio
		getFile(self.srcAudio, function(errAudio, audio){
			//check we have audio and 
			if(errAudio){
				//audio is required
				return cb("Unable to load audio:"+errAudio);
			}
			
			constructBody(self, image, audio, function(err, body, contentType){
				cb(err, body, contentType);
			});
		});
	});
};

Update.prototype.export = function(cb){
	var self = this;
	//load the image
	getFile(self.srcImage, function(errImage, image){
		//load the audio
		getFile(self.srcAudio, function(errAudio, audio){
			//no errors - if they don't provide audio or image then that's ok
			constructBody(self, image, audio, function(err, body, contentType){
				cb(err, body, contentType);
			});
		});
	});
};

function constructBody(content, image, audio, cb){
	
	//construct the body
	var boundary = createBoundary();
	var contentType = 'multipart/form-data; boundary=' + boundary;
	var doubleDash = "--";
	var lineReturn = "\r\n";
	var dataFormat = "binary";
	
	var body = "";
	//LIST THROUGH THE PROPERTIES AND ADD EACH ONE TO THE BODY
	for(var id in content.properties){
		body += doubleDash + boundary + lineReturn;
		body += createContentDisposition(id) + lineReturn;
		body += lineReturn;
		body += content.properties[id] + lineReturn;
	}
	
	//display the properties add for debugging
	//console.log(body);
	
	//ADD THE AUDIO
	//get the audio name
	if(audio){
		var nameAudio = path.basename(content.srcAudio);
		var headerAudio = getHeaderForFile(content.srcAudio);
	
		body += doubleDash + boundary + lineReturn;
		body += createContentDisposition("audio_clip[uploaded_data]")+" filename=\""+nameAudio+"\"" + lineReturn;
		body += createContentType(headerAudio) + lineReturn;
		body += lineReturn;
		//add the file contents
		body += convertDataToString(audio) + lineReturn;
	}
	
	if(image){
		//add the image
		var nameImage = path.basename(content.srcImage);
		var headerImage = getHeaderForFile(content.srcImage);
		
		body += doubleDash + boundary + lineReturn;
		body += createContentDisposition("audio_clip[uploaded_image]")+" filename=\""+nameImage+"\"" + lineReturn;
		body += createContentType(headerImage) + lineReturn;
		body += lineReturn;
		//add the file contents
		body += convertDataToString(image) + lineReturn;
	}
	
	//sign it off
	body += doubleDash + boundary + doubleDash;
	
	cb(null, body, contentType);
}


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

function createContentDisposition(name){
	return "Content-Disposition: form-data; name=\""+name+"\";";
}

function createContentType(type){
	return "Content-Type: " + type;
}

function convertDataToString(data){
	return data.toString("binary");
}

function getHeaderForFile(file){
	var extension = path.extname(file);
	var header = null;
	
	if(extension){
		switch(extension.toLowerCase()){
			case ".mp3":
				header = "audio/mpeg";
			break;
			
			case ".wav":
			case ".wave":
				header = "audio/wav";
			break;
			
			case "ogg":
			case "oga":
				header = "audio/ogg"
			break;
				
			case ".png":
				header = "image/png";
			break;
			
			case ".jpeg":
			case ".jpg":
			case ".jpe":
				header = "image/jpeg";
			break;
		}
	}
	
	return header;
}
