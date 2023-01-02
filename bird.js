// Function returning the closest passed pipe from the bird.
const closestPipe = (bird, pipes) => {
  let closestDist = Infinity;
  let closestPipe = null;
  for (const pipe of pipes.getPipes()) {
    const dist = pipe.top.x - bird.pos.x;
    if (dist > 0 && dist < closestDist) {
      closestDist = dist;
      closestPipe = pipe;
    }
  }

  // Return the [x, y] related to the closest top pipe.
  return [closestDist, closestPipe.top.y];
}

// Normalises the inputs array values to the range 0 to 1.
const normaliseInputs = (inputs) => {
  inputs[0] /= width; // x coord of nearest top pipe.
  inputs[1] /= height; // y coord of nearest top pipe.
  inputs[2] /= height; // y coord of the bird.
  inputs[3] /= 6; // y coord of birds velocity.
}

class Bird {
  constructor(yPos) {
    this.fat = 40; // thickness of the bird.
    this.initPos = yPos;

    this.brain = new NeuralNetwork(4, 4, 1);

    // We add acceleration to imitate parabolic path of bird.
    this.pos = createVector(width / 5, this.initPos);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0.2);
  }

  // Update the position of the bird.
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    // Restrict the velocity of the bird for more 'smooth flying'.
    this.vel.limit(6); // since vel.x === 0, vel.limit === vel.y.max 
  }

  // Resets birds properties back to initial state.
  reset() {
    this.pos = createVector(width / 5, this.initPos);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0.2);
  }

  // Checks if the bird is colliding with any pipes or exceeds the.
  // the map bounds, if so, reset the bird and pipes.
  collide(pipes) {
    // Check if it's outside map bounds.
    if (this.pos.y <= 0 || this.pos.y >= height) {
      return true;
    }

    // Loop through each pipe pair from the passed Pipe object pipes array.
    for (const pipe of pipes.getPipes()) {
      // First check that it's between two pipes.
      if (this.pos.x >= pipe.top.x && this.pos.x <= pipe.top.x + pipe.thick) {
        // Then check if it's inside any of the pipes of the pipe pair.
        if (this.pos.y <= pipe.top.y || this.pos.y >= pipe.bot.y) {
          return true;
        }
      }
    }

    return false;
  }

  // The bird moves upward.
  fly() {
    if (this.vel.y > 0) {
      this.vel.sub(0, 20);
    } else {
      this.vel.sub(0, 6);
    }
  }

  think(pipes) {
    const inputs = [];
    [inputs[0], inputs[1]] = closestPipe(this, pipes);
    inputs[2] = this.pos.y;
    inputs[3] = this.vel.y;
    normaliseInputs(inputs);

    const result = this.brain.predict(inputs)[0];
    if (result > 0.5) {
      this.fly();
    }
  }

  // Show the bird on the canvas.
  show() {
    fill(255, 204, 0, 120);
    strokeWeight(4);
    stroke(51);
    ellipse(this.pos.x, this.pos.y, this.fat, this.fat);
    noStroke();
    noFill();
  }
}

class Birds {
  constructor() {
    this.birds = [];
    for (let i = 0; i < nBirds; i++) {
      this.birds.push(new Bird(10 + 30 * i));
    }
  }

  update() {
    for (const bird of this.birds) {
      bird.update();
    }
  }

  collide(pipes) {
    for (const bird of this.birds) {
      // If a bird collides with a pipe or walls, remove
      // them from the birds array.
      if (bird.collide(pipes)) {
        const idx = this.birds.indexOf(bird);
        this.birds.splice(idx, 1);
      }
    }

    // If all birds dead, reset all birds and pipes.
    if (this.birds.length === 0) {
      console.log("reached");
      nextGeneration();
      pipes.reset();
    }
  }

  fly() {
    for (const bird of this.birds) {
      bird.fly();
    }
  }

  think(pipes) {
    for (const bird of this.birds) {
      bird.think(pipes);
    }
  }

  show() {
    for (const bird of this.birds) {
      bird.show();
    }
  }
}