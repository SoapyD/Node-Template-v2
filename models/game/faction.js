const mongoose = require("mongoose");


const factionSchema = new mongoose.Schema({
	name: String
	,description: String
	
	,squads: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Squad"
		}
    ]
	
	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Faction", factionSchema);