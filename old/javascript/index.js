// Make an instance of two and place it on the page.
var elem = document.getElementById('field');
var params = { width: window.innerWidth, height: window.innerHeight };
var two = new Two(params).appendTo(elem);

var left_press = false;
var right_press = false;
var up_press = false;
var down_press = false;

var shapes = [new diamond(100, 300),
              new diamond(1000, 300),
              new diamond(1000, 700),
              new diamond(100, 700),
              new square(300, 100),
              new pinwheel(300, 200),
              new envelope(200, 200, 1),
              new envelope(200, 300, 0.5),
              new arrow(300, 300)];

var map1 = new map_alpha();

var p1 = new player(100, 100, map1);

two.bind('update', function(frameCount) {
    var seconds = new Date().getTime() / 1000;
    
    for (var i = 0; i < shapes.length; i++) {
        shapes[i].updateTarget(p1);
        if(shapes[i].animate(seconds)) {
            shapes.splice(i, 1);
        }
    }
    
    p1.animate(seconds, map1);
}).play();

$(document).keydown(function(e) {
    //console.log(e.which); //left 37, right 39, up 38, down 40
    
    switch(e.which) {
        case 37: //left
            left_press = true;
            break;
        case 39: //right
            right_press = true;
            break;
        case 38: //up
            up_press = true;
            break;
        case 40: //down 
            down_press = true;
            break;
        default:
            break;
    } 
});

$(document).keyup(function(e) {
    //console.log(e.which); //left 37, right 39, up 38, down 40 
    
    switch(e.which) {
        case 37: //left
            left_press = false;
            break;
        case 39: //right
            right_press = false;
            break;
        case 38: //up
            up_press = false;
            break;
        case 40: //down 
            down_press = false;
            break;
        default:
            break;
    } 
});
    
function moveLinear(pos, target, speed) {
    var diff = pos - target;

    if (Math.abs(diff) < speed) {
        return 0;
    } else if (diff > 0) {
        return -speed;
    } else {
        return speed;
    }
}