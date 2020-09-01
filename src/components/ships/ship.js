import BasicMath from '../utilities/math.js';

export default class Ship {  
  constructor(x, y, two, map) {
    this.two = two;
    this.map = map;
    this.animationSpeed = 0.02;
    this.animateOffset = Math.random() * 600;

    this.size = 40;
    this.shape = new Two.Path([], true, false);
    
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = 'rgba(0, 0, 0, 0)';
    this.shape.linewidth = 2;
    this.shape.scale = 1;
    
    this.shape.translation.x = x;
    this.shape.translation.y = y;
    this.targetX = x;
    this.targetY = y;
    this.targetRot = 0;
    
    this.movementSpeedX = 0.004 + (Math.random() * 0.002);
    this.movementSpeedY = 0.004 + (Math.random() * 0.002);

    this.maxSpeed = 2;
    this.movementSpeed = 1;
    this.rotationSpeed = 1;

    this.turnRadius = 200;
    this.turnRadiusSq = this.turnRadius * this.turnRadius;
  }

  init() {
    this.two.add(this.shape);
  }

  replaceShape(newPath) {
    let oldShape = this.shape;

    this.shape = newPath;

    this.shape.fill = oldShape.fill;
    this.shape.stroke = oldShape.stroke;
    this.shape.linewidth = oldShape.linewidth;
    this.shape.translation.x = oldShape.translation.x;
    this.shape.translation.y = oldShape.translation.y;
    this.shape.scale = oldShape.scale;
  }

  updateTarget(p) {
    this.targetX = p.shape.translation.x;  
    this.targetY = p.shape.translation.y;
  }

  animate(seconds) { }
}