module.exports = class circle {
	constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.r = options.r;	   
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
    
    circleCircle(circle) {

        // get distance between the circle's centers
        // use the Pythagorean Theorem to compute the distance
        let distX = this.x - circle.x;
        let distY = this.y - circle.y;
        let distance = Math.sqrt( (distX*distX) + (distY*distY) );
        
        // if the distance is less than the sum of the circle's
        // radii, the circles are touching!
        if (distance <= this.r+circle.r) {
            return true;
        }
        return false;
    }

    lineCircle(x1, y1, x2, y2) {
    // boolean lineCircle(float x1, float y1, float x2, float y2, float cx, float cy, float r) {

        // is either end INSIDE the circle?
        // if so, return true immediately
        let inside1 = this.pointCircle(x1,y1, this.x,this.y,this.r);
        let inside2 = this.pointCircle(x2,y2, this.x,this.y,this.r);
        if (inside1 || inside2) return true;
    
        // get length of the line
        let distX = x1 - x2;
        let distY = y1 - y2;
        let len = Math.sqrt( (distX*distX) + (distY*distY) );
    
        // get dot product of the line and circle
        let dot = ( ((this.x-x1)*(x2-x1)) + ((this.y-y1)*(y2-y1)) ) / Math.pow(len,2);
    
        // find the closest point on the line
        let closestX = x1 + (dot * (x2-x1));
        let closestY = y1 + (dot * (y2-y1));
    
        // is this point actually on the line segment?
        // if so keep going, but if not, return false
        let onSegment = this.linePoint(x1,y1,x2,y2, closestX,closestY);
        if (!onSegment) return false;
    
        // get distance to closest point
        distX = closestX - this.x;
        distY = closestY - this.y;
        let distance = Math.sqrt( (distX*distX) + (distY*distY) );
    
        if (distance <= this.r) {
            return true;
        }
        return false;
    }    

    // POINT/CIRCLE
    pointCircle(px, py) {
        // get distance between the point and circle's center
        // using the Pythagorean Theorem
        let distX = px - this.x;
        let distY = py - this.y;
        let distance = Math.sqrt( (distX*distX) + (distY*distY) );

        // if the distance is less than the circle's
        // radius the point is inside!
        if (distance <= this.r) {
            return true;
        }
        return false;
    }  

}
