
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


let startX = workerData.unit.x_start - workerData.unit.movement
let startY = workerData.unit.y_start - workerData.unit.movement
let endX = workerData.unit.x_start + workerData.unit.movement
let endY = workerData.unit.y_start + workerData.unit.movement

let live_tiles = [];
let check_tiles = getSpiralMatrix(1, (endX - startX) + 1, startX, startY);

check_tiles.forEach((check_tile) => {
    
    let check_x = (check_tile.pointer.x / GameScene.map.tileWidth) + this.unit_class.sprite_offset
    let check_y = (check_tile.pointer.y / GameScene.map.tileHeight) + this.unit_class.sprite_offset
        
    let found = live_tiles.some(i => i.x === check_x && i.y === check_y);

    //NO NEED TO CHECK POSITIONS THAT AREN'T CLOSE ENOUGH TO REACH
    let distance = gameFunctions.twoPointDistance({x: this.sprite.x / gameFunctions.tile_size, y: this.sprite.y / gameFunctions.tile_size}, {x: check_x,y: check_y});

    let cell = GameScene.grid[check_y - this.unit_class.sprite_offset][check_x - this.unit_class.sprite_offset];
    let acceptable_tile = false
    if(GameScene.acceptable_tiles.includes(cell)){
        acceptable_tile = true;
    }			

    // this.runDrawLiveTiles();
    if(found === false && distance <= this.unit_class.movement && acceptable_tile === true){

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



})



parentPort.postMessage({ 
    welcome: workerData.message 
    ,check_tiles: check_tiles
    // ,process: {
    //     id: process_list[0].id
    //     ,path: process_list[0].path
    // }

})