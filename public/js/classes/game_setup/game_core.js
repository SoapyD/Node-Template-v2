const game_core = class {
	constructor() {	

        this.config = {}

        this.presets = {}

        this.assets = {
            btn_sprite: [],
            units: [],
            bullets: [],
            forces: [],
            players: [],
            barriers: [],
            
            units_preload: [],
            barrier_preload: [],                        
        }

        this.data = {
            id: "",
            mode: '',
            game_state: 0,
            mode_state: 0,
            turn_number: 0,          
            
            tile_size: 32,
            map_height: 0,
            map_depth_itts: 0,
            map_width: 0,            
            
            current_side: -1,
            player: -1,
            side: -1,
            max_players: 2,
            max_sides: 2,
            selected_unit: -1,
        }
        this.current_scene = {};
        this.current_uiscene = {};

        this.setConfig();
        this.setScenes();
        this.setPresets();

        this.live_tiles = [];
        this.temp_sprites = [];

        this.game = new Phaser.Game(this.config);
    }

    setConfig = () => {
        this.config = {
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio,	
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            
            parent: 'gameContainer',
            dom: {
                createContainer: true
            },	   
        }; 
    }

    setScenes = () => {
        switch(instance_type){
            case "DEV":
                this.config.scene = [ MainMenuScene, GameScene, StartUIScene, GameUIScene ]
                break;
            // case "DEV-ONLINE":
            //     this.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, GameScene, GameUIScene, ArmySetupUIScene]
            //     break;		
            // default:
            //     this.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, GameScene, GameUIScene, ArmySetupUIScene]
            //     break;
        }       
    }

    setPresets = () => {

        this.presets.line = 0x00cccc

        this.presets.deselectMove = {
            line_colour: this.presets.line,
            fill_colour: 0x2ECC40,
            line_alpha: 0.5,
            circle_alpha: 0.15,
            fill_alpha: 0.15,
            width: 3
        }
        
        this.presets.selectMove = {
            line_colour: this.presets.line,
            fill_colour: 0x2ECC40,
            line_alpha: 0.75,
            circle_alpha: 0.15,
            fill_alpha: 0.15,
            width: 5
        }        

        this.presets.selectCohesionPass = {
            line_colour: 0x2ECC40,
            fill_colour: 0x2ECC40,
            line_alpha: 0.75,
            circle_alpha: 0.75,
            fill_alpha: 0.75,
            width: 5,
            line_width: 5            
        }

        this.presets.selectCohesionFail = {
            line_colour: 0xFF0000,
            fill_colour: 0xFF0000,
            line_alpha: 0.75,
            circle_alpha: 0.75,
            fill_alpha: 0.5,
            width: 5,
            line_width: 5
        }        

        this.presets.deselectCohesionPass = {
            line_colour: 0x2ECC40,
            fill_colour: 0x2ECC40,
            line_alpha: 0.75,
            circle_alpha: 0.75,
            fill_alpha: 0.15,
            width: 5,
            line_width: 1            
        }

        this.presets.deselectCohesionFail = {
            line_colour: 0xFF0000,
            fill_colour: 0xFF0000,
            line_alpha: 0.75,
            circle_alpha: 0.75,
            fill_alpha: 0.15,
            width: 5,
            line_width: 1
        }                
    }
    

    getSideColour = (side) => {
        let colour = {};
        colour.colour = 0xFFFFFF;
        switch(side){
            case 0:
                colour.colour = 0xff3333; //red
                break;
            case 1:
                colour.colour = 0x3399ff; //blue
                break;
            case 2:
                colour.colour = 0x00FF00; //lime
                break;
            case 3:
                colour.colour = 0xFFFF00; //yellow
                break;				
        }
    
        colour.colour_gray = 0x808080;
    
        colour.colour_info = Phaser.Display.Color.ValueToColor(colour.colour)
        colour.colour_info.dest = {r: 255, g: 255, b: 255};
        colour.colour_info.r_itt = (colour.colour_info.dest.r - colour.colour_info.r) / 255
        colour.colour_info.g_itt = (colour.colour_info.dest.g - colour.colour_info.g) / 255									
        colour.colour_info.b_itt = (colour.colour_info.dest.b - colour.colour_info.b) / 255
        
        return colour
    }


	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
	// ████████ ██████   █████  ███    ██ ███████ ██ ████████ ██  ██████  ███    ██ ███████ 
	//    ██    ██   ██ ██   ██ ████   ██ ██      ██    ██    ██ ██    ██ ████   ██ ██      
	//    ██    ██████  ███████ ██ ██  ██ ███████ ██    ██    ██ ██    ██ ██ ██  ██ ███████ 
	//    ██    ██   ██ ██   ██ ██  ██ ██      ██ ██    ██    ██ ██    ██ ██  ██ ██      ██ 
	//    ██    ██   ██ ██   ██ ██   ████ ███████ ██    ██    ██  ██████  ██   ████ ███████ 
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################

    sceneTransition = (options) => {
        this.current_scene.scene.start(options.scene)	
      }
    
    
    uiSceneTransition = (options) => {
        this.current_uiscene.scene.stop()
        // this.current_uiscene.scene.start(options.uiscene)	
    }


    hideButtons = () => {
        this.assets.btn_sprite.forEach((btn) => {
            btn.hideButton();
            btn.text.visible = false;
        })
    }
    
    showButtons = () => {
        this.assets.btn_sprite.forEach((btn) => {
            btn.showButton();
            btn.text.visible = true;	
        })
    }


    resetAll = (options) => {

        if(options.data.cohesion_resets){
            options.data.cohesion_resets.forEach((cohesion_reset) => {
                gameCore.assets.units[cohesion_reset.id].core.cohesion_check = cohesion_reset.cohesion_check
            })
        }

        this.assets.players.forEach((player, i) => {
            player.ready = false;
            let force = this.assets.forces[i]
            if(force.side == gameCore.data.current_side){
                GameUIScene.setForcesHUD(i, "unready", true, true)
            }
        })

        this.assets.units.forEach((unit) => {
            if (unit.core.alive){
                drawPath(
                    unit.core.id
                    ,{ data:
                        {
                            path: []
                        }
                    }
                )

                unit.core.targets = [];
                unit.drawTarget();
                unit.core.fight_targets = [];
                unit.drawFightTarget();

                unit.updateElements(unit.sprite)
            }
        })

        this.resetTempSprites();        
    }


    // ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
    // ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
    // █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
    // ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
    // ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 

    resetTempSprites = () => {
        this.temp_sprites.forEach((sprite) => {
            sprite.destroy();
        })
        
        this.temp_sprites = []
    }

    drawLiveTiles = (reset=1, colour) => {
        if(reset === 1){
            this.resetTempSprites();
        }
        
        if(this.live_tiles){
            this.live_tiles.forEach((tile, i)=> {
                this.temp_sprites.push(
                    this.current_scene.physics.add.image(
                        tile.x * gameCore.data.tile_size,
                        tile.y * gameCore.data.tile_size,"marker").setDepth(0)
                )

                if(colour){
                    this.temp_sprites[i].setTint(colour)
                }
            })		
        }
    }

    drawTextParticle(options){

        let part_options = {
            scene: GameScene.scene,
            // parent_id: this.core.id,
            text: options.text,
            text_style: { 
                font: "16px Arial",
                fill: "#ff0044",
                align: "center",
                stroke: "#000000",
                strokeThickness: 2
            },
            pos: {
                x: options.pos.x,
                y: options.pos.y
            },
            tween:true,
            rise_duration: 500,
            fadeout_duration: 500
        }
    
        new particle(part_options)
    }

 
	// ██    ██ ██████  ██████   █████  ████████ ███████       ███████ ██      ███████ ███    ███ ███████ ███    ██ ████████ ███████ 
	// ██    ██ ██   ██ ██   ██ ██   ██    ██    ██            ██      ██      ██      ████  ████ ██      ████   ██    ██    ██      
	// ██    ██ ██████  ██   ██ ███████    ██    █████   █████ █████   ██      █████   ██ ████ ██ █████   ██ ██  ██    ██    ███████ 
	// ██    ██ ██      ██   ██ ██   ██    ██    ██            ██      ██      ██      ██  ██  ██ ██      ██  ██ ██    ██         ██ 
	//  ██████  ██      ██████  ██   ██    ██    ███████       ███████ ███████ ███████ ██      ██ ███████ ██   ████    ██    ███████ 


	// checkCollisionsBarriers = () => {
	// 	this.scene_container.barriers.forEach((barrier) => {
	// 		barrier.checkCollisions();
	// 	})
	// }

	// updateBarriers = () => {
	// 	let new_list = []
	// 	this.scene_container.barriers.forEach((barrier) => {
	// 		barrier.checkDeath();
	// 		if(barrier.alive === true){
	// 			new_list.push(barrier)
	// 		}
	// 	})
	// 	this.scene_container.barriers = new_list;
	// }

	updateElements = (worldPoint) => {
																																	  
		//CHECK BULLET DEATH
		let bullets = [];
		if(this.assets.bullets){
			this.assets.bullets.forEach((bullet) => {

				bullet.checkRange();
				if(bullet.delete === false){
					bullets.push(bullet)
				}

				// this.assets.barriers.forEach((barrier) => {
				// 	if(barrier.side != bullet.side){
				// 		barrier.checkAction(bullet)
				// 	}
				// })
			})
		}
		
		this.assets.bullets = bullets;
		

		// let click_circle = new u_circle({
		// 	x: worldPoint.x,
		// 	y: worldPoint.y,
		// 	r: 1
		// });


		// let touching_unit = false;
		// if(gameFunctions.units){
		// 	gameFunctions.units.forEach((unit) => {
		// 		if(unit.core.side === gameFunctions.current_side){

		// 			if(unit.is_moving === true){
		// 				unit.updateUnitElements(unit.sprite);
		// 			}
		// 		}

		// 		let unit_circle = new u_circle({
		// 			x: unit.sprite.x,
		// 			y: unit.sprite.y,
		// 			r: unit.sprite.width / 2
		// 		});
		// 		let clash = GameScene.u_collisions.circleCircle(click_circle, unit_circle);

		// 		if(clash === true){
		// 			touching_unit = true;
		// 			if(this.scene_container.hovered_unit_id !== unit.core.id){
		// 				this.scene_container.hovered_unit_id = unit.core.id
		// 				GameUIScene.setUnitHUD(unit)

		// 				if(this.scene_container.selected_unit.length > 0){
		// 					let selected_unit = this.scene_container.selected_unit[0];
		// 					if(selected_unit.core.side !== unit.core.side){
		// 						GameUIScene.setChanceHUD(selected_unit, unit)
		// 					}
		// 				}						
		// 			}
		// 		}
		// 	})
		// }		

		// if(touching_unit === false){
		// 	GameUIScene.hideUnitHUD();
		// 	GameUIScene.hideChanceHUD();
		// 	this.scene_container.hovered_unit_id = -1;
		// }
	}




}