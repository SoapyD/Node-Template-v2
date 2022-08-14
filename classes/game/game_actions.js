
// const { Worker, workerData } = require('worker_threads')
const _ = require('lodash');
const utils = require("../../utils");
// const unit = require('../../models/game/unit');
const setupWorkers = require('./workers');

module.exports = class game_actions {
	constructor(options) {	
    }

    /*
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

    findBulletPathsWorker = async(options) => {
        const result = await this.runWorker(options)
        socketHandler.generateBullets(result)
    }
    */

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


            //IF LEFT CLICK

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
                
                let unit_search = collisionHandler.checkUnitClash(
                    {
                        game_data: options.game_data
                        ,check_pos: {
                            x: select_options.player.pointerX
                            ,y: select_options.player.pointerY
                        }
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

            //WHEN A NEW UNIT IS SELECTED
            if(select_options.unit_selected === true){
                switch(options.game_data.mode){
                    case "move":
                    case "charge":                        
                        this.getPotentialPaths(select_options)
                    break;      
                }
            }

            //WHEN THERE'S A SELECTED UNIT AND ANOTHER CLICK IS REGISTERED
            if(select_options.unit_selected === false){
                if(select_options.player && select_options.player.selected_unit !== -1){

                    select_options.saved_unit = options.game_data.units[select_options.player.selected_unit]

                    switch(options.game_data.mode){
                        case "move":
                        case "charge":    
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
    // ######  #######  #####  ####### #######  #####  
    // #     # #       #     # #          #    #     # 
    // #     # #       #       #          #    #       
    // ######  #####    #####  #####      #     #####  
    // #   #   #             # #          #          # 
    // #    #  #       #     # #          #    #     # 
    // #     # #######  #####  #######    #     ##### 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      

    reset = (options) => {
        if(options.game_data){
            let game_data = options.game_data;

            //UPDATE POSITIONS OF UNITS
            game_data.units.forEach((unit) => {
                unit.path = [];
                unit.targets = [];
                unit.fight_targets = [];
                unit.moved = false;
                unit.shoot = false;
                unit.charged = false;
                unit.fight = false;
            })

            databaseHandler.updateData(game_data)
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
            setupWorkers.findPotentialPathsWorker({
                worker_path: 'potential_paths.js',
                message: 'Potential Path Test',
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

        try{
            setupWorkers.setupPathFinderWorker(
                options.parent.game_data,
                {
                worker_path: 'pathfinder.js',
                message: 'Pathfinding Test',
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
                    ,x_end: (options.player.pointerX)
                    ,y_end: (options.player.pointerY)                              
                }
            })
        }catch(e){

            let options = {
                "class": "actionHandler",
                "function": "getPath",
                "e": e
            }
            errorHandler.log(options)
        }           
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



    getBulletPath = async(options) => {

        try{

            //GET WEAPON DETAILS
            let gun = await databaseHandler.findData({
                model: "Gun"
                ,search_type: "findOne"
                ,params: {_id: options.saved_unit.gun_class[options.saved_unit.selected_gun]}
            })            
    
            if(gun[0]){
    
                //IF TARGETS AVAILABLE TO SET
                gun = gun[0];

                let max_targets = gun.max_targets
                if(options.saved_unit.special_rules.includes("firing drills") && options.saved_unit.moved === false){
                    max_targets = gun.max_targets * 2;
                }

                if(options.saved_unit.targets.length < max_targets){
    
                    let end = {
                        x: options.player.pointerX + 0.5
                        ,y: options.player.pointerY + 0.5
                    }
                    let start = {
                        x: options.saved_unit.tileX + options.saved_unit.sprite_offset
                        ,y: options.saved_unit.tileY + options.saved_unit.sprite_offset
                    }
            
                    let path = collisionHandler.gridRayTracing(start, end)
            
                    //CHECK THROUGH TILES AND SEE IF THEY CLASH WITH ANY TERRAIN
                    let potential_targets = [];
                    let saved_path = [];
                    let skip = false;
                    let dest_time = -1;
                    path.forEach((e, i) => {
            
                        let cell = options.matrix[e.tileY][e.tileX]            
            
                        if(skip === false){
                            e.cell = cell
                            saved_path.push(e)
                        }
            
                        //break the loop if this isn't an acceptable tile
                        if(!options.acceptable_tiles.includes(cell)){
                            skip = true;
                        }
    
                        //break the loop if it's beyond the range of the weapon
                        let range = utils.functions.distanceBetweenPoints(
                            {
                                x:e.x* options.parent.game_data.tile_size
                                ,y:e.y* options.parent.game_data.tile_size
                            },
                            options.saved_unit
                        )
    
                        if(range > gun.range){
                            skip = true;
                        }

                        let hit_time = (range / 200) + (options.saved_unit.targets.length * 2);
                        
                        if(skip === false){
                            dest_time = hit_time;
                        }
    
                        //break the loop if the position hits another unit
                        let unit_search = collisionHandler.checkUnitClash(
                            {
                                game_data: options.parent.game_data
                                ,check_pos: {x: e.tileX, y: e.tileY}
                            })
                        if(unit_search.length > 0){
                            let unit = unit_search[0]
                            if(unit.id !== options.saved_unit.id){ // && unit.side !== options.saved_unit.side){
                                // skip = true;
                                if(!JSON.stringify(potential_targets).includes('"id":'+unit.id)){
                                    potential_targets.push({
                                        range: range,
                                        id: unit.id,
                                        hit_time: hit_time, //range/pixels per second + bullet_pos * 2 seconds
                                        pos: {
                                            x: e.x,
                                            y: e.y                                            
                                        }  
                                    })
                                }
                            }
                        }
    
    
                    })
    
                    // console.log("units")
                    // potential_targets.forEach((item) => {
                    //     console.log(item.id)
                    // })
            
                    saved_path.forEach((e, i) => {
                        e.tileX += 0.5
                        e.tileY += 0.5
                    })
                    let target = {
                        x: saved_path[saved_path.length - 1].x,
                        y: saved_path[saved_path.length - 1].y,
                        hit_time: dest_time,
                        potential_targets: potential_targets                        
                    }
                    // if(potential_targets.length > 0){
                    //     target.x = potential_targets[0].pos.x
                    //     target.y = potential_targets[0].pos.y
                    //     target.target_id = potential_targets[0].id                         
                    // }

                    //UPDATE GAME DATA SO IT SAVES THE TARGET FOR THAT UNIT
                    let update = {}
                    update["units."+options.saved_unit.id+".targets."+options.saved_unit.targets.length] = target; 

                    let update_options = 
                    {
                        model: "GameData"
                        ,params: [
                            {
                                filter: {_id: options.parent.game_data.id}, 
                                value: {$set: update}
                            },                           
                        ]
                    }   
            
                    await databaseHandler.updateOne(update_options)                  
    
                    //SET TARGETS IN GAME_DATA FOR UNIT
                    let return_targets = options.parent.game_data.units[options.saved_unit.id].targets
                    return_targets.push(target)
            
                    socketHandler.returnShootingTarget({
                        id: options.parent.id,
                        unit: options.saved_unit.id,
                        // path: saved_path,
                        targets: return_targets
                    })
    
                }
            } 
        }catch(e){

            let options = {
                "class": "actionHandler",
                "function": "getBulletPath",
                "e": e
            }
            errorHandler.log(options)
        }  


    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    // ######  ###  #####  #     # #######        #####  #       ###  #####  #    # 
    // #     #  #  #     # #     #    #          #     # #        #  #     # #   #  
    // #     #  #  #       #     #    #          #       #        #  #       #  #   
    // ######   #  #  #### #######    #    ##### #       #        #  #       ###    
    // #   #    #  #     # #     #    #          #       #        #  #       #  #   
    // #    #   #  #     # #     #    #          #     # #        #  #     # #   #  
    // #     # ###  #####  #     #    #           #####  ####### ###  #####  #    # 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

    rightClick = async(options) => {

        let player = options.game_data.players[options.data.player];

        //IF PLAYER HAS A SELECTED UNIT
        if(player.selected_unit !== -1){

            let unit = options.game_data.units[player.selected_unit];
            let update = {}
            let new_targets = []

            switch(options.game_data.mode){
                case "move":
                case "charge":
                    //REMOVE PATH FROM SELECTED UNIT
                    update["units."+unit.id+".path"] = []; 
                break; 
                case "shoot":
                    //REMOVE LAST TARGET FROM UNIT
                    new_targets = unit.targets
                    new_targets.pop()
                    update["units."+unit.id+".targets"] = new_targets;
                    // update["units."+unit.id+".potential_targets"] = unit.potential_targets.pop();
                    //SEND DATA TO CLIENTS
                break;     
                case "fight":
                    //REMOVE LAST TARGET FROM UNIT
                    //SEND DATA TO CLIENTS
                break;                          
            }        

            
            if(Object.keys(update).length !== 0){
                let update_options = 
                {
                    model: "GameData"
                    ,params: [
                        {
                            filter: {_id: options.game_data.id}, 
                            value: {$set: update}
                        }
                    ]
                }   
        
                await databaseHandler.updateOne(update_options)  
            } 


            switch(options.game_data.mode){
                case "move":
                case "charge":
                    socketHandler.returnPath({
                        id: options.id,
                        process: {
                            id: unit.id,
                            path: []
                        }
                    })
                break; 
                case "shoot":
                    socketHandler.returnShootingTarget({
                        id: options.id,
                        unit: unit.id,
                        targets: new_targets
                    })
                break;     
                case "fight":
                    //REMOVE LAST TARGET FROM UNIT
                    //SEND DATA TO CLIENTS
                break;                          
            }  


        }

    }


}
