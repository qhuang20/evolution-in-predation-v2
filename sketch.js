// Algae gets Energy from sunlight through the process of photosynthesis.
// Ciliate gets Energy by feeding on algae.

const ciliates = [];
const algaes = [];
const copepods = [];

const algaeNutritionEnergy = 1;
const algaeBirthRate = 0.1;
const maxNumAlgaes = 100;
const ciliateNutritionEnergy = 2;

const initNumAlgaes = 40;
const initNumCiliates = 15;
const initNumCopepods = 2;


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
  // Add add Copepod button
  let addCopepodButton = createButton('Add Copepod');
  addCopepodButton.position(280, 10);  // Adjust the position value based on the actual spacing needed.
  addCopepodButton.mousePressed(addCopepod);
  addCopepodButton.style('font-size', '20px');
  addCopepodButton.style('color', 'red');
  // Store data every 1 second
  setInterval(storeData, 1000);


  generateAlgaes(initNumAlgaes);
  generateCiliates(initNumCiliates)
  generateCopepods(initNumCopepods);
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
    copepod.borders();
    copepod.actOnEnvironment(ciliates); // no predator
    copepod.update(); 
    copepod.display(); 

    const offspring = copepod.reproduce();
    if (offspring != null && copepods.length < 4 && ciliates.length > 20) { // must make sure the food is plenty
      copepods.push(offspring);
    }

    if (copepod.isDead()) {
      algaes.push(createVector(copepod.position.x, copepod.position.y));
      algaes.push(createVector(copepod.position.x, copepod.position.y));
      copepods.splice(i, 1);
    }
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
    copepods.push(new Copepod(x, y));
  }
}





// For the Add Copepod button
function addCopepod() {
  generateCopepods(1);
}

// Display energy stats
function displayStats() {
  let totalAlgaeEnergy = algaes.length * algaeNutritionEnergy;

  let totalCiliateEnergy = 0;
  for (let ciliate of ciliates) {
    totalCiliateEnergy += ciliate.energy;
  }

  let totalCopepodEnergy = 0;
  for (let copepod of copepods) {
    totalCopepodEnergy += copepod.energy;
  }

  let totalEnergy = totalCiliateEnergy + totalAlgaeEnergy + totalCopepodEnergy;

  fill(255);
  textAlign(RIGHT);
  textSize(22);
  text(`Time Elapsed: ${timeElapsedInSeconds} s`, width - 10, 20);
  text(`Algae Energy: ${totalAlgaeEnergy.toFixed(1)}`, width - 10, 40);
  text(`Ciliate Energy: ${totalCiliateEnergy.toFixed(1)}`, width - 10, 60);
  text(`Copepod Energy: ${totalCopepodEnergy.toFixed(1)}`, width - 10, 80);
  text(`Total Energy: ${totalEnergy.toFixed(1)}`, width - 10, 100);
}

function restartSketch() {
  // Clear existing arrays
  algaes.length = 0;
  ciliates.length = 0;
  copepods.length = 0;

  // Regenerate everything
  generateAlgaes(initNumAlgaes);
  generateCiliates(initNumCiliates)
  generateCopepods(initNumCopepods);
}

function storeData() {
  timeElapsedInSeconds++; 
  
  let totalCiliateEnergy = 0;
  for (let ciliate of ciliates) {
    totalCiliateEnergy += ciliate.energy;
  }
  let totalAlgaeEnergy = algaes.length * algaeNutritionEnergy;
  let totalCopepodEnergy = copepods.length * ciliateNutritionEnergy; // I'm assuming copepods' energy is stored similarly to ciliates'
  let totalEnergy = totalCiliateEnergy + totalAlgaeEnergy;

  // Store the data
  frameData.push([
    timeElapsedInSeconds,
    totalEnergy,
    algaes.length,
    totalAlgaeEnergy,
    ciliates.length,
    totalCiliateEnergy,
    copepods.length,
    totalCopepodEnergy  
  ]);
}


function arrayToCSV(arr) {
  const csv = arr.map(row => row.join(',')).join('\n');
  return csv;
}

function downloadData() {
  let csvContent = "Time Elapsed (s),Total Energy,Algae Population,Algae Energy,Ciliate Population,Ciliate Energy,Copepod Population,Copepod Energy\n"; 
  csvContent += arrayToCSV(frameData);
  
  // Create a blob and download
  let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  let link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", "evolution_data.csv");
  link.click();
}



