
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
    .map(row => row.fight_targets.length)
    .value()
    let max_pos = lengths[lengths.indexOf(Math.max(...lengths))]
    let pos = 0 
    

    
    let fighting_data = [];
    
    //figure out the wounding that needs to be applied as well as what target units get hit
    for(let i=0;i<max_pos;i++){
        //USE LOBASE TO GET PATH POSITIONS
        let targets = _(game_data.units)
        .map(row => row.fight_targets[i])
        .value()
        
        targets.forEach((target, n) => {
            //if there aren't any potential targets, still check if there's any splash damage targets
    
            if(target){
                //ADD ON THE END PATH POINT
                let data = {
                    id: fighting_data.length,
                    uid: '_'+n+'_'+i+'_',
                    origin: n,
                    target: target.target_id,
                    shot: i,
                    pos: {
                        x: target.x,
                        y: target.y
                    }
                    //sub_targets
                }
                fighting_data.push(data);                            
            }
        })
    }

    
    //loop through shooting data and figure out which units hit    
    // let shots_hit = [];
    fighting_data.forEach((item) => {
        //CHECK TO SEE THE SHOT BY X UNIT HASN'T BEEN HANDLED YET
        //uid is the origin of the bullet and the shot number
        // if(!JSON.stringify(shots_hit).includes(item.uid)){
            
            let attacker = game_data.units[item.origin];
            let attacker_melee = attacker.gun_class[attacker.selected_melee];
            
            let hit = false;
    
            if(item.target === -1){
                hit = true;
            }
    
            let target_unit;
            //check if target is hit
            if(item.target > -1){
                target_unit = game_data.units[item.target];
                if(target_unit.alive){
                    hit = true;  
                }
            }
    
            if(hit){

                //APPLY DAMAGE IF THERE'S A TARGET, NEEDS TO GO AFTER BARRIERS AS THEY CAN AFFECT DAMAGE
                if(target_unit){
                    //CALCULATE WOUNDING AND APPLY DAMAGE
                    let damage_applied = utils.checkWounding({
                        gamedata: game_data,
                        attacker: attacker,
                        defender: target_unit,
                        damage: attacker_melee.damage,
                        ap: attacker_melee.ap,
                        bonus: attacker.unit_class.fighting_bonus
                    })

                    let data = attacker.fight_targets[item.shot];
                    data.x = item.pos.x
                    data.y = item.pos.y
                    data.target_id = item.target;
                    data.damage = damage_applied;                       
                }
            }
        // }
    })
    
    await databaseHandler.updateData(game_data)
    
    parentPort.postMessage({ 
        process: {
            game_data_id: game_data.id
        }    
    })
}

runProcess(workerData)
