const mongoose = require("mongoose");


const effectSchema = new mongoose.Schema({
	name: String
	,description: String
    ,effect_type: {type: String, default: ''}
	
	,life: Number
	,value: Number
    ,chance: Number    
	
	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Effect", effectSchema);