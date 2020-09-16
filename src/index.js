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

	let enemies = [new Square(300, 100, two, map),
								new Pinwheel(300, 200, two, map),
								new Envelope(200, 200, 1, two, map),
								new Envelope(200, 300, 0.5, two, map),
								new Arrow(300, 300, two, map)];
	
	for (let i = 0; i < 100; i++) {
		let [px, py] = [Math.random() * map.width, Math.random() * map.height];
		enemies.push(new Diamond(px, py, two, map));
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

	let collision = new Collision(two, map, p1, enemies);

	two.play();
};