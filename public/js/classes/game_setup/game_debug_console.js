
const debug_console = class {
	constructor(options) {	

        this.x = options.x;
        this.y = options.y;        
        this.height = options.height;
        this.width = options.width;
        this.scene = GameUIScene.scene;


		this.text = this.scene.add.text(this.x, this.y - this.height, "", { fill: '#000000' })
		.setDepth(120);

		this.text_box = this.scene.add.rectangle(
			this.x + (this.width / 2), this.y - (this.height / 2), 
			this.width, this.height, 0xffffff)
		.setDepth(100);        

	}
	
	updateText(label) {
		this.label = label;
		this.text.setText(label);
		this.text.x = this.text_box.x - (this.text_box.width / 2);
        this.text.y = this.text_box.y	- (this.text_box.height / 2);

	}

}