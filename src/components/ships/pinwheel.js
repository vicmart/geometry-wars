import Ship from "./ship";

export default class Pinwheel extends Ship {
  constructor(x, y, two) {
    super(x, y, two);
    this.shape.stroke = '#8A2BE2';
    this.size = 44;

    this.init();
  }

  init() {
    this.path = new Two.Path([
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
      new Two.Anchor(-22, 0)
    ], true, false);

    this.replaceShape(this.path);

    super.init();
  }
    
  animate(frames) {
    if (!this.dying) {
      this.shape.rotation = (frames + this.animateOffset) * this.animationSpeed;
    } else {
      this.decomp();
    }

    return false;
  }
}