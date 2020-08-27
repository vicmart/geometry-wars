import BasicMath from '../utilities/math.js';

export default class Ship {  
  constructor(x, y, two, map) {
    this.two = two;
    this.map = map;
    this.animateOffset = Math.random() * 10;

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

    this.maxSpeed = 1;
    this.movementSpeed = 1;
    this.rotationSpeed = 1;

    this.turnRadius = 200;
    this.turnRadiusSq = this.turnRadius * this.turnRadius;
  }

  init() {
    this.two.add(this.shape);
    this.two.update();
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

    if (this.map) {
      let ep = this.map.enemy_path;

      let least_index = this.map.determineEnemyPathPosition(this.shape);

      if (this.map.active_enemy_path_segment > least_index) {
        let diff = {x: ep[least_index + 1].x - ep[least_index].x, y: ep[least_index + 1].y - ep[least_index].y};
        let diff_next = {x: p.shape.translation.x - ep[least_index + 1].x, y: p.shape.translation.y - ep[least_index + 1].y};
        if (least_index < this.map.enemy_path.length - 2) diff_next = {x: ep[least_index + 2].x - ep[least_index + 1].x, y: ep[least_index + 2].y - ep[least_index + 1].y};
        let diff_prev = least_index > 0 ? {x: ep[least_index].x - ep[least_index - 1].x, y: ep[least_index].y - ep[least_index - 1].y} : null;

        diff = BasicMath.scalar(1 / BasicMath.mag(diff), diff);
        diff_next = BasicMath.scalar(1 / BasicMath.mag(diff_next), diff_next);
        if (diff_prev) diff_prev = BasicMath.scalar(1 / BasicMath.mag(diff_prev), diff_prev);

        let angle_between_next = BasicMath.angleBetween(diff, diff_next);
        let angle_between_prev = diff_prev ? BasicMath.angleBetween(diff_prev, diff) : null;

        let intersection_vector_next_points = BasicMath.getIntersectionVectorPoints(ep[least_index + 1], diff, diff_next);
        let intersection_vector_prev_points = diff_prev ? BasicMath.getIntersectionVectorPoints(ep[least_index], diff_prev, diff) : null;

        let dist_to_point = Math.abs(BasicMath.distToLine({x: this.shape.translation.x, y: this.shape.translation.y}, intersection_vector_next_points[1], intersection_vector_next_points[0]));
        let dist_from_point = diff_prev ? Math.abs(BasicMath.distToLine({x: this.shape.translation.x, y: this.shape.translation.y}, intersection_vector_prev_points[1], intersection_vector_prev_points[0])) : null;
        let turn_factor_next = (this.turnRadius - dist_to_point) * (angle_between_next / (2 * this.turnRadius));
        let turn_factor_prev = diff_prev ? (this.turnRadius - dist_from_point) * (angle_between_prev / (2 * this.turnRadius)) : null;
        if (least_index >= this.map.enemy_path.length - 2) turn_factor_prev = diff_prev ? (this.turnRadius - dist_from_point) * (angle_between_prev / (this.turnRadius)) : null;
        let new_diff = BasicMath.scalar(500, diff);
        if (dist_to_point < this.turnRadius) new_diff = BasicMath.turnVector(new_diff, turn_factor_next);
        if (dist_from_point < this.turnRadius && diff_prev) new_diff = BasicMath.turnVector(new_diff, -1 * turn_factor_prev);

        [this.targetX, this.targetY] = [ep[least_index + 1].x + new_diff.x, ep[least_index + 1].y + new_diff.y];

      } else if (this.map.active_enemy_path_segment < least_index) {
        let diff = {x: ep[least_index - 1].x - ep[least_index].x, y: ep[least_index - 1].y - ep[least_index].y};
        diff = BasicMath.scalar(1 / BasicMath.mag(diff), diff);

        let diff_next = {x: p.shape.translation.x - ep[least_index - 1].x, y: p.shape.translation.y - ep[least_index - 1].y};
        if (least_index > 1) {
          diff_next = {x: ep[least_index - 2].x - ep[least_index - 1].x, y: ep[least_index - 2].y - ep[least_index - 1].y};
        }

        diff_next = BasicMath.scalar(1 / BasicMath.mag(diff_next), diff_next);

        let dist_to_point = BasicMath.mag({x: ep[least_index - 1].x - this.shape.translation.x, y: ep[least_index - 1].y - this.shape.translation.y});
        let diff_contribution_scalar = dist_to_point < this.turnRadius ? Math.pow(dist_to_point, 2) : this.turnRadiusSq;
        let diff_contribution = {x: diff.x * diff_contribution_scalar, y: diff.y * diff_contribution_scalar};
        let diff_next_contribution_scalar = dist_to_point < this.turnRadius ? Math.pow(this.turnRadius - dist_to_point, 2) : 0;
        let diff_next_contribution = {x: diff_next.x * diff_next_contribution_scalar, y: diff_next.y * diff_next_contribution_scalar};

        [this.targetX, this.targetY] = [ep[least_index - 1].x + diff_contribution.x + diff_next_contribution.x, ep[least_index - 1].y + diff_contribution.y + diff_next_contribution.y];
      }
    }
  }

  animate(seconds) { }
}