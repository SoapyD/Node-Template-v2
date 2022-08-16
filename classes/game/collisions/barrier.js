const game_collisions = require("./game_collisions")
const gameCollisions = new game_collisions();

const circle = require("./circle")
const line = require("./line")
const utils = require("../../../utils");

exports.check_bullet = (options) => {

    let unique_effects = [];
    //USE LINE CIRCLE COLLISION TO CHECK TO SEE IF ANY BARRIERS ARE HIT
    if(options.game_data.barriers.length > 0){

        //THIS ARRAY LOGS THE POINTS IN THE BULLET PATH THAT PASS THROUGH OR TOUCH A BARRIER
        options.intersections_array = []

        options.game_data.barriers.forEach((barrier) => {
            if(barrier.life > 0){
                let clash = gameCollisions.lineCircle(
                        options.start_pos.x, options.start_pos.y,
                        options.end_pos.x, options.end_pos.y,
                        barrier.x, barrier.y, (barrier.barrier_class.blast_radius / 2) * options.game_data.tile_size
                    )

                //CHECK WHERE THE CLASH OCCURS
                if(clash){
                    let bullet_line = new line({points:[options.start_pos,options.end_pos]})
                    
                    let barrier_circle = new circle({
                        x: barrier.x,
                        y: barrier.y,
                        r: (barrier.barrier_class.blast_radius / 2) * options.game_data.tile_size,
                    })

                    let xPoints = bullet_line.circleCollide(barrier_circle);
                    let intersection_points = bullet_line.convertPointsToPos(xPoints)
                    if(intersection_points.length > 0){
                        //CHECK WHICH INTERSECTION IS CLOSER TO THE ATTACKING PLAYER
                        let saved_dist = -1;
                        let saved_intersection = {};
                        intersection_points.forEach((intersection) => {
                            let dist = utils.functions.distanceBetweenPoints(options.start_pos, intersection)
                            if(dist < saved_dist || saved_dist === -1){
                                saved_intersection.pos = {
                                    x: intersection.x
                                    ,y: intersection.y
                                }
                                // saved_intersection.effects = barrier.barrier_class.effects;
                                if(barrier.barrier_class.effects){
                                    saved_intersection.effects = [];
                                    barrier.barrier_class.effects.forEach((effect) => {
                                        saved_intersection.effects.push(effect.name)
                                    })
                                }
                                saved_intersection.distance = dist;
                                saved_dist = dist;
                            }
                        })
                        options.intersections_array.push(saved_intersection);
                        
                        if(saved_dist > -1){
                            saved_intersection.effects.forEach((effect) => {
                                if(!unique_effects.includes(effect)){
                                    unique_effects.push(effect)
                                }
                            })
                        }
                    }
                }
            }
        })
    }
    // console.log(unique_effects)

    return {
        intersections_array: options.intersections_array
        ,effects: unique_effects
    }
}