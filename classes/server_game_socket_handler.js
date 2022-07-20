
var server_socket_handler = require("./server_socket_handler")
const game_state = require("./game/game_state")
const stateHandler = new game_state()
const utils = require("../utils");

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

    startGameRoom = (socket, options) => {

        try{    
            
            let return_options = {
                type: "room",
                id: options.id,
                functionGroup: "core",
                function: "startGameRoom", 
            }        

            this.sendMessage(return_options)             

            // return_options = {};
            // return_options = {
            //     type: "room",
            //     id: options.id,
            //     functionGroup: "core",
            //     function: "transitionScene",
            //     scene: 'GameScene',
            //     uiscene: 'StartUIScene'   
            // }        

            // this.sendMessage(return_options) 
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "startGameRoom",
                "e": e
            }
            errorHandler.log(options)
        }	        
    }

    setupGameData = async(socket, options) => {

        try{
            //EXTRACT MAP DATA
            const classes = require('../classes');
            const gameMap = new classes.game_maps()
            await gameMap.setup();

            let  find_items = {
                model: "Army"
                ,search_type: "find"
                ,multiple_search: []
            }

            options.data.selected_forces.forEach((force) => {
                find_items.multiple_search.push({params: {name: force.army}})
            })

            let armies = await databaseHandler.findData(find_items)

            let forces = []


            options.data.selected_forces.forEach((force, i) => {
                let force_info = {
                    side: i,
                    start: 0,
                    army: armies[i][0]._id,
                    user: force.user
                }
                forces.push(force_info)
            })


            /*
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
            */

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
                    ,mode: "shoot"            
                }]  
            })
            
            //GET THE POPULATE GAMES DATA
            let game_datas = await databaseHandler.findData({
                model: "GameData"
                ,search_type: "findOne"
                ,params: {_id: game_data[0]._id}
            })            

            // let data = game_datas[0].forces[0].user
            // let data2 = game_datas[0].forces[0].army.squads

            let return_options = {
                type: "room",
                id: options.id,
                functionGroup: "core",
                function: "setupGameData",
                scene: 'GameScene',
                data: {
                    id: game_datas[0]._id,
                    forces: game_datas[0].forces
                }
            }        
            this.sendMessage(return_options) 


            return_options = {};
            return_options = {
                type: "room",
                id: options.id,
                functionGroup: "core",
                function: "transitionScene",
                scene: 'GameScene',
                uiscene: 'StartUIScene'   
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
    // ready up
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   

    readyUp = async(socket, options) => {
        try{

            let game_data = await databaseHandler.findData({
                model: "GameData"
                ,search_type: "findOne"
                ,params: {_id: options.data.id}
            }, false)          

            if(game_data[0]){
                options.game_data = game_data[0];
                stateHandler.readyUp(options)
            }
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "readyUp",
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
            
            if(game_data[0]){

                options.game_data = game_data[0]
                options.socket = socket

                if(options.data.button === 'left-mouse'){
                    actionHandler.checkUnitSelection(options)
                }
                if(options.data.button === 'right-mouse'){
                    actionHandler.rightClick(options)
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
    // #     # ####### #     # ####### 
    // ##   ## #     # #     # #       
    // # # # # #     # #     # #       
    // #  #  # #     # #     # #####   
    // #     # #     #  #   #  #       
    // #     # #     #   # #   #       
    // #     # #######    #    ####### 	
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

        try{        
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
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "returnPotentialPaths",
                "e": e
            }
            errorHandler.log(options)
        }	               
    }

    returnPath = (options) => {
        try{
            let return_options =  {
                type: "room",
                id: options.id,                
                functionGroup: "core",
                function: "setPath",
                data: {
                    // message: "Left Click",
                    id: options.process.id,
                    path: options.process.path,
                }
            }
            this.sendMessage(return_options)        
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "returnPath",
                "e": e
            }
            errorHandler.log(options)
        }	
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

    followPath = async(options) => {

        try{

            //GET THE POPULATE GAMES DATA
            // let game_data = await databaseHandler.findData({
            //     model: "GameData"
            //     ,search_type: "findOne"
            //     ,params: {_id: options.data.id}
            // }, false)

            //COUNT THROUGH PATH POSITIONS UP TO MAXIMUM

            if(options.game_data){
                let game_data = options.game_data;

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
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "followPath",
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    // ######  ####### ####### #     # ######  #     #       #######    #    ######   #####  ####### ####### 
    // #     # #          #    #     # #     # ##    #          #      # #   #     # #     # #          #    
    // #     # #          #    #     # #     # # #   #          #     #   #  #     # #       #          #    
    // ######  #####      #    #     # ######  #  #  # #####    #    #     # ######  #  #### #####      #    
    // #   #   #          #    #     # #   #   #   # #          #    ####### #   #   #     # #          #    
    // #    #  #          #    #     # #    #  #    ##          #    #     # #    #  #     # #          #    
    // #     # #######    #     #####  #     # #     #          #    #     # #     #  #####  #######    #    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    returnShootingTarget = (options) => {

        try{

            let return_options =  {
                type: "source",
                id: options.id,                
                functionGroup: "core",
                function: "setShootingTargets",
                data: {
                    message: "Potential Paths",
                    unit: options.unit,
                    // path: options.path,
                    targets: options.targets,
                }
            }
            this.sendMessage(return_options)       
            
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "returnShootingTarget",
                "e": e
            }
            errorHandler.log(options)
        }	            
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    // #     #    #    #    # #######       ######  #     # #       #       ####### #######  #####  
    // ##   ##   # #   #   #  #             #     # #     # #       #       #          #    #     # 
    // # # # #  #   #  #  #   #             #     # #     # #       #       #          #    #       
    // #  #  # #     # ###    #####   ##### ######  #     # #       #       #####      #     #####  
    // #     # ####### #  #   #             #     # #     # #       #       #          #          # 
    // #     # #     # #   #  #             #     # #     # #       #       #          #    #     # 
    // #     # #     # #    # #######       ######   #####  ####### ####### #######    #     #####   
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    generateBullets = async(options) => {

        try{

            if(options.game_data){

                let game_data = options.game_data;

                let game_datas = await databaseHandler.findData({
                    model: "GameData"
                    ,search_type: "findOne"
                    ,params: {_id: game_data._id}
                })     

                game_data = game_datas[0]

                //FIND MAXIMUM PATH SIZE, WHICH REPRESENTS THE MAXIMUM OF POS
                let lengths = _(game_data.units)
                .map(row => row.targets.length)
                .value()
                let max_pos = lengths[lengths.indexOf(Math.max(...lengths))]
                let pos = 0 

                let shooting_data = [];
                
                //figure out the wounding that needs to be applied as well as what target units get hit
                for(let i=0;i<max_pos;i++){
                    //USE LOBASE TO GET PATH POSITIONS
                    let targets = _(game_data.units)
                    .map(row => row.targets[i])
                    .value()
                    
                    targets.forEach((target, n) => {
                        //if there aren't any potential targets, still check if there's any splash damage targets

                        if(target){
                            if(target.potential_targets){
                                target.potential_targets.forEach((potential_target) => {
                                    let data = {
                                        id: shooting_data.length,
                                        uid: '_'+n+'_'+i+'_',
                                        origin: n,
                                        shot: i,
                                        hit_time: potential_target.hit_time,
                                        target: potential_target.id,
                                        //sub_targets
                                    }
                                    shooting_data.push(data);
                                })
                            }
                        }
                    })
                }

                shooting_data = utils.functions.sortDynamic(shooting_data, "hit_time")
                // console.log(shooting_data)

                //loop through shooting data and figure out which units hit
                
                let shots_hit = [];
                shooting_data.forEach((item) => {
                    if(!JSON.stringify(shots_hit).includes(item.uid)){
                        
                        //check if target is hit
                        let target_unit = game_data.units[item.target];
                        if(target_unit.alive){

                            //CALCULATE WOUNDING HERE AND APPLY DAMAGE
                            // Math.floor(Math.random() * 20)+1

                            shots_hit.push(item)

                            target_unit.alive = false;
                        }
                    }
                })

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
                    let targets = _(options.game_data.units)
                    .map(row => row.targets[options.pos])
                    .value()

                    let return_options =  {
                        type: "room",
                        id: options.id,                
                        functionGroup: "core",
                        function: "generateBullets",
                        data: {
                            targets: targets
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

                },2000, options)

            }

        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "generateBullets",
                "e": e
            }
            errorHandler.log(options)
        }	               

    }

}