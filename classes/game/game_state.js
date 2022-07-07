

module.exports = class game_state {
	constructor(options) {	
    }

    resetReady = (options) => {

        //reset all ready status' to false for players
        let update_options = 
        {
            model: "GameData"
            ,params: []
        }   

        options.game_data.players.forEach((player, i) => {
            let update = {}
            update["players."+i+".ready"] = false; 
            update_options.params.push(                {
                filter: {_id: options.game_data.id}, 
                value: {$set: update}
            })
        })

        databaseHandler.updateOne(update_options)
    }

    readyUp = async(options) => {
        try{        
            let update = {}
            update["players."+options.data.player+".ready"] = true; 

            let update_options = 
            {
                model: "GameData"
                ,params: [
                    {
                        filter: {_id: options.game_data.id}, 
                        value: {$set: update}
                    }
                ]
            }   

            let updated_items = await databaseHandler.updateOne(update_options)
            if(updated_items[0]){
                options.game_data = updated_items[0]
                this.checkReady(options)
            }
            
        }catch(e){

            let options = {
                "class": "gameState",
                "function": "checkState",
                "e": e
            }
            errorHandler.log(options)
        }	            
    }

    checkReady = async(options) =>{
        try{
            if(options.game_data){
                //CHECK TO SEE IF ALL PLAYERS ARE READY
                // let game_data = await databaseHandler.findData({
                //     model: "GameData"
                //     ,search_type: "findOne"
                //     ,params: {_id: options.game_data._id}
                // }, false)

                // if(game_data[0]){
                //     game_data = game_data[0];
                    let all_ready = true
                    options.game_data.players.forEach((player) => {
                        if(player.ready === false){
                            all_ready = false;
                        }
                    })

                    //STOP LOOPING CHECK IF ALL PLAYERS ARE READY
                    if(all_ready){
                        this.checkState(options)
                    }
                // }           
            }
        }catch(e){

            let options = {
                "class": "gameState",
                "function": "checkState",
                "e": e
            }
            errorHandler.log(options)
        }	
    }

    checkState = (options) => {
        console.log("all ready")

        switch(options.game_data.mode){
            case "move":
                socketHandler.followPath(options)
                break;
        }

        this.resetReady(options)
    }

}