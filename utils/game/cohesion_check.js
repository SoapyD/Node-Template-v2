const _ = require('lodash');
const functions = require("../functions");
// const collisions = require("../../classes/game/collisions");

//  #####  ####### #     # #######  #####  ### ####### #     #        #####  #     # #######  #####  #    # 
// #     # #     # #     # #       #     #  #  #     # ##    #       #     # #     # #       #     # #   #  
// #       #     # #     # #       #        #  #     # # #   #       #       #     # #       #       #  #   
// #       #     # ####### #####    #####   #  #     # #  #  # ##### #       ####### #####   #       ###    
// #       #     # #     # #             #  #  #     # #   # #       #       #     # #       #       #  #   
// #     # #     # #     # #       #     #  #  #     # #    ##       #     # #     # #       #     # #   #  
//  #####  ####### #     # #######  #####  ### ####### #     #        #####  #     # #######  #####  #    # 

const cohesionCheckSquad = (options) => {
	try{	
		//ADD UNITS IN SQUAD THAT AREN'T THE UNIT BEING CHECKED
		// let open = [];
		// options.game_data.units.forEach((unit) => {
		// 	if(unit.alive === true 
		// 		&& unit.id !== options.check_unit.id 
		// 		&& unit.player === options.check_unit.player 
		// 		&& unit.squad === options.check_unit.squad) //
		// 	{
		// 		open.push(unit);
		// 	}
		// })
		let open = _.filter(options.squad, function(o) { 
			return o.id !== options.check_unit.id; 
		});

		//ADD THE CHECK UNIT AS THE FIRST CLOSED UNIT
		let closed = [];
		closed.push(options.check_unit)
		
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

					// console.log("open",open_unit.id, "closed",closed_unit.id, distance)
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
			
			//
			if(any_closed === false){
				return false;
				// break;
			}
			if(new_open.length === 0){
				return true;
				// break;				
			}
			
			// closed.concat(closed_add)
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

		// console.log("-----------")

		if(squad.length === 1){
			squad[0].cohesion_check = true
		}else{
			//CHECK TO SEE EACH UNIT IN THE SQUAD PASSES COHERANCY
			squad.forEach((unit) => {
				unit.cohesion_check = cohesionCheckSquad({
					game_data: options.game_data
					,squad: squad
					,check_unit: unit
				});

				// console.log(unit.cohesion_check)
			})
		}

		/*
		options.game_data.units.forEach((unit) => {
			if(unit.alive === true && unit.player === options.unit.player && unit.squad === options.unit.squad)
			{		
		
				unit.cohesion_check = unit.cohesionCheckSquad();

				// let colours = {
				// 	line_colour: 0x00cccc,
				// 	fill_colour: 0x2ECC40,
				// 	line_alpha: 0.75,
				// 	circle_alpha: 0.75,
				// 	fill_alpha: 0.75,
				// 	width: 5,
				// 	line_width: 5
				// }

				// if(unit.cohesion_check === false){
				// 	colours.line_colour = 0x00cccc;
				// 	colours.fill_colour = 0xFF0000; //0x6666ff	
				// 	// colours.width = 1.0;
				// 	colours.line_width = 1.0;
				// 	colours.fill_alpha = 0.5;
				// }

				// if(unit.id !== this.id || GameScene.selected_unit.length === 0){
				// 	colours.circle_alpha = 0.4,
				// 	colours.fill_alpha = 0.35,
				// 	colours.line_colour = 0x808080; //grey
				// 	colours.line_alpha = 0.35;
				// }
				
				// if(GameScene.selected_unit.length === 0){
				// 	colours.fill_alpha = 0.15;
				// 	colours.line_alpha = 0.15;
				// }

				// unit.drawPath(colours)

				units_check++;
			}
			// else{
			// 	unit.resetCohesionGraphic();
			// }
		})

		//IF ALL OTHER UNITS IN THE SQUAD ARE DEAD, AUTO-PASS THE CHECK
		if(units_check === 1){
			this.cohesion_check = true
		}

		*/

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