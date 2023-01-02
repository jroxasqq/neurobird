class Pipe {
  constructor(xPos) {
    this.thick = 80;
    this.gap = 150;

    // 'Pipe' comes in pairs, with
    // this.top refering to the bottom left corner of top pipe,
    // this.bot refering to the top left corner of the bottom pipe.
    this.top = createVector(xPos, random(50, height - this.gap));
    this.bot = createVector(xPos, this.top.y + this.gap);

    this.vel = createVector(2, 0);
  }

  // Update the position of the pipe pair.
  update() {
    this.top.sub(this.vel);
    this.bot.sub(this.vel);
  }

  // Show the pipes on the canvas.
  show() {
    fill(46, 163, 77);
    strokeWeight(4);
    stroke(51);
    rect(this.top.x, 0, this.thick, this.top.y);
    rect(this.bot.x, this.bot.y, this.thick, height - this.bot.y);
    noStroke();
    noFill();
  }
}

class Pipes {
  constructor() {
    this.nPipes = 5;
    this.pipes = [];
    this.seperation = 330;

    // Initialise pipes array with pipes seperated by 330px gap.
    for (let i = 0; i < this.nPipes; i++) {
      this.pipes.push(new Pipe(width + this.seperation * i));
    }
  }

  // Returns the pipes array of this object.
  getPipes() {
    return this.pipes;
  }

  // Regenerates new pipes if pipes deleted due to being our of game view.
  replace() {
    if (this.pipes.length < this.nPipes) {
      // hor. comp. of last pipes in the array.
      const lastPipe = this.pipes[this.pipes.length - 1].top.x;
      this.pipes.push(new Pipe(lastPipe + this.seperation));
    }
  }

  // Update the position of all pipes.
  update() {
    for (const pipe of this.pipes) {
      pipe.update();
    }

    // Filter out pipes that are out of the game view.
    this.pipes = this.pipes.filter(pipe => (pipe.top.x > -width));

    // Replace any possibly deleted pipes.
    this.replace();
  }

  // Resets pipes by regenerating a new set of pipes.
  reset() {
    this.pipes = [];
    for (let i = 0; i < this.nPipes; i++) {
      this.pipes.push(new Pipe(width + 330 * i));
    }
  }

  // Show all the pipes to the canvas.
  show() {
    for (const pipe of this.pipes) {
      pipe.show();
    }
  }
}