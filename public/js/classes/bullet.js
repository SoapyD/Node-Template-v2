
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
		this.damage =  options.unit.gun_class[options.unit.core.selected_gun].damage;
		this.blast_spritesheet = options.unit.gun_class[options.unit.core.selected_gun].blast_spritesheet;
		this.blast_radius = options.unit.gun_class[options.unit.core.selected_gun].blast_radius;	
		
		this.origin = {
			x: options.unit.sprite.x,
			y: options.unit.sprite.y
		}
		this.angle = options.angle;
		this.target = options.target;
		
		this.sprite = options.scene.physics.add.image(options.unit.sprite.x,options.unit.sprite.y,options.spritesheet)

		this.sprite.setDepth(20);
		this.sprite.setOrigin(0.5,0.5);	
		this.sprite.body.setSize(5, 5); //set the size of the bounding box
		this.sprite.parent = this;

		// console.log(options)
		
        this.sprite.rotation = options.angle;
		
		this.sprite.enableBody(true, options.unit.sprite.x, options.unit.sprite.y, true, true);

		options.scene.physics.velocityFromAngle(Phaser.Math.RadToDeg(options.angle), this.speed, this.sprite.body.velocity);	
		
		this.colliders = [];

		//ADD COLLISION CHECK TO THE BULLET AGAINST ALL OTHER UNIT COLLISIONS IF IT'S NOT A BARRAGE WEAPON
		// if(this.unit.checkSpecialRule("barrage") === false){
		// 	GameScene.unit_collisions.forEach((collider, i) => {
		// 		if(i !== this.side){
		// 			this.colliders.push(options.scene.physics.add.collider(this.sprite, GameScene.unit_collisions[i], this.checkHit))
		// 		}
		// 	})
		// }

		//PLAY SHOT SOUND
		GameScene.sfx['shot'].play();
		
	}

	checkHit(bullet, unit) {
		
        /*
		//run kill function on bullet
		if(unit.parent.core.in_combat === false){

			bullet.parent.kill();
			// console.log(bullet.parent)			

			//DEAL DAMAGE IF IT'S NOT A BLAST WEAPON
			if(bullet.parent.blast_radius === 1){

				if(bullet.parent.player !== unit.parent.core.player){


					let ap = bullet.parent.unit.gun_class[bullet.parent.unit.selected_gun].ap
					if(bullet.parent.blunt === true){
						ap -= 4;
					}
					if(bullet.parent.unit.checkSpecialRule("sniper") === false){
						ap += 4;
					}


					let options = {
						damage: bullet.parent.damage,
						ap: ap,
						bonus: bullet.parent.unit.unit_class.shooting_bonus,
						random_roll: gameFunctions.getRandomInt(20),
						attacker_id: bullet.parent.unit.core.id,
						defender_id: unit.parent.core.id
					}			

					

					
					if(GameScene.online === false){
						unit.parent.wound(options);
					}else{
						//ONLY SEND THE WOUND MESSAGE IF THIS IS THE ATTACKING PLAYER
						if(gameFunctions.params.player_number === bullet.parent.unit.core.player){
							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								room_name: gameFunctions.params.room_name,
								returnFunctionGroup: "connFunctions",
								returnFunction: "woundUnit",
								returnParameters: options,
								message: "Wound Unit"
							}				
							connFunctions.messageServer(data)
						}
					}
				}
			}
		}
        */
	}
	
	kill(){


        // if(this.unit.gun_class[this.unit.selected_gun].barrier){

        //     let barrier_info = this.unit.gun_class[this.unit.selected_gun].barrier;

        //     new barrier({
        //         scene: this.scene,
        //         x: this.sprite.x,
        //         y: this.sprite.y,
        //         blast_radius: barrier_info.blast_radius,
        //         blast_spritesheet: barrier_info.blast_sprite,
        //         unit: this.unit,
        //         life: barrier_info.life,
        //         effects: barrier_info.effects			
        //     })				
        // }

		//WOUND ANY UNITS IF ITS IN THE BLAST RADIUS
        /*
		if(this.blast_radius > 1){
			gameCore.assets.units.forEach((unit) => {
				
				let val = Math.pow(this.sprite.x - unit.sprite.x, 2) + Math.pow(this.sprite.y - unit.sprite.y, 2)
				let dist = Math.round(Math.sqrt(val),0)
				if(unit.core.in_combat === false && dist <= (this.blast_radius / 2) * gameCore.data.tile_size){
					
					let ap = this.unit.gun_class[this.unit.selected_gun].ap
					if(this.blunt === true){
						ap -= 4;
					}
					if(this.unit.checkSpecialRule("sniper") === true){
						ap += 4;
					}					

					let options = {
						damage: this.damage,
						ap: ap,
						bonus: this.unit.unit_class.shooting_bonus,	
						random_roll: gameFunctions.getRandomInt(20),
						attacker_id: this.unit.core.id,
						defender_id: unit.core.id
					}


					if(GameScene.online === false){
						unit.wound(options);
					}else{
						//ONLY SEND THE WOUND MESSAGE IF THIS IS THE ATTACKING PLAYER
						
						if(gameFunctions.params.player_number === this.unit.core.player){
							let data = {
								functionGroup: "socketFunctions",  
								function: "messageAll",
								room_name: gameFunctions.params.room_name,
								returnFunctionGroup: "connFunctions",
								returnFunction: "woundUnit",
								returnParameters: options,
								message: "Wound Unit"
							}				
							connFunctions.messageServer(data)
						}
					}					
					
				}
			})	
		}
		
		
		let options = {
			scene: GameScene.scene,
			key: "boom"+this.id,
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

		this.colliders.forEach((collider) => {
			options.scene.physics.world.removeCollider(collider);
		})
        */
		
		this.sprite.destroy();
		// GameScene.active_actions--;

		// if(GameScene.active_actions === 0){
		// 	modeHandler.readyAdvanceMode();
		// }		

		this.delete = true;

	}
	
	checkRange(bullet){

        
		//RESET THE RANGE TO MAXIMUM RANGE IF THE ORIGINAL TARGET IS A UNIT THAT'S NOW DEAD
		// if(this.target.unit !== -1){
		// 	let target_unit = gameCore.assets.units[this.target.unit];
		// 	if(target_unit.alive === false){
		// 		this.range = this.saved_range;
		// 	}
		// }

		//CHECK THE CURRENT RANGE AND KILL THE BULLET IF IT GOES BEYOND IT'S MAXIMUM RANGE
		let current_range = Math.sqrt(Math.pow(this.origin.x - this.sprite.x, 2) + Math.pow(this.origin.y - this.sprite.y, 2))
		
		if (current_range >= this.range && this.delete === false){
			// console.log("THIS IS A RANGE KILL!!!!!!!!")
			this.kill(); 
		}
		
		//GET THE CURRENT GRID POSITION OF THE BULLET
		let gridX = Math.floor(this.sprite.x/gameCore.data.tile_size);
		let gridY = Math.floor(this.sprite.y/gameCore.data.tile_size);	
		
		// let cell = GameScene.grid[gridY][gridX]
		
		//KILL THE BULLET IF IT HITS A BLOCKING TILE AND ISN'T DEAD ALREADY NOR A BARRAGE WEAPON
		// if(this.unit.checkSpecialRule("barrage") === false){
		// 	if(!GameScene.pathfinder.acceptable_tiles.includes(cell) && this.delete === false){		
		// 		this.kill();
		// 	}
		// }

        
	}
}
