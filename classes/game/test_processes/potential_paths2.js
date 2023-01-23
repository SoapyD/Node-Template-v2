
var game_pathfinder = require("../game_pathfinder")


const getUnitTiles = (workerData) => {
    let unit_tiles = []

    workerData.setup_data.game_data.units.forEach((unit) => {
        if(unit.id != workerData.setup_data.id){
            let info = collisionHandler.getUnitTileRange(unit);

            // let map_height = workerData.setup_data.game_data.matrix.length;
            let map_width = workerData.setup_data.game_data.matrix[0].length;            

            for(let x=info.min.x; x<=info.max.x;x+=1){
                for(let y=info.min.y; y<=info.max.y;y+=1){
                    unit_tiles.push({
                        x: x,
                        y: y,
                        pos: (map_width * y) + x
                    })
                }                
            }
        }
    })

    return unit_tiles;
}


const checkTileClash = (options) => {

    //CHECK EACH TILESET, IF ANY CHECK FAILS, END THE CHECK BY RETURNING A CLASH = TRUE result
    let tile_x = options.x;
    let tile_y = options.y;

    //ONLY THE TRAVEL-TO TILE NEEDS CHECKING HERE AS THESE ONLY ENSURE THE SAME SPACE ISN'T CHECKED MORE THAN ONCE
    let closed_check = options.closed_tiles.some(i => i.x === tile_x && i.y === tile_y);
    if(closed_check === true){
        return true
    }

    let open_check = options.open_tiles.some(i => i.x === tile_x && i.y === tile_y); 
    if(open_check === true){
        return true
    }

    let next_check = options.next_tiles.some(i => i.x === tile_x && i.y === tile_y);         
    if(next_check === true){
        return true
    } 


    //THE ENTIRE AREA OF THE SPRITE FOOT IS CHECKED HERE AS THEY INVOLVE CLASHING WITH OTHER UNITS AND
    //NON-ACCEPTABLE TILES
    let info = options.selected_unit_info;
    let map_height = options.workerData.setup_data.game_data.matrix.length;
    let map_width = options.workerData.setup_data.game_data.matrix[0].length;  


    for(let y=tile_y+info.min_offset.y; y<=tile_y+info.max_offset.y;y+=1){   
        for(let x=tile_x+info.min_offset.x; x<=tile_x+info.max_offset.x;x+=1){

            if(x >= 0 && y >= 0 && x < map_width && y < map_height){            

                let unit_tile_found = options.unit_tiles.some(i => i.x === x && i.y === y);   
                if(unit_tile_found === true){
                    return true
                }    

                // console.log('y',y,'x',x)
                let cell = options.workerData.grid[y][x];
                if(!options.workerData.acceptable_tiles.includes(cell)){
                    return true;
                }	
            }
            else{
                return true;
            }
            
        }
    }

    return false;

}


const getCheckTiles = (workerData, unit_tiles) => {

    let selected_unit = workerData.setup_data.game_data.units[workerData.setup_data.id];
    let selected_unit_info = collisionHandler.getUnitTileRange(selected_unit);

    // let check_tiles = []
    let closed_tiles = [];
    let open_tiles = [];
    open_tiles.push({
        x: workerData.setup_data.x_start,
        y: workerData.setup_data.y_start,        
    })

    let map_height = workerData.setup_data.game_data.matrix.length;
    let map_width = workerData.setup_data.game_data.matrix[0].length;  
    
    let movement = workerData.setup_data.movement;
    // let movement = 2;    

    for(let i=0;i<=movement;i+=1){

        //FOREACH OPEN TILE
        let next_tiles = []
        open_tiles.forEach((open_tile) => {

            let skip = true;
            //LOOP THROUGH N,E,S,W ADDING EACH DIR TO FURTHER OPEN TILE CHECKS
            //AS LONG AS THEY'RE NOT ALREADY IN THE CLOSED TILES LIST
            for(let y=open_tile.y-1; y<=open_tile.y+1; y+=1){
                for(let x=open_tile.x-1; x<=open_tile.x+1; x+=1){

                    if(skip != true){                        
                        if(x >= 0 && y >= 0 && x < map_width && y < map_height){	
                            
                            let tile_clash = checkTileClash({
                                selected_unit_info: selected_unit_info,
                                x: x,
                                y: y,
                                workerData: workerData,
                                closed_tiles: closed_tiles,
                                open_tiles: open_tiles,
                                next_tiles: next_tiles,
                                unit_tiles: unit_tiles,
                            })

                            if(tile_clash === false){
                                next_tiles.push({
                                    x: x,
                                    y: y
                                })
                            }
                        }
                        skip = true;
                    }
                    else{
                        skip = false;
                    }

                }                
            }

            closed_tiles.push(open_tile)
        })

        open_tiles = next_tiles;

    }

    let return_tiles = []
    closed_tiles.forEach((closed_tile) => {
        return_tiles.push({
            pointer: {
                x: closed_tile.x,
                y: closed_tile.y,                
            }
        })
    })

    return return_tiles
}



exports.runProcess = async(workerData) => {

    // const gamePathfinder = new game_pathfinder(workerData)

    let game_datas = await databaseHandler.findData({
        model: "GameData"
        ,search_type: "findOne"
        ,params: {_id: workerData.game_data_id}
    })     
    
    game_data = game_datas[0]
    workerData.setup_data.game_data = game_data;    

    let unit_tiles = getUnitTiles(workerData);
    
    let live_tiles = [];
    let check_tiles = getCheckTiles(workerData, unit_tiles)
    
    check_tiles.forEach((check_tile) => {

        live_tiles.push({
            x: check_tile.pointer.x + 0.5,
            y: check_tile.pointer.y + 0.5,                        
        });  
    })
    
    return { 
        welcome: workerData.message
        ,id: workerData.id     
        ,process: {
            id: workerData.setup_data.id
            ,paths: live_tiles
        }
    }
}