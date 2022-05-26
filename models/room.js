const mongoose = require("mongoose");
// const User = require("../models/user");


const roomSchema = new mongoose.Schema({
	room_name: String
	,password: String
	,sockets: [String]
    ,users: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]

	,author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		user_name: String
    }

	,config: {
		max_players: Number
		,max_sides: Number
		,turn_number: Number
		,current_player: {type: Number, default: 0}
		,current_side: {type: Number, default: 0}
		,mode: String
		,mode_state: {type: Number, default: 0}
	}
	
	// ,selected_unit: {type: Number, default: -1}	
	
	,forces: [{
		player_number: Number
		,user: //{type: String, default: ""}
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}		
		,side: {type: Number, default: -1}
		,start: {type: Number, default: -1}
		,army:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Army"
		}		
		// ,army_id: {type: String, default: ""}
		,army_list: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Army"
			}			
		]
		,army_selected:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Army"
		}			
		,ready: {type: Boolean, default: false}
		,actions: {type: Number, default: 0}
	}]
	
	,units: [{
		
		id: Number
		,side: Number
		,player: Number
		,squad: Number		
		
		,upgrade_id: Number
		,unit_name: String
		,shoot_name: String
		,fight_name: String
		,armour_name: String
		
		,health: Number
		,alive: Boolean
		,killed_by: Number
		,in_combat: Boolean
		
		,x: {type: Number, default: 0}
		,y: {type: Number, default: 0}
		,rotation: {type: Number, default: 0}
	}]
	


   ,created_date: {type: Date, default: Date.now}
   ,updateddate: {type: Date, default: Date.now}	
	
});


module.exports = mongoose.model("Room", roomSchema);