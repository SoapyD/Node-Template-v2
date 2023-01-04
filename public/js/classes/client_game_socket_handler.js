
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ####### ######     #    #     #  #####  ### ####### ### ####### #     #        #####   #####  ####### #     # ####### 
//    #    #     #   # #   ##    # #     #  #     #     #  #     # ##    #       #     # #     # #       ##    # #       
//    #    #     #  #   #  # #   # #        #     #     #  #     # # #   #       #       #       #       # #   # #       
//    #    ######  #     # #  #  #  #####   #     #     #  #     # #  #  # #####  #####  #       #####   #  #  # #####   
//    #    #   #   ####### #   # #       #  #     #     #  #     # #   # #             # #       #       #   # # #       
//    #    #    #  #     # #    ## #     #  #     #     #  #     # #    ##       #     # #     # #       #    ## #       
//    #    #     # #     # #     #  #####  ###    #    ### ####### #     #        #####   #####  ####### #     # ####### 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

clientSocketHandler.transitionScene = (options) => {


    try{
        if(options.uiscene){
            gameCore.uiSceneTransition(options)
        }
        gameCore.sceneTransition(options)

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "transitionScene",
            "e": e
        }
        errorHandler.log(options)
    }	

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  #####  #######    #    ######  #######       ######  ####### ####### #     # 
// #     #    #      # #   #     #    #          #     # #     # #     # ##   ## 
// #          #     #   #  #     #    #          #     # #     # #     # # # # # 
//  #####     #    #     # ######     #    ##### ######  #     # #     # #  #  # 
//       #    #    ####### #   #      #          #   #   #     # #     # #     # 
// #     #    #    #     # #    #     #          #    #  #     # #     # #     # 
//  #####     #    #     # #     #    #          #     # ####### ####### #     # 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

clientSocketHandler.sendStartGameRoom = () => {
    try{

        let options = {
            functionGroup: "core",  
            function: "startGameRoom",
            id: clientRoomHandler.core.room_name,
            // data: {
            // }     
        }                

        clientSocketHandler.messageServer(options)            

    }catch(e){

        let options = {
            "class": "socketHandler",
            "function": "sendStartRoom",
            "e": e
        }
        errorHandler.log(options)
    }	         
}

clientSocketHandler.startGameRoom = () => {

    try{
        //CHECK TO SEE IF USER IS ADMIN SO CAN START ROOM
        if(clientRoomHandler.core.admins.includes(clientRoomHandler.user.id)){
            let options = {
                functionGroup: "core",  
                function: "setupGameData",
                id: clientRoomHandler.core.room_name,
                data: {
                    // room_name: clientRoomHandler.core.room_name,
                    selected_forces: []
                }     
            }                
    
            clientRoomHandler.core.users.forEach((user) => {
    
                options.data.selected_forces.push(
                    {user: user, army: "Test"}
                    // ,{user: user, army: "Test"}
                )
            })
    
    
            clientSocketHandler.messageServer(options)
        }
    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "startRoom",
            "e": e
        }
        errorHandler.log(options)
    }           
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

clientSocketHandler.setupGameData = (options) => {
    try{
        if(options.data.forces){
            gameCore.data.id = options.data.id
            gameCore.assets.forces = options.data.forces
            gameCore.assets.forces.forEach((force, i) => {
                if(force.user._id === clientRoomHandler.user.id){
                    gameCore.data.player = i
                    gameCore.data.side = force.side
                }
            })
        }
    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "setupGameData",
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

clientSocketHandler.reloadGameData = (options) => {


    try{
        // console.log(options.data.game_data)
        // gameCore.assets.forces = options.data.forces

        clientSocketHandler.setupGameData(options)

        gameCore.assets.units_preload = options.data.units
        
        //IF GAMECORE CURRENT SCENE IS GAME_SCENE, RELOAD UNITS
        if(gameCore.current_scene.scene.key == 'GameScene'){
            // GameScene.game_squad_setup.unit_list = [];            
            GameScene.game_squad_setup.runPlacement();
            // gameCore.assets.units = GameScene.game_squad_setup.unit_list;     
            //SET MODE
            clientSocketHandler.setMode(options);                   
        }else{
            //ELSE TRANSITION TO GAME_SCENE WHICH SHOULD RELOAD UNITS AS STANDARD
            // gameCore.data.id = options.data.game_data_id;
            // console.log("CAN'T RELOAD, NOT THE RIGHT SCENE")(

            // gameCore.data.game_state = 2

            clientSocketHandler.transitionScene({
                scene: 'GameScene'
                ,uiscene: 'StartUIScene'
            })

            // function: "transitionScene",
            // scene: 'GameScene',
            // uiscene: 'StartUIScene'   

        }

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "reloadGameData",
            "e": e
        }
        errorHandler.log(options)
    }        
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  #####     #    #     # #######        #####     #    #     # ####### 
// #     #   # #   #     # #             #     #   # #   ##   ## #       
// #        #   #  #     # #             #        #   #  # # # # #       
//  #####  #     # #     # #####   ##### #  #### #     # #  #  # #####   
//       # #######  #   #  #             #     # ####### #     # #       
// #     # #     #   # #   #             #     # #     # #     # #       
//  #####  #     #    #    #######        #####  #     # #     # ####### 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

clientSocketHandler.saveGame = () => {

    try{

        if(gameCore.data.player === 0){

            let options = {
                functionGroup: "core",  
                function: "saveUnitData",
                id: clientRoomHandler.core.room_name,            
                data: {}     
            }                

            let data = {
                // id: gameCore.data.id,
            }
            data.units = [];
            gameCore.assets.units.forEach((unit) => {
                //THIS IS THE REASON WHY UNITS AREN'T BEING SAVED CORRECTLY
                // if(unit.core.player === gameCore.data.player){
                
                    // unit.core.alive = unit.core.alive
                    unit.core.alive = true //NEEDS SETTING WHEN UNITS ARE PLACED CORRECTLY
                    unit.core.x = unit.sprite.x
                    unit.core.y = unit.sprite.y		
                    unit.core.x -= gameCore.data.tile_size * unit.unit_class.sprite_offset;
                    unit.core.y -= gameCore.data.tile_size * unit.unit_class.sprite_offset;	
                    
                    unit.core.tileX = unit.core.x / gameCore.data.tile_size,
                    unit.core.tileY = unit.core.y / gameCore.data.tile_size,               
                    // console.log(unit.core)
                    data.units.push(unit.core)
            })

            options.data.update = data;
            options.data.id = gameCore.data.id

            clientSocketHandler.messageServer(options)
        }
    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "saveGame",
            "e": e
        }
        errorHandler.log(options)
    }    
}

clientSocketHandler.setMode = (options) => {
    try{
        gameCore.resetAll();
        gameCore.data.mode = options.data.mode;

        if(GameUIScene.mode_button){
            GameUIScene.mode_button.updateText(gameCore.data.mode)
        }
    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "moveMarker",
            "e": e
        }
        errorHandler.log(options)
    }      
}

clientSocketHandler.changeMode = (options) => {
    try{
        let options = {
            functionGroup: "core",  
            function: "changeMode",
            id: clientRoomHandler.core.room_name,            
            data: {
                id: gameCore.data.id,    
            }
        }             
        clientSocketHandler.messageServer(options)

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "moveMarker",
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

clientSocketHandler.moveMarker = (options) => {
    try{
        let id = options.data.i;
        GameScene.markers[id].x = options.data.x;
        GameScene.markers[id].y = options.data.y;
        if(options.data.pointerX && options.data.pointerY){
            GameScene.markers[id].setVisible(!GameScene.game_maps.checkCollision(options.data.pointerX,options.data.pointerY)); 
        }

        //CHECK TO SEE IF MARKER IS ON A UNIT
        let unit_id = -1
        gameCore.assets.units.forEach((unit) => {
            if(
                options.data.x + (gameCore.data.tile_size / 2) > unit.sprite_ghost.x - (unit.sprite_ghost.width / 2) &&
                options.data.x + (gameCore.data.tile_size / 2) < unit.sprite_ghost.x + (unit.sprite_ghost.width / 2) &&
                options.data.y + (gameCore.data.tile_size / 2) > unit.sprite_ghost.y - (unit.sprite_ghost.height / 2) &&
                options.data.y + (gameCore.data.tile_size / 2) < unit.sprite_ghost.y + (unit.sprite_ghost.height / 2)                                
            ){
                unit_id = unit.core.id
                GameUIScene.setUnitHUD(unit)

                if(gameCore.data.selected_unit != -1){
                    let selected_unit = gameCore.assets.units[gameCore.data.selected_unit];
                    GameUIScene.setChanceHUD(selected_unit, unit)
                }                    
            }
        })
        if(unit_id == -1){
            if(gameCore.data.selected_unit != -1){
                let selected_unit = gameCore.assets.units[gameCore.data.selected_unit];
                GameUIScene.setUnitHUD(selected_unit)
            }else{
                GameUIScene.hideUnitHUD()
            }
            GameUIScene.hideChanceHUD()
        }

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "moveMarker",
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

clientSocketHandler.resetSelection = (options) => {


    try{

        const runSelection = (unit) => {
            unit.drawPath(gameCore.presets.selectMove)

            unit.drawCohesion({
                sprite: unit.sprite_ghost
                ,colour_pass: gameCore.presets.selectCohesionPass
                ,colour_fail: gameCore.presets.selectCohesionFail 
            })
        }
        const runDeSelection = (unit) => {
            unit.drawPath(gameCore.presets.deselectMove)      
                            
            unit.drawCohesion({
                sprite: unit.sprite_ghost
                ,colour_pass: gameCore.presets.deselectCohesionPass
                ,colour_fail: gameCore.presets.deselectCohesionFail                
            })      
        }        

        // switch(gameCore.data.mode){
        //     case "move":
        //     case "charge":        
        //     case "shoot":                                    
                //RESET PATHS
                gameCore.assets.units.forEach((unit) => {
                    if(unit.core.player == gameCore.data.player){
                        if(unit.core.id == options.data.selected_unit_id){                        
                            runSelection(unit)         
                            GameUIScene.setUnitHUD(unit)
                            gameCore.data.selected_unit = unit.core.id       
                        }else{
                            runDeSelection(unit)               
                        }
                    }
                })                
            // break;      
        // }        

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "resetSelection",
            "e": e
        }
        errorHandler.log(options)
    }        
}

clientSocketHandler.resetAll = (options) => {


    try{
        // console.log("RESET ALL")
        // gameCore.assets.units.forEach((unit) => {
        //     if (unit.core.alive){
        //         drawPath(
        //             unit.core.id
        //             ,{ data:
        //                 {
        //                     path: []
        //                 }
        //             }
        //         )

        //         unit.core.targets = [];
        //         unit.drawTarget();
        //         unit.core.fight_targets = [];
        //         unit.drawFightTarget();
        //     }
        // })

        // gameCore.resetTempSprites();
        gameCore.resetAll()

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "resetAll",
            "e": e
        }
        errorHandler.log(options)
    }        
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ######  #######    #    ######  #     #       #     # ######  
// #     # #         # #   #     #  #   #        #     # #     # 
// #     # #        #   #  #     #   # #         #     # #     # 
// ######  #####   #     # #     #    #    ##### #     # ######  
// #   #   #       ####### #     #    #          #     # #       
// #    #  #       #     # #     #    #          #     # #       
// #     # ####### #     # ######     #           #####  #      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

clientSocketHandler.readyUp = (options) => {


    try{
        let options = {
            functionGroup: "core",  
            function: "readyUp",
            id: clientRoomHandler.core.room_name,
            data: {
                id: gameCore.data.id,
                player: gameCore.data.player
            }     
        }                

        clientSocketHandler.messageServer(options)

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "moveMarker",
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
//  #####  ####### #######       ######     #    ####### #     # 
// #     # #          #          #     #   # #      #    #     # 
// #       #          #          #     #  #   #     #    #     # 
//  #####  #####      #    ##### ######  #     #    #    ####### 
//       # #          #          #       #######    #    #     # 
// #     # #          #          #       #     #    #    #     # 
//  #####  #######    #          #       #     #    #    #     # 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

const drawPath = (id, options) => {
    let unit = gameCore.assets.units[id]
    unit.core.path = options.data.path

    unit.drawPath(options.colours)

    if(options.data.squad_cohesion_info){

        options.data.squad_cohesion_info.forEach((c_unit) => {
            let unit = gameCore.assets.units[c_unit.id];
            gameCore.assets.units[c_unit.id].core.cohesion_check = c_unit.cohesion_check;

            if(id == c_unit.id){
                unit.drawCohesion({
                    sprite: unit.sprite_ghost
                    ,colour_pass: gameCore.presets.selectCohesionPass
                    ,colour_fail: gameCore.presets.selectCohesionFail                
                })    
            }else{
                unit.drawCohesion({
                    sprite: unit.sprite_ghost
                    ,colour_pass: gameCore.presets.deselectCohesionPass
                    ,colour_fail: gameCore.presets.deselectCohesionFail                
                })                  
            }
        })
    }
}

clientSocketHandler.setPath = (options) => {

    try{

        options.colours = gameCore.presets.selectMove;        
        options.data.ids.forEach((id) => {
            drawPath(id, options)
        })

        if(options.data.alert_message){
            GameScene.showMessage(options.data.alert_message)
        }

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "moveMarker",
            "e": e
        }
        errorHandler.log(options)
    }        
}



clientSocketHandler.setPotentialPaths = (options) => {

    // console.log(options.data)

    try{
        // let unit = gameCore.assets.units[options.data.id]
        gameCore.live_tiles = options.data.live_tiles
        gameCore.drawLiveTiles()

        if(options.data.alert_message){
            GameScene.showMessage(options.data.alert_message)
        }

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "moveMarker",
            "e": e
        }
        errorHandler.log(options)
    }        
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #     # ####### #     # #######       #     # #     # ### ####### 
// ##   ## #     # #     # #             #     # ##    #  #     #    
// # # # # #     # #     # #             #     # # #   #  #     #    
// #  #  # #     # #     # #####   ##### #     # #  #  #  #     #    
// #     # #     #  #   #  #             #     # #   # #  #     #    
// #     # #     #   # #   #             #     # #    ##  #     #    
// #     # #######    #    #######        #####  #     # ###    #    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 



clientSocketHandler.moveUnit = (options) => {
    try{
        if(options.data.start){
            // resetMove
            gameCore.resetTempSprites()
        }


        // const addTween = (unit, position) => {
        //     let tween = getTweenData(unit, position)
        //     GameScene.scene.tweens.add(tween)
        // }

        const getTweenData = (unit, position) => {
            let game_pos = {
                x: position.x * gameCore.data.tile_size,
                y: position.y * gameCore.data.tile_size,                    
            }
            
            let tween_data = {
                targets: unit.sprite_ghost,
                x: {value: game_pos.x, duration: 200},
                y: {value: game_pos.y, duration: 200},
                delay: 0,
                angle: {value: unit.checkAngle(unit.sprite_ghost, game_pos), duration: 0},
            }

            return tween_data
        }


        options.data.positions.forEach((position, i) => {

            let unit = gameCore.assets.units[i];


            //ONLY APPLY AN POSITION MOVE IF THERE'S ONE PASSED FROM THE SERVER
            if(position){
                // console.log(position)
                if(position.effects){
                    let effect_string = ''
                    position.effects.forEach((effect, i) => {
                        if(i > 0){
                            effect_string += ', '
                        }
                        effect_string += effect

                        //APPLY 
                    })
                    if(effect_string !== ''){
                        gameCore.drawTextParticle({
                            text: effect_string,
                            pos: {
                                x: position.x * gameCore.data.tile_size,
                                y: position.y * gameCore.data.tile_size                                
                            }
                        })
                    }
                }


                let tween = GameScene.scene.tweens.add(getTweenData(unit, position))
                
                if(position.damage > 0){
                    unit.wound({damage:position.damage})                    
                }
                if(position.last_pos == true){
                    unit.core.in_combat = true
                    unit.drawSymbol()
                    
                    if(position.clashing_units){
                        position.clashing_units.forEach((clashing_unit_id) => {
                            let clashing_unit = gameCore.assets.units[clashing_unit_id]
                            clashing_unit.core.in_combat = true
                            clashing_unit.drawSymbol() 
                        })
                    }
  
                }

                //UPDATE PLAYER ELEMENTS AS IT MOVES
                tween.on('update',(target) => {
                    let unit = target.targets[0].parent

                    unit.updateElements(unit.sprite_ghost)
                    unit.sprite.x = unit.sprite_ghost.x
                    unit.sprite.y = unit.sprite_ghost.y
                    unit.sprite.angle = unit.sprite_ghost.angle
                    // unit.updateUnitElements(unit.sprite_ghost);
                })

            }
        })


    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "moveMarker",
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
//  #####  ####### #######       #######    #    ######   #####  ####### ####### 
// #     # #          #             #      # #   #     # #     # #          #    
// #       #          #             #     #   #  #     # #       #          #    
//  #####  #####      #    #####    #    #     # ######  #  #### #####      #    
//       # #          #             #    ####### #   #   #     # #          #    
// #     # #          #             #    #     # #    #  #     # #          #    
//  #####  #######    #             #    #     # #     #  #####  #######    #   
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

clientSocketHandler.setShootingTargets = (options) => {

    try{
        let unit = gameCore.assets.units[options.data.unit];


        // console.log(options.data.path)

        unit.core.targets = options.data.targets;
        unit.drawTarget();
        
        /*
        
        let saved_tiles = []
        gameCore.live_tiles = []
        options.data.path.forEach((el) => {
            gameCore.live_tiles.push({
                x: el.x
                ,y: el.y
            })
            saved_tiles.push({
                x: el.tileX
                ,y: el.tileY
            })            
        })
        gameCore.drawLiveTiles(1, 0xff3333)


        gameCore.live_tiles = saved_tiles
        gameCore.drawLiveTiles(0)
        */

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "moveMarker",
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


clientSocketHandler.generateBullets = (options) => {
    try{

        options.data.targets.forEach((target, i) => {

            //ONLY APPLY AN POSITION MOVE IF THERE'S ONE PASSED FROM THE SERVER
            if(target){
                let unit = gameCore.assets.units[i]
                let game_pos = {
                    x: target.x * gameCore.data.tile_size,
                    y: target.y * gameCore.data.tile_size,                    
                }
                let angle = Phaser.Math.Angle.BetweenPoints(unit.sprite, game_pos);

				let bullet_options = {
					scene: GameScene.scene,
					spritesheet: "bullet",
					angle: angle,
					unit: unit,
					target: {x: game_pos.x, y: game_pos.y},
                    server_options: target
				}

			    gameCore.assets.bullets.push(new bullet(bullet_options))

                //make unit shot=true

                // target.intersections.forEach((intersection) => {
                //     gameCore.current_scene.physics.add.image(
                //         intersection.x,
                //         intersection.y,"marker").setDepth(0)           
                // })

                unit.core.shot = true
                unit.drawSymbol()
            }
        })

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
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
//  #####  ####### #######       #######    #    ######   #####  ####### ####### 
// #     # #          #             #      # #   #     # #     # #          #    
// #       #          #             #     #   #  #     # #       #          #    
//  #####  #####      #    #####    #    #     # ######  #  #### #####      #    
//       # #          #             #    ####### #   #   #     # #          #    
// #     # #          #             #    #     # #    #  #     # #          #    
//  #####  #######    #             #    #     # #     #  #####  #######    #   
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

clientSocketHandler.setFightTargets = (options) => {

    try{
        let unit = gameCore.assets.units[options.data.unit];

        unit.core.fight_targets = options.data.targets;
        unit.drawFightTarget();

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "moveMarker",
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

clientSocketHandler.generateMelee = (options) => {
    try{

        options.data.targets.forEach((target, i) => {

            //ONLY APPLY AN POSITION MOVE IF THERE'S ONE PASSED FROM THE SERVER
            if(target){
                let unit = gameCore.assets.units[i]
                let game_pos = {
                    x: target.x * gameCore.data.tile_size,
                    y: target.y * gameCore.data.tile_size,                    
                }
                let angle = Phaser.Math.Angle.BetweenPoints(unit.sprite, game_pos);
                unit.sprite.angle = angle;

                // console.log(target)
				let target_unit = gameCore.assets.units[target.target_id];
                target_unit.wound({damage:target.damage})             
            }
        })

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "generateMelee",
            "e": e
        }
        errorHandler.log(options)
    }  
}


clientSocketHandler.drawPopup = (options) => {
    try{

        GameScene.showMessage(options.data.popup_message)

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
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

    clientSocketHandler.generateEffects = (options) => {
        try{
            if(options.data.units_status_affected){
                options.data.units_status_affected.forEach((unit_affected) => {
                    let unit = gameCore.assets.units[unit_affected.id]

                    if(unit_affected.effects){
                        unit_affected.effects.forEach((effect) => {
                            unit.drawTextParticle(effect.message)
                            unit.wound(effect)
                        })
                    }
                })
            }

            if(options.data.units_specials_affected){
                options.data.units_specials_affected.forEach((unit_affected) => {
                    let unit = gameCore.assets.units[unit_affected.id]

                    if(unit_affected.rules){
                        unit_affected.rules.forEach((rule) => {
                            unit.drawTextParticle(rule.message)
                            if(rule.message == 'regen'){
                                unit.core.health += rule.value;
                                unit.updateElements(unit.sprite_ghost)
                            }
                        })
                    }
                })
            }

    
        }catch(e){
    
            let options = {
                "class": "clientGameSocketHandler",
                "function": "generateEffects",
                "e": e
            }
            errorHandler.log(options)
        }  
    }



clientSocketHandler.defineCoreFunctions();