var Url = module.exports.Url = function(data){
	var self = this;
	var publicProperties = ['detail','high_mp3','image'];
	
	publicProperties.forEach(function(property){
		self.__defineGetter__(property, function(){
		    return data[property]
		});
	});
}

module.exports.parse = function(content){
	var objUrl = [];
	
	//standardise the data
	if(typeof content == 'string'){
		try{
			content = JSON.parse(content);
		}catch(err){
			content = {};
		}
	}
	
	if(typeof content == 'object'){
		var index = 0;
		
		for(var i in content){
			objUrl[i] = new Url(content[i]);
		}	
	}
	
	return objUrl;
}