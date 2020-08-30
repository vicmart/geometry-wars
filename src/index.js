import * as Two from 'twojs-ts';
import Collision from './components/utilities/collision.js';
import Map from './components/map';
import UI from './components/ui';
import Controller from './components/utilities/controller';
import Player from './components/ships/player';
import Diamond from './components/ships/diamond';
import Pinwheel from './components/ships/pinwheel';
import Square from './components/ships/square';
import Envelope from './components/ships/envelope';
import Arrow from './components/ships/arrow';
					

window.onload = function() {
	let elem = document.getElementById('field');
	let params = { width: window.innerWidth, height: window.innerHeight };
	let two = new Two(params).appendTo(elem);

	let map = new Map(two);
	let controller = new Controller();

	let shapes = [new Diamond(100, 300, two, map),
								new Square(300, 100, two, map),
								new Pinwheel(300, 200, two, map),
								new Envelope(200, 200, 1, two, map),
								new Envelope(200, 300, 0.5, two, map),
								new Arrow(300, 300, two, map)];
	
	for (let i = 0; i < 200; i++) {
		let [px, py] = [Math.random() * map.width, Math.random() * map.height];

		shapes.push(new Diamond(px, py, two, map));
	}

	let p1 = new Player(100, 100, two, map, controller);
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
		//console.log(controller);
    
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].updateTarget(p1);
        if (shapes[i].animate(seconds)) {
          shapes.splice(i, 1);
        }
    }
    
    p1.animate(seconds, map);
		ui.animate(seconds);
	}).play();
};