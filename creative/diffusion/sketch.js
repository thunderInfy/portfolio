let speed = 2;

class Particle{
	constructor(x,y, col){
		this.x = x;
		this.y = y;
		this.r = col._getRed();
		this.g = col._getGreen();
		this.b = col._getBlue()
	}
	draw(){
		stroke(this.r, this.g, this.b);
		strokeWeight(1);
		point(this.x, this.y);
	}
	update(){
		this.updatex();
		this.updatey();
	}
	updatex(){
		if(this.x==0){
			this.x = floor(random(speed));
		}
		else if(this.x==width){
			this.x = width-floor(random(speed));
		}
		else{
			this.x += floor(random(-speed, speed+1));
		}
	}
	updatey(){
		if(this.y==0){
			this.y = floor(random(speed));
		}
		else if(this.y==height){
			this.y = height-floor(random(speed));
		}
		else{
			this.y += floor(random(-speed, speed+1));
		}
	}
}

let particles = [];
let N = 1000;
let colors;

function setup() {

	createCanvas(windowWidth, windowHeight);
	colors = [color(255,0,0), color(0,255,0), color(0,0,255)];
}

let pos = 0;

function draw() {
	background(0);
	for(i=0; i<particles.length; i++){
		particles[i].draw();
	}
	for(i=0; i<particles.length; i++){
		particles[i].update();
	}
}

function mousePressed(){
	
	if(pos>=3){
		pos = 0;
		colors[0].setRed((colors[0]._getRed() + colors[1]._getRed()));
		colors[0].setGreen((colors[0]._getGreen() + colors[1]._getGreen()));
		colors[0].setBlue((colors[0]._getBlue() + colors[1]._getBlue()));

		colors[1].setRed((colors[1]._getRed() + colors[2]._getRed()));
		colors[1].setGreen((colors[1]._getGreen() + colors[2]._getGreen()));
		colors[1].setBlue((colors[1]._getBlue() + colors[2]._getBlue()));
	
		colors[2].setRed((colors[2]._getRed() + 255)/2);
		colors[2].setGreen((colors[2]._getGreen() + 255)/2);
		colors[2].setBlue((colors[2]._getBlue() + 255)/2);
	}

	for(i=0; i<N; i++){
		particles.push(new Particle(mouseX, mouseY, colors[pos]));
	}
	pos+=1;

}