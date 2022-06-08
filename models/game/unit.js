const mongoose = require("mongoose");


const unitSchema = new mongoose.Schema({
	name: String
	,cost: Number

	,spritesheet: String
	,sprite_offset: Number
	,size: Number
	,cohesion: Number

	,health: Number	
	,movement: Number
	,death_sfx: String

	,shooting_bonus: Number
	,fighting_bonus: Number

	,symbol_id: Number	
	
	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Unit", unitSchema);