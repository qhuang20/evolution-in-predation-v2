class Copepod {
  constructor(x, y, dna) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, -1);
    this.acceleration = createVector(0, 0);
    this.ovalWidth = random(30, 40);
    this.ovalHeight = random(80, 100);
    this.maxSpeed = 3.0; // same as ciliate
    this.maxForce = 0.3; // lower than ciliate
    this.maxEnergy = 20; // greater than ciliate
    this.mutationRate = 0.02; // greater than ciliate

    this.reproductionRate = 0.001; // lower than ciliate
    this.lifespan = 2.5; // greater than ciliate
    this.agingRate = 0.0005; 
    this.energy = 2; // greater than ciliate
    this.energyDissipationRate = 0.002; // greater than ciliate

    // Initialize DNA with mutations
    this.initDNA(dna);
  }

  initDNA(existingDNA) {
    this.dna = [];
    if (existingDNA === undefined) {
      this.dna[0] = random(2, 3); // Food attraction
      // this.dna[1] = random(-2, 2); // Predator repulsion
      this.dna[2] = random(50, 150); // Food perception
      // this.dna[3] = random(0, 100); // Predator perception
    } else {
      this.dna = existingDNA.map((gene, index) => {
        if (random(1) < this.mutationRate) {
          return gene + random(-0.1, 0.1); // Add mutation
        }
        return gene;
      });
    }
  }

  update() {
    this.lifespan -= this.agingRate;
    this.energy -= this.energyDissipationRate;

    this.acceleration.limit(this.maxForce);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity); 
    this.acceleration.mult(0); 
  }
  




  applyForce(force) {
    this.acceleration.add(force);
  }

  forceTo(target) {
    const desiredDir = p5.Vector.sub(target, this.position);
    desiredDir.setMag(this.maxSpeed);
    const steeringForce = p5.Vector.sub(desiredDir, this.velocity);
    return steeringForce;
  }

  closestObjectIndex(list, perception) {
    let closestDist = Infinity;
    let closestIndex = null;
    for (let i = list.length - 1; i >= 0; i--) {
      const distance = this.position.dist(list[i].position);
      if (distance < closestDist && distance < perception) {
        closestDist = distance;
        closestIndex = i;
      }
    }
    return closestIndex;
  }

  actOnEnvironment(foods) {
    const nextFoodIndex = this.closestObjectIndex(foods, this.dna[2]);
    const foodSteer =
      nextFoodIndex != null && this.energy < this.maxEnergy
        ? this.forceTo(foods[nextFoodIndex].position)
        : createVector(0, 0);
    foodSteer.mult(this.dna[0]);
    this.applyForce(foodSteer);
    // eat the food
    if (nextFoodIndex != null) {
      const foodDist = this.position.dist(foods[nextFoodIndex].position);
      if (foodDist < this.ovalWidth) {
        this.energy += foods[nextFoodIndex].energy;
        foods.splice(nextFoodIndex, 1);
      }
    }
  }





  reproduce() {
    if (random(1) < this.reproductionRate && this.energy > 12) {
      this.energy -= 4; // Use some energy for reproduction
      return new Copepod(this.position.x, this.position.y, this.dna);
    }
    return null;
  }

  isDead() {
    return this.lifespan < 0 || this.energy < 0;
  }




  display() {
    const angle = this.velocity.heading() + PI / 2; 

    push(); // Save the current drawing settings
    translate(this.position.x, this.position.y); // Move the origin to the copepod's position
    rotate(angle);
    // Draw the oval body
    const alphaValue = map(this.lifespan, 0, 2, 0, 255);
    // fill(color(255 * alphaValue, 200 * alphaValue, 100 * alphaValue, 180 * alphaValue)); 
    fill(color(255, 200, 100, alphaValue)); 
    stroke(255);
    strokeWeight(2);
    ellipse(0, 0, this.ovalWidth, this.ovalHeight);
    // Draw the two antennae
    strokeWeight(2);
    line(0, -this.ovalHeight / 2, -65, -this.ovalHeight / 2 - 20); // Left antenna
    line(0, -this.ovalHeight / 2, 65, -this.ovalHeight / 2 - 20); // Right antenna
    // Draw the tail
    strokeWeight(4);
    line(0, this.ovalHeight / 2, 0, this.ovalHeight / 2 + 40); // Tail
    pop(); // Restore original drawing settings
  }

  borders() {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y > height) this.position.y = 0;
  }
  
}


