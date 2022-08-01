
const barrier = class {
	constructor(options) {	
	
        this.id = gameCore.assets.barriers.length;
        this.type = "barrier"
        this.unit = options.unit
        this.side = options.unit.core.side
        this.scene = options.scene
        this.alive = true;
        this.life = options.life;
        this.modifier = options.modifier;

        this.effects = options.effects

        this.text = this.life
        this.style =  { 
            font: "16px Arial",
            fill: "#ff0044",
            align: "center",
            stroke: "#000000",
            strokeThickness: 2
        }

        this.text = options.scene.add.text(options.x, options.y, this.text, this.style).setDepth(20);
        this.text.x -= this.text.width / 2;
        this.text.y -= this.text.height / 2;

		this.blast_spritesheet = options.blast_spritesheet;
		this.blast_radius = options.blast_radius;	
		
		this.origin = {
			x: options.x,
			y: options.y
		}
         

        this.sprite = options.scene.physics.add.image(this.origin.x,this.origin.y,options.blast_spritesheet)
        this.sprite.setDepth(20);
        this.sprite.setAlpha(0.5);

        this.sprite.setTint(this.unit.colour)

        if(options.blast_radius){
            let size = options.blast_radius  * gameCore.data.tile_size;
            this.sprite.displayWidth = size;
            this.sprite.displayHeight = size;
        }

        this.sprite.parent = this;

		gameCore.assets.barriers.push(this)
    }

    
    updateText() {
        this.text.x += (this.text.width / 2)
        this.text.y += (this.text.height / 2)

        this.text.setText(this.life)     
        this.text.x -= (this.text.width / 2)
        this.text.y -= (this.text.height / 2)                
    }

	checkDeath() {
        this.checkCollisions();

        this.life--;
        this.updateText()
        if (this.life <= 0){
            this.alive = false;
            this.sprite.destroy();
            this.text.destroy();
        }
    }

    checkCollisions = () => {
		if(this.blast_radius > 0){
			gameFunctions.units.forEach((unit) => {
                this.checkAction(unit)
			})	
		}        
    }    

    checkEffects(name) {
        let has_rule = false;
        if (this.effects.find((rule) => rule === name)){
            has_rule = true;
        }	
    
        return has_rule
    }

    checkAction = (obj) => {

        // let val = Math.pow(this.sprite.x - obj.sprite.x, 2) + Math.pow(this.sprite.y - obj.sprite.y, 2)
        // let dist = Math.round(Math.sqrt(val),0)
        
        // let blast_size = (this.blast_radius*0.5) * gameCore.data.tile_size

        // if(dist <= blast_size){    

        //     if(obj.type === 'bullet'){
        //         if(this.checkEffects("blunt") === true && obj.blunt === false){
        //             this.drawTextParticle(obj.sprite, "blunt")
        //             obj.blunt = true;
        //             GameScene.sfx['blunt'].play();
        //         }
        //     }

        //     if(obj.type === 'unit'){
        //         if(this.checkEffects("poison") === true && obj.core.poison_timer < 2){

        //             if(obj.core.poison === false){
        //                 obj.drawTextParticle("poisoned!")
        //             }
        //             obj.core.poison = true;
        //             obj.core.poison_timer = 2;
        //             obj.core.poison_caused_by = this.unit.core.id;
        //             GameScene.sfx['poison'].play();
        //         }
        //     }

        // }
    }

    drawTextParticle = (obj, string) => {
		let part_options = {
			scene: GameScene.scene,
			text: string,
			text_style: { 
				font: "16px Arial",
				fill: "#ff0044",
				align: "center",
				stroke: "#000000",
				strokeThickness: 2
			},
			pos: {
				x: obj.x,
				y: obj.y
			},
			tween:true,
            rise_duration: 500,
            fadeout_duration: 500
		}
		new particle(part_options)        
    }
    
    // applyDamage = (unit) => {
    //     let options = {
    //         damage: 1,
    //         ap: 0,
    //         bonus: 0,	
    //         random_roll: -1,
    //         defender_id: unit.core.id
    //     }

    //     if(GameScene.online === false){
    //         unit.wound(options);
    //     }else{            
    //         if(gameFunctions.params.player_number === this.unit.core.player){
    //             let data = {
    //                 functionGroup: "socketFunctions",  
    //                 function: "messageAll",
    //                 room_name: gameFunctions.params.room_name,
    //                 returnFunctionGroup: "connFunctions",
    //                 returnFunction: "woundUnit",
    //                 returnParameters: options,
    //                 message: "Wound Unit"
    //             }				
    //             connFunctions.messageServer(data)
    //         }
    //     }	
    // }

}