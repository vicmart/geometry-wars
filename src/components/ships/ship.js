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

    this.skeleton = [];
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


  destruct() {
    if (this.dying) return;

    let verticies = !this.shape_group ? this.path.vertices : [];
    if (this.shape_group) {
      for (let path of this.shape_group) {
        verticies.push(...path.vertices);
      }
    }

    for (let [index, vertex] of verticies.entries()) {
      let next_index = index + 1;
      if (next_index >= verticies.length) next_index = 0;
      let next_vertex = verticies[next_index];

      let adjusted_vertex = BasicMath.turnVector({x: vertex._x, y: vertex._y}, this.shape.rotation);
      let adjusted_next_vertex = BasicMath.turnVector({x: next_vertex._x, y: next_vertex._y}, this.shape.rotation);

      let path = this.two.makeLine((adjusted_vertex.x * this.shape.scale) + this.shape.translation.x, (adjusted_vertex.y * this.shape.scale) + this.shape.translation.y, (adjusted_next_vertex.x * this.shape.scale) + this.shape.translation.x, (adjusted_next_vertex.y * this.shape.scale) + this.shape.translation.y);
      path.stroke = this.shape.stroke;
      path.linewidth = 2;
      path.rotationSpeed = (Math.random() - 0.5) * Math.PI/128;
      path.initial_x = path.translation.x;
      path.initial_y = path.translation.y;
      this.skeleton.push(path);
    }

    this.dying = true;
    this.killed_x = this.shape.translation.x;
    this.killed_y = this.shape.translation.y;

    if (this.shape_group) {
      for (let shape of this.shape_group) {
        this.shape.remove(shape);
      }
    }

    this.two.remove(this.shape);
  }

  garbageCollect() {
    this.two.unbind('update', this.animateFunction);
    for (let path of this.skeleton) {
      this.two.remove(path);
    }
  }

  decomp() {
    let overall_opacity = 0;
    for (let path of this.skeleton) {
      let x_diff = this.killed_x - path.translation.x;
      let y_diff = this.killed_y - path.translation.y;
      path.translation.x -= x_diff != 0 ? (2 / x_diff) : 0;
      path.translation.y -= y_diff != 0 ? (2 / y_diff) : 0;
      path.rotation += path.rotationSpeed;
      path.opacity = Math.max(0, (10 - Math.sqrt(Math.pow(path.initial_x - path.translation.x, 2) + Math.pow(path.initial_y - path.translation.y, 2))) / 10);
      overall_opacity += path.opacity;
    }

    overall_opacity = overall_opacity / this.skeleton.length;

    if (overall_opacity < 0.05) this.garbageCollect();
  }

  animate(seconds) { }
}