let vehicles = [];
let alignWeight;
let separateWeight;
let cohesionWeight;

function setup() {
	alignWeight = random(0.8, 1.2);
	separateWeight = random(0.8, 1.2);
	cohesionWeight = random(0.8, 1.2);
	createCanvas(windowWidth, windowHeight);
	let canvas = document.getElementById("defaultCanvas0");
	canvas.style.position = "fixed";
	canvas.style.top = 0;
	canvas.style.left = 0;
	canvas.style.zIndex = -1;
	for (let i = 0; i < 250; i++) {
		vehicles.push(new Vehicle());
	}
	angleMode(DEGREES);
	for (let i = 0; i < 5; i++) {
		updateScene();
	}
}

function updateScene() {
	for (let vehicle of vehicles) {
		let separateForce = vehicle.separate(vehicles);
		let alignForce = vehicle.align(vehicles);
		let cohesionForce = vehicle.cohesion(vehicles);
		alignForce.mult(alignWeight);
		separateForce.mult(separateWeight);
		cohesionForce.mult(cohesionWeight);
		let force = p5.Vector.add(alignForce, separateForce, cohesionForce);
		force.limit(vehicle.maxForce);
		vehicle.applyForce(force);
	}
	for (let vehicle of vehicles) {
		vehicle.update();
	}
}

function draw() {
	scale(1, -1);
	translate(0, -height);
	background(255);
	for (let vehicle of vehicles) {
		vehicle.draw();
	}
	updateScene();
}

class Vehicle {
	constructor() {
		this.center = createVector(random(width), random(height));
		this.param = 4;
		this.acceleration = createVector(0, 0);
		this.maxSpeed = 1;
		this.maxForce = 0.01;
		this.velocity = createVector(random(-1, 1), random(-1, 1));
		this.velocity.setMag(this.maxSpeed);
		this.maxSeparation = 5 * this.param;
		this.maxAlignment = 8 * this.param;
		this.maxCohesion = 12 * this.param;
	}
	getTriangleVertices() {
		return [0, 2 * this.param, this.param, -this.param, -this.param, -this.param];
	}
	seek(target) {
		let desired = p5.Vector.sub(target, this.center);
		desired.setMag(this.maxSpeed);
		let force = p5.Vector.sub(desired, this.velocity);
		force.limit(this.maxForce);
		return force;
	}
	getTargetOthers(others, maxDistance) {
		let res = [];
		for (let other of others) {
			let d = p5.Vector.dist(this.center, other.center);
			if (d > 0 && d < maxDistance) {
				res.push(other);
			}
		}
		return res;
	}
	separate(others) {
		let sum = createVector(0, 0);
		let targetOthers = this.getTargetOthers(others, this.maxSeparation);
		if (targetOthers.length == 0) return sum;
		for (let targetOther of targetOthers) {
			let d = p5.Vector.dist(this.center, targetOther.center);
			let diff = p5.Vector.sub(this.center, targetOther.center);
			diff.normalize();
			diff.div(d);
			sum.add(diff);
		}
		sum.setMag(this.maxSpeed);
		let steer = p5.Vector.sub(sum, this.velocity);
		steer.limit(this.maxForce);
		return steer;
	}
	align(others) {
		let sum = createVector(0, 0);
		let targetOthers = this.getTargetOthers(others, this.maxAlignment);
		if (targetOthers.length == 0) return sum;
		for (let targetOther of targetOthers) {
			sum.add(targetOther.velocity);
		}
		sum.setMag(this.maxSpeed);
		let steer = p5.Vector.sub(sum, this.velocity);
		steer.limit(this.maxForce);
		return steer;
	}
	cohesion(others) {
		let sum = createVector(0, 0);
		let targetOthers = this.getTargetOthers(others, this.maxCohesion);
		if (targetOthers.length == 0) return sum;
		for (let targetOther of targetOthers) {
			sum.add(targetOther.center);
		}
		sum.div(targetOthers.length);
		return this.seek(sum);
	}
	draw() {
		noStroke();
		push();
		translate(this.center.x, this.center.y);
		rotate(this.velocity.heading() - 90);
		let transparency = 20;

		let lowX = width * 0.2;
		let highX = width * 0.8;
		let x = this.center.x;
		if (x < lowX) {
			transparency = map(x, 0, lowX, 150, 20);
		} else if (x > highX) {
			transparency = map(x, highX, width, 20, 150);
		}

		let red = map(x, 0, width, 255, 0);


		fill(red, 0, 255 - red, transparency);
		triangle(...this.getTriangleVertices());
		pop();
	}
	limitCenter() {
		if (this.center.x > width) {
			this.center.x = 0;
		}
		if (this.center.y > height) {
			this.center.y = 0;
		}
		if (this.center.x < 0) {
			this.center.x = width;
		}
		if (this.center.y < 0) {
			this.center.y = height;
		}
	}
	update() {
		this.velocity.add(this.acceleration);
		this.center.add(this.velocity);
		this.acceleration.set(0, 0);
		this.limitCenter();
	}
	applyForce(force) {
		this.acceleration.add(force);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
