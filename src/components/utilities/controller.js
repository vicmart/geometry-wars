export default class Controller {
  constructor() {
    this.left_press = false;
    this.right_press = false;
    this.up_press = false;
		this.down_press = false;
		
		this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => { this.keydown(e); });
		document.addEventListener('keyup', (e) => { this.keyup(e); });
	}

  keydown(e) {
		//console.log(e.which); //left 37, right 39, up 38, down 40
		
		switch(e.which) {
			case 37: //left
				this.left_press = true;
				break;
			case 39: //right
        this.right_press = true;
				break;
			case 38: //up
        this.up_press = true;
				break;
			case 40: //down 
        this.down_press = true;
				break;
			default:
				break;
		}
	}

	keyup(e) {
		//console.log(e.which); //left 37, right 39, up 38, down 40 

		switch(e.which) {
			case 37: //left
        this.left_press = false;
				break;
			case 39: //right
        this.right_press = false;
				break;
			case 38: //up
        this.up_press = false;
				break;
			case 40: //down 
        this.down_press = false;
				break;
			default:
				break;
		} 
	}
}