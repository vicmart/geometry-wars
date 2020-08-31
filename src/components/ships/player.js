import Ship from './ship.js';
import Bullet from './bullet.js';
import BasicMath from '../utilities/math.js';

export default class Player extends Ship {
  constructor(x, y, two, map, controller) {
    super(x, y, two);

    this.two.scene.translation.x = window.innerWidth/2 - x;
    this.two.scene.translation.y = window.innerHeight/2 - y;

    this.maxSpeed = 5;
    this.movementSpeed = 0.06;
    this.rotationSpeed = 0.5;
    this.size = 40;
    this.triggerAction = true;
    this.animating = false;
    this.animateStart = 0;
    this.bulletRate = 7;

    this.map = map;
    this.controller = controller;

    this.bulletRotation = 0;
    this.bulletCooldown = new Date().getTime();

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

  animate(frames) {  
    if (this.controller.a_press && !this.controller.d_press) {
      this.targetX -= 10;
    } else if (this.controller.d_press && !this.controller.a_press) {
      this.targetX += 10;
    }

    if (this.controller.w_press && !this.controller.s_press) {
      this.targetY -= 10;
    } else if (this.controller.s_press && !this.controller.w_press) {
      this.targetY += 10;
    }

    let new_bullet = false;
    let horizontal_rotation = -1;
    let vertical_rotation = -1;

    if (this.controller.up_press && !this.controller.down_press) {
      new_bullet = true;
      vertical_rotation = 3 * Math.PI/2;
    } else if (this.controller.down_press && !this.controller.up_press) {
      new_bullet = true;
      vertical_rotation = Math.PI/2;
    }

    if (this.controller.right_press && !this.controller.left_press) {
      new_bullet = true;
      horizontal_rotation = 0;
    } else if (this.controller.left_press && !this.controller.right_press) {
      new_bullet = true;
      horizontal_rotation = Math.PI;
    }

    let total_rotation = 0;

    if (horizontal_rotation != -1 && vertical_rotation != -1) {
      total_rotation = (horizontal_rotation + vertical_rotation) / 2;
      if (horizontal_rotation == 0 && vertical_rotation == 3 * Math.PI/2) {
        total_rotation = 7 * Math.PI / 4;
      }
    } else if (horizontal_rotation != -1) {
      total_rotation = horizontal_rotation;      
    } else if (vertical_rotation != -1) {
      total_rotation = vertical_rotation;      
    }

    this.alterBulletRotation(total_rotation);

    let move_x = (this.targetX - this.shape.translation.x) * this.movementSpeed;
    let move_y = (this.targetY - this.shape.translation.y) * this.movementSpeed;

    if (new_bullet) {
      let now = new Date().getTime();

      if (this.bulletCooldown - now < 0) {
        let vector_from_center = {x: Math.cos(this.bulletRotation) * this.size/4, y: Math.sin(this.bulletRotation) * this.size/4};
        let vector_perp_center = BasicMath.perpendicular(vector_from_center);

        let bullet1 = new Bullet(this.shape.translation.x + vector_from_center.x + (vector_perp_center.x * 1), this.shape.translation.y + vector_from_center.y + (vector_perp_center.y * 1) - 1, this.two, this.map, this.bulletRotation, move_x, move_y);
        bullet1.animateFunction = (frameCount) => { bullet1.animate(frameCount)};
        this.two.bind('update', bullet1.animateFunction);

        let bullet2 = new Bullet(this.shape.translation.x + vector_from_center.x + (vector_perp_center.x * -1), this.shape.translation.y + vector_from_center.y + (vector_perp_center.y * -1) - 1, this.two, this.map, this.bulletRotation, move_x, move_y);
        bullet2.animateFunction = (frameCount) => { bullet2.animate(frameCount)};
        this.two.bind('update', bullet2.animateFunction);

        this.bulletCooldown = now + 50;
      }
    }
    
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
    
    return false;
  }

  alterBulletRotation(target) {
    let target_x = Math.cos(target);
    let target_y = Math.sin(target);

    let current_x = Math.cos(this.bulletRotation);
    let current_y = Math.sin(this.bulletRotation);

    let reach_speed = 4;
    if (Math.abs(target_x + current_x) < 0.00001 || Math.abs(target_y + current_y) < 0.00001) reach_speed = 1;

    current_x += (target_x - current_x) / reach_speed;
    current_y += (target_y - current_y) / reach_speed;

    this.bulletRotation = Math.atan2(current_y, current_x);
  }
}