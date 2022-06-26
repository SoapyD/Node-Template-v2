
// code sourced from here: https://www.jeffreythompson.org/collision-detection/table_of_contents.php
const _ = require('lodash');

const u_circle = class {
	constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.r = options.r;	   
    }    
}

const u_rectangle = class {
	constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.w = options.w;
        this.h = options.h;	   
    }    
}



module.exports = class game_collisions {
	constructor(options) {	

        // this.depth = 30;
		// this.graphics = [];
		// for(let i=0; i<10; i++){
		// 	this.graphics.push(options.scene.add.graphics().setDepth(this.depth));
		// }        
        
    }

  circleRect(circle, rect) {

    // temporarect.y variables to set edges for testing
    let testX = circle.x;
    let testY = circle.y;
  
    // which edge is closest?
    if (circle.x < rect.x)         testX = rect.x;      // test left edge
    else if (circle.x > rect.x+rect.w) testX = rect.x+rect.w;   // right edge
    if (circle.y < rect.y)         testY = rect.y;      // top edge
    else if (circle.y > rect.y+rect.h) testY = rect.y+rect.h;   // bottom edge
  
    // get distance from closest edges
    let distX = circle.x-testX;
    let distY = circle.y-testY;
    let distance = Math.sqrt( (distX*distX) + (distY*distY) );
  
    // if the distance is less than the radius, collision!
    if (distance <= circle.r) {
      return true;
    }
    return false;
  }

  circleCircle(circle1, circle2) {

    // get distance between the circle's centers
    // use the Pythagorean Theorem to compute the distance
    let distX = circle1.x - circle2.x;
    let distY = circle1.y - circle2.y;
    let distance = Math.sqrt( (distX*distX) + (distY*distY) );
  
    // if the distance is less than the sum of the circle's
    // radii, the circles are touching!
    if (distance <= circle1.r+circle2.r) {
      return true;
    }
    return false;
  }


  //GET THE RANGE OF TILES A UNIT OCCUPIES
  getUnitTileRange = (unit) => {

    let min = {
        x: -1,
        y: -1,
    }
    let max = {
        x: -1,
        y: -1,
    }        

    if(unit.sprite_offset === 0){
        min.x = unit.tileX - unit.size;
        min.y = unit.tileY - unit.size;            
        max.x = unit.tileX
        max.y = unit.tileY             
    }

    if(unit.sprite_offset === 0.5){
        min.x = unit.tileX - unit.size;
        min.y = unit.tileY - unit.size;            
        max.x = unit.tileX + unit.size;
        max.y = unit.tileY + unit.size;             
    }

    return {
        min: min,
        max: max
    }
  }


  gridRayTracing = (start, end) => {

      //GET START AND END DIFFERENCE
      let width = end.x - start.x
      let height = end.y - start.y

      let itts = 0
      let x_itt = 0
      let y_itt = 0
      let total_itts = 0

      let n_width = width
      let x_dir = 1;
      if(n_width < 0)
      {
        n_width *= -1;
        x_dir = -1;
      }

      let n_height = height
      let y_dir = 1;
      if(n_height < 0)
      {
        n_height *= -1;
        y_dir = -1;
      }      

      //GET THE X ITTERATIONS AND Y RELATED POSITIONS
      let x_path = []
      if(n_width !== 0){      
        itts = n_width

        x_itt = 0.5
        y_itt = n_height / ((n_width) * 2)
        total_itts = (itts*2)+1
        
        x_path = _.times(total_itts, (i) => {
        return {
          // x:start.x+((i*x_itt) * x_dir)
          // ,y:start.y+((i*y_itt) * y_dir)
          x: Math.floor(start.x+((i*x_itt) * x_dir))
          ,y: Math.floor(start.y+((i*y_itt) * y_dir)) 
        }})
      }      

      //GET THE Y ITTERATIONS AND Z RELATED POSITIONS
      let y_path = []
      if(n_height !== 0){
        itts = n_height

        x_itt = n_width / ((n_height) * 2)
        y_itt = 0.5
        total_itts = (itts*2)+1

        y_path = _.times(total_itts, (i) => {
        return {
          // x:start.x+((i*x_itt) * x_dir)
          // ,y:start.y+((i*y_itt) * y_dir)
          x: Math.floor(start.x+((i*x_itt) * x_dir))
          ,y: Math.floor(start.y+((i*y_itt) * y_dir))         
        }})
      }

      let order_rank = ['asc','asc']
      if(x_dir === -1){
        order_rank[0] = 'desc'
      }
      if(y_dir === -1){
        order_rank[1] = 'desc'
      }      


      //COMBINE THE TWO SETS OF PATHS THEN GET A UNIQUE LIST OF TILES FROM IT
      let combined_path = x_path.concat(y_path)
      
      return _(combined_path)
      .uniqBy((e) => {
        return e.x + '_' + e.y;
      })
      .orderBy(['x', 'y'], order_rank)
      .value()  
  }



}
