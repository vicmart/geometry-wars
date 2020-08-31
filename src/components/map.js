import BasicMath from './utilities/math.js';
import Collision from './utilities/collision.js';

export default class Map {
  constructor(two) {
    this.two = two;
    this.alpha_config();
  }

  alpha_config() {
    this.width = 3000;
    this.height = 1800;

    this.shape = new Two.Path([
      new Two.Anchor(0, 0),
      new Two.Anchor(this.width, 0),
      new Two.Anchor(this.width, this.height),
      new Two.Anchor(0, this.height)
    ], true, false);
      
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = '#49fb35';
    this.shape.linewidth = 3;
    this.shape.scale = 1;

    this.two.add(this.shape);
    this.two.update();

    this.initializeBoundaries();
  }

  initializeBoundaries() {
    this.boundaries = [];

    for (var i = 0; i < this.shape.vertices.length; i++) {
      let x = this.shape.vertices[i].x * this.shape.scale;
      let y = this.shape.vertices[i].y * this.shape.scale;
      
      this.boundaries[i] = [x, y];
    }
  }

  validPosition(px, py, ship) {
    let ship_radius = ship.size/2;
    let valid_position = (px - ship_radius > 0) && (px + ship_radius < this.width) && (py - ship_radius > 0) && (py + ship_radius < this.height);
    return valid_position;
  }

  collision(px, py, move_x, move_y, ship) {
    let ship_radius = ship.size/2;
    let valid_position = (px - ship_radius > 0) && (px + ship_radius < this.width) && (py - ship_radius > 0) && (py + ship_radius < this.height);
    if (valid_position) return [move_x, move_y, ship.targetX, ship.targetY];

    let x_m = px - ship_radius;
    let x_p = this.width - (px + ship_radius);
    let y_m = py - ship_radius;
    let y_p = this.height - (py + ship_radius);

    let targetX = ship.targetX;
    let targetY = ship.targetY;

    if (x_m < 0) {
      targetX = ship_radius;
      move_x = 0 - ((px - move_x) - ship_radius);
    } else if (x_p < 0) {
      targetX = this.width - ship_radius;
      move_x = this.width - ((px - move_x) + ship_radius);
    }

    if (y_m < 0) {
      targetY = ship_radius;
      move_y = 0 - ((py - move_y) - ship_radius);
    } else if (y_p < 0) {
      targetY = this.height - ship_radius;
      move_y = this.height - ((py - move_y) + ship_radius);
    }

    return [move_x, move_y, targetX, targetY];
  }
}