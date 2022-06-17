
var server_socket_handler = require("./server_socket_handler")
var game_pathfinder = require("./game/game_pathfinder")

module.exports = class server_game_socket_handler extends server_socket_handler {
	constructor(options) {	
        super(options)
        // this.test2()

        this.defineCoreFunctions()
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  #####  ####### ####### #     # ######         #####     #    #     # ####### ######     #    #######    #    
    // #     # #          #    #     # #     #       #     #   # #   ##   ## #       #     #   # #      #      # #   
    // #       #          #    #     # #     #       #        #   #  # # # # #       #     #  #   #     #     #   #  
    //  #####  #####      #    #     # ######  ##### #  #### #     # #  #  # #####   #     # #     #    #    #     # 
    //       # #          #    #     # #             #     # ####### #     # #       #     # #######    #    ####### 
    // #     # #          #    #     # #             #     # #     # #     # #       #     # #     #    #    #     # 
    //  #####  #######    #     #####  #              #####  #     # #     # ####### ######  #     #    #    #     # 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    setupGameData = async(socket, options) => {

        try{
            //EXTRACT MAP DATA
            const classes = require('../classes');
            const gameMap = new classes.game_maps()
            await gameMap.setup();

            let selected_force = options.data.selected_forces[0]
            //LOAD UP THE FORCE THE USER WILL USE
            let army = await databaseHandler.findData({
                model: "Army"
                ,search_type: "find"
                ,params: {name: selected_force.army}
            })

            let forces = []
            let force = {
                side: 0,
                start: 0,
                army: army[0][0]._id,
                user: selected_force.user
            }
            forces.push(force)

            let players = []
            options.data.selected_forces.forEach((player) => {
                players.push({})
            })


            //CREATE A NEW INSTANCE OF GAME_DATA
            let game_data = await databaseHandler.createData({
                model: "GameData"
                ,params: [{
                    tile_size: gameMap.tile_size
                    ,acceptable_tiles: gameMap.acceptable_tiles
                    ,matrix: gameMap.matrix
                    ,forces: forces
                    ,players: players            
                }]  
            })
            
            //GET THE POPULATE GAMES DATA
            let game_datas = await databaseHandler.findData({
                model: "GameData"
                ,search_type: "findOne"
                ,params: {_id: game_data[0]._id}
            })            

            // let data = game_datas[0].forces[0].user
            let data2 = game_datas[0].forces[0].army.squads

            let return_options = {
                type: "room",
                id: options.data.room_name,
                functionGroup: "core",
                function: "setupGameData",
                scene: 'GameScene',
                data: {
                    id: game_datas[0]._id,
                    forces: game_datas[0].forces
                }
            }        
            this.sendMessage(return_options) 

            return_options = {}
            return_options = {
                type: "room",
                id: options.data.room_name,
                functionGroup: "core",
                function: "transitionScene",
                scene: 'GameScene'  
            }        

            this.sendMessage(return_options) 
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "setupGameData",
                "e": e
            }
            errorHandler.log(options)
        }	
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  #####     #    #     # #######       #     # #     # ### #######       ######     #    #######    #    
    // #     #   # #   #     # #             #     # ##    #  #     #          #     #   # #      #      # #   
    // #        #   #  #     # #             #     # # #   #  #     #          #     #  #   #     #     #   #  
    //  #####  #     # #     # #####   ##### #     # #  #  #  #     #    ##### #     # #     #    #    #     # 
    //       # #######  #   #  #             #     # #   # #  #     #          #     # #######    #    ####### 
    // #     # #     #   # #   #             #     # #    ##  #     #          #     # #     #    #    #     # 
    //  #####  #     #    #    #######        #####  #     # ###    #          ######  #     #    #    #     # 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    saveUnitData = (socket, options) => {
        try{
            let game_data = databaseHandler.updateOne({
                model: "GameData"
                ,params: [
                    {
                        filter: {_id: options.data.id}, 
                        value: {$set: options.data.update}
                    }
                ]
            })        
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "saveUnitData",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    // #     # ####### #     # #######       #     #    #    ######  #    # ####### ######  
    // ##   ## #     # #     # #             ##   ##   # #   #     # #   #  #       #     # 
    // # # # # #     # #     # #             # # # #  #   #  #     # #  #   #       #     # 
    // #  #  # #     # #     # #####   ##### #  #  # #     # ######  ###    #####   ######  
    // #     # #     #  #   #  #             #     # ####### #   #   #  #   #       #   #   
    // #     # #     #   # #   #             #     # #     # #    #  #   #  #       #    #  
    // #     # #######    #    #######       #     # #     # #     # #    # ####### #     # 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    moveMarker = async(socket, options) => {
        try{

            let game_data = databaseHandler.updateOne({
                model: "GameData"
                ,params: [
                    {
                        filter: {_id: options.data.id}, 
                        value: {$set: options.data.update}
                    }
                ]
            })            

            //RETURN POSITIONAL DATA TO PLAYERS
            let return_options = {
                type: "room",
                id: options.id,
                functionGroup: "core",
                function: "moveMarker",
                data: options.data
            }        
            this.sendMessage(return_options) 
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "moveMarker",
                "e": e
            }
            errorHandler.log(options)
        }        
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //  #####  #       ###  #####  #    #       #     #    #    #     # ######  #       ####### ######  
    // #     # #        #  #     # #   #        #     #   # #   ##    # #     # #       #       #     # 
    // #       #        #  #       #  #         #     #  #   #  # #   # #     # #       #       #     # 
    // #       #        #  #       ###    ##### ####### #     # #  #  # #     # #       #####   ######  
    // #       #        #  #       #  #         #     # ####### #   # # #     # #       #       #   #   
    // #     # #        #  #     # #   #        #     # #     # #    ## #     # #       #       #    #  
    //  #####  ####### ###  #####  #    #       #     # #     # #     # ######  ####### ####### #     # 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

    clickHandler = async(socket, options) => {
        try{

            //GET THE POPULATE GAMES DATA
            let game_data = await databaseHandler.findData({
                model: "GameData"
                ,search_type: "findOne"
                ,params: {_id: options.data.id}
            }, false)
            
            //FIND IF A UNIT IS SELECTED
            let unit_selected = false
            let matrix = [];
            let acceptable_tiles = [];
            // let saved_unit = {};
            let player;

            if(game_data[0]){
                //GET PLAYER POSITION DATA
                game_data = game_data[0]
                player = game_data.players[options.data.player];

                matrix = game_data.matrix;
                acceptable_tiles = game_data.acceptable_tiles;                

                game_data.units.forEach((unit) => {
                    //NEED TO RUN A CLASH CHECK HERE INSTEAD TO SEE IF THE CLICK POSITION IS WITHIN THE UNIT BOUNDS
                    if(player.pointerX === unit.tileX && player.pointerY === unit.tileY){
                        if(unit.player === options.data.player){

                            unit_selected = true;
                            // saved_unit = unit; 
                            let update = {}
                            update["players."+options.data.player+".selected_unit"] = unit.id;

                            databaseHandler.updateOne({
                                model: "GameData"
                                ,params: [
                                    {
                                        filter: {_id: options.data.id}, 
                                        value: {$set: update}
                                    }
                                ]
                            })   

                        }
                    }
                })

            }

            //A NEW UNIT HAS BEEN SELECTED
            if(unit_selected === false){
                //GET SELECTED UNIT DATA

                if(player && player.selected_unit !== -1){
                    let selected_unit = game_data.units[player.selected_unit]

                    const gamePathfinder = new game_pathfinder({
                        id: options.id,
                        // tile_size: game_data.tile_size,
                        grid: matrix, 
                        acceptable_tiles: acceptable_tiles
                    })
    
                    gamePathfinder.setup({
                        callback: this.returnPath
                        ,id: player.selected_unit
                        ,sprite_offset: 0
                        ,movement: 20
                        ,obj_size: 1
                        ,x_start: (selected_unit.tileX + 0)
                        ,y_start: (selected_unit.tileY + 0)
                        ,x_end: (player.pointerX + 0)
                        ,y_end: (player.pointerY + 0)                                                           
                    })
    
                    gamePathfinder.update()                
                }

            }                 

   
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "clickHander",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    // ######  ####### ####### #     # ######  #     #       ######     #    ####### #     # 
    // #     # #          #    #     # #     # ##    #       #     #   # #      #    #     # 
    // #     # #          #    #     # #     # # #   #       #     #  #   #     #    #     # 
    // ######  #####      #    #     # ######  #  #  # ##### ######  #     #    #    ####### 
    // #   #   #          #    #     # #   #   #   # #       #       #######    #    #     # 
    // #    #  #          #    #     # #    #  #    ##       #       #     #    #    #     # 
    // #     # #######    #     #####  #     # #     #       #       #     #    #    #     #
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    returnPath = (pathfinder, process) => {
        let return_options =  {
            type: "room",
            id: pathfinder.id,                
            functionGroup: "core",
            function: "setPath",
            data: {
                message: "Left Click",
                path: process.path,
                id: process.id
            }
        }
        this.sendMessage(return_options)        
    }


}