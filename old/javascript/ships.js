
function ship (x, y) {
    this.animateOffset = Math.random() * 10;
    
    this.targetX = x;
    this.targetY = y;
    this.targetRot = 0;
    
    this.updateTarget = function(p) {
        this.targetX = p.shape.translation.x;  
        this.targetY = p.shape.translation.y;  
    };
};

function diamond (x, y) {
    ship.call(this, x, y);
    
    this.shape = new Two.Path([
        new Two.Anchor(0, -20),
        new Two.Anchor(20, 0),
        new Two.Anchor(0, 20),
        new Two.Anchor(-20, 0)
    ], true, false);
    
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = 'cyan';
    this.shape.linewidth = 2;
    
    this.shape.translation.x = x;
    this.shape.translation.y = y;
    
    this.movementSpeedX = 0.004 + (Math.random() * 0.002);
    this.movementSpeedY = 0.004 + (Math.random() * 0.002);

    two.add(this.shape);
    two.update();
    
    this.animate = function(seconds) {
        this.shape.vertices[0].y = (Math.sin(seconds + this.animateOffset) * 5) - 20;
        this.shape.vertices[1].x = (Math.sin(seconds + this.animateOffset) * 5) + 20;
        this.shape.vertices[2].y = (Math.sin(seconds + this.animateOffset) * -5) + 20;
        this.shape.vertices[3].x = (Math.sin(seconds + this.animateOffset) * -5) - 20;

        this.shape.translation.x += (this.targetX - this.shape.translation.x) * this.movementSpeedX;
        this.shape.translation.y += (this.targetY - this.shape.translation.y) * this.movementSpeedY;
        
        return false;
    };
};

function pinwheel (x, y) {
    ship.call(this, x, y);
    
    this.shape = new Two.Path([
        new Two.Anchor(0, 0),
        new Two.Anchor(-22, -22),
        new Two.Anchor(0, -22),
        new Two.Anchor(0, 0),
        new Two.Anchor(22, -22),
        new Two.Anchor(22, 0),
        new Two.Anchor(0, 0),
        new Two.Anchor(22, 22),
        new Two.Anchor(0, 22),
        new Two.Anchor(0, 0),
        new Two.Anchor(-22, 22),
        new Two.Anchor(-22, 0),
        new Two.Anchor(0, 0)
    ], true, false);
    
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = '#8A2BE2';
    this.shape.linewidth = 2;
    
    this.shape.translation.x = x;
    this.shape.translation.y = y;

    two.add(this.shape);
    two.update();
    
    this.animate = function(seconds) {
        this.shape.rotation = -seconds + this.animateOffset;

        return false;
    };
};

function envelope (x, y, scale) {
    ship.call(this, x, y);
    
    x_shape = new Two.Path([
        new Two.Anchor(0, 0),
        new Two.Anchor(-20, -20),
        new Two.Anchor(0, 0),
        new Two.Anchor(20, 20),
        new Two.Anchor(0, 0),
        new Two.Anchor(20, -20),
        new Two.Anchor(0, 0),
        new Two.Anchor(-20, 20),
        new Two.Anchor(0, 0)
    ], true, false);
    
    square_shape = new Two.Path([
        new Two.Anchor(-20, -20),
        new Two.Anchor(20, -20),
        new Two.Anchor(20, 20),
        new Two.Anchor(-20, 20),
        new Two.Anchor(-20, -20),
    ], true, false);
    
    this.shape = two.makeGroup(x_shape, square_shape);
    
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = '#FF00FF';
    this.shape.linewidth = 2;
    this.shape.scale = scale;
    
    this.shape.translation.x = x;
    this.shape.translation.y = y;

    two.add(this.shape);
    two.update();
    
    this.animate = function(seconds) {
        this.shape.rotation = Math.sin(seconds + this.animateOffset);

        return false;
    };
};

function square (x, y) {
    ship.call(this, x, y);
    
    small_shape = new Two.Path([
        new Two.Anchor(-20, 0),
        new Two.Anchor(0, -20),
        new Two.Anchor(20, 0),
        new Two.Anchor(0, 20)
    ], true, false);
    
    square_shape = new Two.Path([
        new Two.Anchor(-20, -20),
        new Two.Anchor(20, -20),
        new Two.Anchor(20, 20),
        new Two.Anchor(-20, 20),
        new Two.Anchor(-20, -20)
    ], true, false);
    
    this.shape = two.makeGroup(small_shape, square_shape);
    
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = '#49fb35';
    this.shape.linewidth = 2;
    this.shape.scale = 1;
    
    this.shape.translation.x = x;
    this.shape.translation.y = y;

    two.add(this.shape);
    two.update();
    
    this.animate = function(seconds) {
        this.shape.rotation = Math.sin(seconds + this.animateOffset) * 0.5;
    
        return false;
    };
};

function arrow (x, y) {
    ship.call(this, x, y);
    
    this.shape = new Two.Path([
        new Two.Anchor(0, -20),
        new Two.Anchor(15, 12),
        new Two.Anchor(8, 20),
        new Two.Anchor(4, 15),
        new Two.Anchor(0, 15),
        new Two.Anchor(-4, 15),
        new Two.Anchor(-8, 20),
        new Two.Anchor(-15, 12),
    ], true, false);
    
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = '#FFA500';
    this.shape.linewidth = 2;
    this.shape.scale = 1;
    
    this.shape.translation.x = x;
    this.shape.translation.y = y;
    
    this.triggerAction = true;
    this.animating = false;
    this.animateStart = 0;
    
    two.add(this.shape);
    two.update();
    
    this.animate = function(seconds) {
        if (this.triggerAction == true) {
            this.animating = true;
            this.triggerAction = false;
            this.animateStart = seconds;
        }
        
        if (this.animating == true) {
            this.shape.rotation = (seconds - this.animateStart) * 4;
            
            if (seconds - this.animateStart >= Math.PI / 4) {
                this.animating = false;    
            }
        }

        return false;
    };
};

function bullet (x, y, targetX, targetY) {
    ship.call(this, x, y);
    
    this.shape = new Two.Path([
        new Two.Anchor(0, -5),
        new Two.Anchor(3, 3),
        new Two.Anchor(2, 4),
        new Two.Anchor(-2, 4),
        new Two.Anchor(-3, 3),
    ], true, false);
    
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = '#FFA500';
    this.shape.linewidth = 2;
    this.shape.scale = 1;
    
    this.movementSpeed = 10;
    
    this.shape.translation.x = x;
    this.shape.translation.y = y;
    
    this.targetX = targetX;
    this.targetY = targetY;
    
    var x_diff = this.targetX - this.shape.translation.x;
    var y_diff = this.targetY - this.shape.translation.y;

    this.targetRot = Math.atan(y_diff/x_diff) + Math.PI/2;

    if (x_diff < 0) {
        this.targetRot -= Math.PI;
    }
    
    this.shape.rotation = this.targetRot;
    
    two.add(this.shape);
    two.update();
    
    this.animate = function(seconds) {
        var diff_x = this.shape.translation.x - this.targetX;
        var diff_y = this.shape.translation.y - this.targetY;
        
        if (Math.abs(diff_x) < this.movementSpeed) {
            
        } else if (diff_x > 0) {
            this.shape.translation.x -= this.movementSpeed;
        } else {
            this.shape.translation.x += this.movementSpeed;            
        }
        
        if (Math.abs(diff_y) < this.movementSpeed) {
            
        } else if (diff_y > 0) {
            this.shape.translation.y -= this.movementSpeed;
        } else {
            this.shape.translation.y += this.movementSpeed;
        }
        
        if (Math.abs(diff_x) < this.movementSpeed && Math.abs(diff_y) < this.movementSpeed) {
            two.remove(this.shape);
            this.shape = undefined;
            return true;
        }
        
        return false;
    };
};

function player (x, y, play_map) {
    ship.call(this, x, y);
    
    this.shape = new Two.Path([
        new Two.Anchor(0, -10),
        new Two.Anchor(18, 5),
        new Two.Anchor(8, 20),
        new Two.Anchor(12, 10),
        new Two.Anchor(0, 2),
        new Two.Anchor(-12, 10),
        new Two.Anchor(-8, 20),
        new Two.Anchor(-18, 5),
    ], true, false);
    
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = 'white';
    this.shape.linewidth = 2;
    this.shape.scale = 1;
    
    this.shape.translation.x = x;
    this.shape.translation.y = y;
    two.scene.translation.x = window.innerWidth/2 - x;
    two.scene.translation.y = window.innerHeight/2 - y;
    
    this.movementSpeed = 0.06;
    this.rotationSpeed = 0.5;
    
    this.triggerAction = true;
    this.animating = false;
    this.animateStart = 0;
        
    this.bulletCounter = 0;
    this.bulletRate = 7;
    
    this.polygon = [];
        
    for (var i = 0; i < play_map.shape.vertices.length; i++) {
        var x = play_map.shape.vertices[i].x * play_map.shape.scale;
        var y = play_map.shape.vertices[i].y * play_map.shape.scale;

        var index_next = i + 1;
        if (i >= play_map.shape.vertices.length - 1) {
            index_next = 0;
        }
        
        var index_prev = i - 1;
        if (i == 0) {
            index_prev = play_map.shape.vertices.length - 1;
        }
        
        var nx = play_map.shape.vertices[index_next].x * play_map.shape.scale;
        var ny = play_map.shape.vertices[index_next].y * play_map.shape.scale;
        var px = play_map.shape.vertices[index_prev].x * play_map.shape.scale;
        var py = play_map.shape.vertices[index_prev].y * play_map.shape.scale;

        var normal_next = {x: -(ny - y), y: nx - x};
        var normal_prev = {x: -(y - py), y: x - px};
        
        normal_next = scalar(1 / mag(normal_next), normal_next);
        normal_prev = scalar(1 / mag(normal_prev), normal_prev);
        
        var angle = Math.PI - Math.acos(dot({x: px - x, y: py - y}, {x: nx - x, y: ny - y}) / (mag({x: px - x, y: py - y}) * mag({x: nx - x, y: ny - y})))
        
        var final = scalar(Math.cos(angle/2) * 20, normal_next);
        
        this.polygon[i] = [x, y];
    }
    
    two.add(this.shape);
    two.update();
    
    this.animate = function(seconds, play_map) {  
        this.bulletCounter++;
        
        /**if (this.bulletCounter % this.bulletRate == 0) {
            shapes.push(new bullet(this.shape.translation.x, this.shape.translation.y - 5, this.shape.translation.x + 1000, this.shape.translation.y - 5));
            shapes.push(new bullet(this.shape.translation.x + 5, this.shape.translation.y + 5, this.shape.translation.x + 1005, this.shape.translation.y + 5));
        }**/
;        
        if (left_press && !right_press) {
            this.targetX -= 10;
        } else if (right_press && !left_press) {
            this.targetX += 10;
        }

        if (up_press && !down_press) {
            this.targetY -= 10;
        } else if (down_press && !up_press) {
            this.targetY += 10;
        }
        
        var move_x = (this.targetX - this.shape.translation.x) * this.movementSpeed;
        var move_y = (this.targetY - this.shape.translation.y) * this.movementSpeed;

        var px = this.shape.translation.x + move_x;
        var py = this.shape.translation.y + move_y;

        var in_polygon = pointInPolygon([px, py], this.polygon);
                    
        if (!in_polygon) {
            var least_dist = -1;
            var least_index = -1;
            var least_point = {x: 0, y: 0};
            
            for (var i = 0; i < play_map.shape.vertices.length; i++) {
                var x = play_map.shape.vertices[i].x * play_map.shape.scale;
                var y = play_map.shape.vertices[i].y * play_map.shape.scale;
                var nx = play_map.shape.vertices[0].x * play_map.shape.scale;
                var ny = play_map.shape.vertices[0].y * play_map.shape.scale;

                if (i < play_map.shape.vertices.length - 1) {
                    nx = play_map.shape.vertices[i + 1].x * play_map.shape.scale;
                    ny = play_map.shape.vertices[i + 1].y * play_map.shape.scale;                
                }

                var closest_point = distToSegment({x: px, y: py}, {x: x, y: y}, {x: nx, y: ny});
                var dist = Math.sqrt(dist2({x: px, y: py}, closest_point));
                
                if (dist < least_dist || least_index == -1) {
                    least_dist = dist;
                    least_index = i;
                    least_point = closest_point;
                }
            }

            //console.log(least_point);
            
            var x = play_map.shape.vertices[least_index].x * play_map.shape.scale;
            var y = play_map.shape.vertices[least_index].y * play_map.shape.scale;
            var nx = play_map.shape.vertices[0].x * play_map.shape.scale;
            var ny = play_map.shape.vertices[0].y * play_map.shape.scale;

            if (least_index < play_map.shape.vertices.length - 1) {
                nx = play_map.shape.vertices[least_index + 1].x * play_map.shape.scale;
                ny = play_map.shape.vertices[least_index + 1].y * play_map.shape.scale;                
            }

            var b_vec = {x: -(ny - y), y: nx - x};
            b_vec = scalar(-1 / mag(b_vec), b_vec);

            var a_vec = {x: move_x, y: move_y};
            var a_proj = scalar(dot(a_vec, b_vec) / (mag(b_vec) * mag(b_vec)), b_vec);

            var a_perp = subtract(a_vec, a_proj);
            move_x = a_perp.x;
            move_y = a_perp.y;

            var new_a_vec = {x: this.targetX - least_point.x, y: this.targetY - least_point.y};
            var new_b_vec = {x: nx - x, y: ny - y};
            new_b_vec = scalar(1 / mag(new_b_vec), new_b_vec);

            var new_a_proj = scalar(dot(new_a_vec, new_b_vec) / (mag(new_b_vec) * mag(new_b_vec)), new_b_vec);

            this.targetX = least_point.x + new_a_proj.x;
            this.targetY = least_point.y + new_a_proj.y;
        }
        
        two.scene.translation.x -= move_x;
        two.scene.translation.y -= move_y;

        this.shape.translation.x += move_x;
        this.shape.translation.y += move_y;
        
        var x_diff = this.targetX - this.shape.translation.x;
        var y_diff = this.targetY - this.shape.translation.y;
        
        if(mag({x: x_diff, y: y_diff}) > 10) {
            this.targetRot = Math.atan(y_diff/x_diff) - Math.PI/2;
        
            if (x_diff < 0) {
                this.targetRot -= Math.PI;
            }

            if (this.targetRot > -Math.PI/2 && this.shape.rotation < -3 * Math.PI/2) {
                this.shape.rotation += Math.PI * 2;
            }

            if (this.shape.rotation > -Math.PI/2 && this.targetRot <= -3 * Math.PI/2) {
                this.shape.rotation -= Math.PI * 2;
            }
        
            if (!isNaN(this.targetRot)) {
                this.shape.rotation += (this.targetRot - this.shape.rotation) * this.rotationSpeed;
            }
        }
        
        return false;
    };    
};