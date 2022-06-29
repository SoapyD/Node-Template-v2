const mongoose = require("mongoose");


const gameSchema = new mongoose.Schema({
	room_name: String
	,tile_size: Number
    ,acceptable_tiles: [Number]
    ,matrix: [[Number]]    

	,mode: String

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
		pointerY: {type: Number, default: -1},
		selected_unit: {type: Number, default: -1}						
	}]
	
	,units: [{
		
		id: Number
		,side: Number
		,player: Number
		,squad: Number	
		,upgrade_id: Number

		,x: {type: Number, default: 0}
		,y: {type: Number, default: 0}
		,tileX: {type: Number, default: 0}
		,tileY: {type: Number, default: 0}		
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
		
		,selected_gun: Number
		,selected_melee: Number

		,unit_class:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Unit"
		}		
		,armour_class:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Armour"
		}
		,gun_class:
		[{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Armour"
		}]
		,melee_class:
		[{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Melee"
		}]		

		,path: [{
			x: Number
			,y: Number
		}]
		,targets: [{
			x: Number
			,y: Number
		}]		

		,fight_targets: [{
			x: Number
			,y: Number
		}]

		,is_moving: Boolean
		,cohesion_check: Boolean
		
		//MAYBE SOURCE THESE FROM THE LINKED UNIT DATA INSTEAD
		,movement: Number
		,size: Number
		,sprite_offset: Number

	}]

   ,created_date: {type: Date, default: Date.now}
   ,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("GameData", gameSchema);