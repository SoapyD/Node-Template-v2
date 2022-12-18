const _ = require('lodash');
const barrier = require('../../models/game/barrier');
const functions = require("../functions");

exports.applyEffects = (options) => {

    //TAKE UNIT AND LOOP THROUGH BARRIER DATA, IF IT CONTAINS A STATUS EFFECT
    let unit = options.unit;
    options.barrier_class.effects.forEach((effect) => {
        if(effect.effect_type === 'status'){

            //IF THE STATUS EFFECT ISN'T ON THE UNIT, ADD IT
            if(!JSON.stringify(unit.status_effects).includes(effect.name)){
                unit.status_effects.push({
                    name: effect.name
                    ,life: effect.life
                })
            }else{
                //IF THE STATUS ALREADY EXISTS, EXTEND IT'S LIFE
                unit.status_effects.forEach((status_effect) => {
                    if(status_effect.name === effect.name){
                        status_effect.life = effect.life
                    }
                })
            }
        }
    })

    return unit;
}

exports.checkPosition = (options) => {

    let pos = options.pos;
    let game_data = options.game_data;
    let unit = options.unit;
    let i = options.i;

    let path_pos = {
        x: pos.x * game_data.tile_size
        ,y: pos.y * game_data.tile_size
    }                  

    //GET BARRIERS THAT'RE IN RANGE OF THE PATH
    let barriers = _.filter(game_data.barriers, function(o) { 
        return functions.distanceBetweenPoints(path_pos, o) <= (o.barrier_class.blast_radius / 2) * game_data.tile_size
    });

    //LOOP THROUGH BARRIERS AND APPLY EFFECTS ON UNIT
    barriers.forEach((barrier) => {

        //ADD EFFECTS TO PATH SO IT CAN BE USED DURING MOVEMENT
        barrier.barrier_class.effects.forEach((effect) => {
            if(effect.effect_type === 'status'){
                //ONLY ADD EFFECT TO PATH IF IT'S NOT ALREADY ON THE UNIT
                if(!JSON.stringify(unit.status_effects).includes(effect.name)){
                    //ADD EFFECT TO PATH SO IT CAN BE DISPLAYED AS THAT PATH SECTION IS SEARCHED BY CLIENT
                    if(unit.path.length > 0){
                        if(!JSON.stringify(unit.path[i].effects).includes(effect.name)){
                            unit.path[i].effects.push(effect.name)
                        }
                    }
                }
            }
        })

        //APPLY BARRIER EFFECT TO UNIT
        unit = exports.applyEffects({
            barrier_class: barrier.barrier_class,
            unit: unit
        })

    })
}

exports.checkCombat = (options) => {

    let pos = options.pos;
    let game_data = options.game_data;
    let unit = options.unit;
    let i = options.i;

    let clashing_units = collisionHandler.checkAttackingUnits({
        game_data: game_data
        ,start: pos
        ,unit: unit
    })

    // console.log('path:',i,', units:',clashing_units.length)
    if(clashing_units.length > 0){
        clashing_units.forEach((clash) => {
            unit.path[i].clashing_units.push(clash.id)
        })
    }
}


exports.checkPath = (options) => {

    //LOOP THROUGH PATH POSITIONS
    options.unit.path.forEach((pos, i) => {

        let check_options = {
            game_data: options.game_data
            ,unit: options.unit
            ,i: i
            ,pos: pos
        }

        exports.checkPosition(check_options)
        exports.checkCombat(check_options)                    

    })

    return options.unit.path
}


/*
exports.movePath = (options) => {
    let game_data = options.game_data
    game_data.units.forEach((unit) => {
        if(unit.path){
            if(unit.path.length > 0){

                //LOOP THROUGH PATH POSITIONS
                unit.path.forEach((pos, i) => {

                    let check_options = {
                        game_data: game_data
                        ,unit: unit
                        ,i: i
                        ,pos: pos
                    }

                    exports.checkPosition(check_options)
                    exports.checkCombat(check_options)                    

                })
            }
        }
    })

    return game_data
}
*/