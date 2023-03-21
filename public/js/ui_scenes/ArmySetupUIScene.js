

var ArmySetupUIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function ArmySetupUIScene ()
    {
        Phaser.Scene.call(this, { key: 'ArmySetupUIScene' });
    },

    preload: function()
    {
        ArmySetupUIScene.scene = this.scene.get('ArmySetupUIScene')
        // ArmySetupUIScene.scene.scene.launch('ArmySetupUIScene');
    },


    create: function()
    {
        let x_origin = this.cameras.main.centerX	
        let y_origin = this.cameras.main.centerY
        this.state = 0
        this.squad_id = 0
        this.set_squads = []
        this.saved_squads = []

        const changeSide = () => {
            gameCore.data.player += 1
            gameCore.data.side += 1
            if(gameCore.data.player >= gameCore.assets.forces.length){
                gameCore.data.player = 0
                gameCore.data.side = 0                
            }else{
                ArmySetupUIScene.scene.state = 0
                ArmySetupUIScene.scene.squad_id = 0
            }
        }

		let options;
		
		options = {
			scene: ArmySetupUIScene.scene, 
			x: gameCore.config.width,
			y: 25,
			height: 50,
			width: 250,
			label:  "Change Side",
			array: gameCore.assets.btn_sprite,

			clickAction: changeSide,
			callbackParams: {},
		}
		
		created_button = new button(options)
		gameCore.assets.btn_sprite.push(created_button)

    },

    update: function (time, delta)
    {
        let force = gameCore.assets.forces[gameCore.data.player]

        switch(this.state){
            //GET SQUAD TO SETUP
            case 0:
                this.squad_info = force.army.squads[this.squad_id]
                // console.log(this.squad_info)

                this.squad_matrix = []
                // console.log( GameScene.scene.scene.add)
                let squad_layout = []
                switch(true){
                    case this.squad_info.size == 1:
                        squad_layout = 
                        [
                            [1],
                        ]
                        break;                    
                    case this.squad_info.size <= 5:
                        squad_layout = 
                        [
                            [1,0,1],
                            [0,1,0],
                            [1,0,1],                                                        
                        ]
                        break;
                    case this.squad_info.size <= 10:
                        squad_layout = 
                        [
                            [1,0,1,0,1,0,1],
                            [0,1,0,0,0,1,0],
                            [1,0,1,0,1,0,1],                                                        
                        ]
                        break;          
                    case this.squad_info.size <= 15:
                        squad_layout = 
                        [
                            [1,0,1,0,1,0,1],
                            [0,1,0,0,0,1,0],
                            [1,0,1,0,1,0,1],
                            [0,0,0,0,0,0,0],                            
                            [0,0,1,0,1,0,0],
                            [0,0,0,1,0,0,0],
                            [0,0,1,0,1,0,0],                                                                                    
                        ]
                        break;                        
                    case this.squad_info.size <= 20:
                        squad_layout = 
                        [
                            [1,0,1,0,1,0,1],
                            [0,1,0,0,0,1,0],
                            [1,0,1,0,1,0,1],
                            [0,0,0,0,0,0,0],                            
                            [1,0,1,0,1,0,1],
                            [0,1,0,0,0,1,0],
                            [1,0,1,0,1,0,1],                                                                                    
                        ]
                        break;                                                 
                }
                // console.log(squad_layout)
                // console.log(this.squad_info)
                let unit = this.squad_info.squad.unit;

                let unit_count = 0;
                for(let y=0; y<squad_layout.length; y++){
                    for(let x=0; x<squad_layout[0].length; x++){
                        
                        let pos = squad_layout[y][x];
                        if(pos == 1 && unit_count<this.squad_info.size){
                            
                            let sprite = GameScene.scene.add.sprite(0,0);
                            let colours = gameCore.getSideColour(gameCore.data.side);
                            sprite.setTint(colours.colour)

                            sprite.setOrigin(0.5,1);
                            sprite.setDepth(0);
                            sprite.play(unit.spritesheet+'_idle_south', true);
                            this.squad_matrix.push({
                                sprite: sprite
                                ,offset: {
                                    x: ((x - squad_layout[0].length / 2) * gameCore.data.tile_size) + (gameCore.data.tile_size * unit.sprite_offset)
                                    ,y: ((y - squad_layout.length / 2) * gameCore.data.tile_size) + (gameCore.data.tile_size * unit.sprite_offset)
                                }
                            })  
                            unit_count++;
                        }
                    }                    
                }

                this.state++;
                break;
            //WAIT FOR SQUAD TO BE DEPLOYED, MOVE SQUAD BLOCK TO MATCH MOUSE POSITION
            case 1:
                if(GameScene.tile_position){
                    this.squad_matrix.forEach((unit) => {
                        unit.sprite.x = GameScene.tile_position.x + (gameCore.data.tile_size / 2) + unit.offset.x
                        unit.sprite.y = GameScene.tile_position.y + (gameCore.data.tile_size / 2) + unit.offset.y                    
                    })
                }
                break;
            //RESET STATE FOR NEXT SQUAD, OR ADVANCE IF NO MORE AVAILABLE
            case 2:
                this.set_squads.push(this.squad_matrix);
                this.squad_matrix = []
                this.squad_id += 1;
                if(this.squad_id < force.army.squads.length){
                    this.state = 0
                }else{
                    console.log("NO MORE UNITS TO PLACE")
                    this.state += 1
                }
                // console.log("STATE", this.state)
                // console.log("ID", this.squad_id)
                // console.log("SIZE", force.army.squads.length)    
                break            
            //SEND SQUAD PLACEMENT
            case 3:
                let squad_placement = []
                this.set_squads.forEach((squad) => {
                    let matrix = []
                    squad.forEach((unit) => {
                        matrix.push({
                            x: unit.sprite.x
                            ,y: unit.sprite.y
                        })
                    })
                    squad_placement.push(matrix)
                })

                clientSocketHandler.sendSquadPlacement(squad_placement)
                console.log("PLACEMENT FINISHED, WAITING FOR OTHER PLAYERS")
                
                this.saved_squads.push(this.set_squads)
                this.set_squads = []
                this.state += 1;  
                break;                
        }
                    
    }
});
