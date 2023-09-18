class Copepod {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, -1);
    this.acceleration = createVector(0, 0);
    this.ovalWidth = 40;
    this.ovalHeight = 100;
    this.maxSpeed = 3;
    this.maxForce = 0.5;
  }
  
  update() {
    this.acceleration.limit(this.maxForce);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity); 
    this.acceleration.mult(0); 
  }
  








  display() {
    push(); // Save the current drawing settings
    translate(this.position.x, this.position.y); // Move the origin to the copepod's position
    // Draw the oval body
    fill(color(255, 200, 100, 180)); 
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


