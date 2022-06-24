const game_assets = class {
	constructor(options) {	

        this.scene = options.scene;
        this.parent = options.parent;


		// ██████   █████  ██████   █████  ███    ███ ███████ 
		// ██   ██ ██   ██ ██   ██ ██   ██ ████  ████ ██      
		// ██████  ███████ ██████  ███████ ██ ████ ██ ███████ 
		// ██      ██   ██ ██   ██ ██   ██ ██  ██  ██      ██ 
		// ██      ██   ██ ██   ██ ██   ██ ██      ██ ███████ 
														   
		
		switch(instance_type){
			case "DEV":
				this.parent.master_volume = 0;
				break;
			case "DEV-ONLINE":
				this.parent.master_volume = 0.05;
				break;				
			default:
				this.parent.master_volume = 0.2;
				break;
		}
		
		this.parent.master_sfx_volume = 0.3;
		this.parent.music_playing = false;		
        this.parent.music_track = 0;        
        
										
        this.preLoadSprites();
        this.preLoadParticles();
        this.preLoadSFX();
        this.preLoadMusic();

    }

    preLoadSprites = () => {

		this.scene.load.image('white', '../../img/game/white_texture.jpg');        
		
		//UNIT SPRITES
		this.scene.load.image('trooper_blaster', '../../img/game/units/trooper_blaster.png');
		this.scene.load.image('trooper_rocket', '../../img/game/units/trooper_rocket.png');
		this.scene.load.image('trooper_laser_cannon', '../../img/game/units/trooper_laser_cannon.png');
		this.scene.load.image('trooper_assault_cannon', '../../img/game/units/trooper_assault_cannon.png');
		this.scene.load.image('trooper_rad_cannon', '../../img/game/units/trooper_rad_cannon.png');
		this.scene.load.image('trooper_leader', '../../img/game/units/trooper_leader.png');							

		this.scene.load.image('elite_blaster', '../../img/game/units/elite_blaster.png');
		this.scene.load.image('elite_assault_cannon', '../../img/game/units/elite_assault_cannon.png');
		this.scene.load.image('elite_leader', '../../img/game/units/elite_leader.png');	
		this.scene.load.image('elite_claws', '../../img/game/units/elite_claws.png');						


		this.scene.load.image('tank_assault', '../../img/game/units/tank_assault.png');
		this.scene.load.image('dread_assault_fist', '../../img/game/units/dread_assault_fist.png');

    }

    preLoadParticles = () => {
		//PARTICLE SPRITES
		this.scene.load.image('bullet', '../../img/game/particles/bullet.png');	
		this.scene.load.image('smoke', '../../img/game/particles/smoke.png');
		this.scene.load.image('barrier', '../../img/game/particles/barrier.png');	
		this.scene.load.image('marker', '../../img/game/particles/marker.png');			
        this.scene.load.spritesheet('explosion', '../../img/game/particles/explosion7.png', { frameWidth: 256, frameHeight: 256 }); //WEAPON BLAST
        this.scene.load.spritesheet('punch', '../../img/game/particles/explosion23.png', { frameWidth: 256, frameHeight: 256 });	//CLOSE COMBAT BLAST
        this.scene.load.spritesheet('special_blast', '../../img/game/particles/explosion65.png', { frameWidth: 256, frameHeight: 256 });	//SPECIAL WEAPON BLAST
        this.scene.load.spritesheet('heavy_blast', '../../img/game/particles/explosion102.png', { frameWidth: 256, frameHeight: 256 });	//HEAVY WEAPON BLAST				
        this.scene.load.spritesheet('symbols', '../../img/game/symbols.png', { frameWidth: 190, frameHeight: 200 }); 	        
    }

    preLoadSFX = () => {
		let old_path =this.scene.load.path
		this.scene.load.setPath('../../sfx');		
		this.scene.load.audio('select', [ 'select.mp3' ])
		this.scene.load.audio('clear', [ 'clear.mp3' ])
		this.scene.load.audio('button', [ 'button.mp3' ])
		
		this.scene.load.audio('action', [ 'action.mp3' ])	
		this.scene.load.audio('end_path', [ 'end_path.mp3' ])	
		this.scene.load.audio('end_turn', [ 'end_turn.mp3' ])	
		
		this.scene.load.audio('movement', [ 'movement.mp3' ])	
		this.scene.load.audio('sword', [ 'sword.mp3' ])
		this.scene.load.audio('shot', [ 'shot.mp3' ])
		this.scene.load.audio('blast', [ 'blast.mp3' ])	

		this.scene.load.audio('blunt', [ 'blunt.mp3' ])	
		this.scene.load.audio('poison', [ 'poison.mp3' ])	
		this.scene.load.audio('shield', [ 'shield.mp3' ])							
		
		this.scene.load.audio('death_man', [ 'death_man.mp3' ])
		this.scene.load.audio('death_machine', [ 'death_machine.mp3' ])        

		this.scene.load.setPath(old_path);
    }

    preLoadMusic = () => {
		let old_path =this.scene.load.path
		this.scene.load.setPath('../../music');
		this.scene.load.audio('song1', [ 'song1.mp3' ])
		this.scene.load.audio('song2', [ 'song2.mp3' ])
		this.scene.load.audio('song3', [ 'song3.mp3' ])
		this.scene.load.setPath(old_path);        
    }

    loadSound = () => {
		// ███    ███ ██    ██ ███████ ██  ██████          ██          ███████ ███████ ██   ██ 
		// ████  ████ ██    ██ ██      ██ ██               ██          ██      ██       ██ ██  
		// ██ ████ ██ ██    ██ ███████ ██ ██      █████ ████████ █████ ███████ █████     ███   
		// ██  ██  ██ ██    ██      ██ ██ ██            ██  ██              ██ ██       ██ ██  
		// ██      ██  ██████  ███████ ██  ██████       ██████         ███████ ██      ██   ██ 
																							
		
		//SFX can only be set in the creation method once theyve been pre-loaded
		this.parent.sfx = {}		
		this.parent.sfx.select = this.scene.sound.add('select', {volume: 0.1 * this.parent.master_sfx_volume});
		this.parent.sfx.clear = this.scene.sound.add('clear', {volume: 1 * this.parent.master_sfx_volume});
		this.parent.sfx.button = this.scene.sound.add('button', {volume: 1 * this.parent.master_sfx_volume});
		
		this.parent.sfx.action = this.scene.sound.add('action', {volume: 0.1 * this.parent.master_sfx_volume});
		this.parent.sfx.end_path = this.scene.sound.add('end_path', {volume: 0.04 * this.parent.master_sfx_volume});
		this.parent.sfx.end_turn = this.scene.sound.add('end_turn', {volume: 0.5 * this.parent.master_sfx_volume});
		
		this.parent.sfx.movement = this.scene.sound.add('movement', {volume: 0.1 * this.parent.master_sfx_volume});
		this.parent.sfx.sword = this.scene.sound.add('sword', {volume: 0.5 * this.parent.master_sfx_volume});
		this.parent.sfx.blast = this.scene.sound.add('blast', {volume: 0.2 * this.parent.master_sfx_volume});
		this.parent.sfx.shot = this.scene.sound.add('shot', {volume: 0.2 * this.parent.master_sfx_volume});
		
		this.parent.sfx.shield = this.scene.sound.add('shield', {volume: 0.05 * this.parent.master_sfx_volume});
		this.parent.sfx.poison = this.scene.sound.add('poison', {volume: 0.2 * this.parent.master_sfx_volume});
		this.parent.sfx.blunt = this.scene.sound.add('blunt', {volume: 0.2 * this.parent.master_sfx_volume});				

		this.parent.sfx.death_man = this.scene.sound.add('death_man', {volume: 0.3 * this.parent.master_sfx_volume});
		this.parent.sfx.death_machine = this.scene.sound.add('death_machine', {volume: 0.3 * this.parent.master_sfx_volume});
		
		
		this.parent.music = []
		this.parent.music.push(this.scene.sound.add('song1', {volume: this.parent.master_volume}));
		this.parent.music.push(this.scene.sound.add('song2', {volume: this.parent.master_volume}));
		this.parent.music.push(this.scene.sound.add('song3', {volume: this.parent.master_volume}));

		
		this.parent.music.forEach((track) => {
			track.on('complete', () => {

				this.parent.music_track += 1
				if(this.parent.music_track >= this.parent.music.length){
					this.parent.music_track = 0
				}
				this.parent.music_playing = false;
			});				
		})
    }

	// ███████  ██████  ██    ██ ███    ██ ██████        ██   ██  █████  ███    ██ ██████  ██      ███████ ██████  ███████ 
	// ██      ██    ██ ██    ██ ████   ██ ██   ██       ██   ██ ██   ██ ████   ██ ██   ██ ██      ██      ██   ██ ██      
	// ███████ ██    ██ ██    ██ ██ ██  ██ ██   ██ █████ ███████ ███████ ██ ██  ██ ██   ██ ██      █████   ██████  ███████ 
	//      ██ ██    ██ ██    ██ ██  ██ ██ ██   ██       ██   ██ ██   ██ ██  ██ ██ ██   ██ ██      ██      ██   ██      ██ 
	// ███████  ██████   ██████  ██   ████ ██████        ██   ██ ██   ██ ██   ████ ██████  ███████ ███████ ██   ██ ███████ 

	sfxHandler = (sfx) => {
		
		if (!this.parent.scene.sound.locked)
		{
			// already unlocked so play
			this.parent.sfx[sfx].play();
		}
		else
		{
			// wait for 'unlocked' to fire and then play
			this.parent.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
				this.parent.sfx[sfx].play();
			})
		}
	}

	musicHandler = () => {
		
		if(this.parent.music_playing === false){
					
			if (!this.parent.scene.sound.locked)
			{
				// already unlocked so play
				this.parent.music[this.parent.music_track].play();
			}
			else
			{
				// wait for 'unlocked' to fire and then play
				this.parent.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
					if(this.parent.music){
						this.parent.music[this.parent.music_track].play();
					}
				})
			}				
			
			this.parent.music_playing = true;
		}
	}


// ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 

    resetTempSprites = () => {
        // console.log(live_tiles)
        if (!this.temp_sprites){
            this.temp_sprites = [];
        }
        else{
            this.temp_sprites.forEach((sprite) => {
                sprite.destroy();
            })
        }		
    }

    drawLiveTiles = () => {
        this.resetTempSprites();
        
		if(this.live_tiles){
			this.live_tiles.forEach((tile)=> {
				this.temp_sprites.push(
					this.scene.physics.add.image(
						tile.x * gameCore.data.tile_size,
						tile.y * gameCore.data.tile_size,"marker").setDepth(0)
				)
			})		
		}
    }

}