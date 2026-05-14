let moverBalonX = 0;
let moverBalonZ = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(2, 5, 15);
  
  // Actualizar coordenadas en el HTML
  let el = document.getElementById('posicion');
  if(el) el.innerText = `📍 Posición: X: ${floor(moverBalonX)} | Z: ${floor(moverBalonZ)}`;

  // Control de cámara
  orbitControl(1.5, 1.5, 0.2);

  // === ILUMINACIÓN ===
  ambientLight(40, 40, 70); // Luz ambiental azulada
  directionalLight(200, 200, 200, 0, 1, -1); // Luz de foco principal
  pointLight(255, 255, 255, mouseX - width/2, mouseY - height/2, 400); // Luz que sigue al mouse

  // --- DIBUJAR CAMPO ---
  push();
  translate(0, 250, 0);
  noStroke();
  ambientMaterial(10, 100, 30);
  box(2000, 10, 1200);
  pop();

  // --- DIBUJAR BALÓN ---
  push();
  let rebote = abs(sin(frameCount * 0.04)) * -250;
  translate(-300 + moverBalonX, 210 + rebote, 200 + moverBalonZ);
  rotateY(frameCount * 0.05);
  specularMaterial(255);
  shininess(20);
  sphere(45, 24);
  pop();

  // --- DIBUJAR TROFEO ---
  dibujarTrofeo(350, 120, -100);

  // --- DIBUJAR PORTERÍA ---
  dibujarPorteria(0, 250, -580);
  
  // --- DIBUJAR GRADAS ---
  push();
  translate(0, 180, 650);
  ambientMaterial(40, 45, 60);
  box(2200, 150, 150);
  pop();
}

function dibujarTrofeo(x, y, z) {
  push();
  translate(x, y, z);
  rotateY(frameCount * 0.02);
  specularMaterial(255, 215, 0); // ORO
  shininess(150);
  noStroke();
  push(); translate(0, 100, 0); box(140, 20, 140); pop(); // Base
  cylinder(45, 150); // Cuerpo
  push(); translate(0, -100, 0); sphere(80); // Copa
  push(); translate(85, 0, 0); rotateZ(0.4); torus(40, 10); pop(); // Asa R
  push(); translate(-85, 0, 0); rotateZ(-0.4); torus(40, 10); pop(); // Asa L
  pop();
  pop();
}

function dibujarPorteria(x, y, z) {
  push();
  translate(x, y, z);
  specularMaterial(220);
  push(); translate(0, -180, 0); rotateZ(HALF_PI); cylinder(10, 600); pop();
  push(); translate(-300, -90, 0); cylinder(10, 180); pop();
  push(); translate(300, -90, 0); cylinder(10, 180); pop();
  pop();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) moverBalonX -= 25;
  if (keyCode === RIGHT_ARROW) moverBalonX += 25;
  if (keyCode === UP_ARROW) moverBalonZ -= 25;
  if (keyCode === DOWN_ARROW) moverBalonZ += 25;
  moverBalonX = constrain(moverBalonX, -800, 800);
  moverBalonZ = constrain(moverBalonZ, -1000, 600);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}