import Ship from "./ship";
import Explosion from "./../utilities/explosion";

export default class Bullet extends Ship {
  constructor(x, y, two, map, targetDirection, extraSpeedX, extraSpeedY) {
    super(x, y, two);

    this.size = 3;
    this.shape.stroke = '#FFA500';
    this.shape.linewidth = 3;

    this.direction = targetDirection;

    this.move_x = 15 * Math.cos(this.direction);
    this.move_y = 15 * Math.sin(this.direction);

    let extraSpeedXFactor = this.move_x < 0 ? -1 : 1;
    let extraSpeedYFactor = this.move_y < 0 ? -1 : 1;
    this.move_x += Math.max(0, extraSpeedX * extraSpeedXFactor) * Math.cos(this.direction);
    this.move_y += Math.max(0, extraSpeedY * extraSpeedYFactor) * Math.sin(this.direction);

    this.targetRot = this.direction + Math.PI/2;
    
    this.shape.rotation = this.targetRot;

    this.map = map;

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

    this.shape.rotation = this.targetRot;

    this.visible = true;
    this.two.add(this.shape);

    this.animateFunction = (frameCount) => { this.animate(frameCount)};
  }

  destruct() {
    this.removeSelf();
    this.dying = true;
    this.garbageCollect();
    this.two.remove(this.shape);
  }
    
  animate(frames) {
    if (!this.map.validPosition(this.shape.translation.x + this.move_x, this.shape.translation.y + this.move_y, this)) {
      new Explosion(this.two, this.shape.translation.x, this.shape.translation.y, this.shape.stroke, 0.5);
      this.destruct();
      return true;
    }

    this.shape.translation.x += this.move_x;
    this.shape.translation.y += this.move_y;

    if (this.two.camera.visible(this.shape.translation.x, this.shape.translation.y, this.size, this.size)) {
      if (!this.visible && !this.dying) {
        this.two.add(this.shape);
        this.visible = true;
      }
    } else {
      if (this.visible) {
        this.two.remove(this.shape);
        this.visible = false;
      }
    }

    return false;
  }
}