
module.exports = class u_line {
    constructor(options) {
        this.points = options.points;
    };
  
    slope() {
        var slope;
  
        if (this.points[1].x !== this.points[0].x)
            slope = (this.points[1].y - this.points[0].y) / (this.points[1].x - this.points[0].x);
        else
            slope = false;
  
        return slope;
    };
  
    yInt() {
        if (this.points[0].x === this.points[1].x) return this.points[0].x === 0 ? 0 : false;
        if (this.points[0].y === this.points[1].y) return this.points[0].y;
        return this.points[0].y - this.slope() * this.points[0].x;
    };
  
    xInt() {
        if (this.points[0].y === this.points[1].y) return this.points[0].y === 0 ? 0 : false;
        if (this.points[0].x === this.points[1].x) return this.points[0].x;
        return (-1 * this.yInt())/ this.slope();
    };
  
    // onSegment(x) {
    //     return (this.points[0].x <= x && x <= this.points[1].x);
    // };
  
    // collide(other) {
    //     if (this.slope() === other.slope()) return false;
  
    //     var intersect = {};
    //     intersect.x = (other.yInt() - this.yInt()) / (this.slope() - other.slope());
    //     intersect.y = this.slope() * intersect.x + this.yInt();
  
    //     return intersect;
    // };
  
    circleCollide(circle) {
        var slope = this.slope();
        var yInt = this.yInt();
        var a = 1 + slope * slope;
        var b = 2 * (slope * (yInt - circle.y) - circle.x);
        var c = circle.x * circle.x + (yInt - circle.y) * (yInt - circle.y) - circle.r * circle.r;
  
        var d = b * b - 4 * a * c;
  
        if (d === 0) {
            return [(-b + Math.sqrt(d)) / (2 * a)];
        } else if (d > 0) {
            return [(-b + Math.sqrt(d)) / (2 * a), (-b - Math.sqrt(d)) / (2 * a)];
        } 
  
        return [];
    }

    convertPointsToPos(xPoints) {
        let points = []
        for (var i = 0; i < xPoints.length; i++) {
            // console.log(xPoints[i], this.slope() * xPoints[i] + this.yInt());
            points.push({
                x: xPoints[i],
                y: this.slope() * xPoints[i] + this.yInt()
            })
        }        

        return points;
    }
  }