
const { workerData, parentPort } = require('worker_threads')
const databaseClass = require('../../mongoose_db_handler');
const collisions = require("../collisions")
let databaseHandler = new databaseClass();
let collisionHandler = new collisions.game_collisions();
const _ = require('lodash');
const utils = require("../../../utils");

runProcess = async(workerData) => {

    let game_datas = await databaseHandler.findData({
        model: "GameData"
        ,search_type: "findOne"
        ,params: {_id: workerData.game_data_id}
    })     
    
    game_data = game_datas[0]
    
    
    //FIND MAXIMUM PATH SIZE, WHICH REPRESENTS THE MAXIMUM OF POS
    let lengths = _(game_data.units)
    .map(row => row.targets.length)
    .value()
    let max_pos = lengths[lengths.indexOf(Math.max(...lengths))]
    let pos = 0 
    
    //reset blast_units arrays
    game_data.units.forEach((unit) => {
        unit.targets.forEach((target) => {
            target.blast_targets = [];
        })
    })
    
    let shooting_data = [];
    
    //figure out the wounding that needs to be applied as well as what target units get hit
    for(let i=0;i<max_pos;i++){
        //USE LOBASE TO GET PATH POSITIONS
        let targets = _(game_data.units)
        .map(row => row.targets[i])
        .value()
        
        targets.forEach((target, n) => {
            //if there aren't any potential targets, still check if there's any splash damage targets
    
            if(target){
                if(target.potential_targets){
                    target.potential_targets.forEach((potential_target) => {
                        let data = {
                            id: shooting_data.length,
                            uid: '_'+n+'_'+i+'_',
                            origin: n,
                            shot: i,
                            hit_time: potential_target.hit_time,
                            target: potential_target.id,
                            pos: potential_target.pos
                            //sub_targets
                        }
                        shooting_data.push(data);
                    })
                }
                //ADD ON THE END PATH POINT
                let data = {
                    id: shooting_data.length,
                    uid: '_'+n+'_'+i+'_',
                    origin: n,
                    shot: i,
                    hit_time: target.hit_time,
                    target: -1,
                    pos: {
                        x: target.x,
                        y: target.y
                    }
                    //sub_targets
                }
                shooting_data.push(data);                            
            }
        })
    }
    
    shooting_data = utils.functions.sortDynamic(shooting_data, "hit_time")
    // console.log(shooting_data)
    
    //loop through shooting data and figure out which units hit
    
    let shots_hit = [];
    shooting_data.forEach((item) => {
        //CHECK TO SEE THE SHOT BY X UNIT HASN'T BEEN HANDLED YET
        //uid is the origin of the bullet and the shot number
        if(!JSON.stringify(shots_hit).includes(item.uid)){
            
            let attacker = game_data.units[item.origin];
            let attacker_dims = collisionHandler.getUnitTileRange(attacker, game_data.tile_size);
    
            let attacker_gun = attacker.gun_class[attacker.selected_gun];
            // let defender = game_data.units[item.target];
            
            let bullet_hit = false;
    
            if(item.target === -1){
                bullet_hit = true;
            }
    
            let target_unit;
            //check if target is hit
            if(item.target > -1){
                target_unit = game_data.units[item.target];
                if(target_unit.alive){
                    bullet_hit = true;  
                }
            }
    
            if(bullet_hit){
    
                let returned_data = collisions.barrier.check_bullet({
                    game_data: game_data,
                    intersections_array: game_data.units[item.origin].targets[item.shot].intersections,
                    start_pos: attacker_dims.mid_game,
                    end_pos: {x: item.pos.x * game_data.tile_size, y: item.pos.y * game_data.tile_size}
                })
    
                game_data.units[item.origin].targets[item.shot].intersections = returned_data.intersections_array
    
                //CHECK FOR BARRIER CREATION
                if(attacker_gun.barrier){
                    let barrier = {
                        barrier_class: attacker_gun.barrier.id
                        ,life: attacker_gun.barrier.life
                        ,x: item.pos.x * game_data.tile_size
                        ,y: item.pos.y * game_data.tile_size                                    
                        ,tileX: item.pos.x
                        ,tileY: item.pos.y
                    }
    
                    game_data.barriers.push(barrier)                              
                }
    
                //APPLY DAMAGE IF THERE'S A TARGET, NEEDS TO GO AFTER BARRIERS AS THEY CAN AFFECT DAMAGE
                if(target_unit){
                    //CALCULATE WOUNDING AND APPLY DAMAGE
                    let damage_applied = utils.checkWounding({
                        gamedata: game_data,
                        attacker: attacker,
                        defender: target_unit,
                        damage: attacker_gun.damage,
                        ap: attacker_gun.ap,
                        bonus: attacker.unit_class.shooting_bonus,
                        barrier_effects: returned_data.effects
                    })
    
                    shots_hit.push(item)
    
                    //APPLY DAMAGE OUTCOMES TO TARGETS AND SUB TARGETS (HIT OR MISS)
                    //SO THAT DATA CAN BE PASSED BACK TO PLAYERS AND APPLIED                            
                    //SET THE TARGET OF THE BULLET IF IT'S HIT A UNIT
                    let shot_data = attacker.targets[item.shot];
                    shot_data.x = item.pos.x
                    shot_data.y = item.pos.y
                    shot_data.target_id = item.target;
                    shot_data.damage = damage_applied;   

                    //CHECK FOR STATUS EFFECTS HERE
                    if(attacker_gun.barrier){
                        target_unit = utils.checkStatusEffects.applyEffects({
                            unit: target_unit,
                            barrier_class: attacker_gun.barrier
                        })
                    }
                }
    
    
                //ALSO NEED TO APPLY SPLASH DAMAGE HERE  
                // console.log(attacker.gun_class[attacker.selected_gun]) 
                if(attacker_gun.blast_radius > 1){
                    let blast_units = collisionHandler.checkBlastClash({
                        game_data: game_data
                        ,start: item.pos
                        ,blast_radius: attacker_gun.blast_radius
                    })
    
                    blast_units.forEach((blast_unit) => {
                        
                        if(blast_unit.alive && blast_unit.id != item.target){
                            //CALCULATE WOUNDING AND APPLY DAMAGE
                            let damage_applied = utils.checkWounding({
                                gamedata: game_data,
                                attacker: attacker,
                                defender: blast_unit,
                                damage: attacker_gun.damage,
                                ap: attacker_gun.ap,
                                bonus: attacker.unit_class.shooting_bonus,
                                barrier_effects: returned_data.effects
                            })

                            //CHECK FOR STATUS EFFECTS HERE                            
                            target_unit = utils.checkStatusEffects.applyEffects({
                                unit: blast_unit,
                                barrier_class: attacker_gun.barrier
                            })

                            game_data.units[item.origin].targets[item.shot].blast_targets.push({
                                id: blast_unit.id
                                ,damage: damage_applied
                            })
                        }
                    })
    
                }
            }
    
        }
    })
    
    await databaseHandler.updateData(game_data)
    
    parentPort.postMessage({ 
        process: {
            game_data_id: game_data.id
        }    
    })
}

runProcess(workerData)
