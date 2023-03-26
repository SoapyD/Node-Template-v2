
// const utils = require("../utils");

// code sourced from here: https://www.jeffreythompson.org/collision-detection/table_of_contents.php
const { mixin } = require('lodash');
const _ = require('lodash');



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

  lineCircle(x1, y1, x2, y2, cx, cy, r) {
    // boolean lineCircle(float x1, float y1, float x2, float y2, float cx, float cy, float r) {

      // is either end INSIDE the circle?
      // if so, return true immediately
      let inside1 = this.pointCircle(x1,y1, cx,cy,r);
      let inside2 = this.pointCircle(x2,y2, cx,cy,r);
      if (inside1 || inside2) return true;
    
      // get length of the line
      let distX = x1 - x2;
      let distY = y1 - y2;
      let len = Math.sqrt( (distX*distX) + (distY*distY) );
    
      // get dot product of the line and circle
      let dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);
    
      // find the closest point on the line
      let closestX = x1 + (dot * (x2-x1));
      let closestY = y1 + (dot * (y2-y1));
    
      // is this point actually on the line segment?
      // if so keep going, but if not, return false
      let onSegment = this.linePoint(x1,y1,x2,y2, closestX,closestY);
      if (!onSegment) return false;
    
      // get distance to closest point
      distX = closestX - cx;
      distY = closestY - cy;
      let distance = Math.sqrt( (distX*distX) + (distY*distY) );
    
      if (distance <= r) {
        return true;
      }
      return false;
    }    

  // POINT/CIRCLE
  pointCircle(px, py, cx, cy, r) {

    // get distance between the point and circle's center
    // using the Pythagorean Theorem
    let distX = px - cx;
    let distY = py - cy;
    let distance = Math.sqrt( (distX*distX) + (distY*distY) );

    // if the distance is less than the circle's
    // radius the point is inside!
    if (distance <= r) {
      return true;
    }
    return false;
  }  

  // RECTANGLE/RECTANGLE
  rectRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    // are the sides of one rectangle touching the other?

    if (r1x + r1w > r2x &&    // r1 right edge past r2 left
        r1x < r2x + r2w &&    // r1 left edge past r2 right
        r1y + r1h > r2y &&    // r1 top edge past r2 bottom
        r1y < r2y + r2h) {    // r1 bottom edge past r2 top
          return true;
    }
    return false;
  }

  dist(x1, y1, x2, y2) {
    let distX = x1 - x2;
    let distY = y1 - y2;
    return Math.sqrt( (distX*distX) + (distY*distY) );   
  }

  // LINE/POINT
  linePoint(x1, y1, x2, y2, px, py) {

    // get distance from the point to the two ends of the line
    let d1 = this.dist(px,py, x1,y1);
    let d2 = this.dist(px,py, x2,y2);
  
    // get the length of the line
    let lineLen = this.dist(x1,y1, x2,y2);
  
    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    let buffer = 0.1;    // higher # = less accurate
  
    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
      return true;
    }
    return false;
  }

	getUnitTiles = (options) => {
		let unit_tiles = []
	
		options.game_data.units.forEach((unit) => {
			if(unit.id != options.id){
				let info = this.getUnitTileRange(unit);
	
				let map_width = options.game_data.matrix[0].length;            
	
				for(let x=info.min.x; x<=info.max.x;x+=1){
					for(let y=info.min.y; y<=info.max.y;y+=1){
						unit_tiles.push({
							x: x,
							y: y,
							pos: (map_width * y) + x
						})
					}                
				}
			}
		})
	
		return unit_tiles;
	}


  //GET THE RANGE OF TILES A UNIT OCCUPIES
  getUnitTileRange = (unit, tile_size=0) => {

    //IF A UNIT HAS A PATH, USE THAT AS IT'S CHECKING POINT
    let pos = {
      x: unit.tileX,
      y: unit.tileY      
    }
    //SET CHECK POS TO PATH END IF A UNIT HAS MOVEMENT PLANNED
    if(unit.path.length > 0){
      let path_pos = unit.path[unit.path.length - 1];
      pos.x = path_pos.x
      pos.y = path_pos.y
      pos.x = pos.x - unit.sprite_offset
      pos.y = pos.y - unit.sprite_offset      
    }


    let min = {
        x: -1,
        y: -1,
    }
    let max = {
        x: -1,
        y: -1,
    }
    let min_offset = {
      x: -1,
      y: -1,
    }
    let max_offset = {
        x: -1,
        y: -1,
    }

    let mid = {
      x: -1,
      y: -1,
    }  
    let mid_game = {
      x: -1,
      y: -1,
    }
    let mid_tile_pos = {
      x: -1,
      y: -1
    }                

    if(unit.sprite_offset === 0){
        min.x = pos.x - unit.size;
        min.y = pos.y - unit.size;            
        max.x = pos.x
        max.y = pos.y        
        min_offset.x = -unit.size;
        min_offset.y = -unit.size;
        max_offset.x = 0;
        max_offset.y = 0;                

        mid.x = ((max.x - min.x) / 2) + min.x;
        mid.y = ((max.y - min.y) / 2) + min.y;        
    }

    if(unit.sprite_offset === 0.5){
        min.x = pos.x - unit.size;
        min.y = pos.y - unit.size;            
        max.x = pos.x + unit.size;
        max.y = pos.y + unit.size;       
        
        min_offset.x = -unit.size;
        min_offset.y = -unit.size;
        max_offset.x = unit.size;
        max_offset.y = unit.size;

        mid.x = ((max.x - min.x) / 2) + min.x + unit.sprite_offset;
        mid.y = ((max.y - min.y) / 2) + min.y + unit.sprite_offset;        
    }

    mid_tile_pos.x = ((max.x - min.x) / 2) + min.x;
    mid_tile_pos.y = ((max.y - min.y) / 2) + min.y;    

    mid_game.x = mid.x * tile_size;
    mid_game.y = mid.y * tile_size;    

    return {
        min: min,
        max: max,
        mid: mid,
        min_offset: min_offset,
        max_offset: max_offset,
        mid_game: mid_game,
        mid_tile_pos: mid_tile_pos,
        dim: {
          w: (max.x - min.x) + 1,
          h: (max.y - min.y) + 1,
        },          
        dim_games: {
          w: ((max.x - min.x)+1) * tile_size,
          h: ((max.y - min.y)+1) * tile_size,
        }          

    }
  }

  checkUnitClash = (options) => {
    //USE LODASH TO SEARCH FOR UNIT
    // console.log(options.check_pos)
    return _.filter(options.game_data.units, (unit) => {
      let range = this.getUnitTileRange(unit)
      // console.log(range)
      // console.log('x:', options.check_pos.x, 'min:', range.min.x, ',max',range.max.x)
      // console.log('y:', options.check_pos.y, 'min:', range.min.y, ',max',range.max.y)      
      
      return (
          range.min.x <= options.check_pos.x && range.min.y <= options.check_pos.y
          && range.max.x >= options.check_pos.x && range.max.y >= options.check_pos.y
      )
    })    
  }

  checkUnitUnitClash = (options) => {
    //USE LODASH TO SEARCH FOR UNIT
    return _.filter(options.game_data.units, (unit) => {
      let unit_dims = this.getUnitTileRange(options.unit)
      let check_dims = this.getUnitTileRange(unit)
      let clash = this.rectRect(
        unit_dims.min.x, unit_dims.min.y, 1, 1 //unit_dims.dim.w, unit_dims.dim.h
        ,check_dims.min.x, check_dims.min.y, 1, 1 //, check_dims.dim.w, check_dims.dim.h        
        )
      
      return (
          // range.min.x <= options.check_pos.x && range.min.y <= options.check_pos.y
          // && range.max.x >= options.check_pos.x && range.max.y >= options.check_pos.y
          unit.id !== options.unit.id
          && clash === true
      )
    })    
  }


  checkBlastClash = (options) => {
      
    let start = {
      x: options.start.x * options.game_data.tile_size ,
      y: options.start.y * options.game_data.tile_size            
    }

    //USE LODASH TO SEARCH FOR ALL UNITS THAT CENTER POSITION IS WITHIN THE BLAST RADIUS
    return _.filter(options.game_data.units, (unit) => {
     
      let range = this.getUnitTileRange(unit)
      let unit_mid = range.mid;
      unit_mid.x *= options.game_data.tile_size;
      unit_mid.y *= options.game_data.tile_size;      

      let dist = Math.round(Math.sqrt(Math.pow(start.x - unit_mid.x, 2) + Math.pow(start.y - unit_mid.y, 2)),0)
      let max_dist = ((options.blast_radius * options.game_data.tile_size) / 2);
      // console.log(dist, max_dist)
      
      return (
          dist <= max_dist
      )
    })     
  }

  checkAttackingUnits = (options) => {
      
    let start = {
      x: options.start.x * options.game_data.tile_size ,
      y: options.start.y * options.game_data.tile_size            
    }
    // console.log(start)

    //USE LODASH TO SEARCH FOR ALL UNITS THAT CENTER POSITION IS WITHIN THE BLAST RADIUS
    return _.filter(options.game_data.units, (unit) => {
     
      // return unit.id <= 5;
      
      if(options.unit.id != unit.id && options.unit.side != unit.side){
        
        let range = this.getUnitTileRange(unit)
        let unit_mid = range.mid;
        unit_mid.x *= options.game_data.tile_size;
        unit_mid.y *= options.game_data.tile_size;      
  
        let dist = Math.round(Math.sqrt(Math.pow(start.x - unit_mid.x, 2) + Math.pow(start.y - unit_mid.y, 2)),0)
        let max_dist = 0 
        
        //GET WEAPON DETAILS
        let melee = unit.melee_class[unit.selected_melee]     

        if(melee){
            //IF TARGETS AVAILABLE TO SET
            max_dist = melee.range;
        }        
        
        return dist <= max_dist
      }
      
    })     
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
      
      let steps = 0.25
      let multiplier = 1 / steps

      //GET THE X ITTERATIONS AND Y RELATED POSITIONS
      let x_path = []
      if(n_width !== 0){      
        itts = n_width

        x_itt = steps
        y_itt = n_height / ((n_width) * multiplier)
        total_itts = (itts*multiplier)+1
        
        x_path = _.times(total_itts, (i) => {
        return {
          x:start.x+((i*x_itt) * x_dir)
          ,y:start.y+((i*y_itt) * y_dir)
          ,tileX: Math.floor(start.x+((i*x_itt) * x_dir))
          ,tileY: Math.floor(start.y+((i*y_itt) * y_dir)) 
        }})
      }      

      //GET THE Y ITTERATIONS AND Z RELATED POSITIONS
      let y_path = []
      if(n_height !== 0){
        itts = n_height

        x_itt = n_width / ((n_height) * multiplier)
        y_itt = steps
        total_itts = (itts*multiplier)+1

        y_path = _.times(total_itts, (i) => {
        return {
          x:start.x+((i*x_itt) * x_dir)
          ,y:start.y+((i*y_itt) * y_dir)
          ,tileX: Math.floor(start.x+((i*x_itt) * x_dir))
          ,tileY: Math.floor(start.y+((i*y_itt) * y_dir))       
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
      // .uniqBy((e) => {
      //   return e.x + '_' + e.y;
      // })
      .orderBy(['x', 'y'], order_rank)
      .value()  
  }



}
