import Ship from './ship';

export default class Diamond extends Ship {
  constructor(x, y, two) {
    super(x, y, two);

    this.movementSpeedX = 0.004 + (Math.random() * 0.002);
    this.movementSpeedY = 0.004 + (Math.random() * 0.002);
    this.shape.stroke = 'cyan';

    this.init();
  }

  init() {
    this.replaceShape(new Two.Path([
      new Two.Anchor(0, -20),
      new Two.Anchor(20, 0),
      new Two.Anchor(0, 20),
      new Two.Anchor(-20, 0)
    ], true, false));


    super.init();
  }
    
  animate(seconds) {
    this.shape.vertices[0].y = (Math.sin(seconds + this.animateOffset) * 5) - 20;
    this.shape.vertices[1].x = (Math.sin(seconds + this.animateOffset) * 5) + 20;
    this.shape.vertices[2].y = (Math.sin(seconds + this.animateOffset) * -5) + 20;
    this.shape.vertices[3].x = (Math.sin(seconds + this.animateOffset) * -5) - 20;

    this.shape.translation.x += (this.targetX - this.shape.translation.x) * this.movementSpeedX;
    this.shape.translation.y += (this.targetY - this.shape.translation.y) * this.movementSpeedY;
    
    return false;
  }
}