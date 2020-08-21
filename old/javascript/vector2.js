function Vector2(x, y) 
{
    this.x = x;
    this.y = y;
}
Vector2.prototype.add = function(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
};
Vector2.prototype.subtract = function(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
};
Vector2.prototype.scale = function(scalar) {
    return new Vector2(this.x*scalar, this.y*scalar);
};
Vector2.prototype.normalized = function() {
    var magnitude = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return new Vector2(this.x/magnitude, this.y/magnitude);
};
Vector2.prototype.dot = function(other) {
    return this.x*other.x + this.y*other.y;
};
/*
Vector2.prototype.closestPointOnLine = function(pt1, pt2)
{
    var A = this.subtract(pt1);
    var u = pt2.subtract(pt1).normalized();
    
    return pt1.add(u.scale(A.dot(u)));
}
*/
Vector2.prototype.closestPointOnLine = function(pt1, pt2) {
    function dist2(pt1, pt2) { 
        return Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2);
    }
    
    var l2 = dist2(pt1, pt2);
    if (l2 == 0) 
        return dist2(this, v);
    
    var t = ((this.x - pt1.x) * (pt2.x - pt1.x) + (this.y - pt1.y) * (pt2.y - pt1.y)) / l2;
    
    if (t < 0) 
        return pt1;
    if (t > 1) 
        return pt2;
    
    return new Vector2(pt1.x + t * (pt2.x - pt1.x), pt1.y + t * (pt2.y - pt1.y));
}
Vector2.prototype.vector2Args = function(x, y) {
    x = x || 0;
    y = y || 0;
    return [this.x + x, this.y + y];
};

