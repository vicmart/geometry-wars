function map() {
    
}

function map_alpha (x, y) {
    map.call(this);
    
    this.shape = new Two.Path([
        new Two.Anchor(10, 10),
        new Two.Anchor(200, 10),
        new Two.Anchor(200, 200),
        new Two.Anchor(400, 400),
        new Two.Anchor(500, 400),
        new Two.Anchor(500, 10),
        new Two.Anchor(600, 10),
        new Two.Anchor(700, 100),
        new Two.Anchor(900, 100),
        new Two.Anchor(1000, 500),
        new Two.Anchor(1100, 500),
        new Two.Anchor(1100, 10),
        new Two.Anchor(1250, 10),
        new Two.Anchor(1250, 700),
        new Two.Anchor(800, 700),
        new Two.Anchor(800, 400),
        new Two.Anchor(600, 400),
        new Two.Anchor(600, 600),
        new Two.Anchor(300, 600),
        new Two.Anchor(10, 200)
        /**new Two.Anchor(10, 10),
        new Two.Anchor(200, 10),
        new Two.Anchor(200, 200),
        new Two.Anchor(10, 200)**/
    ], true, false);
    
    this.shape.fill = 'rgba(0, 0, 0, 0)';
    this.shape.stroke = '#49fb35';
    this.shape.linewidth = 3;
    this.shape.scale = 2;

    two.add(this.shape);
    two.update();
};