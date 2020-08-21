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
		//left 65, right 68, up 87, down 83
		
		switch(e.which) {
			case 65: //left
				this.left_press = true;
				break;
			case 68: //right
        this.right_press = true;
				break;
			case 87: //up
        this.up_press = true;
				break;
			case 83: //down 
        this.down_press = true;
				break;
			default:
				break;
		}
	}

	keyup(e) {
		//console.log(e.which); //left 37, right 39, up 38, down 40 

		switch(e.which) {
			case 65: //left
        this.left_press = false;
				break;
			case 68: //right
        this.right_press = false;
				break;
			case 87: //up
        this.up_press = false;
				break;
			case 83: //down 
        this.down_press = false;
				break;
			default:
				break;
		} 
	}
}