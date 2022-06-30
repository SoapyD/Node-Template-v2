
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
        gameCore.sceneTransition({scene:options.scene})
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

clientSocketHandler.startRoom = () => {

    try{
        let options = {
            functionGroup: "core",  
            function: "setupGameData",
            data: {
                room_name: clientRoomHandler.core.room_name

                ,selected_forces: []
            }     
        }                

        clientRoomHandler.core.users.forEach((user) => {

            options.data.selected_forces.push({
                user: user
                ,army: "Test"
            })
        })


        clientSocketHandler.messageServer(options)
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

        let options = {
            functionGroup: "core",  
            function: "saveUnitData",            
            data: {}     
        }                

        let data = {
            // id: gameCore.data.id,
        }
        data.units = [];
        gameCore.assets.units.forEach((unit) => {
            if(unit.core.player === gameCore.data.player){

                unit.core.x = unit.sprite.x
                unit.core.y = unit.sprite.y		
                unit.core.x -= gameCore.data.tile_size * unit.unit_class.sprite_offset;
                unit.core.y -= gameCore.data.tile_size * unit.unit_class.sprite_offset;	
                
                unit.core.tileX = unit.core.x / gameCore.data.tile_size,
                unit.core.tileY = unit.core.y / gameCore.data.tile_size,               
                
                data.units.push(unit.core)
            }

        })

        options.data.update = data;
        options.data.id = gameCore.data.id

        clientSocketHandler.messageServer(options)

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "saveGame",
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
        GameScene.markers[id].setVisible(!GameScene.game_maps.checkCollision(options.data.pointerX,options.data.pointerY)); 
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

clientSocketHandler.setPath = (options) => {

    // console.log(options.data)

    try{
        let unit = gameCore.assets.units[options.data.id]
        unit.core.path = options.data.path

        let colours = {
            line_colour: 0x00cccc,
            fill_colour: 0x2ECC40,
            line_alpha: 0.75,
            circle_alpha: 0.15,
            fill_alpha: 0.15,
            width: 5
        }

        unit.drawPath(colours)

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

    }catch(e){

        let options = {
            "class": "clientGameSocketHandler",
            "function": "moveMarker",
            "e": e
        }
        errorHandler.log(options)
    }        
}


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

            //ONLY APPLY AN POSITION MOVE IF THERE'S ONE PASSED FROM THE SERVER
            if(position){
                let unit = gameCore.assets.units[i]
                let tween = GameScene.scene.tweens.add(getTweenData(unit, position))
                
                //UPDATE PLAYER ELEMENTS AS IT MOVES
                tween.on('update',(target) => {
                    let unit = target.targets[0].parent

                    unit.updateElements(unit.sprite_ghost)
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




clientSocketHandler.defineCoreFunctions();