import Ship from './ship';

export default class Square extends Ship {
  constructor(x, y, two) {
    super(x, y, two);

    this.movementSpeedX = 0.004 + (Math.random() * 0.002);
    this.movementSpeedY = 0.004 + (Math.random() * 0.002);
    this.shape.stroke = '#49fb35';

    this.init();
  }

  init() {
    let small_shape = new Two.Path([
      new Two.Anchor(-20, 0),
      new Two.Anchor(0, -20),
      new Two.Anchor(20, 0),
      new Two.Anchor(0, 20)
    ], true, false);
  
    let big_shape = new Two.Path([
      new Two.Anchor(-20, -20),
      new Two.Anchor(20, -20),
      new Two.Anchor(20, 20),
      new Two.Anchor(-20, 20),
      new Two.Anchor(-20, -20)
    ], true, false);
    
    this.replaceShape(this.two.makeGroup(small_shape, big_shape));

    super.init();
  }
    
  animate(frames) {
    this.shape.rotation = Math.sin((frames + this.animateOffset) * this.animationSpeed) * 0.5;
    
    return false;
  }
}