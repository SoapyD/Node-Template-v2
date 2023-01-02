const hud = class {
	constructor(options) {	

		this.scene = options.scene;
		this.x = options.x;
		this.y = options.y;		
		this.width = options.width;
		this.height = options.height;		
		this.x_itts = this.width / options.x_itts;
		this.y_itts = this.height / options.y_itts;
		this.x_indent = options.x_indent
		this.y_indent = options.y_indent


		this.fill_colour = options.fill_colour;
		this.fill_alpha = options.fill_alpha;
		this.radius = options.radius;

		if(options.colour){
			// this.colour = options.colour.colour;
			this.saved_colour = this.fill_colour;
			this.colour_gray = options.colour.colour_gray;
		}

		if(options.border){
			this.border = options.border;
		}		

		this.graphics = this.scene.add.graphics();
		this.drawBox()


		this.text = {};
		this.text_items = options.text;

		this.text_items.forEach((item) => {

			this.text[item.id] = this.drawText(item)
		})


		if(options.grid === true){
			this.drawGrid();
		}		
	}

	drawBox(){
		this.graphics.clear();
		this.graphics.fillStyle(this.fill_colour, this.fill_alpha);
        this.graphics.fillRoundedRect(this.x, this.y, this.width, this.height, this.radius);

		if(this.border){
			this.graphics.lineStyle(this.border.width, this.border.colour, this.border.alpha);
			this.graphics.strokeRoundedRect(this.x, this.y, this.width, this.height, this.radius);
		}		
	}

	drawText(item){
		let default_type = 'Arial'
		let font_style = "28px "+default_type;
		if(item.font){
			if(item.font.height){
				font_style = item.font.height + 'px '+default_type
			}
		}

		let width = this.width;
		if(item.text_width){
			width = item.text_width * this.x_itts
		}
		
		let style = { font: font_style, fill: "#000000", wordWrap: {width: width}, align: "left" };
		let style_center = { font: font_style, fill: "#000000", wordWrap: {width: width}, align: "center" };


		let text_item = {};
		
		text_item.label = item.label;

		if (item.box){
			text_item.text = this.scene.add.text(0, 0, item.label, style_center).setDepth(200);
			text_item.text.x = this.x+(item.x*this.x_itts + ((item.box.width / 2) * this.x_itts) - (text_item.text.width / 2)) + this.x_indent
			text_item.text.y = this.y+(item.y*this.y_itts + ((item.box.height / 2) * this.y_itts) - (text_item.text.height / 2)) + this.y_indent	

			text_item.graphics = this.scene.add.graphics();
			text_item.graphics.fillStyle(item.box.fill_colour, item.box.fill_alpha);
			text_item.graphics.fillRoundedRect(
				this.x+(item.x*this.x_itts)+this.x_indent, 
				this.y+(item.y*this.y_itts)+this.y_indent, 
				item.box.width * this.x_itts, 
				item.box.height * this.y_itts, 
				item.box.radius);				

			if(item.box.border){
				text_item.graphics.lineStyle(item.box.border.width, item.box.border.colour, item.box.border.alpha);
				text_item.graphics.strokeRoundedRect(
					this.x+(item.x*this.x_itts)+this.x_indent, 
					this.y+(item.y*this.y_itts)+this.y_indent, 
					item.box.width * this.x_itts, 
					item.box.height * this.y_itts, 
					item.box.radius);
			}	

		}else{
			text_item.text = this.scene.add.text(0, 0, item.label, style).setDepth(200);

			//IF THERE'S NO ALIGNMENT INFO, DEFAULT ALIGN TO THE LEFT
			if(!item.align){
				text_item.text.x = this.x+(item.x*this.x_itts) + this.x_indent
				text_item.text.y = this.y+(item.y*this.y_itts + ((item.height / 2) * this.y_itts) - (text_item.text.height / 2)) + this.y_indent	
			}else{
				switch(item.align){
					case "left":
						text_item.text.x = this.x+(item.x*this.x_itts) + this.x_indent
						text_item.text.y = this.y+(item.y*this.y_itts + ((item.height / 2) * this.y_itts) - (text_item.text.height / 2)) + this.y_indent								
					break
					case "center":
						text_item.text.x = this.x+(item.x*this.x_itts + ((item.width / 2) * this.x_itts) - (text_item.text.width / 2)) + this.x_indent
						text_item.text.y = this.y+(item.y*this.y_itts + ((item.height / 2) * this.y_itts) - (text_item.text.height / 2)) + this.y_indent								
					break							
					default:
						text_item.text.x = this.x+(item.x*this.x_itts) + this.x_indent
						text_item.text.y = this.y+(item.y*this.y_itts + ((item.height / 2) * this.y_itts) - (text_item.text.height / 2)) + this.y_indent							
				}
			}
			
		}	


		return text_item;
	}

	drawGrid(){
		this.graphics.lineStyle(2, 0x000000,0.5);
		
		this.graphics.beginPath();			
		
		for(let x=this.x; x<this.x+this.width; x+=this.x_itts){
			this.graphics.moveTo(x+this.x_indent, this.y+this.y_indent);
			this.graphics.lineTo(x+this.x_indent, this.y+this.height);
		}				
	
		for(let y=this.y; y<this.y+this.height; y+=this.y_itts){
			this.graphics.moveTo(this.x+this.x_indent, y+this.y_indent);
			this.graphics.lineTo(this.x+this.width, y+this.y_indent);
		}	

		this.graphics.closePath();
		this.graphics.strokePath();	
	}

	setText(id, new_text){

		let text_item;
		let has_box = false;
		this.text_items.forEach((item) => {
			if(item.id === id){
				text_item = item
				if(item.box){
					has_box = true;
				}
			}
		})
		
		let text_obj = this["text"][id]["text"];
		if(has_box === true){
			text_obj.x += (text_obj.width / 2)			
		}

		text_obj.setText(new_text)
		if(has_box === true){
			text_obj.x -= (text_obj.width / 2)		
		}		
		//NEEDS TO INCLUDE NEW ALIGNMENT OF TEXT TOO
	}

	setColour(colour){
		this.colour = colour
		this.saved_colour = colour
		this.fill_colour =  colour
		this.drawBox();
	}

	setGray(is_gray){
		if(is_gray === true){
			this.fill_colour = this.colour_gray
			this.drawBox();
		}else{
			this.fill_colour = this.saved_colour
			this.drawBox();			
		}
	}

	setVisible(is_visible){
		if(is_visible === false){
			this.graphics.visible = false;

			for (let key in this.text){
				this.text[key]["text"].visible = false;
				if(this.text[key].graphics){
					this.text[key].graphics.visible = false;
				}
			}
		}
		if(is_visible === true){
			this.graphics.visible = true;

			for (let key in this.text){
				this.text[key]["text"].visible = true;
				if(this.text[key].graphics){
					this.text[key].graphics.visible = true;
				}			
			}			
		}		
	}

	/*
	drawFlash(active=true, gray_out=false){
		if(active === true){
			this.flash_tween = this.scene.tweens.addCounter({
				targets: this, 
				from: 0,
				to: 255,
				yoyo: 1,
				repeat: -1,
				onUpdate: function (tween) {
					if(this.parent){
						const value = Math.floor(tween.getValue());
	
						let colour_info = this.parent.colour.colour_info
	
						let new_colour = Phaser.Display.Color.GetColor(
							colour_info.r + (value * colour_info.r_itt), 
							colour_info.g + (value * colour_info.g_itt), 
							colour_info.b + (value * colour_info.b_itt)
							);
							
						this.parent.fill_colour = new_colour;
						this.parent.drawBox();
					}
				}
			})
			// tween.sprite = this.sprite
			this.flash_tween.parent = this				
		}else{
			// if (this.flash_tween){
			// 	this.flash_tween.stop();
			// 	if(gray_out === false){
			// 		this.sprite_ghost.setTint(this.colour)
			// 	}else{
			// 		this.sprite_ghost.setTint(this.colour_gray)
			// 	}
			// }
		}
	}
	*/
}