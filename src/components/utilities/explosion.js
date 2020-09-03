export default class Explosion {
  constructor(two, x, y, color = 'white', scale = 1) {
    this.center_x = x;
    this.center_y = y;
    this.two = two;
    this.sparks = [];
    this.scale = scale;
    this.timer = 0;
    this.speed = 2 * this.scale;
    this.speed_spread = 1.5 * this.scale;
    this.color = color;
    this.duration = 35 * this.scale;

		this.init();
  }

  init() {
    let iteration = Math.PI / (16 * this.scale);
    for (let r = 0; r < Math.PI * 2; r += iteration) {
      r += (iteration * Math.random()) - (iteration/2); 
      let size = ((Math.random() * 4) + 7) * this.scale;
      let path = this.two.makeLine(this.center_x, this.center_y, this.center_x + (size * Math.cos(r)), this.center_y + (size * Math.sin(r)));
      path.stroke = this.color;
      path.linewidth = 2;
      path.custom_r = r;
      path.custom_speed = (Math.random() * (2 * this.speed_spread)) + (this.speed - this.speed_spread);
      this.sparks.push(path);
    }

    this.animateFunction = () => {
      this.timer++;
      for (let path of this.sparks) {
        path.translation.x += Math.cos(path.custom_r) * path.custom_speed;
        path.translation.y += Math.sin(path.custom_r) * path.custom_speed;
        path.opacity = Math.max(0, (this.duration - this.timer)/this.duration);
      }

      if (this.timer > this.duration) {
        this.two.unbind('update', this.animateFunction);
        for (let path of this.sparks) {
          this.two.remove(path);
        }
      }
    }

    this.two.bind('update', this.animateFunction);
	}
}