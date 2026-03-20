function setup() {
  createCanvas(600, 300);
}

function draw() {
  background(255);

  // Franja verde
  fill(0, 104, 71);
  rect(0, 0, 200, height);

  // Franja blanca
  fill(255);
  rect(200, 0, 200, height);

  // Franja roja
  fill(206, 17, 38);
  rect(400, 0, 200, height);

  // Escudo simple (águila)
  fill(139, 69, 19); // café
  ellipse(300, 150, 50, 40); // cuerpo

  fill(255, 215, 0); // dorado
  triangle(280, 135, 300, 110, 320, 135); // ala

  stroke(0, 100, 0);
  strokeWeight(2);
  noFill();
  arc(310, 160, 30, 20, 0, PI); // serpiente

  noStroke();

  // nopal
  fill(34, 139, 34);
  rect(320, 170, 8, 30);
}
