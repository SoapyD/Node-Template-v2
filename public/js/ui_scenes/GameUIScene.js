var GameUIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'GameUIScene' });
    },

    preload: function()
    {
        this.load.spritesheet("buttons", "./img/game/buttons3.jpg", 
        { frameWidth: 100, frameHeight: 50, endFrame: 3 });	
		
		GameUIScene.scene = this.scene.get('GameUIScene')

		let options = {
			x: 0,
			y: gameCore.config.height,
			width: 300,
			height: 100,
			scene: GameUIScene.scene
		}

		GameUIScene.debug_console = new debug_console(options);	

		GameUIScene.mode_check_state = 0;
		GameUIScene.mode_check_timer = 0;
	
    },

    create: function()
    {
		GameUIScene.setupHUD();

		let callbackParams = {};
		
		gameCore.assets.btn_sprite = [];		
		

		switch(instance_type){
			case "DEV":
				GameUIScene.loadSingleButton(this)
				break;
			case "DEV-ONLINE":
				GameUIScene.loadSingleButton(this)
				break;
			default:
				GameUIScene.loadSingleButton(this)
				break;
		}		
				
		gameCore.current_uiscene = this.scene.get('GameUIScene');
    },

    update: async function (time, delta)
    {

		let console_text = "DEV CONSOLE"+'\r';
		console_text += '////////////////////////'+'\r'
		// console_text += 'Mode: '+gameCore.data.mode_state+'\r'

		GameUIScene.debug_console.updateText(console_text)


		// modeHandler.advanceMode();

    }
});


// ██       ██████   █████  ██████        ██████  ██    ██ ████████ ████████  ██████  ███    ██ ███████ 
// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██    ██    ██       ██    ██    ██ ████   ██ ██      
// ██      ██    ██ ███████ ██   ██ █████ ██████  ██    ██    ██       ██    ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██    ██    ██       ██    ██    ██ ██  ██ ██      ██ 
// ███████  ██████  ██   ██ ██████        ██████   ██████     ██       ██     ██████  ██   ████ ███████ 

GameUIScene.loadSingleButton = (scene) => {
	try{	
		let callbackParams;
		let options;
		let created_button;
		
		options = {
			scene: scene, 
			x: gameCore.config.width,
			y: 25,
			height: 50,
			width: 250,
			label:  "+",
			array: gameCore.assets.btn_sprite,

			clickAction: clientSocketHandler.runReadyUp,
			callbackParams: {},
		}
		
		created_button = new button(options)
		gameCore.assets.btn_sprite.push(created_button)
		GameUIScene.mode_button = created_button;


		options = {
			scene: scene, 
			x: gameCore.config.width,
			y: 75,
			height: 50,
			width: 250,
			label:  "change mode",
			array: gameCore.assets.btn_sprite,

			clickAction: clientSocketHandler.changeMode,
			callbackParams: {},
		}
		
		created_button = new button(options)
		gameCore.assets.btn_sprite.push(created_button)



		gameCore.showButtons()
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "loadSingleButton",
			"e": e
		}
		errorHandler.log(options)
	}
}

// ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 


// GameUIScene.checkButtonVisability = () => {
// 	try{	
// 		if(GameScene.online === true){
// 			if(gameFunctions.params.player_side === gameFunctions.current_side){
// 				gameCore.showButtons()	
// 			}else{
// 				gameCore.hideButtons()
// 			}
// 		}
// 	}catch(e){

// 		let options = {
// 			"class": "GameUIScene",
// 			"function": "checkButtonVisability",
// 			"e": e
// 		}
// 		errorHandler.log(options)
// 	}		
// }














//  #####  ####### ####### #     # ######        #     # #     # ######  
// #     # #          #    #     # #     #       #     # #     # #     # 
// #       #          #    #     # #     #       #     # #     # #     # 
//  #####  #####      #    #     # ######  ##### ####### #     # #     # 
// 	     # #          #    #     # #             #     # #     # #     # 
// #     # #          #    #     # #             #     # #     # #     # 
//  #####  #######    #     #####  #             #     #  #####  ######  

GameUIScene.setupHUD = () => {
	try{
		let hud_width = 240;

		//SETUP HUD ITEM THAT DISPLAYS THE CURRENT TURN NUMBER
		GameUIScene.hud_item = new hud({
			scene: GameUIScene.scene,
			// grid: true,

			x: 2, y: 2,
			x_itts: 6, y_itts: 4,
			x_indent: 10, y_indent: 6,			
			width: hud_width, height: 50,

			fill_colour: 0xe6ffff,
			fill_alpha: 0.9,
			radius: { tl: 0, tr: 12, bl: 12, br: 12 },
			border: {
				width: 4,
				colour: 000000,
				alpha: 1
			},
			text: [
				{id: 'Turn',label: 'Turn:', x: 0, y: 0, height: 3},
				{id: 'c_Turn',label: gameCore.data.turn_number, x: 3, y: 0, box: {fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 2, height: 3}},				
			]
		});


		// #     # #     # ### #######       #     # #     # ######  
		// #     # ##    #  #     #          #     # #     # #     # 
		// #     # # #   #  #     #          #     # #     # #     # 
		// #     # #  #  #  #     #    ##### ####### #     # #     # 
		// #     # #   # #  #     #          #     # #     # #     # 
		// #     # #    ##  #     #          #     # #     # #     # 
		//  #####  #     # ###    #          #     #  #####  ######  

		//
		GameUIScene.hud_unit = new hud({
			scene: GameUIScene.scene,
			grid: false,

			x: 2, y: 2+50,
			x_itts: 24, y_itts: 8,
			x_indent: 10, y_indent: 6,			
			width: hud_width, height: 200,

			fill_colour: 0xe6ffff,
			fill_alpha: 0.9,
			radius: { tl: 0, tr: 12, bl: 12, br: 12 },
			border: {
				width: 4,
				colour: 000000,
				alpha: 1
			},
			text: [

				{id: 'u_h',label: "unit", x: 0, y: 0,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 22, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				//ROW 1
				{id: 'r1_h',label: '', x: 0, y: 2, height: 1, text_width: 5, align: "left", 
				font: {height: 16}
				},

				{id: 'h_m',label: 'M', x: 7, y: 1, height: 1, width: 3, align: "center", 
				font: {height: 22}
				},
				{id: 'f_m',label: gameCore.data.turn_number, x: 7, y: 2, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				{id: 'h_sb',label: 'SB', x: 11, y: 1, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_sb',label: gameCore.data.turn_number, x: 11, y: 2, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				{id: 'h_fb',label: 'FB', x: 15, y: 1, height: 1, width: 3, align: "center",
				font: {height: 22},	
				},
				{id: 'f_fb',label: gameCore.data.turn_number, x: 15, y: 2,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				{id: 'h_a',label: 'A', x: 19, y: 1, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_a',label: gameCore.data.turn_number, x: 19, y: 2, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},				


				//ROW 2
				{id: 'r2_h',label: 'guns', x: 0, y: 4, height: 1, text_width: 5, align: "left", 
				font: {height: 16},
				},


				{id: 'h_gun_d',label: 'D', x: 7, y: 3, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_gun_d',label: gameCore.data.turn_number, x: 7, y: 4,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				{id: 'h_gun_ap',label: 'AP', x: 11, y: 3, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_gun_ap',label: gameCore.data.turn_number, x: 11, y: 4, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},				

				{id: 'h_gun_r',label: 'Range', x: 15, y: 3, height: 1, width: 7, align: "center",
				font: {height: 22},
				},
				{id: 'f_gun_r',label: gameCore.data.turn_number, x: 15, y: 4,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 7, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},


				//ROW 3
				{id: 'r3_h',label: 'melee', x: 0, y: 6, height: 1, text_width: 5, align: "left",
				font: {height: 16},
				},

				{id: 'h_mel_d',label: 'D', x: 7, y: 5, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_mel_d',label: gameCore.data.turn_number, x: 7, y: 6, 
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

				{id: 'h_mel_ap',label: 'AP', x: 11, y: 5, height: 1, width: 3, align: "center",
				font: {height: 22},
				},
				{id: 'f_mel_ap',label: gameCore.data.turn_number, x: 11, y: 6,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 3, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},				
				//
				{id: 'h_mel_r',label: 'Range', x: 15, y: 5, height: 1, width: 7, align: "center",
				font: {height: 22},
				},
				{id: 'f_mel_r',label: gameCore.data.turn_number, x: 15, y: 6,
				font: {height: 22},
				box: {
					fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 7, height: 1, 
					border: {width: 1, colour: 0xe000000, alpha: 1}
					}
				},

			]
		});

		GameUIScene.hud_unit.setVisible(false);

		//  #####  ######  #######  #####  ###    #    #             #     # #     # ######  
		// #     # #     # #       #     #  #    # #   #             #     # #     # #     # 
		// #       #     # #       #        #   #   #  #             #     # #     # #     # 
		//  #####  ######  #####   #        #  #     # #       ##### ####### #     # #     # 
		// 	     # #       #       #        #  ####### #             #     # #     # #     # 
		// #     # #       #       #     #  #  #     # #             #     # #     # #     # 
		//  #####  #       #######  #####  ### #     # #######       #     #  #####  ######  


		//SETUP HUD ITEM THAT DISPLAYS THE CURRENT TURN NUMBER
		GameUIScene.hud_special = new hud({
			scene: GameUIScene.scene,
			// grid: true,

			x: 2, y: 2+250,
			x_itts: 6, y_itts: 8,
			x_indent: 10, y_indent: 6,			
			width: hud_width, height: 100,

			fill_colour: 0xe6ffff,
			fill_alpha: 0.9,
			radius: { tl: 0, tr: 12, bl: 12, br: 12 },
			border: {
				width: 4,
				colour: 000000,
				alpha: 1
			},
			text: [
				{id: 'h_special',label: 'Special Rules:', x: 0, y: 0, height: 3,
				font: {height: 16},
				},
				{id: 'f_special',label: 'melee', x: 3, y: 0, height: 1, text_width: 5, align: "left",
				font: {height: 16},
				},
				
				{id: 'h_status',label: 'Status Effects:', x: 0, y: 4, height: 3,
				font: {height: 16},
				},
				{id: 'f_status',label: 'melee', x: 3, y: 4, height: 1, text_width: 5, height: 3, align: "left",
				font: {height: 16},
				},				
			]
		});

		//  #####  #     #    #    #     #  #####  #######       #     # #     # ######  
		// #     # #     #   # #   ##    # #     # #             #     # #     # #     # 
		// #       #     #  #   #  # #   # #       #             #     # #     # #     # 
		// #       ####### #     # #  #  # #       #####   ##### ####### #     # #     # 
		// #       #     # ####### #   # # #       #             #     # #     # #     # 
		// #     # #     # #     # #    ## #     # #             #     # #     # #     # 
		//  #####  #     # #     # #     #  #####  #######       #     #  #####  ######  

		//SETUP HUD ITEM THAT DISPLAYS THE CURRENT TURN NUMBER
		GameUIScene.hud_chance = new hud({
			scene: GameUIScene.scene,
			// grid: true,

			x: 2, y: 2+350,
			x_itts: 6, y_itts: 8,
			x_indent: 10, y_indent: 6,			
			width: hud_width, height: 100,

			fill_colour: 0xe6ffff,
			fill_alpha: 0.9,
			radius: { tl: 0, tr: 12, bl: 12, br: 12 },
			border: {
				width: 4,
				colour: 000000,
				alpha: 1
			},
			text: [
				{id: 'h_mel_chance',label: 'Melee Chance:', x: 0, y: 0, height: 3,
				font: {height: 22},
				},
				{id: 'f_mel_chance',label: gameCore.data.turn_number, x: 4, y: 0, 
				font: {height: 22},
				box: {fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 1.25, height: 3}},	
				
				{id: 'h_gun_chance',label: 'Shoot Chance:', x: 0, y: 4, height: 3,
				font: {height: 22},
				},
				{id: 'f_gun_chance',label: gameCore.data.turn_number, x: 4, y: 4, 
				font: {height: 22},
				box: {fill_colour: 0xffffff, fill_alpha: 1, radius: 5, width: 1.25, height: 3}},					

			]
		});

		GameUIScene.hideChanceHUD()


		// ####### ####### ######   #####  #######       #     # #     # ######  
		// #       #     # #     # #     # #             #     # #     # #     # 
		// #       #     # #     # #       #             #     # #     # #     # 
		// #####   #     # ######  #       #####   ##### ####### #     # #     # 
		// #       #     # #   #   #       #             #     # #     # #     # 
		// #       #     # #    #  #     # #             #     # #     # #     # 
		// #       ####### #     #  #####  #######       #     #  #####  ######  

		//SETUP A HUD ITEM FOR EACH FORCE AVAILABLE
		if(gameCore.assets.forces){
			GameUIScene.forces_hud = {};
			gameCore.assets.forces.forEach((force, i) => {
			// for (let i=0;i<4;i++){
			// let i = 0

				let colour = gameCore.getSideColour(force.side)
				let width = 100;

				//THE HEADER CONTAINS THE PLAYER USERNAME
				GameUIScene.forces_hud[i] = {}
				GameUIScene.forces_hud[i]["header"] =
					new hud({
						scene: GameUIScene.scene,
						// grid: true,
			
						x: (i*width)+(hud_width * 1) + 2, y: 2,
						x_itts: 4, y_itts: 4,
						x_indent: 0, y_indent: 0,			
						width: width, height: 50,
			
						fill_colour: colour.colour,
						fill_alpha: 0.9,
						radius: 0,
						border: {
							width: 4,
							colour: 000000,
							alpha: 1
						},
						text: [
							{id: i,label: force.user.username, x: 1, y: 1, height: 2, width: 2, align: "center", font: {height: 18}},
						]
					})

				//THIS ONE CONTAINS THE POINTS EARNED
				GameUIScene.forces_hud[i]["body"] =
					new hud({
						scene: GameUIScene.scene,
						// grid: true,
			
						x: (i*width)+(hud_width * 1) + 2, y: 50+2,
						x_itts: 4, y_itts: 4,
						x_indent: 0, y_indent: 0,			
						width: width, height: 25,
			
						fill_colour: colour.colour,
						fill_alpha: 0.9,
						radius: 0,
						border: {
							width: 4,
							colour: 000000,
							alpha: 1
						},
						text: [
							{id: i,label: "points: 0", x: 1, y: 1, height: 2, width: 2, align: "center", font: {height: 12}},
						]
					})

				//THE FOOTER CONTAINS THE FORCE WAITING AND READY STATYS
				GameUIScene.forces_hud[i]["footer"] =
					new hud({
						scene: GameUIScene.scene,
						// grid: true,
			
						x: (i*width)+(hud_width * 1) + 2, y: 75+2,
						x_itts: 4, y_itts: 4,
						x_indent: 0, y_indent: 0,			
						width: width, height: 25,
			
						colour: colour,
						fill_colour: colour.colour,
						fill_alpha: 0.9,
						radius: 0,
						border: {
							width: 4,
							colour: 000000,
							alpha: 1
						},
						text: [
							{id: i,label: 'unready', x: 1, y: 1, height: 2, width: 2, align: "center", font: {height: 12}},
						]
					})					
		
				GameUIScene.forces_hud[i]["footer"].setVisible(false);
			// }
			})

			GameUIScene.setAllWaitingHUD();
		}
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "setupHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}

//  #####  ####### #######       #     # #     # ### #######       #     # #     # ######  
// #     # #          #          #     # ##    #  #     #          #     # #     # #     # 
// #       #          #          #     # # #   #  #     #          #     # #     # #     # 
//  #####  #####      #    ##### #     # #  #  #  #     #    ##### ####### #     # #     # 
//       # #          #          #     # #   # #  #     #          #     # #     # #     # 
// #     # #          #          #     # #    ##  #     #          #     # #     # #     # 
//  #####  #######    #           #####  #     # ###    #          #     #  #####  ###### 

GameUIScene.setUnitHUD = (unit) => {
	try{	
		let element = GameUIScene.hud_unit
		element.setVisible(true);

		element.setText("u_h",unit.unit_class.name)

		element.setText("f_m",unit.unit_class.movement)
		element.setText("f_sb",unit.unit_class.shooting_bonus)
		element.setText("f_fb",unit.unit_class.fighting_bonus)
		element.setText("f_a",unit.armour_class.value)

		element.setText("r2_h",unit.gun_class[unit.core.selected_gun].name)
		element.setText("f_gun_d",unit.gun_class[unit.core.selected_gun].damage)
		element.setText("f_gun_ap",unit.gun_class[unit.core.selected_gun].ap)
		element.setText("f_gun_r",unit.gun_class[unit.core.selected_gun].max_targets+'x'+(unit.gun_class[unit.core.selected_gun].range / gameCore.data.tile_size)+'ti')

		element.setText("r3_h",unit.melee_class[unit.core.selected_melee].name)
		element.setText("f_mel_d",unit.melee_class[unit.core.selected_melee].damage)
		element.setText("f_mel_ap",unit.melee_class[unit.core.selected_melee].ap)
		element.setText("f_mel_r",unit.melee_class[unit.core.selected_melee].max_targets+'x'+(unit.melee_class[unit.core.selected_melee].range / gameCore.data.tile_size)+'ti')		

		if(unit.core.alive === true){
			element = GameUIScene.hud_special
			element.setVisible(true);	
			
			let special_rules = []
			unit.special_rules.forEach((rule) => {
				special_rules.push(rule.name)
			})
			element.setText("f_special",special_rules)
	
			// let status = ''
			// if(unit.core.poison){
			// 	status += 'poisoned'
			// }
			let status_effects = []
			if(unit.core.status_effects){
				unit.core.status_effects.forEach((rule) => {
					status_effects.push(rule.class.name)
				})	
			}

			element.setText("f_status",status_effects)
		}

	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "setUnitHUD",
			"e": e
		}
		errorHandler.log(options)
	}	
}

GameUIScene.hideUnitHUD = () => {
	try{	
		let element = GameUIScene.hud_unit
		element.setVisible(false);

		element = GameUIScene.hud_special
		element.setVisible(false);
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "hideUnitHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}

//  #####  ####### #######        #####  #     #    #    #     #  #####  ####### 
// #     # #          #          #     # #     #   # #   ##    # #     # #       
// #       #          #          #       #     #  #   #  # #   # #       #       
//  #####  #####      #    ##### #       ####### #     # #  #  # #       #####   
//       # #          #          #       #     # ####### #   # # #       #       
// #     # #          #          #     # #     # #     # #    ## #     # #       
//  #####  #######    #           #####  #     # #     # #     #  #####  ####### 

GameUIScene.setChanceHUD = (selected_unit, target_unit) => {
	try{	
		let element = GameUIScene.hud_chance
		element.setVisible(true);

		let mel_chance = target_unit.armour_class.value - (selected_unit.melee_class[selected_unit.core.selected_melee].ap + selected_unit.unit_class.fighting_bonus);
		let gun_chance = target_unit.armour_class.value - (selected_unit.gun_class[selected_unit.core.selected_gun].ap + selected_unit.unit_class.shooting_bonus);

		let max_roll_value = 20
		if(selected_unit.cohesion_check === false && selected_unit.unit_class.cohesion > 0){
			max_roll_value = 10;
		}

		mel_chance = Math.round(100-((mel_chance / max_roll_value) * 100),2) + '%'
		gun_chance = Math.round(100-((gun_chance / max_roll_value) * 100),2) + '%'

		element.setText("f_mel_chance",mel_chance)
		element.setText("f_gun_chance",gun_chance)
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "setChanceHUD",
			"e": e
		}
		errorHandler.log(options)
	}
}

GameUIScene.hideChanceHUD = () => {
	try{	
		let element = GameUIScene.hud_chance
		element.setVisible(false);
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "hideChanceHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}

// ####### ####### ######   #####  #######       #     # #     # ######  
// #       #     # #     # #     # #             #     # #     # #     # 
// #       #     # #     # #       #             #     # #     # #     # 
// #####   #     # ######  #       #####   ##### ####### #     # #     # 
// #       #     # #   #   #       #             #     # #     # #     # 
// #       #     # #    #  #     # #             #     # #     # #     # 
// #       ####### #     #  #####  #######       #     #  #####  ######  

GameUIScene.setForcesHUD = (i, text, is_visible, is_gray) => {
	try{	
		if(GameUIScene.forces_hud){
			let element = GameUIScene.forces_hud[i]["footer"]
			element.setText(i,text)
			element.setVisible(is_visible);
			element.setGray(is_gray)
		}
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "setForcesHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}

GameUIScene.setAllWaitingHUD = () => {
	try{	
		gameCore.assets.forces.forEach((force, i) => {
			if(force.side === gameCore.data.current_side){
				GameUIScene.setForcesHUD(i, "unready", true, true)
			}else{
				GameUIScene.setForcesHUD(i, "unready", false, true)
			}
		})
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "setAllWaitingHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}

// ######  ####### ### #     # #######  #####        #     # #     # ######  
// #     # #     #  #  ##    #    #    #     #       #     # #     # #     # 
// #     # #     #  #  # #   #    #    #             #     # #     # #     # 
// ######  #     #  #  #  #  #    #     #####  ##### ####### #     # #     # 
// #       #     #  #  #   # #    #          #       #     # #     # #     # 
// #       #     #  #  #    ##    #    #     #       #     # #     # #     # 
// #       ####### ### #     #    #     #####        #     #  #####  ###### 

GameUIScene.updatePointsHUD = () => {
	try{	
		//FOREACH FORCE
		gameCore.assets.forces.forEach((force, i) => {
			//LOOP THROUGH EACH UNIT AND SAY WHO KILLED THEM

			let points = 0;
			gameCore.assets.units.forEach((unit) => {
				if(unit.core.killed_by !== -1){
					let killing_unit = gameCore.assets.units[unit.core.killed_by]
					if(killing_unit.core.player === force.player_number){
						points+= unit.unit_class.cost;
					}
				}
			})

			let element = GameUIScene.forces_hud[i]["body"]
			element.setText(i,"points: "+points)
		})
	}catch(e){

		let options = {
			"class": "GameUIScene",
			"function": "updatePointsHUD",
			"e": e
		}
		errorHandler.log(options)
	}		
}

/**/