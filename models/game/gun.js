const mongoose = require("mongoose");


const gunSchema = new mongoose.Schema({
	name: String
	,cost: Number
	
	,range: Number
	,damage: Number
	,ap: Number
	,max_targets: Number
	,blast_spritesheet: String
	,blast_radius: Number
	
	,barrier: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Barrier"
	}

	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Gun", gunSchema);