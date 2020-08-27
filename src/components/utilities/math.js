export default class BasicMath {
  static sqr(x) { 
    return x * x;
  }

  static dist2(v, w) { 
    return this.sqr(v.x - w.x) + this.sqr(v.y - w.y);
  }

  static dot(v, w) {
    return (v.x * w.x) + (v.y * w.y);
  }

  static mag(v) {
    return Math.sqrt(this.sqr(v.x) + this.sqr(v.y));
  }

  static scalar(a, v) {
    return {x: v.x * a, y: v.y * a};
  }

  static perpendicular(v) {
    return {x: v.y, y: -v.x};
  }

  static add(v, w) {
    return {x: v.x + w.x, y: v.y + w.y};
  }

  static subtract(v, w) {
    return {x: v.x - w.x, y: v.y - w.y};
  }

  static print(v) {
    return "[x: " + v.x.toFixed(2) + " y: " + v.y.toFixed(2) + " ]";
  }

  static angleBetween(v, w) {
    return Math.atan2(w.y - v.y, w.x - v.x);
  }

  static turnVector(v, a) {
    let vectorAngle = Math.atan2(v.y, v.x); 
    let vectorMagnitude = this.mag(v);
    return {x: Math.cos(vectorAngle + a) * vectorMagnitude, y: Math.sin(vectorAngle + a) * vectorMagnitude};
  }

  static distToSegmentSquared(p, v, w) {
    let l2 = this.dist2(v, w);

    if (l2 == 0) {
      return this.dist2(p, v);
    }
    
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

    t = Math.max(0, Math.min(1, t));
    
    return { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
  }

  static distToSegment(p, v, w) { 
    return Math.sqrt(this.distToSegmentSquared(p, v, w)); 
  }

  static distToLineSquared(p, v, w) {
    let l2 = this.dist2(v, w);

    if (l2 == 0) {
      return this.dist2(p, v);
    }
    
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

    return this.dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y)});
  }

  static distToLine(p, v, w) { 
    return Math.sqrt(this.distToLineSquared(p, v, w)); 
  }

  static getIntersectionVectorPoints(p, v, w) {
    let perpendicular = BasicMath.perpendicular(BasicMath.add(v, w));
    let point1 = BasicMath.add(p, perpendicular);
    
    return [p, point1];
  }
}