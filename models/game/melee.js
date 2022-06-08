const mongoose = require("mongoose");


const meleeSchema = new mongoose.Schema({
	name: String
	,cost: Number
	
	,damage: Number
	,ap: Number
	,max_targets: Number
	,range: Number	
	
	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Melee", meleeSchema);