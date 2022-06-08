const mongoose = require("mongoose");


const armourSchema = new mongoose.Schema({
	name: String
	,cost: Number
	
	,value: Number
	
	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Armour", armourSchema);