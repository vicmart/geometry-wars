import Ship from "./ship";

export default class Bullet extends Ship {
  constructor(two, x, y, targetX, targetY) {
    super(x, y, two);

    this.shape.stroke = '#FFA500';
    this.movementSpeed = 10;

    this.targetX = targetX;
    this.targetY = targetY;
    
    let x_diff = this.targetX - this.shape.translation.x;
    let y_diff = this.targetY - this.shape.translation.y;

    this.targetRot = Math.atan(y_diff/x_diff) + Math.PI/2;

    if (x_diff < 0) {
      this.targetRot -= Math.PI;
    }
    
    this.shape.rotation = this.targetRot;
  
    this.init();
  }

  init() {
    this.replaceShape(new Two.Path([
      new Two.Anchor(0, -5),
      new Two.Anchor(3, 3),
      new Two.Anchor(2, 4),
      new Two.Anchor(-2, 4),
      new Two.Anchor(-3, 3),
  ], true, false));

    super.init();
  }
    
  animate(seconds) {
    let diff_x = this.shape.translation.x - this.targetX;
    let diff_y = this.shape.translation.y - this.targetY;
    
    if (Math.abs(diff_x) < this.movementSpeed) {
        
    } else if (diff_x > 0) {
      this.shape.translation.x -= this.movementSpeed;
    } else {
      this.shape.translation.x += this.movementSpeed;            
    }
    
    if (Math.abs(diff_y) < this.movementSpeed) {
        
    } else if (diff_y > 0) {
      this.shape.translation.y -= this.movementSpeed;
    } else {
      this.shape.translation.y += this.movementSpeed;
    }
    
    if (Math.abs(diff_x) < this.movementSpeed && Math.abs(diff_y) < this.movementSpeed) {
      two.remove(this.shape);
      this.shape = undefined;
      return true;
    }
    
    return false;
  }
}