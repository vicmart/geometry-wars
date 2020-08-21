import BasicMath from '../utilities/math.js';

export default class Collision {
  static pointInPolygonPadding(point, vs, padding) {
    let px = parseFloat(point[0]), py = parseFloat(point[1]);
    
    for (let i = 0; i < vs.length; i++) {
      let x = parseFloat(vs[i][0]);
      let y = parseFloat(vs[i][1]);
      let nx = parseFloat(vs[0][0]);
      let ny = parseFloat(vs[0][1]);

      if (i < vs.length - 1) {
        nx = parseFloat(vs[i + 1][0]);
        ny = parseFloat(vs[i + 1][1]);                
      }

      let closest_point = BasicMath.distToSegment({x: px, y: py}, {x: x, y: y}, {x: nx, y: ny});
      let dist = Math.sqrt(BasicMath.dist2({x: px, y: py}, closest_point));

      if (dist < padding) {
        return false;
      }
    }

    return true;
  };

  static pointInPolygon(point, vs) {
    let x = parseFloat(point[0]), y = parseFloat(point[1]);

    let wn = 0;

    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = parseFloat(vs[i][0]), yi = parseFloat(vs[i][1]);
      let xj = parseFloat(vs[j][0]), yj = parseFloat(vs[j][1]);

      if (yj <= y) {
        if (yi > y) {
          if (this.isLeft([xj, yj], [xi, yi], [x,y]) > 0) {
            wn++;
          }
        }
      } else {
        if (yi <= y) {
          if (this.isLeft([xj, yj], [xi, yi], [x, y]) < 0) {
            wn--;
          }
        }
      }
    }

    return wn != 0;
  };


  static isLeft(P0, P1, P2) {
    let res = ( (P1[0] - P0[0]) * (P2[1] - P0[1])
            - (P2[0] -  P0[0]) * (P1[1] - P0[1]) );
    return res;
  }
}