const _ = require('lodash');
const functions = require("../functions");

//  #####  ####### #     # #######  #####  ### ####### #     #        #####  #     # #######  #####  #    # 
// #     # #     # #     # #       #     #  #  #     # ##    #       #     # #     # #       #     # #   #  
// #       #     # #     # #       #        #  #     # # #   #       #       #     # #       #       #  #   
// #       #     # ####### #####    #####   #  #     # #  #  # ##### #       ####### #####   #       ###    
// #       #     # #     # #             #  #  #     # #   # #       #       #     # #       #       #  #   
// #     # #     # #     # #       #     #  #  #     # #    ##       #     # #     # #       #     # #   #  
//  #####  ####### #     # #######  #####  ### ####### #     #        #####  #     # #######  #####  #    # 

const cohesionCheckSquad = (options) => {
	try{	

		let open = _.filter(options.squad, function(o) { 
			return o.id !== options.check_unit.id; 
		});

		//ADD THE CHECK UNIT AS THE FIRST CLOSED UNIT
		let closed = [];
		closed.push(options.check_unit)
		// console.log('////////////////////////////')
		
		for(let i=0; i<1000; i++){
			
			let new_open = []
			let closed_add = []
			let any_closed = false;


			open.forEach((open_unit) => {
				//FOR EACH OPEN UNIT, CHECK TO SEE IF THE DISTANCE BETWEEN IT AND EACH
				//CLOSED UNIT IS LESS THAN THE COHESION VALUE GIVEN
				let add_closed = false;
				closed.forEach((closed_unit) => {

					let open_dims = collisionHandler.getUnitTileRange(open_unit, options.game_data.tile_size)
					let closed_dims = collisionHandler.getUnitTileRange(closed_unit, options.game_data.tile_size)					

					let distance = functions.distanceBetweenPoints(open_dims.mid_game, closed_dims.mid_game);
					if(distance <= open_unit.unit_class.cohesion){
						add_closed = true;
					}

					// console.log(
					// 	"open",open_unit.id,
					// 	"closed",closed_unit.id, "dist", distance, 
					// 	"open len", open.length,
					// 	"closed len", closed.length
					// 	)
				})
				
				//IF THE UNIT IS CLOSE ENOUGH TO ANOTHER SQUAD MEMBER, CLOSE THAT UNIT OFF, ELSE ADD IT TO THE OPEN LIST TO BE RECHECKED
				if(add_closed === true){
					closed_add.push(open_unit)
					any_closed = true;
				}
				else{
					new_open.push(open_unit)
				}
			})
			
			
			// console.log(
			// 	"open new len", new_open.length,
			// 	 "closed new len", closed_add.length,
			// 	 "any closed", any_closed
			// 	)

			if(any_closed === false){
				return false;
			}
			if(new_open.length === 0){
				return true;
			}			
			
			closed = closed_add
			open = new_open
				
			
		}
	}catch(e){

		let options = {
			"class": "unit",
			"function": "cohesionCheckSquad",
			"e": e
		}
		errorHandler.log(options)
	}		
}

module.exports = (options) => {
	try{	
		// let units_check = 0;

		//GET A LIST OF UNITS THAT ARE ALIVE AND MATCH TEST UNIT PLAYER AND SQUAD NUMBER
		let squad = _.filter(options.game_data.units, function(o) { 
			return o.alive === true && o.player === options.unit.player && o.squad === options.unit.squad; 
		});
		squad.forEach((unit) => {
			if(unit.path.length > 0){
				let path_pos = unit.path[unit.path.length - 1]
				unit.x = path_pos.x * options.game_data.tile_size
				unit.y = path_pos.y * options.game_data.tile_size
				unit.tileX = path_pos.x - unit.sprite_offset
				unit.tileY = path_pos.y - unit.sprite_offset			
			}
		})

		// console.log("-----------")

		if(squad.length === 1){
			squad[0].cohesion_check = true
		}else{
			let cohesion_check = cohesionCheckSquad({
				game_data: options.game_data
				,squad: squad
				,check_unit: options.unit
			});
			// console.log(cohesion_check)
			squad.forEach((unit) => {
				unit.cohesion_check = cohesion_check;
			})
		}

		return squad
	}catch(e){

		let options = {
			"class": "unit",
			"function": "cohesionCheck",
			"e": e
		}
		errorHandler.log(options)
	}	
}