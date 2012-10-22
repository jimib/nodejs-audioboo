var Url = require("./url");
var User = require("./user");

var Audio = module.exports.Audio = function(data){
	var self = this;
	var publicProperties = ['id','title','user','duration','urls'];
	
	data.urls = Url.parse(data.urls);
	data.user = User.parse(data.user);
	
	publicProperties.forEach(function(property){
		self.__defineGetter__(property, function(){
		    return data[property]
		});
	});
}

module.exports.parse = function(content){
	var arrAudio = [];
	
	//standardise the data
	if(typeof content == 'string'){
		try{
			content = JSON.parse(content);
		}catch(err){
			content = [];
		}
	}
	
	if(typeof content == 'object' && typeof content.forEach == 'function'){
		var index = 0;
		
		content.forEach(function(item){
			arrAudio.push(new Audio(item));
		});	
	}
	
	return arrAudio;
}