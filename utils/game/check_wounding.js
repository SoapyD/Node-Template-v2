

const functions = require("../functions");

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
        let natural_role = random_roll
        // random_roll = 20

        let min_roll_needed = options.defender.armour_class.value - (options.ap + options.bonus);
        if(options.hit_override !== undefined){
            min_roll_needed = options.hit_override;
        }

        if(options.barrier_effects){
            options.barrier_effects.forEach((effect) => {

                if(effect.name === "blunt" && options.gamedata.mode === 'shoot'){
                    random_roll -= 4;
                }
            })
        }
        // if(options.barrier_effects.includes("blunt") && options.gamedata.mode === 'shoot'){
        //     random_roll -= 4;
        // }

        if(functions.checkArray(options.attacker.special_rules,'name','sniper') && options.gamedata.mode === 'shoot'){
            random_roll += 4;
        }  
        if(functions.checkArray(options.attacker.special_rules,'name','whirling dervish') && options.gamedata.mode === 'fight'){
            random_roll += 4;
        }                    

        // HALF THE RANDOM ROLL IF THE PLAYER IS OUT OF COHESION
        if(options.attacker){
        	if(options.attacker.cohesion_check === false){
        		random_roll = Math.round(random_roll / 2,0);
        	}
        }

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
        if(natural_role === 20){
            result = "critical success"
        }
        if(natural_role === 1){
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
                // console.log('target_id:',target.id)
                target.health -= options.damage;
                if(target.health <= 0){
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