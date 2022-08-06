
const { Worker, workerData } = require('worker_threads')

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
    //SAVE THE PATH TO THE UNIT

    let update = {}
    update["units."+options.setup_data.id+".path"] = result.process.path; 

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

    // let game_datas = await databaseHandler.findData({
    //     model: "GameData"
    //     ,search_type: "findOne"
    //     ,params: {_id: result.process.game_data_id}
    // })     
    
    // let game_data = game_datas[0]

    // console.log(result)
    socketHandler.generateBullets({
        id: options.id,
        game_data_id: result.process.game_data_id
    })
}