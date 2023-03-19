const game_controls = class {
	constructor(options) {	

        this.scene = options.scene;
        this.parent = options.parent;
    }

    setupControls = () => {

		// ███████ ███████ ████████ ██    ██ ██████        ████████  █████  ██████  ██      ███████ 
		// ██      ██         ██    ██    ██ ██   ██          ██    ██   ██ ██   ██ ██      ██      
		// ███████ █████      ██    ██    ██ ██████  █████    ██    ███████ ██████  ██      █████   
		// 	    ██ ██         ██    ██    ██ ██               ██    ██   ██ ██   ██ ██      ██      
		// ███████ ███████    ██     ██████  ██               ██    ██   ██ ██████  ███████ ███████ 
																								 		
		this.scene.input.mouse.disableContextMenu();
		
        //Create a camera controller using the arraow keys
        var cursors = this.scene.input.keyboard.createCursorKeys();		
				
		// Handles the clicks on the map to make the character move
		this.scene.input.on('pointerup',this.clickHandler);
		
		this.setupCamera();
	        
    }

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
            this.parent.map.width * gameCore.data.tile_size + (offset * 2), 
            this.parent.map.height * gameCore.data.tile_size + (offset * 2)
            );	
        
        
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
        this.parent.minimap = this.scene.cameras.add(gameCore.config.width - width, gameCore.config.height - height, width, height).setZoom(0.2).setName('mini');
        this.parent.minimap.setBackgroundColor(0x002244);	
        
    
        this.parent.minimap.startFollow(this.parent.rectangle);	
    }    


    //  #####  #       ###  #####  #    #       #     #    #    #     # ######  #       ####### ######  
	// #     # #        #  #     # #   #        #     #   # #   ##    # #     # #       #       #     # 
	// #       #        #  #       #  #         #     #  #   #  # #   # #     # #       #       #     # 
	// #       #        #  #       ###    ##### ####### #     # #  #  # #     # #       #####   ######  
	// #       #        #  #       #  #         #     # ####### #   # # #     # #       #       #   #   
	// #     # #        #  #     # #   #        #     # #     # #    ## #     # #       #       #    #  
	//  #####  ####### ###  #####  #    #       #     # #     # #     # ######  ####### ####### #     # 

	clickHandler = function(pointer){


		if (pointer.leftButtonReleased())
		{	

            let options = {
                functionGroup: "core",  
                function: "clickHandler",
                id: clientRoomHandler.core.room_name,
                data: {
                    id: gameCore.data.id,
                    player: gameCore.data.player,
                    button: "left-mouse"
                }
            }				
            clientSocketHandler.messageServer(options)  

			// this.parent.left_click = true;
		}		
		if (pointer.rightButtonReleased())
		{	

            let options = {
                functionGroup: "core",  
                function: "clickHandler",
                id: clientRoomHandler.core.room_name,
                data: {
                    id: gameCore.data.id,
                    player: gameCore.data.player,
                    button: "right-mouse"
                }
            }				
            clientSocketHandler.messageServer(options)  

			// this.parent.right_click = true;
		}			
	};


}