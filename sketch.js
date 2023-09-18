// Algae gets Energy from sunlight through the process of photosynthesis.
// Ciliate gets Energy by feeding on algae.

const ciliates = [];
const algaes = [];
const copepods = [];

const maxNumAlgaes = 100;
const numCiliates = 10;
const algaeNutritionEnergy = 1;
const algaeBirthRate = 0.1;

let restartButton; 
let frameData = [];
let timeElapsedInSeconds = 0;


function setup() {
  createCanvas(1040, 660);
  // Add restart button
  restartButton = createButton('Restart');
  restartButton.position(10, 10);
  restartButton.mousePressed(restartSketch);
  restartButton.style('font-size', '20px');  
  // Add get data button
  let getDataButton = createButton('Download Data');
  getDataButton.position(100, 10);
  getDataButton.mousePressed(downloadData);
  getDataButton.style('font-size', '20px');
  // Store data every 1 second
  setInterval(storeData, 1000);


  generateCiliates(numCiliates)
  generateAlgaes(30);
  generateCopepods(2);
}

function draw() {
  background(0);
  displayStats();

  // Algae grows randomly until it reaches maxAlgaes
  if (algaes.length < maxNumAlgaes && random(1) < algaeBirthRate) {
    generateAlgaes(1);
  }
  displayAlgaes(algaes, color(0, 255, 0), 4);

  // Ciliate 
  const algaesPositions = algaes;
  const copepodPositions = copepods.map(copepod => copepod.position);
  for (let i = ciliates.length - 1; i >= 0; i--) {
    const ciliate = ciliates[i];
    ciliate.borders();
    ciliate.actOnEnvironment(algaesPositions, copepodPositions);
    ciliate.update();
    ciliate.display();

    const offspring = ciliate.reproduce();
    if (offspring != null) {
      ciliates.push(offspring);
    }

    if (ciliate.isDead()) {
      algaes.push(createVector(ciliate.position.x, ciliate.position.y));
      ciliates.splice(i, 1);
    }
  }

  // Copepod 
  for (let i = copepods.length - 1; i >= 0; i--) {
    const copepod = copepods[i];
    copepods[i].update(); 
    copepods[i].borders(); 
    copepods[i].display(); 
  }
}















// --- Helper functions ----------------------------

// Generate algaes at random positions
function generateAlgaes(count) {
  for (let i = 0; i < count; i++) {
    const x = random(width);
    const y = random(height);
    algaes.push(createVector(x, y));
  }
}

function displayAlgaes(itemList, fillColor, size) { 
  fill(fillColor);
  noStroke();
  for (const item of itemList) {
    ellipse(item.x, item.y, size, size);
  }
}



// Generate ciliates at random positions
function generateCiliates(count) {
  // Create initial ciliates
  for (let i = 0; i < count; i++) {
    const x = random(width);
    const y = random(height);
    ciliates[i] = new Ciliate(x, y);
  }
}



// Generate copepods at random positions
function generateCopepods(count) {
  for (let i = 0; i < count; i++) {
    const x = random(width);
    const y = random(height);
    copepods[i] = new Copepod(x, y);
  }
}






// Display energy stats
function displayStats() {
  let totalCiliateEnergy = 0;
  for (let ciliate of ciliates) {
    totalCiliateEnergy += ciliate.energy;
  }
  let totalAlgaeEnergy = algaes.length * algaeNutritionEnergy;
  let totalEnergy = totalCiliateEnergy + totalAlgaeEnergy;

  fill(255);
  textAlign(RIGHT);
  textSize(22);
  text(`Total Energy: ${totalEnergy.toFixed(1)}`, width - 10, 20);
  text(`Algae Energy: ${totalAlgaeEnergy.toFixed(1)}`, width - 10, 40);
  text(`Ciliate Energy: ${totalCiliateEnergy.toFixed(1)}`, width - 10, 60);
}

function restartSketch() {
  // Clear existing arrays
  ciliates.length = 0;
  algaes.length = 0;

  // Regenerate ciliates and algaes
  generateCiliates(numCiliates);
  generateAlgaes(20);
}

function storeData() {
  timeElapsedInSeconds++; 
  
  let totalCiliateEnergy = 0;
  for (let ciliate of ciliates) {
    totalCiliateEnergy += ciliate.energy;
  }
  let totalAlgaeEnergy = algaes.length * algaeNutritionEnergy;
  let totalEnergy = totalCiliateEnergy + totalAlgaeEnergy;

  // Store the data
  frameData.push([
    timeElapsedInSeconds,
    totalEnergy,
    algaes.length,
    totalAlgaeEnergy,
    ciliates.length,
    totalCiliateEnergy
  ]);
}

function arrayToCSV(arr) {
  const csv = arr.map(row => row.join(',')).join('\n');
  return csv;
}

function downloadData() {
  let csvContent = "Time Elapsed (s),Total Energy,Algae Population,Algae Energy,Ciliate Population,Ciliate Energy\n";
  csvContent += arrayToCSV(frameData);
  
  // Create a blob and download
  let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  let link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", "evolution_data.csv");
  link.click();
}


