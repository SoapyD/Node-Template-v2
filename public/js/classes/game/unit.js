
const unit = class {
	constructor(options) {
		
		this.core = options.core

		//CLASS DATA		
		this.special_rules = options.special_rules;

		//UNIT CLASS	
		this.unit_class = options.unit_class	

				
		//GUN CLASS
		this.gun_class = []
		this.gun_class.push(options.gun_class);

		//FIGHT CLASS
		this.melee_class = []
		this.melee_class.push(options.melee_class);

		//ARMOUR CLASS
		this.armour_class = options.armour_class
		

		//ALL OTHER ELEMENTS
		this.scene = options.scene;
		this.type = 'unit'

		// this.core.path = [];
		// this.is_moving = false;
		// this.core.cohesion_check = true;
		// this.core.targets = [];						
		// this.core.fight_targets = [];

		this.depth_sprite_flash = 6;		
		this.depth_sprite = 4;
		this.depth_sprite_ghost = 5;
		// this.depth_sprite_symbol = 10;
		this.depth_sprite_action = 10;
		this.depth_path = 9;
		this.depth_explosion = 1;
		this.depth_health = 2;
		this.depth_cohesion = 1;
		this.depth_fight_radius = 1.5;
		this.depth_text = 20;
		this.depth_text_box = 10;
		
		
		this.core.x += gameCore.data.tile_size * this.unit_class.sprite_offset;
		this.core.y += gameCore.data.tile_size * this.unit_class.sprite_offset;				

		//SPRITES
		this.spritesheet = this.unit_class.spritesheet;
		this.sprite = options.scene.physics.add.image(this.core.x,this.core.y,this.spritesheet).setScale(0.8); //.setInteractive();
		this.sprite.setImmovable(true)
		this.sprite.setDepth(this.depth_sprite);
		this.sprite.angle = this.core.angle;
		this.sprite.parent = this
		// GameScene.unit_collisions[this.core.side].add(this.sprite)
		

		this.sprite_ghost = options.scene.add.image(this.core.x,this.core.y,this.spritesheet).setInteractive().setScale(0.8);
		this.sprite_ghost.alpha = 1; //0.5;
		this.sprite_ghost.angle = this.core.angle;
		this.sprite_ghost.parent = this;
		this.sprite_ghost.is_ghost = true;
		this.sprite_ghost.setDepth(this.depth_sprite_ghost);
		// this.sprite_ghost.on('pointerup', this.selectHander)
		

		//action sprite
		this.sprite_action = options.scene.add.image(this.core.x,this.core.y,"symbols").setScale(0.08 * (this.unit_class.size + 1))		
		this.sprite_action.setFrame(0).setDepth(this.depth_sprite_action);
		this.sprite_action.alpha = 0.4
		this.sprite_action.visible = false
		

		//THIS EXPLOSION
		options.scene.anims.create({
		key: 'hit',
		frames: options.scene.anims.generateFrameNumbers('punch'),
		frameRate: 50
		})			
		
		
		//SETUP GRAPHICS THAT CAN BE USED TO DRAW ACTIONS
		this.bar_graphic = options.scene.add.graphics().setDepth(this.depth_health);
		this.bar_back_graphic = options.scene.add.graphics().setDepth(this.depth_health);

		this.fight_graphic = options.scene.add.graphics().setDepth(this.depth_fight_radius);

		this.path_graphic = options.scene.add.graphics().setDepth(this.depth_path);
		this.cohesion_graphic = options.scene.add.graphics().setDepth(this.depth_cohesion);
		this.blast_graphics = [];
		for(let i=0; i<10; i++){
			this.blast_graphics.push(options.scene.add.graphics().setDepth(this.depth_explosion));
		}
		

		this.text_style = { 
			font: "8px Arial",
			fill: "#000000",
			align: "center",
			stroke: "#000000",
			strokeThickness: 1
		},		
		this.text = options.scene.add.text(this.sprite.x, this.sprite.y - (this.sprite.displayHeight / 2), "", this.text_style).setDepth(this.depth_text);
		this.text_graphic = options.scene.add.graphics().setDepth(this.depth_text_box);
	
		this.queued_text_particles = [];
		this.adding_particle = 0;		

		
		this.drawTint()
		this.drawFlash()
		this.drawFightRadius()

		this.updateElements(this.sprite);
	
		// this.selectHander = this.selectHander.bind(this);
		this.drawSymbol();
	}






// ######  #######  #####  ####### #######  #####  
// #     # #       #     # #          #    #     # 
// #     # #       #       #          #    #       
// ######  #####    #####  #####      #     #####  
// #   #   #             # #          #          # 
// #    #  #       #     # #          #    #     # 
// #     # #######  #####  #######    #     #####  	
	
resetColours(){
	try{	
		if(this.core.path.length > 0){
			let colours = {
				line_colour: 0x808080,
				fill_colour: 0x2ECC40,
				line_alpha: 0.5,
				circle_alpha: 0.15,
				fill_alpha: 0.15,
				width: 5
			}
			if(this.core.cohesion_check === false){
				colours.fill_colour = 0xFF0000; //0x6666ff				
			}
			this.drawPath(colours)
		}
	}catch(e){

		let options = {
			"class": "unit",
			"function": "resetColours",
			"e": e
		}
		errorHandler.log(options)
	}	
}

// resetCohesionGraphic() {
// 	try{	
// 		this.cohesion_graphic.clear()
// 	}catch(e){

// 		let options = {
// 			"class": "unit",
// 			"function": "resetCohesionGraphic",
// 			"e": e
// 		}
// 		errorHandler.log(options)
// 	}		
// }

resetActions() {
	try{	
		this.core.path = [];
		this.core.targets = [];
		this.core.fight_targets = [];	

		
		// this.resetGhost();
		if(this.sprite_ghost){
			this.sprite_ghost.x = this.sprite.x;
			this.sprite_ghost.y = this.sprite.y;
			this.sprite_ghost.angle = this.sprite.angle;
			this.sprite_ghost.alpha = 1;			
		}

				
		this.path_graphic.clear();
		this.cohesion_graphic.clear();

		this.text.setText("");
		this.text_graphic.clear();		
		
		this.blast_graphics.forEach((graphic) => {
			graphic.clear();
		})
	}catch(e){

		let options = {
			"class": "unit",
			"function": "resetActions",
			"e": e
		}
		errorHandler.log(options)
	}		
}

resetMove() {
	try{	
		this.core.path = [];
		this.path_graphic.clear();		
		this.resetGhost();
		this.updateElements(this.sprite_ghost);
		
		//CHECK TO SEE IF THE RESET AFFECTS ANY OTHER UNITS THAT'VE MOVED
		//IF SO, RESET THOSE UNIT MOVES AS WELL
		gameCore.assets.units.forEach((unit) => {
			if(unit.core.id !== this.core.id && unit.path.length > 0){
				let check = this.checkSpriteOverlap(this.sprite_ghost, unit.sprite_ghost)
				
				if(check === true){
					unit.resetMove();
				}
				/**/
			}
		})
	}catch(e){

		let options = {
			"class": "unit",
			"function": "resetMove",
			"e": e
		}
		errorHandler.log(options)
	}	
}

resetShoot = () => {
	try{
		//RESET THE DRAW GRAPHICS
		this.path_graphic.clear()
		
		this.blast_graphics.forEach((graphic) => {
			graphic.clear();
		})	
	}catch(e){

		let options = {
			"class": "unit",
			"function": "resetShoot",
			"e": e
		}
		errorHandler.log(options)
	}	

}

resetFightRadius() {
	try{	
		this.fight_graphic.clear();	
	}catch(e){

		let options = {
			"class": "unit",
			"function": "resetFightRadius",
			"e": e
		}
		errorHandler.log(options)
	}		
}

resetGhost() {
	try{	
		if(this.sprite_ghost){
			this.sprite_ghost.x = this.sprite.x;
			this.sprite_ghost.y = this.sprite.y;
			this.sprite_ghost.angle = this.sprite.angle;
			this.sprite_ghost.alpha = 1;
		}
		this.sprite.setTint(this.colour)
		this.sprite.alpha = 1;
		this.drawFightRadius();
		
		// if(gameCore.data.mode === "move" || gameCore.data.mode === "charge"){
		// 	if(this.unit_class.cohesion > 0){
		// 		this.cohesionCheck();	
		// 	}
		// }
	}catch(e){

		let options = {
			"class": "unit",
			"function": "resetGhost",
			"e": e
		}
		errorHandler.log(options)
	}		
}

// resetDrawInfo(){
// 	try{	
// 		this.text.setText("");
// 		this.text_graphic.clear();
// 	}catch(e){

// 		let options = {
// 			"class": "unit",
// 			"function": "resetDrawInfo",
// 			"e": e
// 		}
// 		errorHandler.log(options)
// 	}		
// }	

// ####### #     # #     #  #####  ####### ### ####### #     #  #####  
// #       #     # ##    # #     #    #     #  #     # ##    # #     # 
// #       #     # # #   # #          #     #  #     # # #   # #       
// #####   #     # #  #  # #          #     #  #     # #  #  #  #####  
// #       #     # #   # # #          #     #  #     # #   # #       # 
// #       #     # #    ## #     #    #     #  #     # #    ## #     # 
// #        #####  #     #  #####     #    ### ####### #     #  #####  	

async delay(ms) {
	try{	
		return new Promise(resolve => setTimeout(resolve, ms));
	}catch(e){

		let options = {
			"class": "unit",
			"function": "delay",
			"e": e
		}
		errorHandler.log(options)
	}		
}		


checkAngle(start_pos, end_pos) {
	try{
		let angle = 0
		if(start_pos.x < end_pos.x){
			angle = 0;
		}
		if(start_pos.x > end_pos.x){
			angle = 180;
		}				
		if(start_pos.y < end_pos.y){
			angle = 90;
		}
		if(start_pos.y > end_pos.y){
			angle = -90;
		}		
		
		return angle;
	}catch(e){

		let options = {
			"class": "unit",
			"function": "checkAngle",
			"e": e
		}
		errorHandler.log(options)
	}		
}	



// ██     ██  ██████  ██    ██ ███    ██ ██████  ██ ███    ██  ██████  
// ██     ██ ██    ██ ██    ██ ████   ██ ██   ██ ██ ████   ██ ██       
// ██  █  ██ ██    ██ ██    ██ ██ ██  ██ ██   ██ ██ ██ ██  ██ ██   ███ 
// ██ ███ ██ ██    ██ ██    ██ ██  ██ ██ ██   ██ ██ ██  ██ ██ ██    ██ 
//  ███ ███   ██████   ██████  ██   ████ ██████  ██ ██   ████  ██████ 


kill(){	
	try{	
		this.core.alive = false;

		GameScene.sfx[this.unit_class.death_sfx].play();
		this.sprite.destroy();
		if(this.sprite_ghost){
			this.sprite_ghost.destroy();
		}
		this.sprite_action.destroy();
		// this.sprite_symbol.destroy();
		this.text_graphic.destroy();
		this.text.destroy();

		this.bar_graphic.destroy();
		this.bar_back_graphic.destroy();
		this.path_graphic.destroy();
		this.cohesion_graphic.destroy();
		this.fight_graphic.destroy();
		this.blast_graphics.forEach((graphic) => {
			graphic.destroy();
		})
		this.delete = true;

		// modeHandler.checkGameEnd();
	}catch(e){

		let options = {
			"class": "unit",
			"function": "kill",
			"e": e
		}
		errorHandler.log(options)
	}		
}

wound = (options) => {
	console.log(options)

	let print_text = options.damage+' dmg'
	if(options.damage > 0) {
		this.core.health -= options.damage
		if(this.core.health < 0){
			this.core.health = 0;
		}
		gameCore.assets.units[this.id] -= options.damage		
	}else{
		print_text = 'miss'
	}

	this.drawTextParticle(print_text)

	if(this.core.health === 0){
		this.kill();
	}
}
	
// ######  ######     #    #     # 
// #     # #     #   # #   #  #  # 
// #     # #     #  #   #  #  #  # 
// #     # ######  #     # #  #  # 
// #     # #   #   ####### #  #  # 
// #     # #    #  #     # #  #  # 
// ######  #     # #     #  ## ##  	

drawTint(){

	try{	
		let colour = gameCore.getSideColour(this.core.side);
		this.colour = colour.colour
		this.colour_gray = colour.colour_gray;
		this.colour_info = colour.colour_info;

		this.sprite.setTint(this.colour)
		if(this.sprite_ghost){
			this.sprite_ghost.setTint(this.colour)					
		}
	}catch(e){

		let options = {
			"class": "unit",
			"function": "drawTint",
			"e": e
		}
		errorHandler.log(options)
	}
}

drawFlash(active=true, gray_out=false){
	try{	
		if(active === true && this.core.player === gameCore.data.player){
			this.flash_tween = this.scene.tweens.addCounter({
				targets: this, 
				from: 0,
				to: 255,
				yoyo: 1,
				repeat: -1,
				onUpdate: function (tween) {
					if(this.sprite_ghost){
						const value = Math.floor(tween.getValue());

						let colour_info = this.sprite_ghost.parent.colour_info

						this.sprite_ghost.setTint(Phaser.Display.Color.GetColor(
							colour_info.r + (value * colour_info.r_itt), 
							colour_info.g + (value * colour_info.g_itt), 
							colour_info.b + (value * colour_info.b_itt)
							));	
					}
				}
			})
			// tween.sprite = this.sprite
			this.flash_tween.sprite_ghost = this.sprite_ghost				
		}else{
			if (this.flash_tween){
				this.flash_tween.stop();
				if(gray_out === false){
					this.sprite_ghost.setTint(this.colour)
				}else{
					this.sprite_ghost.setTint(this.colour_gray)
				}
			}
		}
	}catch(e){

		let options = {
			"class": "unit",
			"function": "drawFlash",
			"e": e
		}
		errorHandler.log(options)
	}		
}

drawTextParticle(text){

	let part_options = {
		scene: GameScene.scene,
		parent_id: this.core.id,
		text: text,
		text_style: { 
			font: "16px Arial",
			fill: "#ff0044",
			align: "center",
			stroke: "#000000",
			strokeThickness: 2
		},
		pos: {
			x: this.sprite.x,
			y: this.sprite.y
		},
		tween:true,
		rise_duration: 500,
		fadeout_duration: 500
	}

	if(this.adding_particle === 0){

		this.adding_particle = 1;
		new particle(part_options)	
	}else{
		this.queued_text_particles.push(part_options)
	}
}


updateElements(sprite){
	try{	
		// this.updateUnitElements(sprite);
		this.drawHealth(sprite);
		this.sprite_action.x = sprite.x
		this.sprite_action.y = sprite.y

		this.drawInfo(sprite);
		this.drawHealth(sprite);
		this.drawFightRadius();
	}catch(e){

		let options = {
			"class": "unit",
			"function": "updateElements",
			"e": e
		}
		errorHandler.log(options)
	}		
}

// updateUnitElements(sprite){
// 	try{	
// 		this.drawHealth(sprite);
// 		this.sprite_action.x = sprite.x
// 		this.sprite_action.y = sprite.y
// 	}catch(e){

// 		let options = {
// 			"class": "unit",
// 			"function": "updateUnitElements",
// 			"e": e
// 		}
// 		errorHandler.log(options)
// 	}
// }	


drawInfo(sprite)
{
	try{	
		let string = ""
		switch(gameCore.data.mode){
			case "shoot":
				string = this.core.targets.length + "/" + this.gun_class[this.core.selected_gun].max_targets
				break;
			case "fight":
				string = this.core.fight_targets.length + "/" + this.melee_class[this.core.selected_melee].max_targets
				break;				
		}

		if(string !== ""){

			this.text.setText(string);
			this.text.x = sprite.x - this.text.width + (this.sprite.displayWidth / 2)
			this.text.y = sprite.y - this.text.height + (this.sprite.displayHeight / 2)

			this.text_graphic.clear();
			this.text_graphic.fillStyle(0xFFFFFF).setDepth(this.depth_text_box);
			this.text_graphic.fillRect(this.text.x, this.text.y, this.text.width, this.text.height);
		}
	}catch(e){

		let options = {
			"class": "unit",
			"function": "drawInfo",
			"e": e
		}
		errorHandler.log(options)
	}
}


drawBacking(sprite, width){
	try{
		let radius_graphic = this.bar_back_graphic;
		this.bar_back_graphic.clear();

		radius_graphic.lineStyle(1, 0x000000, 0.5);
		radius_graphic.fillStyle(0x000000, 0.5);
		let circle = new Phaser.Geom.Circle(sprite.x, sprite.y, (width / 2)+5);
		radius_graphic.fillCircleShape(circle).setDepth(this.depth_health - 0.5);

		radius_graphic.strokePath();	
	}catch(e){

		let options = {
			"class": "unit",
			"function": "drawBacking",
			"e": e
		}
		errorHandler.log(options)
	}			
}	

drawHealth(sprite)
{
	try{	
		this.bar_graphic.clear();

		let width = gameCore.data.tile_size * (this.unit_class.size * 3)
		if(width === 0){
			width = gameCore.data.tile_size
		}
		if(this.unit_class.sprite_offset === 0){
			width = gameCore.data.tile_size * (this.unit_class.size * 2)
		}
		width *= 0.8
		
		
		let pos = {
			x: sprite.x,
			y: sprite.y
		}		
		
		
		let angle = (270 / this.unit_class.health) * this.core.health;
		
		let fill_colour = 0x2ECC40; //green
		if (this.core.health <= this.unit_class.health / 2) 
		{

			fill_colour = 0xffdb00; //yellow
		}
		if (this.core.health <= this.unit_class.health / 4)
		{
			fill_colour = 0xff0000; //red
		}

		
		// arc (x, y, radius, startAngle, endAngle, anticlockwise)
		this.drawBacking(sprite, width);

		this.bar_graphic.lineStyle(7, fill_colour, 0.75);
		// this.bar_graphic.arc(pos.x, pos.y, width / 2, Phaser.Math.DegToRad(angle), Phaser.Math.DegToRad(0), true)
		
		let segment_size = 270 / this.unit_class.health;
		for (let i=0;i<this.core.health;i++){
			//  Without this the arc will appear closed when stroked
			this.bar_graphic.beginPath();			
			this.bar_graphic.arc(pos.x, pos.y, width / 2, Phaser.Math.DegToRad(((i+1) * segment_size) - 10), Phaser.Math.DegToRad(i * segment_size), true)
			this.bar_graphic.strokePath();
		}

	}catch(e){

		let options = {
			"class": "unit",
			"function": "drawHealth",
			"e": e
		}
		errorHandler.log(options)
	}		
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
// #     # ####### #     # ####### 
// ##   ## #     # #     # #       
// # # # # #     # #     # #       
// #  #  # #     # #     # #####   
// #     # #     #  #   #  #       
// #     # #     #   # #   #       
// #     # #######    #    ####### 	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ######  ######     #    #     #       ######     #    ####### #     # 
// #     # #     #   # #   #  #  #       #     #   # #      #    #     # 
// #     # #     #  #   #  #  #  #       #     #  #   #     #    #     # 
// #     # ######  #     # #  #  # ##### ######  #     #    #    ####### 
// #     # #   #   ####### #  #  #       #       #######    #    #     # 
// #     # #    #  #     # #  #  #       #       #     #    #    #     # 
// ######  #     # #     #  ## ##        #       #     #    #    #     # 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//CALLED AS PART OF CALLBACK IN "FINDPATH"
drawPath(colours) {

	try{	
		//UPDATE THE POSITIONAL DATA AND ANGLE OF THE SPRITE GHOST
		if(this.core.path.length > 1){
			this.sprite.alpha = 0.75
			this.sprite.setTint(0x808080) //turn unit grey if it has a ghost path			

			let pos = this.core.path[this.core.path.length - 1];

			let angle = this.checkAngle(this.core.path[this.core.path.length - 2], this.core.path[this.core.path.length - 1])

			if(this.sprite_ghost){
				this.sprite_ghost.x = pos.x * gameCore.data.tile_size;
				this.sprite_ghost.y = pos.y * gameCore.data.tile_size;
				this.sprite_ghost.angle = angle;

				this.updateElements(this.sprite_ghost)

				// if(gameCore.data.mode === "charge"){
					this.drawFightRadius();
				// }
			}
		}else{
			if(this.sprite_ghost){
				this.sprite_ghost.x = this.sprite.x;
				this.sprite_ghost.y = this.sprite.y;
				this.sprite_ghost.angle = this.sprite.angle;

				this.updateElements(this.sprite_ghost)

				// if(gameCore.data.mode === "charge"){
					this.drawFightRadius();
				// }
			}			
		}
		
		
		
		//DRAW THE  PATH OF THE UNIT
		let last_pos = {
			x: this.sprite.x / gameCore.data.tile_size,
			y: this.sprite.y / gameCore.data.tile_size
		}
		
		//RESET THE DRAW GRAPHICS
		this.path_graphic.clear();
		this.cohesion_graphic.clear();
		
		if (this.core.path && this.core.path.length > 1){
			
			this.path_graphic.lineStyle(colours.width, colours.line_colour, colours.line_alpha);
			this.path_graphic.beginPath();

			this.core.path.forEach((pos, i) => {

				if (i !== 0){
					this.path_graphic.lineTo(pos.x * gameCore.data.tile_size, pos.y * gameCore.data.tile_size);
				}
				else{
					this.path_graphic.moveTo(pos.x * gameCore.data.tile_size, pos.y * gameCore.data.tile_size);
				}
				
				last_pos = pos;
			})				
			
			this.path_graphic.strokePath();						
		}
		
		
		// this.cohesion_graphic.lineStyle(colours.line_width, colours.line_colour, colours.circle_alpha);
		// this.cohesion_graphic.fillStyle(colours.fill_colour, colours.fill_alpha);
		// let circle = new Phaser.Geom.Circle(last_pos.x * gameCore.data.tile_size, last_pos.y * gameCore.data.tile_size, this.unit_class.cohesion / 2);
		// this.cohesion_graphic.fillCircleShape(circle);
		// this.cohesion_graphic.strokePath();		
	}catch(e){

		let options = {
			"class": "unit",
			"function": "drawPath",
			"e": e
		}
		errorHandler.log(options)
	}	
}		


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
//  #####  #     # ####### ####### ####### 
// #     # #     # #     # #     #    #    
// #       #     # #     # #     #    #    
//  #####  ####### #     # #     #    #    
//       # #     # #     # #     #    #    
// #     # #     # #     # #     #    #    
//  #####  #     # ####### #######    #   	
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ######  ######     #    #     #       #######    #    ######   #####  ####### ####### 
// #     # #     #   # #   #  #  #          #      # #   #     # #     # #          #    
// #     # #     #  #   #  #  #  #          #     #   #  #     # #       #          #    
// #     # ######  #     # #  #  # #####    #    #     # ######  #  #### #####      #    
// #     # #   #   ####### #  #  #          #    ####### #   #   #     # #          #    
// #     # #    #  #     # #  #  #          #    #     # #    #  #     # #          #    
// ######  #     # #     #  ## ##           #    #     # #     #  #####  #######    #    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//CALLED AS PART OF CALLBACK IN "FINDPATH"
// drawTarget(targets, blast_radius) {	
drawTarget() {	

	try{	
		if (this.core.targets){
			
			this.resetShoot();

			this.path_graphic.lineStyle(8, 0x00cccc, 0.5);	
			this.path_graphic.beginPath();
			
			this.core.targets.forEach((target, i) => {
				let x =  target.x * gameCore.data.tile_size;
				let y =  target.y * gameCore.data.tile_size;				
				
				this.path_graphic.moveTo(this.sprite.x, this.sprite.y);
				this.path_graphic.lineTo(x, y);

				let gun = this.gun_class[this.core.selected_gun];
				if(gun.blast_radius > 1){
					let blast_graphic = this.blast_graphics[i];
					blast_graphic.fillStyle(0x0000FF, 0.5);

					let circle = new Phaser.Geom.Circle(x, y, (gun.blast_radius / 2) * gameCore.data.tile_size);
					blast_graphic.fillCircleShape(circle).setDepth(this.depth_explosion);

					blast_graphic.strokePath();
				}

				/*
				let pos = {x:0,y:0};
				if(target.x && target.y){
					pos.x = target.x;
					pos.y = target.y;
				}else{
					pos.x = gameCore.assets.units[target].sprite.x;
					pos.y = gameCore.assets.units[target].sprite.y;
				}
				this.path_graphic.moveTo(this.sprite.x, this.sprite.y);
				
				
				//OFFSET PATH POSITION TO MIDDLE OF TILE
				pos.x += this.unit_class.sprite_offset;
				pos.y += this.unit_class.sprite_offset;	
				
				this.path_graphic.lineTo(pos.x, pos.y);
				
				if(blast_radius > 1){
					let blast_graphic = this.blast_graphics[i];
					blast_graphic.fillStyle(0x0000FF, 0.5);

					let circle = new Phaser.Geom.Circle(pos.x, pos.y, (blast_radius / 2) * gameCore.data.tile_size);
					blast_graphic.fillCircleShape(circle).setDepth(this.depth_explosion);

					blast_graphic.strokePath();
				}
				*/
				
			})

			this.path_graphic.strokePath();		
		}
	}catch(e){

		let options = {
			"class": "unit",
			"function": "drawTarget",
			"e": e
		}
		errorHandler.log(options)
	}		
}		


drawFightRadius(){

	try{	
		this.fight_graphic.clear();
		let radius_graphic = this.fight_graphic;
		radius_graphic.lineStyle(2, this.colour, 0.5);
		radius_graphic.fillStyle(this.colour, 0.05);
		let circle = new Phaser.Geom.Circle(this.sprite_ghost.x, this.sprite_ghost.y, (this.melee_class[this.core.selected_melee].range));
		radius_graphic.fillCircleShape(circle).setDepth(this.depth_fight_radius);

		radius_graphic.strokePath();		
		/**/
	}catch(e){

		let options = {
			"class": "unit",
			"function": "drawFightRadius",
			"e": e
		}
		errorHandler.log(options)
	}		
}	

drawSymbol(){

	let draw_symbol = -1;
	let shot_symbol = 2;
	let fight_symbol = 0;

	if(this.core.shot === true){

		if(this.checkSpecialRule("swift") === false){
			draw_symbol = shot_symbol
		}
	}

	if(this.core.in_combat === true){
		draw_symbol = fight_symbol		
	}

	if(draw_symbol !== -1){
		this.sprite_action.setFrame(draw_symbol)
		this.sprite_action.visible = true
	}else{
		this.sprite_action.visible = false
	}

}






	


}

