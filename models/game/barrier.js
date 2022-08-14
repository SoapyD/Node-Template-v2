const mongoose = require("mongoose");


const barrierSchema = new mongoose.Schema({
    name: String
    ,description: String
	,cost: Number
	
    ,blast_radius: Number
    ,blast_sprite: String
    ,life: Number
    // ,modifier: Number
    ,effects: [String]
	
	,f_effects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Effect"
		}
    ]

	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Barrier", barrierSchema);