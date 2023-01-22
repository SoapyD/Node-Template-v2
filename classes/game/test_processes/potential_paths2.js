
var game_pathfinder = require("../game_pathfinder")


const getUnitTiles = (workerData) => {
    let unit_tiles = []

    workerData.setup_data.game_data.units.forEach((unit) => {
        if(unit.id != workerData.setup_data.id){
            let info = collisionHandler.getUnitTileRange(unit);

            let map_height = workerData.setup_data.game_data.matrix.length;
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


const getCheckTiles = (workerData, unit_tiles) => {

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
    
                            if(closed_tiles.length == 35){
                                let t = 0
                            }
    
                            let closed_check = closed_tiles.some(i => i.x === x && i.y === y);
                            let open_check = open_tiles.some(i => i.x === x && i.y === y); 
                            let next_check = next_tiles.some(i => i.x === x && i.y === y);         
                            let unit_tile_found = unit_tiles.some(i => i.x === x && i.y === y);   
                            
                            let cell = workerData.grid[y][x];
                            let acceptable_tile = false
                            if(workerData.acceptable_tiles.includes(cell)){
                                acceptable_tile = true;
                            }			


                            if(closed_check === false && open_check === false && 
                                next_check === false && unit_tile_found == false &&
                                acceptable_tile === true){
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

    const gamePathfinder = new game_pathfinder(workerData)

    let game_datas = await databaseHandler.findData({
        model: "GameData"
        ,search_type: "findOne"
        ,params: {_id: workerData.game_data_id}
    })     
    
    game_data = game_datas[0]
    workerData.setup_data.game_data = game_data;    

    let unit_tiles = getUnitTiles(workerData);
    
    let live_tiles = [];
    // let check_tiles = getSpiralMatrix(1, (endX - startX) + 1, startX, startY);
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