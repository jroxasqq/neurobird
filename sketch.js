const nBirds = 100;

function setup() {
  createCanvas(400, 600);
  birds = new Birds();
  pipes = new Pipes();
}

function draw() {
  background(85, 200, 250);

  pipes.update();
  birds.update();
  birds.collide(pipes);
  
  birds.think(pipes);

  pipes.show();
  birds.show();
}
