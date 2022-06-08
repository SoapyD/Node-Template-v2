const game_core = class {
	constructor() {	

        this.config = {}

        this.assets = {
            btn_sprite: [],
            units: [],
            units_preload: [],
            forces: [],            
        }

        this.data = {
            mode: '',
            mode_state: 0,
            turn_number: 0,          
            
            tile_size: 32,
            
            current_side: -1,
            player_number: -1,
            player_side: -1,
            max_players: 2,
            max_sides: 2,
        }
        this.current_scene = {};

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