
// const workerpool = require('workerpool');
var game_pathfinder = require("../game_pathfinder")

// const databaseClass = require('../../mongoose_db_handler');
// let databaseHandler = new databaseClass();

exports.runProcess = async(workerData) => {

    let game_datas = await databaseHandler.findData({
        model: "GameData"
        ,search_type: "findOne"
        ,params: {_id: workerData.game_data_id}
    })  
    
    game_data = game_datas[0]
    workerData.setup_data.game_data = game_data;

    const gamePathfinder = new game_pathfinder(workerData)    

    gamePathfinder.setup(workerData.setup_data)
    let process_list = gamePathfinder.update() 

    return { 
        welcome: workerData.message 
        ,id: gamePathfinder.id
        ,game_data_id: workerData.game_data_id
        ,process: {
            ids: [process_list[0].id]
            ,path: process_list[0].path
        }
    }

}

// runProcess(workerData)
// workerpool.worker({
//     runProcess: runProcess
// });