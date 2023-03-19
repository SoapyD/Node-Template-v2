

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
    },

    update: function (time, delta)
    {
        switch(this.state){
            //GET SQUAD TO SETUP
            case 0:
                let force = gameCore.assets.forces[gameCore.data.player]
                this.squad_info = force.army.squads[this.squad_id]
                console.log(this.squad_info)

                this.squad_matrix = []
                // console.log( GameScene.scene.scene.add)
                let sprite = GameScene.scene.add.sprite(100,100);
                sprite.setOrigin(0.5,1);
                sprite.setDepth(0);
                sprite.play(this.squad_info.squad.unit.spritesheet+'_idle_south', true);
                this.squad_matrix.push(sprite)
                this.state++;
                break;
            //WAIT FOR SQUAD TO BE DEPLOYED, MOVE SQUAD BLOCK TO MATCH MOUSE POSITION
            case 1:
                if(GameScene.tile_position){
                    this.squad_matrix[0].x = GameScene.tile_position.x
                    this.squad_matrix[0].y = GameScene.tile_position.y                    
                }
                break;
            //RESET STATE FOR NEXT SQUAD, OR ADVANCE IF NO MORE AVAILABLE
        }
                    
    }
});
