function sqr(x) { 
    return x * x;
}

function dist2(v, w) { 
    return sqr(v.x - w.x) + sqr(v.y - w.y);
}

function dot(v, w) {
    return (v.x * w.x) + (v.y * w.y);
}

function mag(v) {
    return Math.sqrt(sqr(v.x) + sqr(v.y));
}

function scalar(a, v) {
    return {x: v.x * a, y: v.y * a};
}

function subtract(v, w) {
    return {x: v.x - w.x, y: v.y - w.y};
}

function print(v) {
    return "[x: " + v.x.toFixed(2) + " y: " + v.y.toFixed(2) + " ]";
}

function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
  
    if (l2 == 0) {
      return dist2(p, v);
    }
    
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

    t = Math.max(0, Math.min(1, t));
    
    return { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
}

function distToSegment(p, v, w) { 
    return distToSegmentSquared(p, v, w); 
}