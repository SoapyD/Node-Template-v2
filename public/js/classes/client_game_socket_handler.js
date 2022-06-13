
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

clientSocketHandler.startRoom = () => {

    try{
        let options = {
            functionGroup: "core",  
            function: "setupGameData",
            data: {
                room_name: clientRoomHandler.core.room_name

                ,selected_forces: [{
                    user: clientRoomHandler.core.users[0]
                    ,army: "Test"
                }]
            }     
        }                

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


// clientSocketHandler.clickHander = (options) => {
//     try{

//     }catch(e){

//         let options = {
//             "class": "clientGameSocketHandler",
//             "function": "moveMarker",
//             "e": e
//         }
//         errorHandler.log(options)
//     }        
// }



clientSocketHandler.defineCoreFunctions();