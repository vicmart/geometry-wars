import * as Two from 'twojs-ts';
import Vector2 from 'victor';
import Map from './components/map';
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

	let shapes = [new Diamond(100, 300, two),
								new Diamond(1000, 300, two),
								new Diamond(1000, 700, two),
								new Diamond(100, 700, two),
								new Square(300, 100, two),
								new Pinwheel(300, 200, two),
								new Envelope(200, 200, 1, two),
								new Envelope(200, 300, 0.5, two),
								new Arrow(300, 300, two)];
	
	for (let i = 0; i < 10; i++) {
		shapes.push(new Diamond(Math.random() * 1000, Math.random() * 1000, two));
	}

	let map = new Map(two);
	let controller = new Controller();

	let p1 = new Player(100, 100, two, map, controller);

	two.bind('update', function(frameCount) {
		let seconds = new Date().getTime() / 1000;
		//console.log(controller);
    
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].updateTarget(p1);
        if(shapes[i].animate(seconds)) {
            shapes.splice(i, 1);
        }
    }
    
    p1.animate(seconds, map);
	}).play();
};