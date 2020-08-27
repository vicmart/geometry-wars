import Ship from './ship.js';
import BasicMath from '../utilities/math.js';

export default class Player extends Ship {
  constructor(x, y, two, map, controller) {
    super(x, y, two);

    this.two.scene.translation.x = window.innerWidth/2 - x;
    this.two.scene.translation.y = window.innerHeight/2 - y;

    this.movementSpeed = 0.06;
    this.rotationSpeed = 0.5;
    this.size = 20;
    this.triggerAction = true;
    this.animating = false;
    this.animateStart = 0;
    this.bulletRate = 7;

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

    super.init();
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
    [move_x, move_y, this.targetX, this.targetY] = this.map.collision(px, py, move_x, move_y, this);
    
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

    this.determineEnemyPathPosition();
    
    return false;
  }

  determineEnemyPathPosition() {
    let least_index = this.map.determineEnemyPathPosition(this.shape);
    this.map.active_enemy_path_segment = least_index;
  }
}