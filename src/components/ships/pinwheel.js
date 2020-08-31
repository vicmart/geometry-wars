import Ship from "./ship";

export default class Pinwheel extends Ship {
  constructor(x, y, two) {
    super(x, y, two);
    this.shape.stroke = '#8A2BE2';

    this.init();
  }

  init() {
    this.replaceShape(new Two.Path([
      new Two.Anchor(0, 0),
      new Two.Anchor(-22, -22),
      new Two.Anchor(0, -22),
      new Two.Anchor(0, 0),
      new Two.Anchor(22, -22),
      new Two.Anchor(22, 0),
      new Two.Anchor(0, 0),
      new Two.Anchor(22, 22),
      new Two.Anchor(0, 22),
      new Two.Anchor(0, 0),
      new Two.Anchor(-22, 22),
      new Two.Anchor(-22, 0),
      new Two.Anchor(0, 0)
    ], true, false));

    super.init();
  }
    
  animate(frames) {
    this.shape.rotation = (frames + this.animateOffset) * this.animationSpeed;

    return false;
  }
}