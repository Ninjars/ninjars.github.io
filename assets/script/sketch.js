// inpired and derived from https://p5js.org/examples/hello-p5-flocking.html

let boids = [];
let boidCount = 50;
let boidSize = 10;
let boidMaxSpeed = 1.2;
let boidMaxForce = 0.015;

let repelFactor = 1;
let attractFactor = 0.5;

let desiredSeparation = 45.0;
let lineRange = 75.0;
let mouseInfluenceRange = 200.0;
let mouseInfluenceSqr = mouseInfluenceRange * mouseInfluenceRange;

function setup() {
    let canvas = createCanvas(windowWidth, getHeight());    
    canvas.parent('sketch-holder');

    for (let i = 0; i < boidCount; i++) {
        boids[i] = new Boid(i, random(width), random(height));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, getHeight());
}

function draw() {
    background(48, 53, 65);
    
    let mousePosition = createVector(mouseX, mouseY);
    for (let i = 0; i < boids.length; i++) {
        boids[i].run(mousePosition, boids);
    }
}

function getHeight() {
    return document.getElementById('top-box').offsetHeight
}

class Boid {
    constructor(id, x, y) {
        this.id = id;
        this.acceleration = createVector(0, 0);
        this.velocity = p5.Vector.random2D();
        this.position = createVector(x, y);
        this.r = 3;
        this.maxSpeed = boidMaxSpeed;
        this.maxForce = boidMaxForce;
    }

    run(mousePosition, boids) {
        let distances = [];
        for (let i = 0; i < boids.length; i++) {
            distances[i] = p5.Vector.dist(this.position, boids[i].position);
        }
        this.render(mousePosition, boids, distances);
        this.interact(mousePosition, boids, distances);
        this.update();
        this.borders();
    }

    // Draw boid and lines to nearby boids
    render(mousePosition, boids, distances) {
        for (let i = this.id; i < distances.length; i++) {
            let distance = distances[i] / lineRange;
            if (distance > 0 && distance <= 1) {
                stroke(255, (1 - distance) * 255);
                line(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
            }
        }

        let mouseDistance = p5.Vector.dist(this.position, mousePosition) / mouseInfluenceRange;
        if (mouseDistance <= 1) {
            stroke(255, (1 - mouseDistance) * 255);
            line(this.position.x, this.position.y, mousePosition.x, mousePosition.y);
        }

        fill(110, 150, 170, 127);
        stroke(200);
        ellipse(this.position.x, this.position.y, boidSize, boidSize);
    }

    // Wraparound
    borders() {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }

    update() {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        // Reset acceleration to 0 each cycle
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    interact(mousePosition, boids, distances) {
        let separationSteer = this.getSeparationForce(boids, distances);
        let mouseSteer = this.getMouseAttractionForce(mousePosition);

        this.applyForce(separationSteer.mult(repelFactor));
        this.applyForce(mouseSteer.mult(attractFactor));
    }

    getSeparationForce(boids, distances) {
        let steer = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let distance = distances[i];
            if (distance > 0 && distance < desiredSeparation) {
                let vector = p5.Vector.sub(this.position, boids[i].position);
                vector.normalize();
                // Weight the contribution of this steer by distance
                vector.div(distance);
                steer.add(vector);
                count++;
            }
        }

        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.magSq() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize();
            steer.mult(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    getMouseAttractionForce(mousePosition) {
        let vector = p5.Vector.sub(mousePosition, this.position);
        if (vector.magSq() > mouseInfluenceSqr) {
            return createVector(0, 0);
        }

        vector.normalize();
        vector.mult(this.maxSpeed);

        // steer = desired vector - velocity
        let steer = p5.Vector.sub(vector, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }
}