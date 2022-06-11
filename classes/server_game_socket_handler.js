
var server_socket_handler = require("./server_socket_handler")

module.exports = class server_game_socket_handler extends server_socket_handler {
	constructor(options) {	
        super(options)
        // this.test2()

        this.defineCoreFunctions()
    }

    setupGameData = async(socket, options) => {

        //EXTRACT MAP DATA
        const classes = require('../classes');
        const gameMap = new classes.game_maps()
        await gameMap.setup();


        //LOAD UP THE FORCE THE USER WILL USE
        // let army = await databaseHandler.findData({
        // 	model: "Army"
        // 	,search_type: "find"
        // 	,params: {name: "Test"}
        // })

        // room.forces[0].side = 0;
        // room.forces[0].start = 0;
        // room.forces[0].army = army[0]._id;


        //CREATE A NEW INSTANCE OF GAME_DATA
        let game_data = await databaseHandler.createData({
            model: "GameData"
            ,params: [{
                acceptable_tiles: gameMap.acceptable_tiles,
                matrix: gameMap.matrix,            
            }]
        })
        


        let return_options = {
            type: "room",
            id: options.data.room_name,
            functionGroup: "core",
            function: "transitionScene",
            scene: 'GameScene'  
        }        

        this.sendMessage(return_options) 

    }
}