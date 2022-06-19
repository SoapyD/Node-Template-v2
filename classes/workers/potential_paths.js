
const { workerData, parentPort } = require('worker_threads')
var game_pathfinder = require("../game/game_pathfinder")


const getSpiralMatrix = (tile_size, n, x_start, y_start) => {
    // try{	
        const results = [];

        let counter = 1;
        let startRow = 0;
        let endRow = n - 1;
        let startColumn = 0;
        let endColumn = n - 1;

        while(startColumn <= endColumn && startRow <= endRow){
            //COUNT TOP ROW FROM LEFT TO RIGHT
            for(let i= startColumn; i <= endColumn; i++){
                results.push({
                    id: counter,
                    pointer: {
                    x: (x_start + i) * tile_size,
                    y: (y_start + startRow) * tile_size
                    }
                })
                counter++;
            }
            startRow++;

            //COUNT RIGHT COLUMN FROM TOP TO BOTTOM
            for(let i=startRow; i<= endRow; i++){
                results.push({
                    id: counter,
                    pointer: {
                    x: (x_start + endColumn) * tile_size,
                    y: (y_start + i) * tile_size
                    }
                })				
                counter++;
            }
            endColumn--;
            
            //BOTTOM ROW
            for(let i=endColumn; i>= startColumn; i--){
                results.push({
                    id: counter,
                    pointer: {
                    x: (x_start + i) * tile_size,
                    y: (y_start + endRow) * tile_size
                    }
                })						
                counter++;
            }
            endRow--;

            for(let i=endRow; i>=startRow; i--){
                results.push({
                    id: counter,
                    pointer: {
                    x: (x_start + startColumn) * tile_size,
                    y: (y_start + i) * tile_size
                    }
                })					
                counter++;
            }
            startColumn++;			
        }
        
        return results;
    // }catch(e){

    //     let options = {
    //         "class": "unit",
    //         "function": "getSpiralMatrix",
    //         "e": e
    //     }
    //     errorHandler.log(options)
    // }		
}

const gamePathfinder = new game_pathfinder(workerData)


let startX = workerData.setup_data.x_start - workerData.setup_data.movement
let startY = workerData.setup_data.y_start - workerData.setup_data.movement
let endX = workerData.setup_data.x_start + workerData.setup_data.movement
let endY = workerData.setup_data.y_start + workerData.setup_data.movement

let live_tiles = [];
let check_tiles = getSpiralMatrix(1, (endX - startX) + 1, startX, startY);

check_tiles.forEach((check_tile) => {

    if(check_tile.pointer.x >= 0 && check_tile.pointer.y >= 0
        && check_tile.pointer.x < workerData.grid[0].length
        && check_tile.pointer.y < workerData.grid.length        
        ){
            let check_x = check_tile.pointer.x
            let check_y = check_tile.pointer.y
                
            let found = live_tiles.some(i => i.x === check_x && i.y === check_y);
        
            //NO NEED TO CHECK POSITIONS THAT AREN'T CLOSE ENOUGH TO REACH
            let distance = gamePathfinder.twoPointDistance({x: workerData.setup_data.x_start, y: workerData.setup_data.y_start}, {x: check_x,y: check_y});
        
            let cell = workerData.grid[check_y][check_x];
            let acceptable_tile = false
            if(workerData.acceptable_tiles.includes(cell)){
                acceptable_tile = true;
            }			
        
            // this.runDrawLiveTiles();
            if(found === false && distance <= workerData.setup_data.movement && acceptable_tile === true){
        
                workerData.setup_data.x_end = (check_x)
                workerData.setup_data.y_end = (check_y)  

                gamePathfinder.setup(workerData.setup_data)
                let process_list = gamePathfinder.update()
                let process = process_list[0];
        
                if(process){
                    if(process.path_found === true){
            
                        //ADD THE PATH ELEMENTS TO THE LIVE TILES LIST
                        if(process.path){
                            if(process.path.length){
                                let found = false;
                                process.path.forEach((pos) => {
                                    found = live_tiles.some(i => i.x === pos.x && i.y === pos.y);
                                    if(found === false){
                                        live_tiles.push(pos);
                                    }
                                })
            
                            }
                        }
                    }
                }    
            }
        }
    



})



parentPort.postMessage({ 
    welcome: workerData.message
    ,id: workerData.id     
    ,process: {
        id: workerData.setup_data.id
        ,paths: live_tiles
    }

})