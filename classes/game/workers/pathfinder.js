
const { workerData, parentPort } = require('worker_threads')
var game_pathfinder = require("../game_pathfinder")
// const databaseClass = require('../../mongoose_db_handler');
// let databaseHandler = new databaseClass();
// const utils = require("../../../utils");

const gamePathfinder = new game_pathfinder(workerData)

runProcess = async(workerData) => {

    // let game_datas = await databaseHandler.findData({
    //     model: "GameData"
    //     ,search_type: "findOne"
    //     ,params: {_id: workerData.game_data_id}
    // })  
    
    // let game_data = game_datas[0]

    gamePathfinder.setup(workerData.setup_data)
    let process_list = gamePathfinder.update() 
    let path = process_list[0].path
    // let unit = game_data.units[workerData.setup_data.id]
    // unit.path = path

    // path = utils.checkStatusEffects.checkPath({game_data: game_data, unit: unit})


    parentPort.postMessage({ 
        welcome: workerData.message 
        ,id: gamePathfinder.id
        ,process: {
            ids: [process_list[0].id]
            ,path: path
        }

    })

}

runProcess(workerData)