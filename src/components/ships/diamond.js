import Ship from './ship';
import { over } from 'lodash';

export default class Diamond extends Ship {
  constructor(x, y, two, map) {
    super(x, y, two, map);

    this.size = 40;
    this.movementSpeedX = 0.002 + (Math.random() * 0.004);
    this.movementSpeedY = 0.002 + (Math.random() * 0.004);
    this.shape.stroke = 'cyan';

    this.init();
  }

  init() {
    this.path = new Two.Path([
      new Two.Anchor(0, -20),
      new Two.Anchor(20, 0),
      new Two.Anchor(0, 20),
      new Two.Anchor(-20, 0)
    ], true, false);

    this.replaceShape(this.path);


    super.init();
  }
    
  animate(frames) {
    if (!this.dying) {
      this.shape.vertices[0].y = (Math.sin((frames + this.animateOffset) * this.animationSpeed) * 5) - 20;
      this.shape.vertices[1].x = (Math.sin((frames + this.animateOffset) * this.animationSpeed) * 5) + 20;
      this.shape.vertices[2].y = (Math.sin((frames + this.animateOffset) * this.animationSpeed) * -5) + 20;
      this.shape.vertices[3].x = (Math.sin((frames + this.animateOffset) * this.animationSpeed) * -5) - 20;

      let move_x = Math.max(-1 * this.maxSpeed, Math.min(this.maxSpeed, (this.targetX - this.shape.translation.x) * this.movementSpeedX));
      let move_y = Math.max(-1 * this.maxSpeed, Math.min(this.maxSpeed, (this.targetY - this.shape.translation.y) * this.movementSpeedY));

      this.shape.translation.x += move_x;
      this.shape.translation.y += move_y;
    } else {
      this.decomp();
    }
    
    return false;
  }
}