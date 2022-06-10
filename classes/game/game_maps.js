module.exports = class game_maps {
	constructor(options) {	

        this.acceptable_tiles = [];
        this.matrix = [];   

        this.data = {};
        this.layer = 0;
    }

    setup = async() => {
        let promises = []

        promises.push(await this.loadJsonMap())  
        promises.push(this.setMatrix())
        promises.push(this.setAcceptableTiles())

        return Promise.all(promises)
        .catch((err) => {
            let options = {
                "class": "gamep_maps",
                "function": "loadJsonMap",
                "e": e
            }
            errorHandler.log(options)
        }) 

    }

    loadJsonMap = async() => {

        let promises = []
        
        // return await new Promise(resolve => {
        const fs = require("fs-extra")

        const path = require("path");
        const fullPath = path.resolve("./assets/map2.json");
        // this.data = await fs.readJson(fullPath);
        promises.push(this.data = await fs.readJson(fullPath))

        return Promise.all(promises)
        .catch((err) => {
            let options = {
                "class": "gamep_maps",
                "function": "loadJsonMap",
                "e": e
            }
            errorHandler.log(options)
        }) 

    }

    setMatrix = () => {

        let layer_data = this.data.layers[this.layer]
        let list = layer_data.data;
        let elementsPerSubArray = layer_data.width;

        var matrix = [], i, k;
    
        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }
    
            matrix[k].push(list[i]);
        }
    
        this.matrix = matrix;
    }

    setAcceptableTiles = () => {
        
        this.acceptable_tiles = [];
        this.data.tilesets[this.layer].tiles.forEach((tile, i) => {
            let add_acceptable = true;
            if (tile.properties){
                tile.properties.forEach((property) => {
                    if(property.name === "collide"){
                        add_acceptable = false;
                    }
                })
            }
            if(add_acceptable === true){
                this.acceptable_tiles.push(i)
            }
        })     
    }
}