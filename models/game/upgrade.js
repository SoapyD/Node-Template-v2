const mongoose = require("mongoose");


const upgradeSchema = new mongoose.Schema({
	name: String
	,cost: Number
	,description: String
	,upgrades_all_in_squad: {type: Boolean, default: false}
	,spritesheet: String

	,unit: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Unit"
	}		
	,gun: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Gun"
	}	
	,melee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Melee"
	}		
	,armour: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Armour"
	}

});


module.exports = mongoose.model("Upgrade", upgradeSchema);