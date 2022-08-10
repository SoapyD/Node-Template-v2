const _ = require('lodash');
const barrier = require('../../models/game/barrier');
const functions = require("../functions");

module.exports = (options) => {
    let game_data = options.game_data
    game_data.units.forEach((unit) => {
        if(unit.path){
            if(unit.path.length > 0){

                //LOOP THROUGH PATH POSITIONS
                unit.path.forEach((pos) => {
                    pos.x *= game_data.sprite_size
                    pos.y *= game_data.sprite_size                    

                    //GET BARRIERS THAT'RE IN RANGE OF THE PATH
                    let barriers = _.filter(game_data.barriers, function(o) { 
                        return functions.distanceBetweenPoints(pos, o) <= (barrier.barrier_class.blast_radius / 2) * game_data.sprite_size
                    });

                    //LOOP THROUGH BARRIERS AND APPLY EFFECTS ON UNIT
                    barriers.forEach((barrier) => {
                        barrier.effects.forEach((effect) => {

                            //ONLY APPLY EFFECT IF IT'S A STATUS EFFECT
                            switch(effect){
                                case "regen":
                                case "poison":                                    

                                    if(!JSON.stringify(unit.status_effects).includes(effect)){
                                        unit.status_effects.push({
                                            name: effect
                                            ,life: 3
                                        })
                                    }else{
                                        //IF THE STATUS ALREADY EXISTS, EXTEND IT'S LIFE
                                        unit.status_effects.forEach((status_effect) => {
                                            if(status_effect.name === effect.name){
                                                status_effect.life = 3
                                            }
                                        })
                                    }
                                break;
                            }
                        })
                    })

                })
            }
        }
    })

    return game_data
}