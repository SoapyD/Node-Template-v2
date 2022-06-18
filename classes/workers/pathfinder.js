
const { workerData, parentPort } = require('worker_threads')
var game_pathfinder = require("../game/game_pathfinder")

// let selected_unit = game_data.units[player.selected_unit]

const gamePathfinder = new game_pathfinder(workerData)

gamePathfinder.setup(workerData.setup_data)
let process_list = gamePathfinder.update() 

parentPort.postMessage({ 
    welcome: workerData.message 
    ,id: gamePathfinder.id
    ,process: {
        id: process_list[0].id
        ,path: process_list[0].path
    }

})