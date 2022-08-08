
const { Worker, workerData } = require('worker_threads')
const utils = require("../../../utils");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
// ######  #     # #     #       #     # ####### ######  #    # ####### ######   #####  
// #     # #     # ##    #       #  #  # #     # #     # #   #  #       #     # #     # 
// #     # #     # # #   #       #  #  # #     # #     # #  #   #       #     # #       
// ######  #     # #  #  # ##### #  #  # #     # ######  ###    #####   ######   #####  
// #   #   #     # #   # #       #  #  # #     # #   #   #  #   #       #   #         # 
// #    #  #     # #    ##       #  #  # #     # #    #  #   #  #       #    #  #     # 
// #     #  #####  #     #        ## ##  ####### #     # #    # ####### #     #  #####   
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

runWorker = (workerData) => {

    try{

        const path = require('path');
    
        return new Promise((resolve, reject) => {
        
            // import workerExample.js script..
        
            const worker = new Worker(path.resolve(__dirname, workerData.worker_path), {workerData});
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`stopped with  ${code} exit code`));
            })
        })
    }catch(e){
        let options = {
            "class": "Worker",
            "function": "runWorker",
            "e": e
        }
        errorHandler.log(options)        
    }

}

exports.findPotentialPathsWorker = async(options) => {
    const result = await runWorker(options)
    socketHandler.returnPotentialPaths(result)
}

exports.setupPathFinderWorker = async(game_data, options) => {
    const result = await runWorker(options)

    //UPDATE UNIT PATH IN TEST GAME_DATA
    let unit = game_data.units[options.setup_data.id];
    unit.path = result.process.path;
    let path_pos = unit.path[unit.path.length - 1]
    unit.x = path_pos.x * game_data.tile_size
    unit.y = path_pos.y * game_data.tile_size
    unit.tileX = path_pos.x - 0.5
    unit.tileY = path_pos.y - 0.5  

    //CHECK COHERANCY FOR THE UNIT
    let squad = utils.cohesionCheck({
        game_data: game_data,
        unit: unit
    });


    //SAVE THE PATH TO THE UNIT
    let update = {}
    update["units."+options.setup_data.id+".path"] = result.process.path; 

    //ADD COHESION CHECK
    squad.forEach((unit) => {
        update["units."+unit.id+".cohesion_check"] = unit.cohesion_check;        
    })

    let update_options = 
    {
        model: "GameData"
        ,params: [
            {
                filter: {_id: game_data.id}, 
                value: {$set: update}
            }
        ]
    }   

    await databaseHandler.updateOne(update_options)   

    socketHandler.returnPath(result)
}

exports.findBulletPathsWorker = async(options) => {
    const result = await runWorker(options)

    socketHandler.generateBullets({
        id: options.id,
        game_data_id: result.process.game_data_id
    })
}