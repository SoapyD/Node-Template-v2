
const bullet = class {
	constructor(options) {	
	
		this.id = gameCore.assets.bullets.length;
		this.type ='bullet';
		this.scene = options.scene;
		this.delete = false;
		this.unit = options.unit;
		this.side = options.unit.core.side;
		this.player = options.unit.player;

		this.saved_range = options.unit.gun_class[options.unit.core.selected_gun].range;
		this.range = options.unit.gun_class[options.unit.core.selected_gun].range;

		//status'
		this.blunt = false;

		//IF TARGET IS CLOSER THAN TOTAL RANGE, ADJUST THE RANGE
		let val = Math.pow(options.unit.sprite.x - options.target.x, 2) + Math.pow(options.unit.sprite.y - options.target.y, 2)		
		let path_range = Math.sqrt(val)


		if(path_range < this.range){
			this.range = path_range
		}
		
		this.speed = 200;
		// this.damage =  options.unit.gun_class[options.unit.core.selected_gun].damage;
		this.blast_spritesheet = options.unit.gun_class[options.unit.core.selected_gun].blast_spritesheet;
		this.blast_radius = options.unit.gun_class[options.unit.core.selected_gun].blast_radius;	
		
		this.origin = {
			x: options.unit.sprite.x,
			y: options.unit.sprite.y
		}
		this.angle = options.angle;
		this.target = options.target;
		
		if(options.server_options.target_id){
			this.target_id = options.server_options.target_id;
			this.damage = options.server_options.damage;
			this.effects = options.server_options.effects;		
		}

		if(options.server_options.blast_targets){
			this.blast_targets = options.server_options.blast_targets;		
		}		


		if(options.server_options.intersections){
			this.intersections = options.server_options.intersections;		
		}			

		this.sprite = options.scene.physics.add.image(options.unit.sprite.x,options.unit.sprite.y,options.spritesheet)

		this.sprite.setDepth(20);
		this.sprite.setOrigin(0.5,0.5);	
		this.sprite.body.setSize(5, 5); //set the size of the bounding box
		this.sprite.parent = this;
		
        this.sprite.rotation = options.angle;
		
		this.sprite.enableBody(true, options.unit.sprite.x, options.unit.sprite.y, true, true);

		options.scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(options.angle), this.speed, this.sprite.body.velocity);	

		//PLAY SHOT SOUND
		GameScene.sfx['shot'].play();
		
	}
	
	kill(){

		if(this.unit.gun_class[this.unit.core.selected_gun].barrier){

			let barrier_class = this.unit.gun_class[this.unit.core.selected_gun].barrier;

			new barrier({
				scene: this.scene,
				x: this.sprite.x,
				y: this.sprite.y,
				unit: this.unit,
				barrier: barrier_class			
			})				
		}

		let options = {
			scene: GameScene.scene,
			key: "boom"+this.id,
			//THIS DATA NEEDS TO BE PASSED FROM THE SERVER AS THIS ISN'T LOOKED UP TILL LATER
			spritesheet: this.blast_spritesheet,
			width: this.blast_radius,
			framerate: 30,
			sfx: "blast",
			alpha: 0.75,
			scale: 0.75,
			pos: {
				x: this.sprite.x,
				y: this.sprite.y
			}
		}
		new particle(options)	

		if(this.target_id){
			if(this.target_id > -1){
				let unit = gameCore.assets.units[this.target_id];
				unit.wound({damage:this.damage})

				if(this.effects){
					this.effects.forEach((effect) => {
						unit.drawTextParticle(effect)
					})
				}
			}
		}

		if(this.blast_targets){
			this.blast_targets.forEach((blast_target) => {
				let unit = gameCore.assets.units[blast_target.id];
				unit.wound({damage:blast_target.damage})	
				
				if(blast_target.effects){
					if(blast_target.effects){
						blast_target.effects.forEach((effect) => {
							unit.drawTextParticle(effect)
						})
					}					
				}
			})
		}


		this.sprite.destroy();

		this.delete = true;

	}
	
	checkRange(bullet){

		//CHECK THE CURRENT RANGE AND KILL THE BULLET IF IT GOES BEYOND IT'S MAXIMUM RANGE
		let current_range = Math.sqrt(Math.pow(this.origin.x - this.sprite.x, 2) + Math.pow(this.origin.y - this.sprite.y, 2))
		
		if (current_range >= this.range && this.delete === false){
			this.kill(); 
		}

		if(this.intersections){
			if(this.intersections.length > 0){
				let intersection = this.intersections[0];
				if(current_range >= intersection.distance){
					gameCore.drawTextParticle({
						text: intersection.effects[0],
						pos: intersection.pos
					})
					
					this.intersections.shift();
				}
			}
		}
		
		//GET THE CURRENT GRID POSITION OF THE BULLET
		// let gridX = Math.floor(this.sprite.x/gameCore.data.tile_size);
		// let gridY = Math.floor(this.sprite.y/gameCore.data.tile_size);	
	}
}
