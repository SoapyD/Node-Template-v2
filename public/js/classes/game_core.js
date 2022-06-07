const game_core = class {
	constructor() {	

        this.config = {}
        this.setConfig();
        this.setScenes();

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
                this.config.scene = [ GameScene ]
                break;
            // case "DEV-ONLINE":
            //     this.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, GameScene, GameUIScene, ArmySetupUIScene]
            //     break;		
            // default:
            //     this.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, GameScene, GameUIScene, ArmySetupUIScene]
            //     break;
        }       
    }
}