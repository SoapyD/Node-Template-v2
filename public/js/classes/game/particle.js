
const particle = class {
	constructor(options) {	

		this.parent_id = -1;
		if(options.parent_id !== undefined){
			this.parent_id = options.parent_id;
		}

		if(options.sfx){
			GameScene.sfx[options.sfx].play();
		}
		
		if(options.spritesheet){
			this.sprite = options.scene.add.sprite(options.pos.x, options.pos.y, options.spritesheet) //.setScale(4);
			this.sprite.setDepth(2).setAlpha(options.alpha); //.setScale(options.scale).
			
			
			if(options.width){
				this.sprite.displayWidth = options.width * (gameCore.data.tile_size * 2.5);
				this.sprite.displayHeight = options.width * (gameCore.data.tile_size * 2.5);
			}
		}
		
		if(options.key){
			this.key = options.key;
			//THIS EXPLOSION
			options.scene.anims.create({
			key: options.key,
			frames: options.scene.anims.generateFrameNumbers(options.spritesheet),
			frameRate: options.framerate
			})					
			
			this.sprite.anims.play(options.key);			
			
			this.sprite.once('animationcomplete', (sprite)=>{
				sprite.destroy()
			})				
			
		}
		
		if(options.text && options.text_style){
			this.text = options.scene.add.text(options.pos.x, options.pos.y, options.text, options.text_style).setDepth(20);
			this.text.x -= this.text.width / 2;
		}
		

		let rise_duration = 3000;
		if(options.rise_duration){
			rise_duration = options.rise_duration
		}

		let fadeout_duration = 1000;
		if(options.fadeout_duration){
			fadeout_duration = options.fadeout_duration
		}


		if(options.tween){
			
			let target;
			if(this.sprite){
				target = this.sprite
			}
			if(this.text){
				target = this.text
			}			

			let class_parent = this;
			
			options.scene.tweens.add({
				targets: target,
				class_parent: class_parent,
				y: options.pos.y - 30,
				duration: rise_duration,
				// alpha: 0,
				ease: 'Power3',
                onComplete: function ()
                {
					// target.destroy();
					options.scene.tweens.add({
						targets: target,
						duration: fadeout_duration,
						alpha: 0,
						onComplete: function ()
						{						
							//update queued particle list of parent and generate new particle before death
							if(class_parent.parent_id !== -1){
								let parent = gameCore.assets.units[class_parent.parent_id];
								parent.adding_particle = 0
								if(parent.queued_text_particles){
									if(parent.queued_text_particles.length > 0){
										new particle(parent.queued_text_particles[0])
										parent.queued_text_particles.shift()
									}
								}
							}

							target.destroy();
						}
					})
                }
			}); 
		}
		
	}
	
}