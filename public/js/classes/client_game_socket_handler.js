
clientSocketHandler.startRoom = () => {
    gameCore.sceneTransition({scene:"GameScene"})
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
    
    let id = options.parameters.i;
    GameScene.markers[id].x = options.parameters.x;
    GameScene.markers[id].y = options.parameters.y;
    // this.parent.markers[id].setVisible(!this.checkCollision(pointerTileX,pointerTileY)); 
}



clientSocketHandler.defineCoreFunctions();