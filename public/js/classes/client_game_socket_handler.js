
clientSocketHandler.transitionScene = (options) => {
    gameCore.sceneTransition({scene:options.scene})
}

clientSocketHandler.startRoom = () => {
    
    let options = {
        functionGroup: "core",  
        function: "setupGameData",
        data: {
            room_name: clientRoomHandler.core.room_name
            ,users: clientRoomHandler.core.users
        }     
    }                

    clientSocketHandler.messageServer(options)       
}

clientSocketHandler.moveMarker = (options) => {
    
    let id = options.data.i;
    GameScene.markers[id].x = options.data.x;
    GameScene.markers[id].y = options.data.y;
    // this.parent.markers[id].setVisible(!this.checkCollision(pointerTileX,pointerTileY)); 
}



clientSocketHandler.defineCoreFunctions();