var StartUIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'StartUIScene' });
    },

    preload: function()
    {
        this.load.spritesheet("buttons", "./img/game/buttons3.jpg", 
        { frameWidth: 100, frameHeight: 50, endFrame: 3 });	
		
		StartUIScene.scene = this.scene.get('StartUIScene')
	
    },

    create: function()
    {
		// StartUIScene.setupHUD();

		let callbackParams = {};
		
		gameCore.assets.btn_sprite = [];		
		

		switch(instance_type){
			case "DEV":
				StartUIScene.loadSingleButton(this)
				break;
			case "DEV-ONLINE":
				StartUIScene.loadSingleButton(this)
				break;
			default:
				StartUIScene.loadSingleButton(this)
				break;
		}		
				
		gameCore.current_uiscene = this.scene.get('StartUIScene');
    },

    update: async function (time, delta)
    {

    }
});


// ██       ██████   █████  ██████        ██████  ██    ██ ████████ ████████  ██████  ███    ██ ███████ 
// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██    ██    ██       ██    ██    ██ ████   ██ ██      
// ██      ██    ██ ███████ ██   ██ █████ ██████  ██    ██    ██       ██    ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██   ██ ██   ██       ██   ██ ██    ██    ██       ██    ██    ██ ██  ██ ██      ██ 
// ███████  ██████  ██   ██ ██████        ██████   ██████     ██       ██     ██████  ██   ████ ███████ 

StartUIScene.loadSingleButton = (scene) => {
	try{	
		let callbackParams;
		let options;
		
		options = {
			scene: scene, 
			x: (gameCore.config.width / 2) + 125,
			y: gameCore.config.height / 2,
			height: 50,
			width: 250,
			label:  "START GAME",
			array: gameCore.assets.btn_sprite,

			clickAction: clientSocketHandler.readyUp,
			callbackParams: {},
		}
		
		gameCore.assets.btn_sprite.push(new button(options))

		gameCore.showButtons()
	}catch(e){

		let options = {
			"class": "StartUIScene",
			"function": "loadSingleButton",
			"e": e
		}
		errorHandler.log(options)
	}
}