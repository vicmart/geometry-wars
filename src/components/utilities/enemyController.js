import Diamond from '../ships/diamond';
import Pinwheel from '../ships/pinwheel';
import Square from '../ships/square';
import Envelope from '../ships/envelope';
import Arrow from '../ships/arrow';

export default class EnemyController {
  constructor(two, map, collision) {
    this.two = two;
    this.map = map;
    this.collision = collision;

    this.enemy_count = 0;
    this.enemies = {};

    this.init();
  }

  init() {
    this.animateFunction = (frameCount) => {
      for (let id in this.enemies) {
        let enemy = this.enemies[id];
        enemy.animateFunction(frameCount);
        if (enemy.garbage_collect) {
          delete this.enemies[id];
        }
      }
    };

    this.two.bind('update', this.animateFunction);
  } 
  
  add(enemy_type, start_x, start_y, scale = 1) {
    let new_enemy;
    switch(enemy_type) {
      case 'Diamond':
        new_enemy = new Diamond(start_x, start_y, this.two, this.map);
        break;
      case 'Square':
        new_enemy = new Square(start_x, start_y, this.two, this.map);
        break;
      case 'Pinwheel':
        new_enemy = new Pinwheel(start_x, start_y, this.two, this.map);
        break;
      case 'Square':
        new_enemy = new Square(start_x, start_y, this.two, this.map);
        break;
      case 'Envelope':
        new_enemy = new Envelope(start_x, start_y, scale, this.two, this.map);
        break;
      case 'Arrow':
        new_enemy = new Arrow(start_x, start_y, this.two, this.map);
        break;
    }

    if (new_enemy) {
      this.enemies[this.enemy_count] = new_enemy;
      this.enemy_count++;
      this.collision.enemies.push(new_enemy);
    }
  }
}