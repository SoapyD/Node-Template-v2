///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
//  #####  #     # #######  #####  #    #       #     # ####### #     # #     # ######  ### #     #  #####  
// #     # #     # #       #     # #   #        #  #  # #     # #     # ##    # #     #  #  ##    # #     # 
// #       #     # #       #       #  #         #  #  # #     # #     # # #   # #     #  #  # #   # #       
// #       ####### #####   #       ###    ##### #  #  # #     # #     # #  #  # #     #  #  #  #  # #  #### 
// #       #     # #       #       #  #         #  #  # #     # #     # #   # # #     #  #  #   # # #     # 
// #     # #     # #       #     # #   #        #  #  # #     # #     # #    ## #     #  #  #    ## #     # 
//  #####  #     # #######  #####  #    #        ## ##  #######  #####  #     # ######  ### #     #  #####  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

module.exports = (options) => {
    try{
        let random_roll = Math.floor(Math.random() * 20)+1
        // random_roll = 20
        // console.log(random_roll)

        let min_roll_needed = options.defender.armour_class.value - (options.ap + options.bonus);
        if(options.hit_override !== undefined){
            min_roll_needed = options.hit_override;
        }

        if(options.barrier_effects.includes("blunt")){
            random_roll -= 4;
        }
        if(options.attacker.special_rules.includes("sniper")){
            random_roll += 4;
        }            

        // HALF THE RANDOM ROLL IF THE PLAYER IS OUT OF COHESION
        // if(options.attacker_id){
        // 	if(gameFunctions.units[options.attacker_id].cohesion_check === false){
        // 		random_roll = Math.round(random_roll / 2,0);
        // 	}
        // }

        let result = ""
        if(random_roll === -1){
            result = "pass"
        }
        if(random_roll >= min_roll_needed){
            result = "pass"
        }
        if(random_roll < min_roll_needed && random_roll >= 0){
            result = "fail"
        }		
        if(random_roll === 20){
            result = "critical success"
        }
        if(random_roll === 1){
            result = "critical fail"
        }

        let print_text = "";
        let target;
        switch(result){
            case "critical success":
                options.damage *= 2;
                print_text = "crit success!\n-"+options.damage;
                target = options.defender;	
            break;
            case "pass":
                print_text = "-"+options.damage;
                target = options.defender;
            break;
            case "fail":
                print_text = "miss";
                options.damage = 0;
                target = options.defender;
            break;
            case "critical fail":
                options.damage = 0;
                print_text = "crit fail!";
                target = options.defender;
            break;
        }
        
        if(target){
            if(target.alive === true){

                // console.log(print_text)	
                
                target.health -= options.damage;
                // target.drawHealth(this.sprite)
                if(target.health <= 0){
                //     this.core.killed_by = options.attacker_id;
                //     GameUIScene.updatePointsHUD();
                //     target.kill();

                    target.alive = false;
                }
            }
        }

        return options.damage
    }
    catch(e){
        let options = {
            "class": "game_socket_handler",
            "function": "wound",
            "e": e
        }
        errorHandler.log(options)
    }
}