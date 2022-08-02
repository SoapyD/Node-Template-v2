
const barrier = class {
	constructor(options) {	
	
        this.id = gameCore.assets.barriers.length;
        this.type = "barrier"
        this.unit = options.unit
        this.side = options.unit.core.side
        this.scene = options.scene
        this.alive = true;

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

		this.blast_spritesheet = options.barrier.blast_sprite;
		this.blast_radius = options.barrier.blast_radius;	
        this.life = options.barrier.life;

		this.origin = {
			x: options.x,
			y: options.y
		}
         

        this.sprite = options.scene.physics.add.image(this.origin.x,this.origin.y,this.blast_spritesheet)
        this.sprite.setDepth(20);
        this.sprite.setAlpha(0.5);

        this.sprite.setTint(this.unit.colour)

        if(this.blast_radius){
            let size = this.blast_radius  * gameCore.data.tile_size;
            this.sprite.displayWidth = size;
            this.sprite.displayHeight = size;
        }

        this.sprite.parent = this;

		gameCore.assets.barriers.push(this)

        this.updateText()
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
}