import Ship from "./ship";

export default class Arrow extends Ship {
  constructor(x, y, two) {
    super(x, y, two);
    this.shape.stroke = '#FFA500';

    this.triggerAction = true;
    this.animating = false;
    this.animateStart = 0;
  
    this.init();
  }

  init() {
    this.replaceShape(new Two.Path([
      new Two.Anchor(0, -20),
      new Two.Anchor(15, 12),
      new Two.Anchor(8, 20),
      new Two.Anchor(4, 15),
      new Two.Anchor(0, 15),
      new Two.Anchor(-4, 15),
      new Two.Anchor(-8, 20),
      new Two.Anchor(-15, 12),
    ], true, false));

    super.init();
  }
    
  animate(seconds) {
    if (this.triggerAction) {
      this.animating = true;
      this.triggerAction = false;
      this.animateStart = seconds;
    }
  
    if (this.animating == true) {
      this.shape.rotation = (seconds - this.animateStart) * 4;
      
      if (seconds - this.animateStart >= Math.PI / 4) {
        this.animating = false;    
      }
    }

    return false;
  }
}