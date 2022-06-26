
const { Worker, workerData } = require('worker_threads')
const _ = require('lodash');

module.exports = class game_actions {
	constructor(options) {	
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
    }

    findPotentialPathsWorker = async(options) => {
        const result = await this.runWorker(options)
        socketHandler.returnPotentialPaths(result)
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

        socketHandler.returnPath(result)
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //  #####  #     # #######  #####  #    #        #####  ####### #       #######  #####  ####### ### ####### #     # 
    // #     # #     # #       #     # #   #        #     # #       #       #       #     #    #     #  #     # ##    # 
    // #       #     # #       #       #  #         #       #       #       #       #          #     #  #     # # #   # 
    // #       ####### #####   #       ###    #####  #####  #####   #       #####   #          #     #  #     # #  #  # 
    // #       #     # #       #       #  #               # #       #       #       #          #     #  #     # #   # # 
    // #     # #     # #       #     # #   #        #     # #       #       #       #     #    #     #  #     # #    ## 
    //  #####  #     # #######  #####  #    #        #####  ####### ####### #######  #####     #    ### ####### #     # 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

    checkUnitSelection = (options) => {

        try{


            let select_options = {
                parent: options
                ,unit_selected: false
                ,matrix: []
                ,acceptable_tiles: []
                ,saved_unit: {}
                ,player: {}
            }

            //FIND IF A UNIT IS SELECTED


            if(options.game_data){
                //GET PLAYER POSITION DATA
                select_options.player = options.game_data.players[options.data.player];

                select_options.matrix = options.game_data.matrix;
                select_options.acceptable_tiles = options.game_data.acceptable_tiles;  
                
                
                //USE LODASH TO SEARCH FOR UNIT
                let unit_search = _.filter(options.game_data.units, (unit) => {
                    let range = collisionHandler.getUnitTileRange(unit)
                    
                    return (
                        range.min.x <= select_options.player.pointerX && range.min.y <= select_options.player.pointerY
                        && range.max.x >= select_options.player.pointerX && range.max.y >= select_options.player.pointerY
                    )
                })

                //IF A UNIT WAS FOUND, SAVE IT TO GAME DATA FOR THAT PLAYER
                if(unit_search.length > 0){
                    // console.log("found unit:",test[0].id)
                    let unit = unit_search[0]

                    select_options.unit_selected = true;
                    select_options.saved_unit = unit; 
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
            
            let action = "shoot"

            //WHEN A NEW UNIT IS SELECTED
            if(select_options.unit_selected === true){
                switch(action){
                    case "move":
                        this.getPotentialPaths(select_options)
                    break;      
                }
            }

            //WHEN THERE'S A SELECTED UNIT AND ANOTHER CLICK IS REGISTERED
            if(select_options.unit_selected === false){
                if(select_options.player && select_options.player.selected_unit !== -1){

                    select_options.saved_unit = options.game_data.units[select_options.player.selected_unit]

                    switch(action){
                        case "move":
                            this.getPath(select_options)
                        break;      
                        case "shoot":
                            this.getBulletPath(select_options)
                        break;
                    } 
                }
            }

        }catch(e){

            let options = {
                "class": "actionHandler",
                "function": "checkUnitSelection",
                "e": e
            }
            errorHandler.log(options)
        }   
        
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    // #     # ####### #     # ####### 
    // ##   ## #     # #     # #       
    // # # # # #     # #     # #       
    // #  #  # #     # #     # #####   
    // #     # #     #  #   #  #       
    // #     # #     #   # #   #       
    // #     # #######    #    ####### 	
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    getPotentialPaths = (options) => {

        try{
            this.findPotentialPathsWorker({
                worker_path: 'workers/potential_paths.js',
                message: 'Potential Path Test',
                id: options.parent.id,
                grid: options.matrix,
                acceptable_tiles: options.acceptable_tiles,
                setup_data: {
                    id: options.player.selected_unit
                    ,sprite_offset: options.saved_unit.sprite_offset
                    ,movement: options.saved_unit.movement
                    ,obj_size: options.saved_unit.size
                    ,x_start: (options.saved_unit.tileX)
                    ,y_start: (options.saved_unit.tileY)                             
                }
            })  
        }catch(e){

            let options = {
                "class": "actionHandler",
                "function": "checkUnitSelection",
                "e": e
            }
            errorHandler.log(options)
        }   
    }

    getPath = (options) => {
        this.setupPathFinderWorker(
            options.parent.game_data,
            {
            worker_path: 'workers/pathfinder.js',
            message: 'Pathfinding Test',
            id: options.parent.socket.id,
            grid: options.matrix,
            acceptable_tiles: options.acceptable_tiles,
            setup_data: {
                id: options.player.selected_unit
                ,sprite_offset: options.saved_unit.sprite_offset
                ,movement: options.saved_unit.movement
                ,obj_size: options.saved_unit.size
                ,x_start: (options.saved_unit.tileX)
                ,y_start: (options.saved_unit.tileY)
                ,x_end: (options.player.pointerX)
                ,y_end: (options.player.pointerY)                              
            }
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    //  #####  #     # ####### ####### ####### 
    // #     # #     # #     # #     #    #    
    // #       #     # #     # #     #    #    
    //  #####  ####### #     # #     #    #    
    //       # #     # #     # #     #    #    
    // #     # #     # #     # #     #    #    
    //  #####  #     # ####### #######    #   	
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    getBulletPath = (options) => {
        let end = {
            x: options.player.pointerX + 0.5
            ,y: options.player.pointerY + 0.5
        }
        let start = {
            x: options.saved_unit.tileX + options.saved_unit.sprite_offset
            ,y: options.saved_unit.tileY + options.saved_unit.sprite_offset
        }

        let path = collisionHandler.gridRayTracing(start, end)

        socketHandler.returnPotentialPaths({
            id: options.parent.id,
            process: {
                paths: path
            }
        })

    }


}
