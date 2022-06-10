

var MainMenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenuScene ()
    {
        Phaser.Scene.call(this, { key: 'MainMenuScene' });
    },

    preload: function()
    {

    },


    create: function()
    {
        let x_origin = this.cameras.main.centerX	
        let y_origin = this.cameras.main.centerY

        this.add.grid(
            x_origin, y_origin, 
            gameCore.config.width,// + (gameFunctions.cardSize * 2), 
            gameCore.config.height,// + (gameFunctions.cardSize * 2), 
            50, 
            50, 
            0x00b9f2).setAltFillStyle(0x016fce).setOutlineStyle(0x000000);
            
            
        let startOption = this.add.text((gameCore.config.width / 2) - 300, 100, "Please Create or Join a Room", {
            color: '#fcd498',
            fontSize: 30,
            align: 'center',
        }).setFixedSize(600, 50);

		gameCore.current_scene = this.scene.get('MainMenuScene');
    },

    update: function (time, delta)
    {

                    
    }
});
