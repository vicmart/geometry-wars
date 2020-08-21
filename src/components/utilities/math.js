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

  static subtract(v, w) {
    return {x: v.x - w.x, y: v.y - w.y};
  }

  static print(v) {
    return "[x: " + v.x.toFixed(2) + " y: " + v.y.toFixed(2) + " ]";
  }

  static distToSegmentSquared(p, v, w) {
    var l2 = this.dist2(v, w);

    if (l2 == 0) {
      return this.dist2(p, v);
    }
    
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

    t = Math.max(0, Math.min(1, t));
    
    return { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
  }

  static distToSegment(p, v, w) { 
    return this.distToSegmentSquared(p, v, w); 
  }
}