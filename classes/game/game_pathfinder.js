
const pathProcess = class {
    constructor(options) {

		if(options.callback){
			this.callback = options.callback;
		}
		if(options.fail_callback){
			this.fail_callback = options.fail_callback;		
		}

		this.id = options.id
		this.sprite_offset = options.sprite_offset
		this.movement = options.movement
		this.obj_size = options.obj_size;
		// this.tile_size = options.tile_size        
		
		this.start = {
			x: options.x_start,
			y: options.y_start
		},
		this.end = {
			x: options.x_end,
			y: options.y_end
		}		

		this.running = true;
		

		this.current = {
			x: 0,
			y: 0
		},			

		
		this.open = [];
		this.closed = [];
        this.path_found = false;
		this.path = [];

		
		this.current_checks = 0;
		this.max_checks = 100;
    }
}


module.exports = class game_pathfinder {
	constructor(options) {
		this.id = options.id,	
		this.grid = options.grid,
		this.width = this.grid[0].length,
        this.height = this.grid.length,
		this.acceptable_tiles = options.acceptable_tiles;	
		
		
		this.current_checks = 0;
		this.max_checks = 100;       
		
		this.process_list = [];
		// this.bound_unit = -1;
		// this.new_processes = [];
	}
	
	
	setup(options) {
		
		//this.bound_unit = this.id;
        let process = new pathProcess(options)

		//add start pos to open list, first needs converting into a node
		let start_node = {
			pos: process.start
		}
		start_node.f_cost = 999;
		process.open.push(start_node)

		// return process;
		this.process_list.push(process)
    }

	twoPointDistance = (pos_start, pos_end) => {
		return Math.sqrt(Math.pow(pos_start.x - pos_end.x, 2) + Math.pow(pos_start.y - pos_end.y, 2))
	}
	


	update() {

		let i = this.process_list.length;

		while(i--){
			let process = this.process_list[i]
			if(process.running === true 
				//&& process.id === this.bound_unit
				//&& (gameFunctions.mode === 'move' || gameFunctions.mode === "charge")
				){
				// console.log("running")
				//only run the pathfinding process if the check number hasn't been reached yet
				if(this.current_checks <= this.max_checks){
					this.run(process)
				}
			}
			else{
				// console.log("NOT RUNNING")
				this.process_list.splice(i,1);
			}
		}

		this.current_checks = 0;
	}

    run(process) {

		//LOOP THROUGH MAX POSITIONS
		for(this.current_checks;this.current_checks<this.max_checks;this.current_checks++){

			if(process.current_checks < process.max_checks){

				//FIND OPEN NODE WITH LOWEST F_COST
				let f_cost = 1000;
				let index = -1;
				let saved_node

				process.open.forEach((open_node, i) => {
					if(open_node.f_cost < f_cost){
						f_cost = open_node.f_cost;
						index = i;
						process.current = open_node;

					}
				})
				
				
				//REMOVE THE LOWEST F_COST FROM OPEN LIST
				process.closed.push(process.current)

				process.open.splice(index, 1);

				
				//IF THE CURRENT POSITION IS THE END POSITION, THE PATH HAS BEEN FOUND
				if(JSON.stringify(process.current.pos) === JSON.stringify(process.end)){

					// return
					process.path_found = true;
					break;
				}
				
				//GET SURROUNDING NODES
				let nodes = this.checkPosition(process);

				if(nodes){

					// let saved_node;
					nodes.forEach((node) => {
						
						let skip = this.checkCell(process, node)

						//if neighbour non traversable or neighbour is in closed list
						if(skip === true || process.closed.some(e => JSON.stringify(e.pos) === JSON.stringify(node.pos))){                    
						// if(node.cell !== 1 || this.closed.some(e => JSON.stringify(e.pos) === JSON.stringify(node.pos))){
							let test = ""
						}
						else{
							
							//IF OPEN LISTS INCLUDES THE CURRENT NODE
							if (process.open.some(e => JSON.stringify(e.pos) === JSON.stringify(node.pos))) {
								//GET ARRAY POSITION
								let index = process.open.findIndex((e) => JSON.stringify(e.pos) === JSON.stringify(node.pos));
								if(index !== -1){
									let open_node = process.open[index]
									if(node.f_cost < open_node.f_cost){
										process.open[index] = node;
									}
								}
								
								//CHECK TO SEE IF IT NEEDS UPDATING
								
							}else{
								//ADD THE NODE
								process.open.push(node)
							}	
						}
					})	
				}

				process.current_checks++;
			}else{
				break;
			}
		}

		//if the path was found in the process
        if(process.path_found === true){
            let index = process.closed.length - 1
            let node;
            process.path = []

			//COUNT BACK THROUGH THE CLOSED TILES UNTIL THE ORIGINAL TILE IS REACHED
            for(let i=0;i<process.max_checks;i++){

				node = process.closed[index]
				//ADD THE NODE POSITION TO THE BEGINNING OF THE ARRAY
                process.path.unshift(node.pos)

				//FIND THE NEXT CLOSED NODE THAT WAS THE ORIGIN OF THE CURRENT NODE
                index = process.closed.findIndex((e) => JSON.stringify(e.pos) === JSON.stringify(node.origin_pos));

				//WHEN THERE'S NO MORE ORIGINS I.E. THE START POINT, STOP THE CHECK
                if(index === -1){
                    break
                }

			}
			
			process.path = process.path.slice(0,process.movement + 1)

			// //OFFSET PATH SO THEY'RE IN THE MIDDLE OF EACH TILE
			process.path.forEach((pos) => {
				pos.x += process.sprite_offset;
				pos.y += process.sprite_offset;
			})

			process.running = false;
            if(process.callback){
                process.callback(this,process)
			}
			
			
        }
        else{         
			if(process.current_checks >= process.max_checks){
				process.running = false;
				if(process.fail_callback){					
					process.fail_callback(process)
				}

				
			}
        }

        
		// return process.path
	}
	
	checkPosition(process){		

		let nodes = []
		
		for(let x=-1;x<2;x++){
			for(let y=-1;y<2;y++){

				//SKIP IF NOT SAME PLACE OR DIAGONALS
				let skip = false;
				if(x === 0 && y === 0){
					skip = true;
				}
				if(x === -1 && y === -1 || x === 1 && y === -1){
				   skip = true;
				}
				if(x === -1 && y === 1 || x === 1 && y === 1){
				   skip = true;
				}				

				if(skip === false){
					let pos = {
						x: process.current.pos.x + x,
						y: process.current.pos.y + y
					}

					let run_check = true;
					let cell;
					if(pos.x >= 0 && pos.x < this.width 
					&& pos.y >= 0 && pos.y < this.height){
						cell = this.grid[pos.y][pos.x]	
						// if(cell !== 1){
						// 	run_check = false;
						// }
					}else{
						run_check = false;
					}

					if(run_check === true){
						let g_cost = this.twoPointDistance(pos, process.current.pos)
						let h_cost = this.twoPointDistance(pos, process.end)
						let f_cost = g_cost + h_cost;

						// if(return_info.distance === -1 || total_distance < return_info.distance){
						// 	return_info.distance = total_distance;
						// 	return_info.pos = pos;
						// }	
						
						let node = {
							origin_pos: process.current.pos,
							pos: pos,
							cell: cell,
							g_cost: g_cost,
							h_cost: h_cost,
							f_cost: f_cost
						}
						nodes.push(node)
					}
				}		
			}
		}		
		
		return nodes
	}

	checkCell(process, node){

		let skip = false;
		if(!this.acceptable_tiles.includes(node.cell)){
			skip = true;
		}

		if(skip === false){
			
			//CHECK CELL CHECK SLIGHTLY DIFFERENTLY DEPENDING ON THE SPRITE OFFSET VALUE

			if(process.sprite_offset === 0){
				for(let x=-process.obj_size;x<=0;x++){
					for(let y=-process.obj_size;y<=0;y++){
						let pos = {
							x: node.pos.x + x,
							y: node.pos.y + y
						}

						if(pos.x >= 0 && pos.x < this.width 
							&& pos.y >= 0 && pos.y < this.height){					
							let check_cell = this.grid[pos.y][pos.x]

							if(!this.acceptable_tiles.includes(check_cell)){
								skip = true;
								break;
							}					
						}
						else{
							skip = true;
							break;
						}
					}
				}				
			}			
			
			if(process.sprite_offset === 0.5){
				for(let x=-process.obj_size;x<=process.obj_size;x++){
					for(let y=-process.obj_size;y<=process.obj_size;y++){
						let pos = {
							x: node.pos.x + x,
							y: node.pos.y + y
						}

						if(pos.x >= 0 && pos.x < this.width 
							&& pos.y >= 0 && pos.y < this.height){					
							let check_cell = this.grid[pos.y][pos.x]

							if(!this.acceptable_tiles.includes(check_cell)){
								skip = true;
								break;
							}					
						}
						else{
							skip = true;
							break;
						}
					}
				}				
			}
			

		}

		return skip
	}    

}
