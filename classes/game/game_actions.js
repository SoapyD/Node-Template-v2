
// const { Worker, workerData } = require('worker_threads')
const _ = require('lodash');
const utils = require("../../utils");
// const unit = require('../../models/game/unit');
// const setupWorkers = require('./workers');
const collisions = require('./collisions');
// const game_data = require('../../models/game/game_data');

const workerpool = require('workerpool');
// create a worker pool using an external worker script
const pool_potentialpath = workerpool.pool(__dirname + '/workerpool/potential_paths.js');
const pool_pathfinder = workerpool.pool(__dirname + '/workerpool/pathfinder.js');



module.exports = class game_actions {
	constructor(options) {	
    }

    changeMode = async(options) => {

        try{        
            let game_datas = await databaseHandler.findData({
                model: "GameData"
                ,search_type: "findOne"
                ,params: {_id: options.data.id}
            }, true)

            let game_data = game_datas[0]
            switch(game_data.mode){
                case "move":
                    game_data.mode = 'shoot';
                    break;
                case "shoot":
                    game_data.mode = 'effects';
                    break;     
                case "effects":
                    game_data.mode = 'charge';
                    break;                         
                case "charge":
                    game_data.mode = 'fight';
                    break;     
                case "fight":
                    game_data.mode = 'sync';
                    break;
                case "sync":
                    game_data.mode = 'move';
                    break;                     
            }

            //TURNED OFF UPDATE HERE AS THERE'S ONE IN THE RESET PROC
            // databaseHandler.updateData(game_data)
            this.reset({
                id: options.id,
                game_data: game_data
            })

            socketHandler.setMode({
                id: options.id,
                game_data: game_data
            })    
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "setMode",
                "e": e
            }
            errorHandler.log(options)
        }	               
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

                    // let force = options.game_data.forces[options.data.player];

                    if(unit.player === options.data.player){
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
            }

            //WHEN A NEW UNIT IS SELECTED
            if(select_options.unit_selected === true){
                switch(options.game_data.mode){
                    case "move":
                    case "charge":                        
                        this.getPotentialPaths(select_options)
                    break;      
                }

                //ADD IN A RESET FOR UNIT SELECTED
                socketHandler.returnResetSelection({
                    id: select_options.parent.socket.id
                    ,data: {
                        selected_unit_id: select_options.saved_unit.id
                    }
                })
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
                        case "fight":
                            this.getFightPath(select_options)
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

        try{
            if(options.game_data){
                let game_data = options.game_data;

                //KEEP TRACK OF SIDE AND SQUADS HAVING PATHS RESET
                let cohesion_check_units = []
                let squads = [];

                //UPDATE POSITIONS OF UNITS
                game_data.units.forEach((unit) => {
                    if(unit.path.length > 0){
                        if(!squads.includes(unit.squad)){
                            squads.push(unit.squad)
                            cohesion_check_units.push(unit)
                        }
                    }
                    unit.path = [];
                    unit.targets = [];
                    unit.fight_targets = [];
                    // unit.moved = false;
                    // unit.shoot = false;
                    // unit.charged = false;
                    // unit.fight = false;
                })

                //RESET COHESIONS
                let cohesion_resets = []
                cohesion_check_units.forEach((unit) => {
                    //CHECK COHERANCY FOR THE UNIT
                    let squad = utils.cohesionCheck({
                        game_data: game_data,
                        unit: unit
                    });       
                    // squad_array.push(squad)   

                    for(let i=0;i<squad.length;i++){
                        let unit = squad[i]
                        cohesion_resets.push({
                            id: unit.id,
                            cohesion_check: unit.cohesion_check
                        })    
                    }
                })
                if(cohesion_resets.length > 0){
                    options.cohesion_resets = cohesion_resets;
                }

                databaseHandler.updateData(game_data)

                //SEND RESET TO PLAYERS
                socketHandler.returnResetAll(options)
            }
        }
        catch(e){
            let options = {
                "class": "game_actions",
                "function": "reset",
                "e": e
            }
            errorHandler.log(options)
        }	
    }


    resetPath = (unit, game_data) => {

        //REMOVE PATH FROM SELECTED UNIT 
        //CHECK TO SEE IF UNIT RESET CAUSES ANY OTHER UNITS TO RESET
        let check_array = []
        let update = {};
        let squad_cohesion_info = [];
        let reset_move_ids = [];
        unit.path = []; //RESET PATH SO UNIT tileX POS IS USED
        check_array.push(unit)
        for(let i=0;i<1000;i++){
            let new_check_array = [];
            check_array.forEach((check_unit) => {

                let check_pos = {
                    x: check_unit.tileX,
                    y: check_unit.tileY,                                
                }
                update["units."+check_unit.id+".path"] = [];

                //CHECK COHERANCY FOR THE UNIT
                let squad = utils.cohesionCheck({
                    game_data: game_data,
                    unit: check_unit
                });

                //ADD COHESION CHECK
                squad.forEach((squad_unit) => {
                    update["units."+squad_unit.id+".cohesion_check"] = squad_unit.cohesion_check;
                    squad_cohesion_info.push({
                        id: squad_unit.id
                        ,cohesion_check: squad_unit.cohesion_check
                    })        
                })

                reset_move_ids.push(check_unit.id)

                let clashed_units = _.filter(game_data.units, (unit) => {
                    let range = collisionHandler.getUnitTileRange(unit)
                    return (
                        range.min.x <= check_pos.x && range.min.y <= check_pos.y
                        && range.max.x >= check_pos.x && range.max.y >= check_pos.y
                        && unit.id !== check_unit.id
                        && unit.path.length > 0
                    )
                    })  

                if(clashed_units.length > 0){
                    clashed_units.forEach((clash)=>{
                        new_check_array.push(clash)
                    })
                }
            })

            if(new_check_array.length > 0){
                //ADD NEW CHECK
                check_array = new_check_array
            }else{
                return {
                    update: update,
                    squad_cohesion_info: squad_cohesion_info,
                    reset_move_ids: reset_move_ids
                }
            }

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
            let worker_options = {
                game_data_id: options.parent.game_data.id,
                worker_path: 'potential_paths.js',
                message: 'Potential Path Test',
                id: options.parent.socket.id,
                grid: options.matrix,
                acceptable_tiles: options.acceptable_tiles,
                setup_data: {
                    id: options.saved_unit.id //options.player.selected_unit
                    ,sprite_offset: options.saved_unit.sprite_offset
                    ,movement: options.saved_unit.movement
                    ,obj_size: options.saved_unit.size
                    ,x_start: (options.saved_unit.tileX)
                    ,y_start: (options.saved_unit.tileY)                             
                }
            }

            if(options.saved_unit.shot == false || utils.functions.checkArray(options.saved_unit.special_rules,'name','swift')){            
                // run registered functions on the worker via exec
                pool_potentialpath.exec('runProcess', [worker_options])
                    .then(function (result) {
    
                        // console.log('Result: ' + result); // outputs 55
                        socketHandler.returnPotentialPaths(result)
                    })
                    .catch(function (err) {
                    console.error(err);
                    })
                    .then(function () {
                    pool.terminate(); // terminate all workers when done
                    });
            }else{
                socketHandler.returnPotentialPaths({
                    id: options.parent.socket.id
                    ,process: {
                        id: options.saved_unit.id
                        ,paths: []
                    }
                    ,alert_message: "Unit can't charge after shooting"
                })
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

    getPath = (options) => {

        try{
            let worker_options = {
                game_data_id: options.parent.game_data.id,
                worker_path: 'pathfinder.js',
                message: 'Pathfinding Test',
                id: options.parent.id,
                grid: options.matrix,
                acceptable_tiles: options.acceptable_tiles,
                setup_data: {
                    id: options.player.selected_unit // options.saved_unit.id 
                    ,sprite_offset: options.saved_unit.sprite_offset
                    ,movement: options.saved_unit.movement
                    ,obj_size: options.saved_unit.size
                    ,x_start: (options.saved_unit.tileX)
                    ,y_start: (options.saved_unit.tileY)
                    ,x_end: (options.player.pointerX)
                    ,y_end: (options.player.pointerY)                              
                }
            }

            // run registered functions on the worker via exec
            pool_pathfinder.exec('runProcess', [worker_options])
            .then(async function (result) {

                //GET THE POPULATE GAMES DATA
                let game_datas = await databaseHandler.findData({
                    model: "GameData"
                    ,search_type: "findOne"
                    ,params: {_id: result.game_data_id}
                }, true)

                let game_data = game_datas[0]
                //UPDATE UNIT PATH IN TEST GAME_DATA
                let unit = game_data.units[result.process.ids[0]];

                let alert_message = ''
                if(unit.shot == true && !utils.functions.checkArray(options.saved_unit.special_rules,'name','swift')){
                    result.process.path = [];
                    alert_message = "Unit can't charge after shooting";
                }

                unit.path = result.process.path;
                unit.path = utils.checkStatusEffects.checkPath({game_data: game_data, unit: unit})

                if(unit.path.length > 0){
                    let path_pos = unit.path[unit.path.length - 1]
                    unit.x = path_pos.x * game_data.tile_size
                    unit.y = path_pos.y * game_data.tile_size
                    unit.tileX = path_pos.x - unit.sprite_offset
                    unit.tileY = path_pos.y - unit.sprite_offset
                }

                //CHECK COHERANCY FOR THE UNIT
                let squad = utils.cohesionCheck({
                    game_data: game_data,
                    unit: unit
                });


                //SAVE THE PATH TO THE UNIT
                let update = {}
                update["units."+result.process.ids[0]+".path"] = unit.path; // result.process.path;

                //ADD COHESION CHECK
                let squad_cohesion_info = []
                squad.forEach((unit) => {
                    update["units."+unit.id+".cohesion_check"] = unit.cohesion_check;
                    squad_cohesion_info.push({
                        id: unit.id
                        ,cohesion_check: unit.cohesion_check
                    })        
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
                
                options = result
                options.squad_cohesion_info = squad_cohesion_info
                if(alert_message != ''){
                    options.alert_message = alert_message;
                }

                socketHandler.returnPath(options)
            })
            .catch(function (err) {
            console.error(err);
            })
            .then(function () {
            pool.terminate(); // terminate all workers when done
            });
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

                if(utils.functions.checkArray(options.saved_unit.special_rules,'name','firing drills') && options.saved_unit.moved === false){
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
                        //and if the weapon isn't a barrage weapon
                        if(!options.acceptable_tiles.includes(cell) && !utils.functions.checkArray(options.saved_unit.special_rules,'name','barrage')){
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
                            if(unit.id !== options.saved_unit.id && unit.side !== options.saved_unit.side){
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


    // ####### ###  #####  #     # ####### 
    // #        #  #     # #     #    #    
    // #        #  #       #     #    #    
    // #####    #  #  #### #######    #    
    // #        #  #     # #     #    #    
    // #        #  #     # #     #    #    
    // #       ###  #####  #     #    #    	

    getFightPath = async(options) => {

        try{

            let game_data = options.parent.game_data;

            //GET WEAPON DETAILS
            let melee = await databaseHandler.findData({
                model: "Melee"
                ,search_type: "findOne"
                ,params: {_id: options.saved_unit.melee_class[options.saved_unit.selected_melee]}
            })            
    
            if(melee[0]){
    
                //IF TARGETS AVAILABLE TO SET
                melee = melee[0];

                let max_targets = melee.max_targets
                
                if(utils.functions.checkArray(options.saved_unit.special_rules,'name','berserker') && options.saved_unit.moved === true){
                    max_targets = melee.max_targets * 2;
                }

                if(options.saved_unit.fight_targets.length < max_targets){
    
                    let end = {
                        x: options.player.pointerX
                        ,y: options.player.pointerY
                    }
            
                    //break the loop if the position hits another unit
                    let unit_search = collisionHandler.checkUnitClash(
                        {
                            game_data: options.parent.game_data
                            ,check_pos: end
                        })
                    if(unit_search.length > 0){
                        let unit = unit_search[0]
                        if(unit.id !== options.saved_unit.id){ // && unit.side !== options.saved_unit.side){

                            let dims = collisionHandler.getUnitTileRange(options.saved_unit, game_data.tile_size);
                            let circle = new collisions.circle({
                                x: dims.mid_game.x,
                                y: dims.mid_game.y,
                                r: (dims.dim_games.w / 2) + (game_data.tile_size / 2)
                            })
                            
                            let unit_dims = collisionHandler.getUnitTileRange(unit, game_data.tile_size);
                            let unit_circle = new collisions.circle({
                                x: unit_dims.mid_game.x,
                                y: unit_dims.mid_game.y,
                                r: (unit_dims.dim_games.w / 2) + (game_data.tile_size / 2)
                            })

                            let clash = circle.circleCircle(unit_circle)

                            // console.log("clash:",clash)
                            if(clash){
                                let target = {
                                    x: options.player.pointerX + 0.5
                                    ,y: options.player.pointerY + 0.5
                                    ,target_id: unit.id
                                }

                                //UPDATE GAME DATA SO IT SAVES THE TARGET FOR THAT UNIT
                                let update = {}
                                update["units."+options.saved_unit.id+".fight_targets."+options.saved_unit.fight_targets.length] = target; 
    
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
                                let return_targets = options.parent.game_data.units[options.saved_unit.id].fight_targets
                                return_targets.push(target)
                        
                                socketHandler.returnFightTarget({
                                    id: options.parent.id,
                                    unit: options.saved_unit.id,
                                    targets: return_targets
                                })                                
                            }else{
                                socketHandler.returnPopup({
                                    id: options.parent.socket.id,
                                    message: 'Target Out Of Range'
                                })                                    
                            }
                            
                        }
                    }
                }
            } 
        }catch(e){

            let options = {
                "class": "actionHandler",
                "function": "getFightPath",
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
            let reset_move_ids = []
            let squad_cohesion_info = []            

            switch(options.game_data.mode){
                case "move":
                case "charge":
                    let return_info = this.resetPath(unit, options.game_data)
                    update = return_info.update
                    squad_cohesion_info = return_info.squad_cohesion_info
                    reset_move_ids = return_info.reset_move_ids
                break; 
                case "shoot":
                    //REMOVE LAST TARGET FROM UNIT
                    new_targets = unit.targets
                    new_targets.pop()
                    update["units."+unit.id+".targets"] = new_targets;
                    //SEND DATA TO CLIENTS
                break;     
                case "fight":
                    //REMOVE LAST TARGET FROM UNIT
                    //SEND DATA TO CLIENTS
                    new_targets = unit.fight_targets
                    new_targets.pop()
                    update["units."+unit.id+".fight_targets"] = new_targets;                    
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
                            ids: reset_move_ids,
                            path: []
                        }
                        ,squad_cohesion_info: squad_cohesion_info
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
                    socketHandler.returnFightTarget({
                        id: options.id,
                        unit: unit.id,
                        targets: new_targets
                    })                    
                break;                          
            }  


        }

    }


}
