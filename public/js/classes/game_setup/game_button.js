
const button = class {
	constructor(options) {	

		//if a spritesheet is provided, load it, otherwise, generate a rectangle
		if(options.sprite){
			this.btn = options.scene.add.sprite(options.x, options.y, options.sprite).setInteractive()
			this.sprite = options.sprite;
			this.btn.setScrollFactor(0); //make buttons non-scrollable
		}else{
			let border_width = 10;
			
			this.btn = options.scene.add.rectangle((options.x - (options.width / 2)), options.y, options.width - border_width, options.height - border_width, 0xffffff)
			.setDepth(100)
			.setInteractive()
			this.border = options.scene.add.rectangle(options.x - (options.width / 2), options.y, options.width, options.height, 0x404040).setDepth(99)
			

			// this.btn = options.scene.add.graphics()
			// .fillStyle(0xFFFFFF, 1)
			// .setTexture()
			// .fillRect((options.x - (options.width / 2)), options.y, options.width - border_width, options.height - border_width);

		}


		// const btn = game.add.sprite(x, y, "buttons").setInteractive()
		let style = { font: "28px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: this.btn.width, align: "center" }; //, backgroundColor: "#ffff00"


        this.click = false
        if(options.clickAction){
            this.callback = options.clickAction;
        }
        if(options.callbackParams){
            this.callbackParams = options.callbackParams;
        }

		this.label = options.label
		this.text = options.scene.add.text(0, 0, options.label, style).setDepth(200);
		this.text.x = this.btn.x - (this.text.width / 2)
		this.text.y = this.btn.y	- (this.text.height / 2)	
		this.text.setScrollFactor(0); //make buttons non-scrollable

		this.depth = 100;
		this.text.depth = 110;
		
		this.btn.parent = this;
		
		
		this.btn.on('pointerover', function (event) {
			if(this.parent.sprite){
				this.setFrame(1);	
			}
			else{
				this.fillColor = 0x808080
			}		
		});			
		this.btn.on('pointerout', function (event) {
			if(this.parent.sprite){
				this.setFrame(0)	
			}
			else{
				this.fillColor = 0xffffff
			}
		});

		//PRESSING THE MOUSE BUTTON
		this.btn.on('pointerup', function (event) {
			if(this.parent.sprite){
				this.setFrame(0)	
			}
			else{
				this.fillColor = 0x808080
			}
			//NEED TO SET THIS AS A SOCKET MESSAGE
			if (this.parent.click === false){
                this.parent.click = true;
                if(this.parent.callback && this.parent.callbackParams){
                    this.parent.callback(this.parent.callbackParams);
                }else{
                    console.log("no callback associated")
                }
			}
		})			

		//RELEASING THE MOUSE BUTTON    
		this.btn.on('pointerdown', function (event) {
			if(this.parent.sprite){
				this.setFrame(2)	
			}
			else{
				this.fillColor = 0x595959
			}
			if (this.parent.click === true){
				this.parent.click = false;
			}
		})			


		// options.array.push(btn);
	}
	
	updateText(label) {
		this.label = label;
		this.text.setText(label);
		this.text.x = this.btn.x - (this.text.width / 2)
		this.text.y = this.btn.y	- (this.text.height / 2)
	}
	
	hideButton(){
		this.text.setText("");
		this.btn.alpha = 0;
		this.btn.setInteractive(false);
		
		if(this.border){
			this.border.alpha = 0;
		}
	}
	
	showButton(){
		this.text.setText(this.label);
		this.btn.alpha = 1;
		this.btn.setInteractive(true);
		if(this.border){
			this.border.alpha = 1;
		}
	}	
}