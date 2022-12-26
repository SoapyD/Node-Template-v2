const mongoose = require("mongoose");


const effectSchema = new mongoose.Schema({
	name: String
	,description: String
    ,effect_type: {type: String, default: ''}
	,sub_type: {type: String, default: ''}
	
	,life: Number
	,value: Number
    ,chance: {type: Number, default: 0}

	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Effect", effectSchema);