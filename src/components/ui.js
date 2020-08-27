export default class UI {
  constructor(two, player) {
    this.two = two;
    this.player = player;
    this.init();
  }

  init() {
    this.fps = new Two.Text("0", this.player.shape.translation.x + (window.innerWidth/2) - 20, this.player.shape.translation.y - (window.innerHeight/2) + 20, 'normal');
    this.fps.stroke ='#49fb35';
    this.fps.fill ='#49fb35';
    this.fps.size = 18;
    this.fps.weight = 300;
    this.fps.visible = true;
    this.two.add(this.fps);
    this.two.update();
  }

  updateFPS(value) {
    this.fps.value = value;
  }

  animate() {
    this.fps.translation.x = this.player.shape.translation.x + (window.innerWidth/2) - 20;
    this.fps.translation.y = this.player.shape.translation.y - (window.innerHeight/2) + 20;
  }
}