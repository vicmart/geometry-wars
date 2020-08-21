import BasicMath from '../utilities/math.js';
import Collision from '../utilities/collision.js';
import Ship from './ship.js';

export default class Player extends Ship {
  constructor(x, y, two, map, controller) {
    super(x, y, two);

    this.two.scene.translation.x = window.innerWidth/2 - x;
    this.two.scene.translation.y = window.innerHeight/2 - y;

    this.movementSpeed = 0.06;
    this.rotationSpeed = 0.5;
    this.triggerAction = true;
    this.animating = false;
    this.animateStart = 0;
    this.bulletRate = 7;

    this.boundaries = [];

    this.map = map;
    this.controller = controller;

    this.init();
  }

  init() {
    this.replaceShape(new Two.Path([
      new Two.Anchor(0, -10),
      new Two.Anchor(18, 5),
      new Two.Anchor(8, 20),
      new Two.Anchor(12, 10),
      new Two.Anchor(0, 2),
      new Two.Anchor(-12, 10),
      new Two.Anchor(-8, 20),
      new Two.Anchor(-18, 5),
    ], true, false));

    this.shape.stroke = 'rgba(255, 255, 255, 1)';

    this.initializeBoundaries();

    super.init();
  }

  initializeBoundaries() {
    for (var i = 0; i < this.map.shape.vertices.length; i++) {
      let x = this.map.shape.vertices[i].x * this.map.shape.scale;
      let y = this.map.shape.vertices[i].y * this.map.shape.scale;
      
      this.boundaries[i] = [x, y];
    }
  }

  animate(seconds) {  
    if (this.controller.left_press && !this.controller.right_press) {
      this.targetX -= 10;
    } else if (this.controller.right_press && !this.controller.left_press) {
      this.targetX += 10;
    }

    if (this.controller.up_press && !this.controller.down_press) {
      this.targetY -= 10;
    } else if (this.controller.down_press && !this.controller.up_press) {
      this.targetY += 10;
    }
    
    let move_x = (this.targetX - this.shape.translation.x) * this.movementSpeed;
    let move_y = (this.targetY - this.shape.translation.y) * this.movementSpeed;

    let px = this.shape.translation.x + move_x;
    let py = this.shape.translation.y + move_y;

    let in_polygon = Collision.pointInPolygon([px, py], this.boundaries) && Collision.pointInPolygonPadding([px, py], this.boundaries, 20);
                
    if (!in_polygon) {
      [move_x, move_y] = this.mapCollision(px, py, move_x, move_y);
    }
    
    this.two.scene.translation.x -= move_x;
    this.two.scene.translation.y -= move_y;

    this.shape.translation.x += move_x;
    this.shape.translation.y += move_y;
    
    let x_diff = this.targetX - this.shape.translation.x;
    let y_diff = this.targetY - this.shape.translation.y;
    
    if(BasicMath.mag({x: x_diff, y: y_diff}) > 10) {
      this.targetRot = Math.atan(y_diff/x_diff) - Math.PI/2;
  
      if (x_diff < 0) {
        this.targetRot -= Math.PI;
      }

      if (this.targetRot > -Math.PI/2 && this.shape.rotation < -3 * Math.PI/2) {
        this.shape.rotation += Math.PI * 2;
      }

      if (this.shape.rotation > -Math.PI/2 && this.targetRot <= -3 * Math.PI/2) {
        this.shape.rotation -= Math.PI * 2;
      }

      if (!isNaN(this.targetRot)) {
        this.shape.rotation += (this.targetRot - this.shape.rotation) * this.rotationSpeed;
      }
    }
    
    return false;
  }

  mapCollision(px, py, move_x, move_y) {
    let least_index = [];
    let least_point = [];
    
    for (let i = 0; i < this.boundaries.length; i++) {
      let x = this.boundaries[i][0];
      let y = this.boundaries[i][1];
      let nx = this.boundaries[0][0];
      let ny = this.boundaries[0][1];

      if (i < this.boundaries.length - 1) {
        nx = this.boundaries[i + 1][0];
        ny = this.boundaries[i + 1][1];       
      }

      let closest_point = BasicMath.distToSegment({x: px, y: py}, {x: x, y: y}, {x: nx, y: ny});
      let dist = Math.sqrt(BasicMath.dist2({x: px, y: py}, closest_point));

      if (dist < 20) {
        least_index.push(i);
        least_point.push(closest_point);
      }
    }

    //console.log(least_point);

    let valid_move_found = false;
    
    for (let i = 0; i < least_index.length; i++) {
      let x = this.boundaries[least_index[i]][0];
      let y = this.boundaries[least_index[i]][1];
      let nx = this.boundaries[0][0];
      let ny = this.boundaries[0][1];
  
      if (least_index[i] < this.boundaries.length - 1) {
        nx = this.boundaries[least_index[i] + 1][0];
        ny = this.boundaries[least_index[i] + 1][1];     
      }
  
      // get boundary vector normalized
      let b_vec = {x: nx - x, y: ny - y};
      b_vec = BasicMath.scalar(1 / BasicMath.mag(b_vec), b_vec);
  
      // project onto boundary vector
      let a_vec = {x: move_x, y: move_y};
      let a_proj = BasicMath.scalar(BasicMath.dot(a_vec, b_vec) / (BasicMath.mag(b_vec) * BasicMath.mag(b_vec)), b_vec);
  
      let new_move_x = a_proj.x;
      let new_move_y = a_proj.y;
  
      // get boundary vector normalized
      let new_a_vec = {x: this.targetX - least_point[i].x, y: this.targetY - least_point[i].y};
      let new_b_vec = {x: nx - x, y: ny - y};
      new_b_vec = BasicMath.scalar(1 / BasicMath.mag(new_b_vec), new_b_vec);
  
      // project onto boundary vector
      let new_a_proj = BasicMath.scalar(BasicMath.dot(new_a_vec, new_b_vec) / (BasicMath.mag(new_b_vec) * BasicMath.mag(new_b_vec)), new_b_vec);
  
      let new_targetX = this.shape.translation.x + new_a_proj.x;
      let new_targetY = this.shape.translation.y + new_a_proj.y;

      if (Collision.pointInPolygon([new_targetX, new_targetY], this.boundaries) && Collision.pointInPolygonPadding([new_targetX, new_targetY], this.boundaries, 20)) {
        move_x = new_move_x;
        move_y = new_move_y;

        this.targetX = new_targetX;
        this.targetY = new_targetY;

        valid_move_found = true;

        break;
      }
    }

    if (!valid_move_found) {
      move_x = 0;
      move_y = 0;
      this.targetX = this.shape.translation.x;
      this.targetY = this.shape.translation.y;
      console.log('no move found');
    }

    return [move_x, move_y];
  }
}