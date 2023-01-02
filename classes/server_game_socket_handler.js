
var server_socket_handler = require("./server_socket_handler")
const game_state = require("./game/game_state")
// const collisions = require("./game/collisions")
const stateHandler = new game_state()
const utils = require("../utils");

const _ = require('lodash');
// const barrier = require("../models/game/barrier");

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
                    ,mode: "move"            
                }]  
            })
            
            //GET THE POPULATE GAMES DATA
            let game_datas = await databaseHandler.findData({
                model: "GameData"
                ,search_type: "findOne"
                ,params: {_id: game_data[0]._id}
            }) 

            let rooms = await databaseHandler.findData({
                model: "Room"
                ,search_type: "findOne"
                ,params: {
                    room_name: options.id
                }
            })       
            rooms[0].game_data = game_datas[0]._id
            rooms[0].save()

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

    saveUnitData = async(socket, options) => {
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


            game_data = await databaseHandler.findData({
                model: "GameData"
                ,search_type: "findOne"
                ,params: {_id: options.data.id}
            }, false)         

            this.setMode({
                id: options.id,
                game_data: game_data[0]
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
    // ######  ####### #       #######    #    ######         #####     #    #     # ####### ######     #    #######    #    
    // #     # #       #       #     #   # #   #     #       #     #   # #   ##   ## #       #     #   # #      #      # #   
    // #     # #       #       #     #  #   #  #     #       #        #   #  # # # # #       #     #  #   #     #     #   #  
    // ######  #####   #       #     # #     # #     # ##### #  #### #     # #  #  # #####   #     # #     #    #    #     # 
    // #   #   #       #       #     # ####### #     #       #     # ####### #     # #       #     # #######    #    ####### 
    // #    #  #       #       #     # #     # #     #       #     # #     # #     # #       #     # #     #    #    #     # 
    // #     # ####### ####### ####### #     # ######         #####  #     # #     # ####### ######  #     #    #    #     # 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    runReloadGameData = async(socket, options) => {
        try{
            let game_data = await databaseHandler.findData({
                model: "GameData"
                ,search_type: "findOne"
                ,params: {_id: options.data.id}
            })         

            game_data = game_data[0];

            //RETURN POSITIONAL DATA TO PLAYERS
            let return_options = {
                type: "source",
                id: options.id,
                functionGroup: "core",
                function: "reloadGameData",
                data: {
                    mode: game_data.mode,
                    forces: game_data.forces,
                    units: game_data.units,
                    id: options.data.id,
                    message: 'reloading game data'
                }
            }        
            this.sendMessage(return_options) 

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
    // #     # ####### ######  #######        #####  ####### #       #######  #####  ####### 
    // ##   ## #     # #     # #             #     # #       #       #       #     #    #    
    // # # # # #     # #     # #             #       #       #       #       #          #    
    // #  #  # #     # #     # #####   #####  #####  #####   #       #####   #          #    
    // #     # #     # #     # #                   # #       #       #       #          #    
    // #     # #     # #     # #             #     # #       #       #       #     #    #    
    // #     # ####### ######  #######        #####  ####### ####### #######  #####     #    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  


    setMode = (options) => {

        try{        
            let return_options =  {
                type: "room",
                id: options.id,                
                functionGroup: "core",
                function: "setMode",
                data: {
                    message: "Set Mode",
                    mode: options.game_data.mode,
                }
            }
            this.sendMessage(return_options)     
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


    changeMode = async(socket, options) => {

        try{        

            actionHandler.changeMode(options)


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
    // #     # ####### #     # #######       #     #    #    ######  #    # ####### ######  
    // ##   ## #     # #     # #             ##   ##   # #   #     # #   #  #       #     # 
    // # # # # #     # #     # #             # # # #  #   #  #     # #  #   #       #     # 
    // #  #  # #     # #     # #####   ##### #  #  # #     # ######  ###    #####   ######  
    // #     # #     #  #   #  #             #     # ####### #   #   #  #   #       #   #   
    // #     # #     #   # #   #             #     # #     # #    #  #   #  #       #    #  
    // #     # #######    #    #######       #     # #     # #     # #    # ####### #     # 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    sendMoveMarker = async(socket, options) => {
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
            }, true)
            
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
    // ######  #######  #####  ####### #######  #####  
    // #     # #       #     # #          #    #     # 
    // #     # #       #       #          #    #       
    // ######  #####    #####  #####      #     #####  
    // #   #   #             # #          #          # 
    // #    #  #       #     # #          #    #     # 
    // #     # #######  #####  #######    #     ##### 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    returnResetSelection = (options) => {
        try{
            let return_options =  {
                type: "source",
                id: options.id,                
                functionGroup: "core",
                function: "resetSelection",
                data: options.data
            }

            this.sendMessage(return_options)        
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "resetSelection",
                "e": e
            }
            errorHandler.log(options)
        }	
    }
    returnResetAll = (options) => {
        try{
            let return_options =  {
                type: "room",
                id: options.id,                
                functionGroup: "core",
                function: "resetAll",
                data: {
                }
            }

            this.sendMessage(return_options)        
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "returnResetAll",
                "e": e
            }
            errorHandler.log(options)
        }	
    }

    returnPopup = (options) => {

        try{        
            let return_options =  {
                type: "source",
                id: options.id,                
                functionGroup: "core",
                function: "drawPopup",
                data: {
                    message: "Draw Popup",
                    popup_message: options.message
                }
            }
            this.sendMessage(return_options)     
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "returnPopup",
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
            if (options.alert_message){
                return_options.data.alert_message = options.alert_message;
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
                    ids: options.process.ids,
                    path: options.process.path,
                    squad_cohesion_info: options.squad_cohesion_info
                }
            }
            if (options.alert_message){
                return_options.data.alert_message = options.alert_message;
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
            let game_datas = await databaseHandler.findData({
                model: "GameData"
                ,search_type: "findOne"
                ,params: {_id: options.data.id}
            }, true)

            //COUNT THROUGH PATH POSITIONS UP TO MAXIMUM

            if(options.game_data){
                let game_data = game_datas[0];

                //UPDATE POSITIONS OF UNITS
                game_data.units.forEach((unit, i) => {
                    if(unit.path){
                        if(unit.path.length > 0){
                            let last_path_pos = unit.path[unit.path.length - 1]
                            last_path_pos.last_pos = true;
                            unit.x = (last_path_pos.x - unit.sprite_offset) * game_data.tile_size
                            unit.y = (last_path_pos.y - unit.sprite_offset) * game_data.tile_size
                            unit.tileX = last_path_pos.x - unit.sprite_offset
                            unit.tileY = last_path_pos.y - unit.sprite_offset

                            if(game_data.mode === 'move'){
                                unit.moved = true;
                            }
                            if(game_data.mode === 'charge'){
                                unit.charged = true;
                            }

                            unit.is_moving = true;

                            //CHECK THROUGH PATH AND FIGURE OPPORTUNITY ATTACKS / IN COMBAT WITH
                            if(unit.in_combat_with.length > 0){
                                unit.path.forEach((pos) => {
                                    let new_in_combat = []
                                    unit.in_combat_with.forEach((unit_id) => {
                                        //CHECK TO SEE IF THAT UNIT IS STILL CLASHING,
                                        //IF NOT, RUN A WOUNDING ATTACK,
                                        //THEN REMOVE THAT UNIT FROM THE COMBAT CHECK
                                        if(!pos.clashing_units.includes(unit_id)){
                                            let attacker = game_data.units[unit_id];
                                            let attacker_melee = attacker.melee_class[attacker.selected_melee];
                                            //RUN WOUNDING
                                            
                                            if(!utils.functions.checkArray(unit.special_rules,'name','sword dance')){
                                                let damage_applied = utils.checkWounding({
                                                    gamedata: game_data,
                                                    attacker: attacker,
                                                    defender: unit,
                                                    damage: attacker_melee.damage,
                                                    ap: attacker_melee.ap,
                                                    bonus: attacker.unit_class.fighting_bonus
                                                })
                                                pos.damage += damage_applied;
                                            }

                                        }else{
                                            new_in_combat.push(unit_id)
                                        }
                                    })

                                    unit.in_combat_with = new_in_combat
                                })
                            }

                            //RESET IN_COMBAT_WITH
                            unit.in_combat_with.length = [];

                            //CHECK IF LAST STEP HAD CLASHING UNITS, IF SO, SET IN_COMBAT_WITH
                            if(last_path_pos.clashing_units.length > 0){
                                unit.in_combat_with = last_path_pos.clashing_units;
                                unit.in_combat = true

                                //SET IN_COMBAT FOR THE CLASHING UNITS
                                unit.in_combat_with.forEach((unit_id) => {
                                    let check_unit = game_data.units[unit_id];
                                    if(!check_unit.in_combat_with.includes(unit.id)){
                                        check_unit.in_combat_with.push(unit.id)
                                        check_unit.in_combat = true
                                    }
                                })
                            }
                        }
                    }               
                })

                databaseHandler.updateData(game_data)                               

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

                        //WAIT FOR 3 SECONDS BEFORE CLEARING DOWN AND ADVANCING MODE
                        setTimeout(function(){
                            actionHandler.reset(options)
                        },3000);

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
                    message: "Set Shooting Tatgets",
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

            if(options.game_data_id){

                let game_data = options.game_data;
                //GET FULL GAME DATA
                let game_datas = await databaseHandler.findData({
                    model: "GameData"
                    ,search_type: "findOne"
                    ,params: {_id: options.game_data_id}
                })     

                game_data = game_datas[0]


                game_data.units.forEach((unit) => {
                    //SET UNITS THAT HAVE TARGETS AS HAVING SHOT
                    if (unit.targets){
                        if(unit.targets.length > 0){
                            unit.shot = true;
                        }
                    }
                })
                databaseHandler.updateData(game_data)

                //FIND MAXIMUM PATH SIZE, WHICH REPRESENTS THE MAXIMUM OF POS
                let lengths = _(game_data.units)
                .map(row => row.targets.length)
                .value()
                let max_pos = lengths[lengths.indexOf(Math.max(...lengths))]
                let pos = 0; 

                
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
                    let targets = _(game_data.units)
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

                        //WAIT FOR 3 SECONDS BEFORE CLEARING DOWN AND ADVANCING MODE
                        setTimeout(function(){
                            actionHandler.reset(options)
                        },3000);                        
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    // ####### ###  #####  #     # ####### 
    // #        #  #     # #     #    #    
    // #        #  #       #     #    #    
    // #####    #  #  #### #######    #    
    // #        #  #     # #     #    #    
    // #        #  #     # #     #    #    
    // #       ###  #####  #     #    #    	
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

    returnFightTarget = (options) => {

        try{

            let return_options =  {
                type: "source",
                id: options.id,                
                functionGroup: "core",
                function: "setFightTargets",
                data: {
                    message: "Return Fight Targets",
                    unit: options.unit,
                    targets: options.targets,
                }
            }
            this.sendMessage(return_options)       
            
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "returnFightTarget",
                "e": e
            }
            errorHandler.log(options)
        }	            
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    // #     #    #    #    # #######       #     # ####### #       ####### ####### 
    // ##   ##   # #   #   #  #             ##   ## #       #       #       #       
    // # # # #  #   #  #  #   #             # # # # #       #       #       #       
    // #  #  # #     # ###    #####   ##### #  #  # #####   #       #####   #####   
    // #     # ####### #  #   #             #     # #       #       #       #       
    // #     # #     # #   #  #             #     # #       #       #       #       
    // #     # #     # #    # #######       #     # ####### ####### ####### ####### 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    generateMelees = async(options) => {

        try{

            if(options.game_data_id){

                let game_data = options.game_data;
                //GET FULL GAME DATA
                let game_datas = await databaseHandler.findData({
                    model: "GameData"
                    ,search_type: "findOne"
                    ,params: {_id: options.game_data_id}
                })     

                game_data = game_datas[0]


                game_data.units.forEach((unit) => {
                    //SET UNITS THAT HAVE TARGETS AS HAVING SHOT
                    if (unit.fight_targets){
                        if(unit.fight_targets.length > 0){
                            unit.fought = true;
                        }
                    }
                })
                databaseHandler.updateData(game_data)

                //FIND MAXIMUM PATH SIZE, WHICH REPRESENTS THE MAXIMUM OF POS
                let lengths = _(game_data.units)
                .map(row => row.targets.length)
                .value()
                let max_pos = lengths[lengths.indexOf(Math.max(...lengths))]
                let pos = 0; 

                
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
                    let targets = _(game_data.units)
                    .map(row => row.fight_targets[options.pos])
                    .value()

                    let return_options =  {
                        type: "room",
                        id: options.id,                
                        functionGroup: "core",
                        function: "generateMelee",
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

                        //WAIT FOR 3 SECONDS BEFORE CLEARING DOWN AND ADVANCING MODE
                        setTimeout(function(){
                            actionHandler.reset(options)
                        },3000);                        
                    }

                },2000, options)

            }

        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "generateMelee",
                "e": e
            }
            errorHandler.log(options)
        }	               
    }    

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
    // ####### ####### ####### #######  #####  #######  #####  
    // #       #       #       #       #     #    #    #     # 
    // #       #       #       #       #          #    #       
    // #####   #####   #####   #####   #          #     #####  
    // #       #       #       #       #          #          # 
    // #       #       #       #       #     #    #    #     # 
    // ####### #       #       #######  #####     #     ##### 
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      

    generateEffects = async(options) => {

        try{

            if(options.game_data_id){

                // let game_data = options.game_data;
                //GET FULL GAME DATA
                let game_datas = await databaseHandler.findData({
                    model: "GameData"
                    ,search_type: "findOne"
                    ,params: {_id: options.game_data_id}
                })     

                let game_data = game_datas[0]

                let units_affected = []
                let units_specials = []                

                //LOOP THROUGH STATUS EFFECTS
                game_data.units.forEach((unit) => {
                    //SET UNITS THAT HAVE TARGETS AS HAVING SHOT
                    if (unit.status_effects){
                        if(unit.status_effects.length > 0 && unit.alive){
                            let unit_affected = {
                                id: unit.id
                                ,effects: []
                            }
                            let new_status_effects = []
                            unit.status_effects.forEach((effect) => {
                                effect.life -= 1;
                                
                                if(effect.life > 0){
                                    if(effect.class.sub_type == 'damage'){
                                        let damage_applied = utils.checkWounding({
                                            gamedata: game_data,
                                            // attacker: attacker,
                                            hit_override: effect.class.chance,
                                            defender: unit,
                                            damage: effect.class.value,
                                            ap: 0,
                                            bonus: 0
                                        })

                                        unit_affected.effects.push({
                                            message: effect.name,
                                            damage: damage_applied
                                        })
                                    }
                                }
                                new_status_effects.push(effect)
                            })
                            units_affected.push(unit_affected)
                            unit.status_effects = new_status_effects;
                        }
                    }

                    //CHECK FOR SPECIAL RULES
                    if (unit.special_rules){
                        if(unit.special_rules.length > 0 && unit.alive){
                            let unit_affected = {
                                id: unit.id
                                ,rules: []
                            }

                            unit.special_rules.forEach((rule) => {
                                if(rule.name == 'regen' && unit.health < unit.unit_class.health){

                                    let life_returned = 0;
                                    let random_roll = Math.floor(Math.random() * 20)+1
                                    if(random_roll > rule.chance){
                                        unit.life += rule.value;  
                                        life_returned += rule.value;          
                                    }

                                    if(life_returned > 0){

                                        unit_affected.rules.push({
                                            message: rule.name,
                                            value: life_returned
                                        })
    
                                        units_specials.push(unit_affected)                                
                                    }
                                }
                            })
                        }
                    }
                })

                //LOOP THROUGH SPECIAL EFFECTS, LIKE REGEN

                databaseHandler.updateData(game_data)

                let return_options =  {
                    type: "room",
                    id: options.id,                
                    functionGroup: "core",
                    function: "generateEffects",
                    data: {
                        units_status_affected: units_affected,
                        units_specials_affected: units_specials                        
                    }
                }

                this.sendMessage(return_options) 

                setTimeout(function(){
                    actionHandler.reset(options)
                },3000);                        

            }
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "generateEffects",
                "e": e
            }
            errorHandler.log(options)
        }	               
    }    

}