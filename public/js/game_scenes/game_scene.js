

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'GameScene' });
    },

    preload: function()
    {		
		GameScene.scene = this.scene.get('GameScene')
		gameCore.current_scene = this.scene.get('GameScene');
		GameScene.loading_screen = new game_loading_screen({scene: GameScene.scene, }) //launch_uiscene: "ArmySetupUIScene" 

		GameScene.game_assets = new game_assets({scene: GameScene.scene, parent: GameScene})
		GameScene.game_maps = new game_maps({scene: GameScene.scene, parent: GameScene})
		
    },


    create: function()
    {
		GameScene.game_assets.loadSound();
		// GameScene.game_setup.setupSquads();		
		GameScene.game_maps.setupTable();

		GameScene.game_squad_setup = new game_squad_setup({
			scene: GameScene.scene, 
			parent: GameScene,
			unit_list: gameCore.assets.units,
			forces: gameCore.assets.forces,
			tile_size: gameCore.data.tile_size			
		})		
    },

    update: function (time, delta)
    {
		GameScene.game_maps.updateMarker(); 
		GameScene.controls.update(delta);
		GameScene.game_assets.musicHandler(); 

        /*

		let worldPoint = GameScene.scene.input.activePointer.positionToCamera(GameScene.scene.cameras.main);

		switch(GameScene.game_state){

			case 0:
				//PLACE UNITS LOOP			
				break;			
			case 1:
				gameFunctions.current_uiscene.scene.start("GameUIScene")
				GameScene.game_state++;
				break;			

			case 2:
				GameScene.game_setup.checkUnitClicks();
				GameScene.game_setup.updateElements(worldPoint);
				GameScene.pathfinder.update();
				break;
		}

        */
	}
});



// ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 



GameScene.resetTempSprites = () => {
	// console.log(live_tiles)
	if (!GameScene.scene.temp_sprites){
		GameScene.scene.temp_sprites = [];
	}
	else{
		GameScene.scene.temp_sprites.forEach((sprite) => {
			sprite.destroy();
		})
	}		
}

GameScene.showMessage = (text) => {
	let options = {
		scene: GameScene.scene,
		pos: {
			x: GameScene.rectangle.x,
			y: GameScene.rectangle.y
		},
		text: text
	}
	new popup(options)	
}
