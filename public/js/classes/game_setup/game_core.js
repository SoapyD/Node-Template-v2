const game_core = class {
	constructor() {	

        this.config = {}

        this.assets = {
            btn_sprite: [],
            units: [],
            units_preload: [],
            forces: []           
        }

        this.data = {
            id: "",
            mode: '',
            game_state: 0,
            mode_state: 0,
            turn_number: 0,          
            
            tile_size: 32,
            
            current_side: -1,
            player: -1,
            side: -1,
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
                this.config.scene = [ MainMenuScene, GameScene ]
                break;
            // case "DEV-ONLINE":
            //     this.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, GameScene, GameUIScene, ArmySetupUIScene]
            //     break;		
            // default:
            //     this.config.scene = [ MainMenuScene, ArmySelectMenuScene, ArmySelectUIScene, GameScene, GameUIScene, ArmySetupUIScene]
            //     break;
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
    }

}