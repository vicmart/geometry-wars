import BasicMath from './utilities/math.js';
import Collision from './utilities/collision.js';

export default class Map {
  constructor(two) {
    this.two = two;
    this.alpha_config();
  }

  alpha_config() {
    this.shape = new Two.Path([
      new Two.Anchor(0, 0),
      new Two.Anchor(200, 0),
      new Two.Anchor(200, 200),
      new Two.Anchor(400, 400),
      new Two.Anchor(500, 400),
      new Two.Anchor(500, 0),
      new Two.Anchor(600, 0),
      new Two.Anchor(700, 100),
      new Two.Anchor(900, 100),
      new Two.Anchor(1000, 500),
      new Two.Anchor(1100, 500),
      new Two.Anchor(1100, 0),
      new Two.Anchor(1250, 0),
      new Two.Anchor(1250, 700),
      new Two.Anchor(800, 700),
      new Two.Anchor(800, 400),
      new Two.Anchor(600, 400),
      new Two.Anchor(600, 600),
      new Two.Anchor(300, 600),
      new Two.Anchor(0, 200)
      /**new Two.Anchor(10, 10),
      new Two.Anchor(200, 10),
      new Two.Anchor(200, 200),
      new Two.Anchor(10, 200)**/
    ], true, false);
      
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = '#49fb35';
    this.shape.linewidth = 3;
    this.shape.scale = 3;

    this.two.add(this.shape);
    this.two.update();

    this.enemy_path = [{x: 100, y: 100},
      {x: 100, y: 200},
      {x: 350, y: 500},
      {x: 550, y: 500},
      {x: 550, y: 250},
      {x: 850, y: 250},
      {x: 900, y: 600},
      {x: 1175, y: 600},
      {x: 1175, y: 100}];

    for (let point of this.enemy_path) {
      point.x = point.x * this.shape.scale;
      point.y = point.y * this.shape.scale;
    }

    let enemy_path_shape_array = [];
    for (let point of this.enemy_path) {
      enemy_path_shape_array.push(new Two.Anchor(point.x, point.y));
    }

    let enemy_path_shape = new Two.Path(enemy_path_shape_array, true, false);

    enemy_path_shape.fill = 'rgba(0, 0, 0, 0)';
    enemy_path_shape.stroke = 'white';
    enemy_path_shape.linewidth = 3;
    enemy_path_shape.scale = 1;

    this.two.add(enemy_path_shape);
    this.two.update();

    this.initializeBoundaries();
  }

  initializeBoundaries() {
    this.boundaries = [];

    for (var i = 0; i < this.shape.vertices.length; i++) {
      let x = this.shape.vertices[i].x * this.shape.scale;
      let y = this.shape.vertices[i].y * this.shape.scale;
      
      this.boundaries[i] = [x, y];
    }
  }

  collision(px, py, move_x, move_y, ship) {
    let valid_position = Collision.pointInPolygonPadding([px, py], this.boundaries, ship.size) && Collision.pointInPolygon([px, py], this.boundaries);
    if (valid_position) return [move_x, move_y, ship.targetX, ship.targetY];

    let least_index = [];
    let least_point = [];
    let mb = this.boundaries;
    let targetX = this.targetX;
    let targetY = this.targetY;
    
    for (let i = 0; i < mb.length; i++) {
      let [x, y] = [mb[i][0], mb[i][1]];
      let [nx, ny] = [mb[0][0], mb[0][1]];
      if (i < mb.length - 1) [nx, ny] = [mb[i + 1][0], mb[i + 1][1]];

      let closest_point = BasicMath.distToSegmentSquared({x: px, y: py}, {x: x, y: y}, {x: nx, y: ny});
      let dist = Math.sqrt(BasicMath.dist2({x: px, y: py}, closest_point));

      if (dist < ship.size) {
        least_index.push(i);
        least_point.push(closest_point);
      }
    }

    let valid_move_found = false;
    
    for (let i = 0; i < least_index.length; i++) {
      let [x, y] = [mb[least_index[i]][0], mb[least_index[i]][1]];
      let [nx, ny] = [mb[0][0], mb[0][1]];  
      if (least_index[i] < mb.length - 1) [nx, ny] = [mb[least_index[i] + 1][0], mb[least_index[i] + 1][1]];  
  
      // get boundary vector normalized
      let b_vec = {x: nx - x, y: ny - y};
      b_vec = BasicMath.scalar(1 / BasicMath.mag(b_vec), b_vec);
  
      // project onto boundary vector
      let a_vec = {x: move_x, y: move_y};
      let a_proj = BasicMath.scalar(BasicMath.dot(a_vec, b_vec) / (BasicMath.mag(b_vec) * BasicMath.mag(b_vec)), b_vec);
  
      let [new_move_x, new_move_y] = [a_proj.x, a_proj.y];
      let [new_px, new_py] = [ship.shape.translation.x + new_move_x, ship.shape.translation.y + new_move_y];

      if (Collision.pointInPolygon([new_px, new_py], mb) && Collision.pointInPolygonPadding([new_px, new_py], mb, 20)) {
        // determine new target projected onto normalized bounary vector
        let new_a_vec = {x: ship.targetX - least_point[i].x, y: ship.targetY - least_point[i].y};
        let new_a_proj = BasicMath.scalar(BasicMath.dot(new_a_vec, b_vec) / (BasicMath.mag(b_vec) * BasicMath.mag(b_vec)), b_vec);
        let [new_target_x, new_target_y] = [ship.shape.translation.x + new_a_proj.x, ship.shape.translation.y + new_a_proj.y];
        
        [move_x, move_y] = [new_move_x, new_move_y];
        [targetX, targetY] = [new_target_x, new_target_y];

        valid_move_found = true;

        break;
      }
    }

    if (!valid_move_found) {
      [move_x, move_y] = [0, 0];
      [targetX, targetY] = [ship.shape.translation.x, ship.shape.translation.y];
    }

    return [move_x, move_y, targetX, targetY];
  }

  determineEnemyPathPosition(shape) {
    let vs = this.enemy_path;
    let least_dist = -1;
    let least_index = -1;
    let px = shape.translation.x;
    let py = shape.translation.y;

    for (let i = 0; i < vs.length - 1; i++) {
      let [x, y] = [parseFloat(vs[i].x), parseFloat(vs[i].y)];
      let [nx, ny] = [parseFloat(vs[i + 1].x), parseFloat(vs[i + 1].y)];

      let closest_point = BasicMath.distToSegmentSquared({x: px, y: py}, {x: x, y: y}, {x: nx, y: ny});
      let dist = Math.sqrt(BasicMath.dist2({x: px, y: py}, closest_point));

      if (dist < least_dist || least_index == -1) {
        least_index = i;
        least_dist = dist;
      }
    }

    return least_index;
  }
}