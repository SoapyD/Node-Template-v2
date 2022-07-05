const game_maps = class {
	constructor(options) {	

        this.scene = options.scene;
        this.parent = options.parent;

		this.parent.rectangle = this.scene.add.rectangle(0, 0, 10, 10, 0x6666ff);
		this.parent.rectangle.depth = 100;
		this.parent.rectangle.alpha = 0;
		
		this.parent.startX = 0
		this.parent.startY = 0
		this.parent.endX = 0
        this.parent.endY = 0

        this.parent.old_tile_position = {
            x: 0,
            y: 0
        }

        this.preLoadTileMap();
    }

    setupTable = () => {

		// ███████ ███████ ████████ ██    ██ ██████        ████████  █████  ██████  ██      ███████ 
		// ██      ██         ██    ██    ██ ██   ██          ██    ██   ██ ██   ██ ██      ██      
		// ███████ █████      ██    ██    ██ ██████  █████    ██    ███████ ██████  ██      █████   
		// 	    ██ ██         ██    ██    ██ ██               ██    ██   ██ ██   ██ ██      ██      
		// ███████ ███████    ██     ██████  ██               ██    ██   ██ ██████  ███████ ███████ 
																								
		
		this.setupMap();
        this.setupMarker();
	        
    }

    //  #####  ####### ####### #     # ######        #     #    #    ######  
    // #     # #          #    #     # #     #       ##   ##   # #   #     # 
    // #       #          #    #     # #     #       # # # #  #   #  #     # 
    //  #####  #####      #    #     # ######  ##### #  #  # #     # ######  
    //       # #          #    #     # #             #     # ####### #       
    // #     # #          #    #     # #             #     # #     # #       
    //  #####  #######    #     #####  #             #     # #     # #       

    preLoadTileMap = () => {
		this.scene.load.image('tileset', './img/game/maps/gridtiles.png');
		this.scene.load.tilemapTiledJSON('map', '../../img/game/maps/map2.json');
    }

    setupMap = () => {
        // Display map
        this.parent.map = this.scene.make.tilemap({ key: 'map'});
        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        var tiles = this.parent.map.addTilesetImage('tiles', 'tileset');
        this.parent.map.createStaticLayer(0, tiles, 0,0);		
    }
    
	// getTileID = function(x,y){
	// 	var tile = this.parent.map.getTileAt(x, y);
	// 	return tile.index;
	// };

    // ███    ███  █████  ██████  ██   ██ ███████ ██████  
    // ████  ████ ██   ██ ██   ██ ██  ██  ██      ██   ██ 
    // ██ ████ ██ ███████ ██████  █████   █████   ██████  
    // ██  ██  ██ ██   ██ ██   ██ ██  ██  ██      ██   ██ 
    // ██      ██ ██   ██ ██   ██ ██   ██ ███████ ██   ██ 

    setupMarker = () => {
        // Marker that will follow the mouse
        this.parent.markers = [];

        clientRoomHandler.core.users.forEach((user, i) => {

            let colour = gameCore.getSideColour(gameCore.assets.forces[i].side);
            this.parent.markers[i] = this.scene.add.graphics();
            this.parent.markers[i].lineStyle(3, colour.colour, 1);
            this.parent.markers[i].strokeRect(0, 0, this.parent.map.tileWidth, this.parent.map.tileHeight);        
        })

    }

    updateMarker = () => {

        var worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);

		this.parent.rectangle.x = this.parent.camera.midPoint.x
		this.parent.rectangle.y = this.parent.camera.midPoint.y		

		// Rounds down to nearest tile
		var pointerTileX = this.parent.map.worldToTileX(worldPoint.x);
		var pointerTileY = this.parent.map.worldToTileY(worldPoint.y);

        this.parent.tile_position ={
            x: this.parent.map.tileToWorldX(pointerTileX),
            y: this.parent.map.tileToWorldY(pointerTileY)
        }            

        if(this.parent.tile_position.x != this.parent.old_tile_position.x 
            || this.parent.tile_position.y != this.parent.old_tile_position.y)
        {
            if(gameCore.data.player !== -1){
                // let options = {
                //     functionGroup: "core",  
                //     function: "messageRoom",
                //     id: clientRoomHandler.core.room_name,
                //     data: {
                //         functionGroup: "core",
                //         function: "moveMarker",
                //         message: "Move Marker",
                //         data: {
                //             i: gameCore.data.player,
                //             x: this.parent.map.tileToWorldX(pointerTileX),
                //             y: this.parent.map.tileToWorldY(pointerTileY),
                //             pointerX: pointerTileX,
                //             pointerY: pointerTileY,                    
                //         }
                //     }
                // }				
                // clientSocketHandler.messageServer(options)    

                let options = {
                    functionGroup: "core",  
                    function: "moveMarker",
                    id: clientRoomHandler.core.room_name,
                    data: {
                        id: gameCore.data.id,
                        i: gameCore.data.player,
                        x: this.parent.map.tileToWorldX(pointerTileX),
                        y: this.parent.map.tileToWorldY(pointerTileY),
                        pointerX: pointerTileX,
                        pointerY: pointerTileY,
                        update: {}                    
                    }
                }
                
                options.data.update["players."+gameCore.data.player+".x"] = this.parent.map.tileToWorldX(pointerTileX);
                options.data.update["players."+gameCore.data.player+".y"] = this.parent.map.tileToWorldX(pointerTileY);                
                options.data.update["players."+gameCore.data.player+".pointerX"] = pointerTileX;
                options.data.update["players."+gameCore.data.player+".pointerY"] = pointerTileY;

                clientSocketHandler.messageServer(options) 

            }
    
            this.parent.old_tile_position ={
                x: this.parent.tile_position.x,
                y: this.parent.tile_position.y
            }            
        }

    }

	checkCollision = function(x,y){
        let tile;
        // if(this.parent.map){
        tile = this.parent.map.getTileAt(x, y);
        // }
		if (tile){
			return tile.properties.collide == true; //DON'T SHOW MARKER IF IT COLLIDES WITH A COLLIDABLE TILE		
		}
		else{
			return true; //DON'T SHOW THE MARKER IF IT'S NOT RETURNING TILE DATA
		}
	};
	
}