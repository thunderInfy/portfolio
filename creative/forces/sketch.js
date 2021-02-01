G_def = 1;
G_att = 20;
r = 5;

class Particle{
	constructor(x,y, col){
		this.pos = createVector(x,y);
		this.vel = createVector(0,0);
		this.r = col._getRed();
		this.g = col._getGreen();
		this.b = col._getBlue();
		this.force = createVector(0,0);
	}
	draw(){
		stroke(this.r, this.g, this.b);
		strokeWeight(3);
		point(this.pos.x, this.pos.y);
	}
	updateForce(particle, type){
		let sign;
		if(type=='repulsive'){
			sign = G_def;
		}
		else{
			sign = -G_att;
		}
		let d = p5.Vector.dist(this.pos, particle.pos);
		let x = this.pos.x - particle.pos.x;
		let y = this.pos.y - particle.pos.y;
		let n = sqrt(pow(x,2)+pow(y,2));

		d = max(d, 2*r);
		
		this.force.x += sign*x/(n*d*d);
		this.force.y += sign*y/(n*d*d);
		particle.force.x -= sign*x/(n*d*d);
		particle.force.y -= sign*y/(n*d*d);
	}
	update(){
		this.vel.x += this.force.x;
		this.vel.y += this.force.y;
		
		if(this.vel.x > 0)
			this.vel.x = min(100, this.vel.x);
		else
			this.vel.x = max(-100, this.vel.x);
		
		if(this.vel.y > 0)
			this.vel.y = min(100, this.vel.y);
		else
			this.vel.y = max(-100, this.vel.y);

		let nx, ny;

		nx = this.pos.x + this.vel.x;
		ny = this.pos.y + this.vel.y;
	
		if(nx < 0 || nx > width){
			this.vel.x*=-1;
		}

		if(ny < 0 || ny > height){
			this.vel.y*=-1;
		}

		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;

	}
}

class ParticleGroup{
	constructor(x, y, col){
		this.col = col;
		this.particles = [];

		let rows = floor(sqrt(N));
		let cols = ceil(N/rows);
		let lastrowcols = N - cols*(rows-1);

		for(let row=0; row<rows-1; row++){
			for(let col=0; col<cols; col++){
				this.particles.push(new Particle(x+col*2*r,y+row*2*r,this.col));
			}
		}
		for(let col=0; col<lastrowcols; col++){
			this.particles.push(new Particle(x+col*2*r,y+(rows-1)*2*r,this.col));
		}

	}
	update(){
		for(let i=0; i<N; i++){
			this.particles[i].update();
		}
	}
	updateIntraGroup(){
		for(let i=0; i<N; i++){
			for(let j=i+1; j<N; j++){
				this.particles[i].updateForce(this.particles[j], 'repulsive');
			}
		}
	}
	draw(){
		for(let i=0; i<N; i++){
			this.particles[i].draw();
		}
	}
	reset(){
		for(let i=0; i<N; i++){
			this.particles[i].force.x = 0;
			this.particles[i].force.y = 0;
		}
	}
}

let groups = [];
let index = 0;
let N = 50;

let palette, gdef, gatt, rad;

function createForm(pstr, input){
	let para, inp;
	para = createP(pstr+'&emsp;');
	inp = createInput(str(input));
	para.style('display','inline');

	para.style('background-color','#600');
	para.style('color','#fff');

	inp.style('border','none');
	inp.style('background-color','#BC3C6D');
	inp.style('color','#fff');

	createP('&emsp;&emsp;&emsp;&emsp;').style('display','inline');
	return inp;
}

function setup() {
	createCanvas(windowWidth, windowHeight*0.9);
	palette = [color('#696969'),color('#228b22'),color('#800000'),color('#808000'),color('#483d8b'),color('#008b8b'),color('#9acd32'),color('#00008b'),color('#8fbc8f'),color('#8b008b'),color('#ff4500'),color('#ff8c00'),color('#ffff00'),color('#40e0d0'),color('#00ff00'),color('#8a2be2'),color('#00ff7f'),color('#dc143c'),color('#00bfff'),color('#0000ff'),color('#da70d6'),color('#b0c4de'),color('#ff00ff'),color('#1e90ff'),color('#db7093'),color('#f0e68c'),color('#90ee90'),color('#ff1493'),color('#7b68ee'),color('#ffa07a'),color('#f5f5dc'),color('#ffc0cb')];


	gdef = createForm('Repulsion Constant', 1);
	gatt = createForm('Attraction Constant', 20);
	rad = createForm('Radius', 5);
}

function draw() {
	background(0);
	for(let i = 0; i<groups.length; i++){
		groups[i].updateIntraGroup();
	}

	for(let i = 0; i<groups.length; i++){
		for(let j = i+1; j<groups.length; j++){
			for(let k=0; k<N; k++){
				for(let l=0; l<N; l++){
					groups[i].particles[k].updateForce(groups[j].particles[l], 'attractive');
				}
			}
		}
	}

	for(let i = 0; i<groups.length; i++){
		groups[i].update();
	}

	for(let i = 0; i<groups.length; i++){
		groups[i].draw();
	}

	for(let i = 0; i<groups.length; i++){
		groups[i].reset();
	}

	G_def = gdef.value();
	G_att = gatt.value();
	r = rad.value();
}

function mousePressed(){
	if(mouseY < height){
		if(index<32){
			col = palette[index];
			groups.push(new ParticleGroup(mouseX, mouseY, col));
			index++;
		}
	}	
}
