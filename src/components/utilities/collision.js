import BasicMath from '../utilities/math.js';
import Explosion from './explosion.js';

export default class Collision {
  constructor(two, map, p1, enemies = []) {
    this.two = two;
    this.map = map;
    this.p1 = p1;
    this.enemies = enemies;

    this.x_resolution = 20;
    this.y_resolution = 20;
    
    this.enemy_buckets = [];
    this.bullet_buckets = [];

    this.init();
  }

  init() {
    this.x_buckets = Math.ceil(this.map.width / this.x_resolution);
    this.y_buckets = Math.ceil(this.map.height / this.y_resolution);

    this.two.bind('update', (framecount) => { this.mainRoutine() });

    for (let x = 0; x < this.x_buckets; x++) {
      for (let y = 0; y < this.y_buckets; y++) {
        this.two.bind('update', (framecount) => { this.bucketSubroutine(x, y) });
      }
    }
  }

  mainRoutine() {
    let bullets = this.p1.activeBullets;

    this.enemy_buckets = [];
    this.bullet_buckets = [];
  
    for (let bullet of bullets) {
      let x_index = parseInt(bullet.shape.translation.x / this.x_resolution);
      let y_index = parseInt(bullet.shape.translation.y / this.y_resolution);
      let index = (y_index * this.x_buckets) + x_index;
      if (!this.bullet_buckets[index]) this.bullet_buckets[index] = [];
      this.bullet_buckets[index].push(bullet);
    }

    for (let enemy of this.enemies) {
      let x_index = parseInt(enemy.shape.translation.x / this.x_resolution);
      let y_index = parseInt(enemy.shape.translation.y / this.y_resolution);

      let x_overlap = 0;
      let y_overlap = 0;
      if (enemy.shape.translation.x % this.x_resolution < enemy.size) {
        x_overlap = -1;
      } else if (this.x_resolution - (enemy.shape.translation.x % this.x_resolution) < enemy.size) {
        x_overlap = 1;
      }

      if (enemy.shape.translation.y % this.y_resolution < enemy.size) {
        y_overlap = -1;
      } else if (this.y_resolution - (enemy.shape.translation.y % this.y_resolution) < enemy.sizew) {
        y_overlap = 1;
      }

      if (x_overlap != 0 || y_overlap != 0) {
        this.enemy_buckets = this.addToNeighboringBucket(x_index, y_index, x_overlap, y_overlap, this.x_buckets, this.y_buckets, this.enemy_buckets, enemy);
      }

      let index = (y_index * this.x_buckets) + x_index;
      if (!this.enemy_buckets[index]) this.enemy_buckets[index] = [];
      this.enemy_buckets[index].push(enemy);
    }
  }

  bucketSubroutine(x, y) {
    let enemy_bucket = this.enemy_buckets[(y * this.x_buckets) + x];
    let bullet_bucket = this.bullet_buckets[(y * this.x_buckets) + x];

    let occupied_space = {};

    if (!enemy_bucket || enemy_bucket.length === 0) return;
    let space_size = enemy_bucket[0].size * 4;

    if (bullet_bucket && bullet_bucket.length > 0) {
      for (let bullet of bullet_bucket) {
        let x_index = parseInt(bullet.shape.translation.x / space_size);
        let y_index = parseInt(bullet.shape.translation.y / space_size);
        if (!occupied_space[x_index]) occupied_space[x_index] = {}
        if (!occupied_space[x_index][y_index]) occupied_space[x_index][y_index] = [];
        occupied_space[x_index][y_index].push(bullet);
      }

      for (let enemy of enemy_bucket) {
        let x_index = parseInt(enemy.shape.translation.x / space_size);
        let y_index = parseInt(enemy.shape.translation.y / space_size);
        if (occupied_space[x_index] && occupied_space[x_index][y_index]) {
          new Explosion(this.two, enemy.shape.translation.x, enemy.shape.translation.y, enemy.shape.stroke);
          for (let bullet of occupied_space[x_index][y_index]) {
            bullet.destruct();
            bullet_bucket.remove(bullet);
          }
          enemy.destruct();
          this.enemies.remove(enemy);
          enemy_bucket.remove(enemy);
          break;
        }
      }
    }

    for (let enemy of enemy_bucket) {
      for (let other_enemy of enemy_bucket) {
        if (enemy !== other_enemy) {
          let enemy_pos = {x: enemy.shape.translation.x, y: enemy.shape.translation.y};
          let other_enemy_pos = {x: other_enemy.shape.translation.x, y: other_enemy.shape.translation.y};
          let dist_x = Math.abs(enemy_pos.x - other_enemy_pos.x);
          let dist_y = Math.abs(enemy_pos.y - other_enemy_pos.y);
          if (dist_x < enemy.size && dist_y < enemy.size) {
            let overlap_x = enemy.size - dist_x;
            let overlap_y = enemy.size - dist_y;
            let direction_x = dist_x / Math.abs(dist_x);
            let direction_y = dist_y / Math.abs(dist_y);
            enemy.shape.translation.x += (direction_x * overlap_x * 0.5);
            enemy.shape.translation.y += (direction_y * overlap_y * 0.5);
            other_enemy.shape.translation.x += (direction_x * overlap_x * 0.5 * -1);
            other_enemy.shape.translation.y += (direction_y * overlap_y * 0.5 * -1);
          }
        }
      }
    }
  }

  addToNeighboringBucket(x, y, x_offset, y_offset, x_buckets, y_buckets, buckets, enemy) {
    let alt_index = ((y + y_offset) * x_buckets) + (x + x_offset);
  
    if (!buckets[alt_index]) buckets[alt_index] = [];
    buckets[alt_index].push(enemy);
  
    return buckets;
  }
}

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};