
const game_loading_screen = class {
	constructor(options) {	

        // ██       ██████   █████  ██████  ██ ███    ██  ██████        ███████  ██████ ██████  ███████ ███████ ███    ██ 
		// ██      ██    ██ ██   ██ ██   ██ ██ ████   ██ ██             ██      ██      ██   ██ ██      ██      ████   ██ 
		// ██      ██    ██ ███████ ██   ██ ██ ██ ██  ██ ██   ███ █████ ███████ ██      ██████  █████   █████   ██ ██  ██ 
		// ██      ██    ██ ██   ██ ██   ██ ██ ██  ██ ██ ██    ██            ██ ██      ██   ██ ██      ██      ██  ██ ██ 
		// ███████  ██████  ██   ██ ██████  ██ ██   ████  ██████        ███████  ██████ ██   ██ ███████ ███████ ██   ████		

        this.scene = options.scene;

        if(options.launch_uiscene){
            this.launch_uiscene = options.launch_uiscene;
        }

		//CREATE A LOAD SCREEN FOR THE GAME
		this.width = this.scene.cameras.main.width;
		this.height = this.scene.cameras.main.height;

		this.loadingText = this.scene.make.text({
			x: this.width / 2,
			y: this.height / 2 - 50,
			text: 'Loading...',
			style: {
				font: '20px monospace',
				fill: '#ffffff'
			}
		});
		this.loadingText.setOrigin(0.5, 0.5);

		this.percentText = this.scene.make.text({
			x: this.width / 2,
			y: this.height / 2 - 5,
			text: '0%',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});
		this.percentText.setOrigin(0.5, 0.5);

		this.assetText = this.scene.make.text({
			x: this.width / 2,
			y: this.height / 2 + 50,
			text: '',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});

		this.assetText.setOrigin(0.5, 0.5);		
		
		this.progressBar = this.scene.add.graphics();
		this.progressBox = this.scene.add.graphics();
		this.progressBox.fillStyle(0x222222, 0.8);
		this.progressBox.fillRect((this.width / 2) - 160, 270, 320, 50);			
        this.scene.loadingClass = this;
        
		this.scene.load.on('progress', function (value) {
            let loadingClass = this.scene.loadingClass 

			loadingClass.percentText.setText(parseInt(value * 100) + '%');
			loadingClass.progressBar.clear();
			loadingClass.progressBar.fillStyle(0xffffff, 1);
			loadingClass.progressBar.fillRect((loadingClass.width / 2) - 150, 280, 300 * value, 30);
		});
		
		this.scene.load.on('fileprogress', function (file) {
            let loadingClass = this.scene.loadingClass 

			loadingClass.assetText.setText('Loading asset: ' + file.key);
		});		
		
		this.scene.load.on('complete', function () {
            let loadingClass = this.scene.loadingClass 

			loadingClass.progressBar.destroy();
			loadingClass.progressBox.destroy();
			loadingClass.loadingText.destroy();
			loadingClass.percentText.destroy();
			loadingClass.assetText.destroy();
			
            // this.scene.launch("ArmySetupUIScene");
            if(loadingClass.launch_uiscene){
                loadingClass.scene.scene.launch(loadingClass.launch_uiscene);			
            }
		});				

    }
}