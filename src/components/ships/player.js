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

    let in_polygon = Collision.pointInPolygon([px, py], this.boundaries);
                
    if (!in_polygon) {
      let least_dist = -1;
      let least_index = -1;
      let least_point = {x: 0, y: 0};
      
      for (let i = 0; i < this.map.shape.vertices.length; i++) {
        let x = this.map.shape.vertices[i].x * this.map.shape.scale;
        let y = this.map.shape.vertices[i].y * this.map.shape.scale;
        let nx = this.map.shape.vertices[0].x * this.map.shape.scale;
        let ny = this.map.shape.vertices[0].y * this.map.shape.scale;

        if (i < this.map.shape.vertices.length - 1) {
          nx = this.map.shape.vertices[i + 1].x * this.map.shape.scale;
          ny = this.map.shape.vertices[i + 1].y * this.map.shape.scale;                
        }

        let closest_point = BasicMath.distToSegment({x: px, y: py}, {x: x, y: y}, {x: nx, y: ny});
        let dist = Math.sqrt(BasicMath.dist2({x: px, y: py}, closest_point));
        
        if (dist < least_dist || least_index == -1) {
          least_dist = dist;
          least_index = i;
          least_point = closest_point;
        }
      }

      //console.log(least_point);
      
      let x = this.map.shape.vertices[least_index].x * this.map.shape.scale;
      let y = this.map.shape.vertices[least_index].y * this.map.shape.scale;
      let nx = this.map.shape.vertices[0].x * this.map.shape.scale;
      let ny = this.map.shape.vertices[0].y * this.map.shape.scale;

      if (least_index < this.map.shape.vertices.length - 1) {
        nx = this.map.shape.vertices[least_index + 1].x * this.map.shape.scale;
        ny = this.map.shape.vertices[least_index + 1].y * this.map.shape.scale;                
      }

      let b_vec = {x: -(ny - y), y: nx - x};
      b_vec = BasicMath.scalar(-1 / BasicMath.mag(b_vec), b_vec);

      let a_vec = {x: move_x, y: move_y};
      let a_proj = BasicMath.scalar(BasicMath.dot(a_vec, b_vec) / (BasicMath.mag(b_vec) * BasicMath.mag(b_vec)), b_vec);

      let a_perp = BasicMath.subtract(a_vec, a_proj);
      move_x = a_perp.x;
      move_y = a_perp.y;

      let new_a_vec = {x: this.targetX - least_point.x, y: this.targetY - least_point.y};
      let new_b_vec = {x: nx - x, y: ny - y};
      new_b_vec = BasicMath.scalar(1 / BasicMath.mag(new_b_vec), new_b_vec);

      let new_a_proj = BasicMath.scalar(BasicMath.dot(new_a_vec, new_b_vec) / (BasicMath.mag(new_b_vec) * BasicMath.mag(new_b_vec)), new_b_vec);

      this.targetX = least_point.x + new_a_proj.x;
      this.targetY = least_point.y + new_a_proj.y;
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
  };  
}