class Ciliate {
  constructor(x, y, dna) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -1);
    this.position = createVector(x, y);
    this.ovalWidth = random(10, 20); 
    this.ovalHeight = random(20, 40);
    this.maxSpeed = 3;
    this.maxForce = 0.5;
    this.maxEnergy = 10
    this.mutationRate = 0.01;

    this.reproductionRate = 0.002; // default is 0.002
    this.lifespan = 1;
    this.agingRate = 0.0005; // default is 0.0005 
    this.energy = 1; // init is 1 when it's born
    this.energyDissipationRate = 0.001;

    // Initialize DNA with mutations
    this.initDNA(dna);
  }

  initDNA(existingDNA) {
    this.dna = [];
    if (existingDNA === undefined) {
      this.dna[0] = random(-2, 2); // Food attraction
      this.dna[1] = random(-2, 2); // Poison repulsion
      this.dna[2] = random(0, 100); // Food perception
      this.dna[3] = random(0, 100); // Poison perception
    } else {
      this.dna = existingDNA.map((gene, index) => {
        if (random(1) < this.mutationRate) {
          return gene + random(-0.1, 0.1); // Add mutation
        }
        return gene;
      });
    }
  }

  // Update ciliate state
  update() {
    this.lifespan -= this.agingRate;
    this.energy -= this.energyDissipationRate;

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  seek(target) {
    const desiredDir = p5.Vector.sub(target, this.position);
    desiredDir.setMag(this.maxSpeed);
    const steeringForce = p5.Vector.sub(desiredDir, this.velocity);
    steeringForce.limit(this.maxForce);
    return steeringForce;
  }

  seekClosest(list, nutritionValue, perception) {
    let closestDist = Infinity;
    let closestPoint = null;
    for (let i = list.length - 1; i >= 0; i--) {
      const distance = this.position.dist(list[i]);
      if (distance < this.maxSpeed && this.energy < this.maxEnergy) {
        list.splice(i, 1);
        this.energy += nutritionValue;
      } else if (distance < closestDist && distance < perception) {
        closestDist = distance;
        closestPoint = list[i];
      }
    }
    return closestPoint ? this.seek(closestPoint) : createVector(0, 0);
  }

  actOnEnvironment(food) {
    const foodSteer = this.seekClosest(food, algaeNutritionEnergy, this.dna[2]);
    // const poisonSteer = this.seekClosest(poison, -1, this.dna[3]);
    foodSteer.mult(this.dna[0]);
    // poisonSteer.mult(this.dna[1]);
    this.applyForce(foodSteer);
    // this.applyForce(poisonSteer);
  }





  reproduce() {
    if (random(1) < this.reproductionRate && this.energy > 8) {
      this.energy -= 2; // Use some energy for reproduction
      return new Ciliate(this.position.x, this.position.y, this.dna);
    }
    return null;
  }

  isDead() {
    return this.lifespan < 0 || this.energy < 0;
  }

  // Display ciliate on canvas
  display() {
    const angle = this.velocity.heading() + PI / 2;

    push(); // Save the current drawing settings
    translate(this.position.x, this.position.y); // Move the origin to the ciliate's position
    rotate(angle); // Rotate the coordinate system

    // Calculate transparency based on lifespan
    const alphaValue = map(this.lifespan, 0, 1, 0, 255);

    // Draw a long oval as the ciliate's body
    const white = color(255, 255, 255, alphaValue); // Alpha based on lifespan
    fill(white);
    stroke(white);
    strokeWeight(1);
    ellipse(0, 0, this.ovalWidth, this.ovalHeight); // Draws an oval

    // // Display perception radius for algae and poison
    // noFill();
    // strokeWeight(1);
    // stroke(0, 255, 0, 100); // Green for algae
    // ellipse(0, 0, this.dna[2] * 2);

    // stroke(255, 0, 0, 100); // Red for poison
    // ellipse(0, 0, this.dna[3] * 2);

    pop(); // Restore original drawing settings
  }

  // Wraparound logic for canvas edges
  borders() {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y > height) this.position.y = 0;
  }
}




