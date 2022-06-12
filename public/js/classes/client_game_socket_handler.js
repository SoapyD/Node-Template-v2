
clientSocketHandler.transitionScene = (options) => {
    try{
        gameCore.sceneTransition({scene:options.scene})
    }catch(e){

        let options = {
            "class": "gameSocketHandler",
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
            "class": "gameSocketHandler",
            "function": "startRoom",
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
            "class": "gameSocketHandler",
            "function": "moveMarker",
            "e": e
        }
        errorHandler.log(options)
    }        
}

clientSocketHandler.setupGameData = (options) => {
    try{
        if(options.data.forces){
            gameCore.assets.forces = options.data.forces
            gameCore.assets.forces.forEach((force, i) => {
                if(force.user._id === clientRoomHandler.user.id){
                    gameCore.data.player_number = i
                    gameCore.data.player_side = force.side
                }
            })
        }
    }catch(e){

        let options = {
            "class": "gameSocketHandler",
            "function": "setupGameData",
            "e": e
        }
        errorHandler.log(options)
    }      
}



clientSocketHandler.defineCoreFunctions();