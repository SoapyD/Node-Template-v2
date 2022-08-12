const mongoose = require("mongoose");


const gameSchema = new mongoose.Schema({
	room_name: String
	,tile_size: Number
    ,acceptable_tiles: [Number]
    ,matrix: [[Number]]    

	,mode: String
	,game_state: {type: Number, default: 0}

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
		selected_unit: {type: Number, default: -1},
		ready: {type: Boolean, default: false}						
	}]

	,barriers: [{
		barrier_class:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Barrier"
		}
		,life: Number
		,x: {type: Number, default: -1}
		,y: {type: Number, default: -1}
		,tileX: {type: Number, default: -1}
		,tileY: {type: Number, default: -1}							
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
		
		// ,poison: Boolean
		// ,poison_caused_by: Number
		// ,poison_timer: Number

		,moved: {type: Boolean, default: false}
		,charged: {type: Boolean, default: false}
		,shot: {type: Boolean, default: false}
		,fought: {type: Boolean, default: false}		
		,is_moving: Boolean
		,cohesion_check: Boolean		

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


		,special_rules: [String]

		,status_effects: [{
			name: String
			,life: Number
			,caused_by: Number
		}]

		,path: [{
			x: Number
			,y: Number
		}]

		,fight_targets: [{
			x: Number
			,y: Number
		}]

		,targets: [{
			x: Number
			,y: Number
			,hit_time: Number
			,target_id: {type: Number, default: -1}
			,damage: {type: Number, default: 0}
			,potential_targets: [{
				range: Number
				,id: Number
				,hit_time: Number
				,pos: {
					x: Number
					,y: Number
				}
			}]
			,blast_targets: [{
				id: Number
				,damage: {type: Number, default: 0}
			}]


			,intersections: [{
				effects: [String],
				distance: Number,
				pos: {
					x: Number
					,y: Number
				}
			}]			
		}]	

		//MAYBE SOURCE THESE FROM THE LINKED UNIT DATA INSTEAD
		,movement: Number
		,size: Number
		,sprite_offset: Number
	}]

   ,created_date: {type: Date, default: Date.now}
   ,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("GameData", gameSchema);