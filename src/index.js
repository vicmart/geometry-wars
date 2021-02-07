import * as Two from 'twojs-ts';
import Collision from './components/utilities/collision.js';
import Player from './components/ships/player';
import Map from './components/map';
import UI from './components/ui';
import Controller from './components/utilities/controller';
import EnemyController from './components/utilities/enemyController';
import Camera from './components/utilities/camera.js';
					

window.onload = function() {

	let elem = document.getElementById('field');
	let params = { type: Two.Types.canvas, fullscreen: true };
	let two = new Two(params).appendTo(elem);
	two.camera = new Camera(two);

	let map = new Map(two);
	let controller = new Controller();

	let p1 = new Player(100, 100, two, map, controller);
	map.p1 = p1;

	let collision = new Collision(two, map, p1);

	let enemyController = new EnemyController(two, map, collision);

	enemyController.add('Square', 300, 100);
	enemyController.add('Pinwheel', 300, 200);
	enemyController.add('Envelope', 200, 200, 1);
	enemyController.add('Envelope', 200, 300, 0.5);
	enemyController.add('Arrow', 300, 300);
	
	for (let i = 0; i < 100; i++) {
		let [px, py] = [Math.random() * map.width, Math.random() * map.height];
		enemyController.add('Diamond', px, py);
	}

	let ui = new UI(two, p1);
	let lastSecond = new Date().getTime() / 1000;
	let lastFrameCount = two.frameCount;

	two.bind('update', function(frameCount) {
		let seconds = new Date().getTime() / 1000;
		if (parseInt(seconds) > parseInt(lastSecond)) {
			ui.updateFPS(parseInt((two.frameCount - lastFrameCount) / (seconds - lastSecond)));
			lastSecond = seconds;
			lastFrameCount = two.frameCount;
		}

		ui.animate(seconds);
	});

	two.play();
};