
var server_socket_handler = require("./server_socket_handler")
const game_state = require("./game/game_state")
const collisions = require("./game/collisions")
const stateHandler = new game_state()
const utils = require("../utils");

const _ = require('lodash');
const barrier = require("../models/game/barrier");

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
    //  #####  #     # #######  #####  #    #       #     # ####### #     # #     # ######  ### #     #  #####  
    // #     # #     # #       #     # #   #        #  #  # #     # #     # ##    # #     #  #  ##    # #     # 
    // #       #     # #       #       #  #         #  #  # #     # #     # # #   # #     #  #  # #   # #       
    // #       ####### #####   #       ###    ##### #  #  # #     # #     # #  #  # #     #  #  #  #  # #  #### 
    // #       #     # #       #       #  #         #  #  # #     # #     # #   # # #     #  #  #   # # #     # 
    // #     # #     # #       #     # #   #        #  #  # #     # #     # #    ## #     #  #  #    ## #     # 
    //  #####  #     # #######  #####  #    #        ## ##  #######  #####  #     # ######  ### #     #  #####  
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

    checkWounding = (options) => {
        try{
            let random_roll = Math.floor(Math.random() * 20)+1
            // random_roll = 20
            // console.log(random_roll)

            let min_roll_needed = options.defender.armour_class.value - (options.ap + options.bonus);
            if(options.hit_override !== undefined){
                min_roll_needed = options.hit_override;
            }

            // HALF THE RANDOM ROLL IF THE PLAYER IS OUT OF COHESION
            // if(options.attacker_id){
            // 	if(gameFunctions.units[options.attacker_id].cohesion_check === false){
            // 		random_roll = Math.round(random_roll / 2,0);
            // 	}
            // }

            let result = ""
            if(random_roll === -1){
                result = "pass"
            }
            if(random_roll >= min_roll_needed){
                result = "pass"
            }
            if(random_roll < min_roll_needed && random_roll >= 0){
                result = "fail"
            }		
            if(random_roll === 20){
                result = "critical success"
            }
            if(random_roll === 1){
                result = "critical fail"
            }

            let print_text = "";
            let target;
            switch(result){
                case "critical success":
                    options.damage *= 2;
                    print_text = "crit success!\n-"+options.damage;
                    target = options.defender;	
                break;
                case "pass":
                    print_text = "-"+options.damage;
                    target = options.defender;
                break;
                case "fail":
                    print_text = "miss";
                    options.damage = 0;
                    target = options.defender;
                break;
                case "critical fail":
                    options.damage = 0;
                    print_text = "crit fail!";
                    target = options.defender;
                break;
            }
            
            if(target){
                if(target.alive === true){
    
                    // console.log(print_text)	
                    
                    target.health -= options.damage;
                    // target.drawHealth(this.sprite)
                    if(target.health <= 0){
                    //     this.core.killed_by = options.attacker_id;
                    //     GameUIScene.updatePointsHUD();
                    //     target.kill();

                        target.alive = false;
                    }
                }
            }

            return options.damage
        }
        catch(e){
            let options = {
                "class": "game_socket_handler",
                "function": "wound",
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
                //GET FULL GAME DATA
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

                //reset blast_units arrays
                game_data.units.forEach((unit) => {
                    unit.targets.forEach((target) => {
                        target.blast_targets = [];
                    })
                })

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
                                        pos: potential_target.pos
                                        //sub_targets
                                    }
                                    shooting_data.push(data);
                                })
                            }
                            //ADD ON THE END PATH POINT
                            let data = {
                                id: shooting_data.length,
                                uid: '_'+n+'_'+i+'_',
                                origin: n,
                                shot: i,
                                hit_time: target.hit_time,
                                target: -1,
                                pos: {
                                    x: target.x,
                                    y: target.y
                                }
                                //sub_targets
                            }
                            shooting_data.push(data);                            
                        }
                    })
                }

                shooting_data = utils.functions.sortDynamic(shooting_data, "hit_time")
                // console.log(shooting_data)

                //loop through shooting data and figure out which units hit
                
                let shots_hit = [];
                shooting_data.forEach((item) => {
                    //CHECK TO SEE THE SHOT BY X UNIT HASN'T BEEN HANDLED YET
                    //uid is the origin of the bullet and the shot number
                    if(!JSON.stringify(shots_hit).includes(item.uid)){
                        
                        let attacker = game_data.units[item.origin];
                        let attacker_gun = attacker.gun_class[attacker.selected_gun];
                        // let defender = game_data.units[item.target];
                        
                        let bullet_hit = false;

                        if(item.target === -1){
                            bullet_hit = true;
                        }
                        //check if target is hit
                        if(item.target > -1){
                            let target_unit = game_data.units[item.target];
                            if(target_unit.alive){
                                bullet_hit = true;
    
                                //CALCULATE WOUNDING AND APPLY DAMAGE
                                let damage_applied = this.checkWounding({
                                    defender: target_unit,
                                    damage: attacker_gun.damage,
                                    ap: attacker_gun.ap,
                                    bonus: attacker.unit_class.shooting_bonus
                                })
    
                                shots_hit.push(item)
     
                                //APPLY DAMAGE OUTCOMES TO TARGETS AND SUB TARGETS (HIT OR MISS)
                                //SO THAT DATA CAN BE PASSED BACK TO PLAYERS AND APPLIED                            
                                //SET THE TARGET OF THE BULLET IF IT'S HIT A UNIT
                                let shot_data = attacker.targets[item.shot];
                                shot_data.x = item.pos.x
                                shot_data.y = item.pos.y
                                shot_data.target_id = item.target;
                                shot_data.damage = damage_applied;     
                            }
                        }

                        if(bullet_hit){
                            //USE LINE CIRCLE COLLISION TO CHECK TO SEE IF ANY BARRIERS ARE HIT
                            if(game_data.barriers.length > 0){

                                game_data.units[item.origin].targets[item.shot].intersections = []

                                game_data.barriers.forEach((barrier) => {
                                    if(barrier.life > 0){
                                        let clash = collisionHandler.lineCircle(
                                            attacker.x, attacker.y,
                                            item.pos.x * game_data.tile_size, item.pos.y * game_data.tile_size,
                                            barrier.x, barrier.y, (barrier.barrier_class.blast_radius / 2) * game_data.tile_size
                                        )
                                        //CHECK WHERE THE CLASH OCCURS
                                        if(clash){
                                            let bullet_line = new collisions.line({points:[
                                                {x: attacker.x, y: attacker.y},
                                                {x: item.pos.x * game_data.tile_size, y: item.pos.y * game_data.tile_size},
                                            ]})
                                            
                                            let barrier_circle = new collisions.circle({
                                                x: barrier.x,
                                                y: barrier.y,
                                                r: (barrier.barrier_class.blast_radius / 2) * game_data.tile_size,
                                            })

                                            let xPoints = bullet_line.circleCollide(barrier_circle);
                                            let intersection_points = bullet_line.convertPointsToPos(xPoints)
                                            if(intersection_points.length > 0){
                                                intersection_points.forEach((intersection) => {
                                                    game_data.units[item.origin].targets[item.shot].intersections.push(intersection);
                                                })
                                            }
                                        }
                                    }
                                })
                            }

                            //CHECK FOR BARRIER CREATION
                            if(attacker_gun.barrier){
                                let barrier = {
                                    barrier_class: attacker_gun.barrier.id
                                    ,life: attacker_gun.barrier.life
                                    ,x: item.pos.x * game_data.tile_size
                                    ,y: item.pos.y * game_data.tile_size                                    
                                    ,tileX: item.pos.x
                                    ,tileY: item.pos.y
                                }

                                game_data.barriers.push(barrier)                              
                            }

                            //ALSO NEED TO APPLY SPLASH DAMAGE HERE  
                            // console.log(attacker.gun_class[attacker.selected_gun]) 
                            if(attacker_gun.blast_radius > 1){
                                let blast_units = collisionHandler.checkBlastClash({
                                    game_data: game_data
                                    ,start: item.pos
                                    ,blast_radius: attacker_gun.blast_radius
                                })
    
                                blast_units.forEach((blast_unit) => {
                                    
                                    if(blast_unit.alive){
                                        //CALCULATE WOUNDING AND APPLY DAMAGE
                                        let damage_applied = this.checkWounding({
                                            defender: blast_unit,
                                            damage: attacker_gun.damage,
                                            ap: attacker_gun.ap,
                                            bonus: attacker.unit_class.shooting_bonus
                                        })
                                        
                                        game_data.units[item.origin].targets[item.shot].blast_targets.push({
                                            id: blast_unit.id
                                            ,damage: damage_applied
                                        })
                                    }
                                })
    
                            }
                        }

                    }
                })

                //SAVE THE ROOM
                databaseHandler.updateData(game_data)                

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