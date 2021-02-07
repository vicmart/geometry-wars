import Bullet from '../ships/bullet';

export default class BulletController {
  constructor(two, map) {
    this.two = two;
    this.map = map;

    this.bullet_count = 0;
    this.bullets = {};

    this.init();
  }

  init() {
    this.animateFunction = (frameCount) => {
      for (let id in this.bullets) {
        let bullet = this.bullets[id];
        bullet.animateFunction(frameCount);
        if (bullet.garbage_collect) {
          delete this.bullets[id];
        }
      }
    };

    this.two.bind('update', this.animateFunction);
  }
  
  add(start_x, start_y, target_direction, extra_speed_x, extra_speed_y) {
    let new_bullet = new Bullet(start_x, start_y, this.two, this.map, target_direction, extra_speed_x, extra_speed_y);

    this.bullets[this.bullet_count] = new_bullet;
    this.bullet_count++;

    return new_bullet;
  }
}