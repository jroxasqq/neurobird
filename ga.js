const nextGeneration = () => {
  for (let i = 0; i < nBirds; i++) {
    birds.birds[i] = new Bird(10 + 30 * i);
  }
}