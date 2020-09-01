import * as Two from 'twojs-ts';
import Collision from './components/utilities/collision.js';
import Map from './components/map';
import UI from './components/ui';
import Controller from './components/utilities/controller';
import Bullet from './components/ships/bullet';
import Player from './components/ships/player';
import Diamond from './components/ships/diamond';
import Pinwheel from './components/ships/pinwheel';
import Square from './components/ships/square';
import Envelope from './components/ships/envelope';
import Arrow from './components/ships/arrow';
import BasicMath from './components/utilities/math.js';
					

window.onload = function() {

	let elem = document.getElementById('field');
	let params = { type: Two.Types.canvas, fullscreen: true };
	let two = new Two(params).appendTo(elem);

	let map = new Map(two);
	let controller = new Controller();

	let enemies = [new Square(300, 100, two, map),
								new Pinwheel(300, 200, two, map),
								new Envelope(200, 200, 1, two, map),
								new Envelope(200, 300, 0.5, two, map),
								new Arrow(300, 300, two, map)];
	
	for (let i = 0; i < 0; i++) {
		let [px, py] = [Math.random() * map.width, Math.random() * map.height];

		enemies.push(new Diamond(px, py, two, map));
	}

	let p1 = new Player(100, 100, two, map, controller);
	let ui = new UI(two, p1);
	let lastSecond = new Date().getTime() / 1000;
	let lastFrameCount = two.frameCount;


	for (let i = 0; i < enemies.length; i++) {
		two.bind('update', function(frameCount) {
			enemies[i].updateTarget(p1);
			enemies[i].animate(frameCount);
		});
	}

	two.bind('update', function(frameCount) {
		p1.animate(frameCount, map);
	});

	two.bind('update', function(frameCount) {
		let seconds = new Date().getTime() / 1000;
		if (parseInt(seconds) > parseInt(lastSecond)) {
			ui.updateFPS(parseInt((two.frameCount - lastFrameCount) / (seconds - lastSecond)));
			lastSecond = seconds;
			lastFrameCount = two.frameCount;
		}

		ui.animate(seconds);
	});

	let x_resolution = 200;
	let y_resolution = 200;

	let x_buckets = parseInt(map.width / x_resolution);
	let y_buckets = parseInt(map.height / y_resolution);

	let enemy_buckets = [];
	let bullet_buckets = [];

	two.bind('update', function(frameCount) {
		let bullets = p1.activeBullets;

		enemy_buckets = [];
		bullet_buckets = [];

		for (let bullet of bullets) {
			let x_index = parseInt(bullet.shape.translation.x / x_resolution);
			let y_index = parseInt(bullet.shape.translation.y / y_resolution);
			let index = (y_index * x_buckets) + x_index;
			if (!bullet_buckets[index]) bullet_buckets[index] = [];
			bullet_buckets[index].push(bullet);
		}

		for (let enemy of enemies) {
			let x_index = parseInt(enemy.shape.translation.x / x_resolution);
			let y_index = parseInt(enemy.shape.translation.y / y_resolution);

			let x_minus = false;
			let x_plus = false;
			if (enemy.shape.translation.x % x_resolution < enemy.size/2) {
				enemy_buckets = addToNeighboringBucket(x_index, y_index, -1, 0, x_buckets, y_buckets, enemy_buckets, enemy);
				x_minus = true;
			} else if (x_resolution - (enemy.shape.translation.x % x_resolution) < enemy.size/2) {
				enemy_buckets = addToNeighboringBucket(x_index, y_index, 1, 0, x_buckets, y_buckets, enemy_buckets, enemy);
				x_plus = true;
			}

			if (enemy.shape.translation.y % y_resolution < enemy.size/2) {
				enemy_buckets = addToNeighboringBucket(x_index, y_index, 0, -1, x_buckets, y_buckets, enemy_buckets, enemy);
				if (x_minus) {
					enemy_buckets = addToNeighboringBucket(x_index, y_index, -1, -1, x_buckets, y_buckets, enemy_buckets, enemy);
				} else if (x_plus) {
					enemy_buckets = addToNeighboringBucket(x_index, y_index, 1, -1, x_buckets, y_buckets, enemy_buckets, enemy);
				}
			} else if (y_resolution - (enemy.shape.translation.y % y_resolution) < enemy.size/2) {
				enemy_buckets = addToNeighboringBucket(x_index, y_index, 0, 1, x_buckets, y_buckets, enemy_buckets, enemy);
				if (x_minus) {
					enemy_buckets = addToNeighboringBucket(x_index, y_index, -1, 1, x_buckets, y_buckets, enemy_buckets, enemy);
				} else if (x_plus) {
					enemy_buckets = addToNeighboringBucket(x_index, y_index, 1, 1, x_buckets, y_buckets, enemy_buckets, enemy);
				}
			}

			let index = (y_index * x_buckets) + x_index;
			if (!enemy_buckets[index]) enemy_buckets[index] = [];
			enemy_buckets[index].push(enemy);
		}
	});

	for (let x = 0; x < x_buckets; x++) {
		for (let y = 0; y < y_buckets; y++) {
			two.bind('update', function(frameCount) {
				let enemy_bucket = enemy_buckets[(y * x_buckets) + x];
				let bullet_bucket = bullet_buckets[(y * x_buckets) + x];

				if (enemy_bucket && enemy_bucket.length > 0 && bullet_bucket) {
					for (let bullet of bullet_bucket) {
						for (let enemy of enemy_bucket) {
							let bullet_pos = {x: bullet.shape.translation.x, y: bullet.shape.translation.y};
							let enemy_pos = {x: enemy.shape.translation.x, y: enemy.shape.translation.y};
							let dist_x = Math.abs(bullet_pos.x - enemy_pos.x);
							let dist_y = Math.abs(bullet_pos.y - enemy_pos.y);
							if (dist_x < enemy.size && dist_y < enemy.size) {
								bullet.destruct();
								break;
							}
						}
					}
				}
			});
		}
	}

	two.play();
};

function addToNeighboringBucket(x, y, x_offset, y_offset, x_buckets, y_buckets, buckets, enemy) {
	let alt_index = ((y + y_offset) * x_buckets) + (x + x_offset);

	if (!buckets[alt_index]) buckets[alt_index] = [];
	buckets[alt_index].push(enemy);

	return buckets;
}