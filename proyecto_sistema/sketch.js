let balls = [];
let rotX = -0.5;
let rotY = 0;
let zoom = 1;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Agregamos un balón inicial
  balls.push(new Ball());
}

function draw() {
  background(10, 15, 25);
  
  //AQUI SUCEDE LA ILUMINACIÓN AVANZADA
  ambientLight(60);
  pointLight(255, 255, 255, 0, -500, 200);
  directionalLight(100, 255, 100, 0, 1, 0); // Luz verde para el pasto

  // TRASFORMACION GLOBLALL
  push();
  scale(zoom);
  rotateX(rotX);
  rotateY(rotY);

  // CAMPO CHIDO
  for(let i = -10; i < 10; i++) {
    fill(i % 2 === 0 ? color(34, 139, 34) : color(40, 150, 40));
    push();
    translate(0, 0, i * 40);
    rotateX(HALF_PI);
    plane(800, 40);
    pop();
  }

  // SE DIBUJA LA PORTERIA
  dibujarArco();

  // SISTEMA DE BALONES
  for (let b of balls) {
    b.update();
    b.display();
  }
  pop();
}

function dibujarArco() {
  fill(240);
  stroke(200);
  // Poste Izquierdo
  push(); translate(-150, -50, -380); box(10, 100, 10); pop();
  // Poste Derecho
  push(); translate(150, -50, -380); box(10, 100, 10); pop();
  // Travesaño
  push(); translate(0, -100, -380); box(310, 10, 10); pop();
  
  // Red 
  noFill();
  stroke(255, 50);
  push();
  translate(0, -50, -410);
  box(300, 100, 60);
  pop();
}

class Ball {
  constructor() {
    this.pos = createVector(0, -15, 400);
    this.vel = createVector(random(-5, 5), random(-8, -2), -15);
  }
  update() {
    this.pos.add(this.vel);
    if (this.pos.z < -500) { // Reiniciar si sale del campo
      this.pos = createVector(0, -15, 400);
      this.vel = createVector(random(-5, 5), random(-8, -2), -15);
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(frameCount * 0.2); // Rotación de balón
    fill(255);
    noStroke();
    specularMaterial(250); // Material que brilla con la luz
    sphere(15);
    pop();
  }
}

function keyPressed() {
  if (key === 'q' || key === 'Q') zoom += 0.1;
  if (key === 'e' || key === 'E') zoom -= 0.1;
  if (keyCode === UP_ARROW) rotX -= 0.05;
  if (keyCode === DOWN_ARROW) rotX += 0.05;
  if (keyCode === LEFT_ARROW) rotY -= 0.05;
  if (keyCode === RIGHT_ARROW) rotY += 0.05;
  if (key === ' ') balls.push(new Ball()); 
}