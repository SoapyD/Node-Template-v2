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
																								 
		
		this.scene.input.mouse.disableContextMenu();
		
        //Create a camera controller using the arraow keys
        // var cursors = this.scene.input.keyboard.createCursorKeys();		
				
		// Handles the clicks on the map to make the character move
		// this.scene.input.on('pointerup',this.clickHandler);
		
		this.setupMap();
        this.setupCamera();
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
    
        /*
        // ### Pathfinding stuff ###
        // We create the 2D array representing all the tiles of our map
        var grid = [];
        for(var y = 0; y < this.parent.map.height; y++){
            var col = [];
            for(var x = 0; x < this.parent.map.width; x++){
                // In each cell we store the ID of the tile, which corresponds
                // to its index in the tileset of the map ("ID" field in Tiled)
                col.push(this.getTileID(x,y));
            }
            grid.push(col);
        }
        this.parent.grid = grid;
    
    
        this.parent.tileset = this.parent.map.tilesets[0];
        let properties = this.parent.tileset.tileProperties;
        let acceptable_tiles = [];
    
        
        // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
        // and see what properties have been entered in Tiled.
        for(let i = this.parent.tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
            if(!properties.hasOwnProperty(i)) {
                // If there is no property indicated at all, it means it's a walkable tile
                acceptable_tiles.push(i+1);
                continue;
            }
            if(!properties[i].collide) acceptable_tiles.push(i+1);
        }
    
        this.parent.acceptable_tiles = acceptable_tiles;
        */

		// this.parent.pathfinder = new game_pathfinder(grid, acceptable_tiles);	
		// this.parent.u_collisions = new game_collisions({scene: this.scene});		
    }
    
	getTileID = function(x,y){
		var tile = this.parent.map.getTileAt(x, y);
		return tile.index;
	};

    // ███    ███  █████  ██████  ██   ██ ███████ ██████  
    // ████  ████ ██   ██ ██   ██ ██  ██  ██      ██   ██ 
    // ██ ████ ██ ███████ ██████  █████   █████   ██████  
    // ██  ██  ██ ██   ██ ██   ██ ██  ██  ██      ██   ██ 
    // ██      ██ ██   ██ ██   ██ ██   ██ ███████ ██   ██ 

    setupMarker = () => {
        // Marker that will follow the mouse
        this.parent.markers = [];

        clientRoomHandler.core.users.forEach((user, i) => {

            this.parent.markers[i] = this.scene.add.graphics();
            this.parent.markers[i].lineStyle(3, 0xffffff, 1);
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
            let options = {
                functionGroup: "core",  
                function: "messageRoom",
                id: clientRoomHandler.core.room_name,
                data: {
                    functionGroup: "core",
                    function: "moveMarker",
                    message: "Move Marker",
                    data: {
                        i: 0,
                        x: this.parent.map.tileToWorldX(pointerTileX),
                        y: this.parent.map.tileToWorldY(pointerTileY),                    
                    }
                }
            }				
            clientSocketHandler.messageServer(options)    
    
            this.parent.old_tile_position ={
                x: this.parent.tile_position.x,
                y: this.parent.tile_position.y
            }            
        }

    }

	checkCollision = function(x,y){
		var tile = this.parent.map.getTileAt(x, y);
		if (tile){
			return tile.properties.collide == true; //DON'T SHOW MARKER IF IT COLLIDES WITH A COLLIDABLE TILE		
		}
		else{
			return true; //DON'T SHOW THE MARKER IF IT'S NOT RETURNING TILE DATA
		}
	};
	

    //  #####  ####### ####### #     # ######         #####     #    #     # ####### ######     #    
    // #     # #          #    #     # #     #       #     #   # #   ##   ## #       #     #   # #   
    // #       #          #    #     # #     #       #        #   #  # # # # #       #     #  #   #  
    //  #####  #####      #    #     # ######  ##### #       #     # #  #  # #####   ######  #     # 
    //       # #          #    #     # #             #       ####### #     # #       #   #   ####### 
    // #     # #          #    #     # #             #     # #     # #     # #       #    #  #     # 
    //  #####  #######    #     #####  #              #####  #     # #     # ####### #     # #     # 

    setupCamera = () => {
        //Create a camera controller using the arraow keys
        let cursors = this.scene.input.keyboard.createCursorKeys();
    
        this.parent.camera = this.scene.cameras.main;
        
        let controlConfig = {
            camera: this.scene.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.04,
            drag: 0.0009,
            maxSpeed: 0.5
        };
    
        this.parent.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    
        //SET BOUNDS TO THE CAMERA MOVEMENT
        let offset = 200;
        this.scene.cameras.main.setBounds(
            -offset, 
            -offset, 
            this.parent.map.width * gameCore.tile_size + (offset * 2), 
            this.parent.map.height * gameCore.tile_size + (offset * 2));	
        
        
        this.scene.cameras.main.zoom = 1.75;
        this.scene.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
            this.scene.cameras.main.zoom -= (deltaY / 100) * 0.1;
    
            if(this.scene.cameras.main.zoom <= 1.5){
                this.scene.cameras.main.zoom = 1.5
            }	
            if(this.scene.cameras.main.zoom >= 2.5){
                this.scene.cameras.main.zoom = 2.5
            }	
        });	
        
        let width = gameCore.config.width / 4;
        let height = gameCore.config.height / 4;	
        this.parent.minimap = this.scene.cameras.add(gameCore.config.width - width, gameCore.config.height - height, width, height).setZoom(0.3).setName('mini');
        this.parent.minimap.setBackgroundColor(0x002244);	
        
    
        this.parent.minimap.startFollow(this.parent.rectangle);	
    }    


}