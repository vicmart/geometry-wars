import Ship from "./ship";

export default class Envelope extends Ship {
  constructor(x, y, scale, two) {
    super(x, y, two);
    this.shape.stroke = '#FF00FF';
    this.shape.scale = scale;

    this.init();
  }

  init() {
    let x_shape = new Two.Path([
      new Two.Anchor(0, 0),
      new Two.Anchor(-20, -20),
      new Two.Anchor(0, 0),
      new Two.Anchor(20, 20),
      new Two.Anchor(0, 0),
      new Two.Anchor(20, -20),
      new Two.Anchor(0, 0),
      new Two.Anchor(-20, 20),
      new Two.Anchor(0, 0)
    ], true, false);
  
    let square_shape = new Two.Path([
      new Two.Anchor(-20, -20),
      new Two.Anchor(20, -20),
      new Two.Anchor(20, 20),
      new Two.Anchor(-20, 20),
      new Two.Anchor(-20, -20),
    ], true, false);

    this.replaceShape(this.two.makeGroup(x_shape, square_shape));

    super.init();
  }
    
  animate(seconds) {
    this.shape.rotation = Math.sin(seconds + this.animateOffset);

    return false;
  }
}