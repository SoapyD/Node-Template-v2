
var server_socket_handler = require("./server_socket_handler")
var game_pathfinder = require("./game/game_pathfinder")
const { Worker, workerData } = require('worker_threads')
const path = require('path');
const _ = require('lodash');

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
    }

    findPotentialPathsWorker = async(options) => {
        const result = await this.runWorker(options)
        this.returnPotentialPaths(result)
    }

    setupPathFinderWorker = async(game_data, options) => {
        const result = await this.runWorker(options)
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

        this.returnPath(result)
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

    getUnitTileRange = (unit) => {


        let min = {
            x: -1,
            y: -1,
        }
        let max = {
            x: -1,
            y: -1,
        }        

        if(unit.sprite_offset === 0){

            min.x = unit.tileX - unit.size;
            min.y = unit.tileY - unit.size;            

            max.x = unit.tileX
            max.y = unit.tileY             
        }

        if(unit.sprite_offset === 0.5){

            min.x = unit.tileX - unit.size;
            min.y = unit.tileY - unit.size;            

            max.x = unit.tileX + unit.size;
            max.y = unit.tileY + unit.size;             
        }

        return {
            min: min,
            max: max
        }

    }

    getBulletPath = () => {

        //GET START AND END DIFFERENCE
        let start = {x:6.5,y:1.5}
        let end = {x:9.5,y:6.5}
        let width = end.x - start.x
        let height = end.y - start.y

        //CONVERT BOTH VALUES INTO POSITIVE NUMBERS
        let c_width = width
        let x_dir = 1;
        if(width < 0){
        c_width *= -1;
        x_dir = -1
        }

        let c_height = height
        let y_dir = 1;
        if(height < 0){
        c_height *= -1;
        y_dir = -1;
        }

        //console.log(c_width,c_height)

        //FIND WHICH DIMENSION IS LARGEST
        let itts = c_width
        let x_itt = 0.5
        let y_itt = c_height / ((c_width) * 2)

        if(c_height > c_width){
            itts = c_height
        x_itt = c_width / ((c_height) * 2)
        y_itt = 0.5
        }

        let total_itts = (itts*2)+1

        console.log("width:", c_width,"x_itt:",x_itt,"height:",c_height,"y_itt:",y_itt,"total itts:",total_itts)


        _.times(total_itts, (i) => {
        return {
        //i:i,
        x:start.x+((i*x_itt)*x_dir)
        ,y:start.y+((i*y_itt)*y_dir)
        }})
        /**/

        /*
        let path = _.times(total_itts, (i) => {
        return {
        i:i,
        x:Math.floor(start.x+((i*x_itt)*x_dir))
        ,y:Math.floor(start.y+((i*y_itt)*y_dir))
        }})

        _.uniqBy(path, function (e) {
        return e.x + '_' + e.y;
        });
        */      
    }


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
            let saved_unit = {};
            let player;

            if(game_data[0]){
                //GET PLAYER POSITION DATA
                game_data = game_data[0]
                player = game_data.players[options.data.player];

                matrix = game_data.matrix;
                acceptable_tiles = game_data.acceptable_tiles;  
                
                
                //USE LODASH TO SEARCH FOR UNIT
                let unit_search = _.filter(game_data.units, (unit) => {
                    let range = this.getUnitTileRange(unit)
                    
                    return (
                        range.min.x <= player.pointerX && range.min.y <= player.pointerY
                        && range.max.x >= player.pointerX && range.max.y >= player.pointerY
                    )
                })
                if(unit_search.length > 0){
                    // console.log("found unit:",test[0].id)
                    let unit = unit_search[0]

                    unit_selected = true;
                    saved_unit = unit; 
                    let update = {}
                    update["players."+options.data.player+".selected_unit"] = unit.id;

                    let update_options = 
                    {
                        model: "GameData"
                        ,params: [
                            {
                                filter: {_id: options.data.id}, 
                                value: {$set: update}
                            }
                        ]
                    }                            
                    databaseHandler.updateOne(update_options)

                }

                /*
                game_data.units.forEach((unit) => {
                    //NEED TO RUN A CLASH CHECK HERE INSTEAD TO SEE IF THE CLICK POSITION IS WITHIN THE UNIT BOUNDS
                    if(player.pointerX === unit.tileX && player.pointerY === unit.tileY){
                        if(unit.player === options.data.player){

                            unit_selected = true;
                            saved_unit = unit; 
                            let update = {}
                            update["players."+options.data.player+".selected_unit"] = unit.id;

                            let update_options = 
                            {
                                model: "GameData"
                                ,params: [
                                    {
                                        filter: {_id: options.data.id}, 
                                        value: {$set: update}
                                    }
                                ]
                            }                            
                            databaseHandler.updateOne(update_options)   
                        }
                    }
                })
                */

            }

            if(unit_selected === true){
                let selected_unit = saved_unit

                this.findPotentialPathsWorker({
                    worker_path: 'workers/potential_paths.js',
                    message: 'Potential Path Test',
                    id: options.id,
                    grid: matrix,
                    acceptable_tiles: acceptable_tiles,
                    setup_data: {
                        id: player.selected_unit
                        ,sprite_offset: selected_unit.sprite_offset
                        ,movement: selected_unit.movement
                        ,obj_size: selected_unit.size
                        ,x_start: (selected_unit.tileX)
                        ,y_start: (selected_unit.tileY)                             
                    }
                })                
            }

            //A NEW UNIT HAS BEEN SELECTED
            if(unit_selected === false){

                
                //GET SELECTED UNIT DATA
                
                if(player && player.selected_unit !== -1){
                    let selected_unit = game_data.units[player.selected_unit]

                    this.setupPathFinderWorker(
                        game_data,
                        {
                        worker_path: 'workers/pathfinder.js',
                        message: 'Pathfinding Test',
                        id: socket.id,
                        grid: matrix,
                        acceptable_tiles: acceptable_tiles,
                        setup_data: {
                            id: player.selected_unit
                            ,sprite_offset: selected_unit.sprite_offset
                            ,movement: selected_unit.movement
                            ,obj_size: selected_unit.size
                            ,x_start: (selected_unit.tileX)
                            ,y_start: (selected_unit.tileY)
                            ,x_end: (player.pointerX)
                            ,y_end: (player.pointerY)                              
                        }
                    })
                                  
                }

            }
            
            if(unit_selected === true){

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

    returnPotentialPaths = (options) => {
        let return_options =  {
            type: "source",
            id: options.id,                
            functionGroup: "core",
            function: "setPotentialPaths",
            data: {
                message: "Potential Paths",
                id: options.process.id,
                live_tiles: options.process.paths,
            }
        }
        this.sendMessage(return_options)        
    }

    returnPath = (options) => {
        let return_options =  {
            type: "room",
            id: options.id,                
            functionGroup: "core",
            function: "setPath",
            data: {
                message: "Left Click",
                id: options.process.id,
                path: options.process.path,
            }
        }
        this.sendMessage(return_options)        
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    // ####### ####### #       #       ####### #     #       ######     #    ####### #     # 
    // #       #     # #       #       #     # #  #  #       #     #   # #      #    #     # 
    // #       #     # #       #       #     # #  #  #       #     #  #   #     #    #     # 
    // #####   #     # #       #       #     # #  #  # ##### ######  #     #    #    ####### 
    // #       #     # #       #       #     # #  #  #       #       #######    #    #     # 
    // #       #     # #       #       #     # #  #  #       #       #     #    #    #     # 
    // #       ####### ####### ####### #######  ## ##        #       #     #    #    #     # 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

    followPath = async(socket, options) => {

        //GET THE POPULATE GAMES DATA
        let game_data = await databaseHandler.findData({
            model: "GameData"
            ,search_type: "findOne"
            ,params: {_id: options.data.id}
        }, false)

        //COUNT THROUGH PATH POSITIONS UP TO MAXIMUM

        if(game_data[0]){
            game_data = game_data[0];

            //FIND MAXIMUM PATH SIZE, WHICH REPRESENTS THE MAXIMUM OF POS
            let lengths = _(game_data.units)
            .map(row => row.path.length)
            .value()
            let max_pos = lengths[lengths.indexOf(Math.max(...lengths))]
            let pos = 0 

            //SETUP TROOP MOVING
            options = {
                id: options.id
                ,pos: pos
                ,max_pos: max_pos
                ,game_data: game_data
            }
            
            const advancePos = (pos) => {
              pos++;
              return pos
            }
            
            //SET AN INTERVAL THAT'LL COUNT THROUGH TROOP POSITIONS AND COMMUNCATE THEM BACK THE EACH PLAYER
            var myInterval =setInterval(() => {

                //USE LOBASE TO GET PATH POSITIONS
                let positions = _(options.game_data.units)
                .map(row => row.path[options.pos])
                .value()
              
                // console.log(positions)

                let return_options =  {
                    type: "room",
                    id: options.id,                
                    functionGroup: "core",
                    function: "moveUnit",
                    data: {
                        positions: positions
                    }
                }
                if(options.pos === 0){
                    return_options.data.start = true;
                }

                this.sendMessage(return_options) 


                options.pos = advancePos(options.pos)                
                if(options.pos === options.max_pos){
                    clearInterval(myInterval);
                }

            },250, options)
        }

    }


}