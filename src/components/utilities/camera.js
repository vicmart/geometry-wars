export default class Camera {
  constructor(two) {
    this.two = two;

    this.half_width = this.two.width/2;
    this.half_height = this.two.height/2;
  }

  visible(x, y, size_x, size_y) {
    let center_x = (-1 * this.two.scene.translation.x) + this.half_width;
    let center_y = (-1 * this.two.scene.translation.y) + this.half_height;

    return x + size_x > center_x - this.half_width &&
           x - size_x < center_x + this.half_width &&
           y + size_y > center_y - this.half_height &&
           y - size_y < center_y + this.half_height;
  }

  getBounds() {
    let min_x = (-1 * this.two.scene.translation.x);
    let max_x = (-1 * this.two.scene.translation.x) + this.two.width;
    let min_y = (-1 * this.two.scene.translation.y);
    let max_y = (-1 * this.two.scene.translation.y) + this.two.height;

    return {min: {x: min_x, y: min_y}, max: {x: max_x, y: max_y}};
  }
}