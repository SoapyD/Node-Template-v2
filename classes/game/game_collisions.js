
// code sourced from here: https://www.jeffreythompson.org/collision-detection/table_of_contents.php

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

        this.depth = 30;
		this.graphics = [];
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


}
