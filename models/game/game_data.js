const mongoose = require("mongoose");


const gameSchema = new mongoose.Schema({
	room_name: String
    ,acceptable_tiles: [Number]
    ,matrix: [[Number]]    

	,forces: [{
		side: {type: Number, default: -1}
		,start: {type: Number, default: -1}
		,army:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Army"
		}	
		,user:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}	
	}]

	,players: [{
		x: {type: Number, default: -1},
		y: {type: Number, default: -1},
		pointerX: {type: Number, default: -1},
		pointerY: {type: Number, default: -1}						
	}]
	
	,units: [{
		
		id: Number
		,side: Number
		,player: Number
		,squad: Number	
		,upgrade_id: Number

		,x: {type: Number, default: 0}
		,y: {type: Number, default: 0}
		,angle: {type: Number, default: 0}
		
		,alive: Boolean
		,cost: Number		
		,health: Number

		,killed_by: Number
		,in_combat: Boolean
		,in_combat_with: [Number]
		
		,poison: Boolean
		,poison_caused_by: Number
		,poison_timer: Number

		,moved: Boolean
		,charged: Boolean
		,shot: Boolean
		,fought: Boolean								
	}]

   ,created_date: {type: Date, default: Date.now}
   ,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("GameData", gameSchema);