var User = module.exports.User = function(data){
	var self = this;
	var publicProperties = ['id','username','counts','urls'];
	
	publicProperties.forEach(function(property){
		self.__defineGetter__(property, function(){
		    return data[property]
		});
	});
}

module.exports.parse = function(content){

	//standardise the data
	if(typeof content == 'string'){
		try{
			content = JSON.parse(content);
		}catch(err){
			content = {};
		}
	}
	
	return new User(content);
}