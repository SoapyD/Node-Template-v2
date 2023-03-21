const mongoose = require("mongoose");


const unitSchema = new mongoose.Schema({		
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


	//SAVED AS A STRING SO THEY CAN BE EASILY SEARCHED INSTEAD OF CONVERTING AN OBJECT TO JSON STRING
	// ,special_rules: [String]
	,special_rules:
	[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "SpecialRule"
	}]	


	,status_effects: [{
		// name: String
		class: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Effect"
		}		
		,life: Number
		,caused_by: Number
	}]

	,path: [{
		x: Number
		,y: Number
		,effects: [String]
		,clashing_units: [Number]
		,damage: {type: Number, default: 0}
		,last_pos: {type: Boolean, default: false}		
	}]

	,fight_targets: [{
		x: Number
		,y: Number
		,target_id: {type: Number, default: -1}
		,damage: {type: Number, default: 0}
	}]

	,targets: [{
		x: Number
		,y: Number
		,hit_time: Number
		,target_id: {type: Number, default: -1}
		,damage: {type: Number, default: 0}
		,effects: [String]
		//POTENTIAL TARGETS NEEDED TO CALCULATE ACTUAL TARGET
		//THESE ARE ADDED TO AN ARRAY, WHICH IS SORTED THEN CHECKED THROUGH IN TERMS OF 'IMPACT TIME'
		//IF A PARENT-BULLET TO POTENTIAL TARGET ENTRY HASN'T HIT A TARGET AND THE POTENTIAL TARGET ISN'T DEAD, ITS SET AS THE TARGET
		//WOUNDING IS THEN FIGURED OUT FOR THAT TARGET AND ANY UNITS IN SPLASH DAMAGE RANGE
		//THIS THEN ALLOWS US TO SEE IF A UNIT IS DEAD, POST-IMPACT, SO FUTURE POTENTIAL TARGET CHEECKS
		//WILL PASS THROUGH THAT UNIT AND CARRY ONTO TARGETS THAT ARE STILL ALIVE
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
			,effects: [String]
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
})



const gameSchema = new mongoose.Schema({
	room_name: String
	,save_count: {type: Number, default: 0}
	,tile_size: Number
    ,acceptable_tiles: [Number]
    ,matrix: [[Number]]    
	,created_date: {type: Date, default: Date.now}
	,updateddate: {type: Date, default: Date.now}	

	///////////////////////////////////////////////////////
	// CORE RELOAD DATA
	///////////////////////////////////////////////////////
		
	,mode: String
	,game_state: {type: Number, default: 0}
	,current_side: {type: Number, default: 0}	

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
		,squad_placement: [
			[{
				x: Number
				,y: Number 
			}]
		]		
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
		,unit_origin_id: {type: Number, default: -1}						
	}]
	
	,units: [unitSchema]
	
});




module.exports = mongoose.model("GameData", gameSchema);