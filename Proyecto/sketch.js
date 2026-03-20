
let ang = 0;

let pelotaX = 420;
let pelotaY = 260;

let velX = 4;
let velY = -3;

// posicion del jugador
let jugadorX = 420;
let jugadorY = 330;
let escalaJugador = 1;
let rotacionJugador = 0;
let shearJugador = 0;

// puntos de la curva bezier
let p0x = 80, p0y = 300;
let p1x = 180, p1y = 80;
let p2x = 420, p2y = 80;
let p3x = 520, p3y = 300;
let moviendoPunto = -1;

// parametros del fractal
let nivelArbol = 5;
let anguloArbol = 0.5;

// modo de transformacion actual
let modo = "traslacion";
let moviendoJugador = false;

// variables extras para alargar el codigo
let contadorExtra = 0;
let listaNumeros = [1,2,3,4,5];
let textoExtra = "p5.js";
let colorFondo = 200;
let valorTemporal1 = 0;
let valorTemporal2 = 0;
let valorTemporal3 = 0;
let valorTemporal4 = 0;
let valorTemporal5 = 999;

function setup() {
  createCanvas(900, 500);
  textSize(14);
  
  // ciclo para agregar mas numeros
  for(let i=0; i<10; i++) {
    listaNumeros.push(i*2);
  }
}

function draw() {
  // fondo celeste
  background(90, 170, 255);
  
  // nubes
  fill(255, 255, 255, 200);
  noStroke();
  ellipse(150, 80, 60, 30);
  ellipse(180, 70, 40, 25);
  ellipse(500, 120, 80, 40);
  ellipse(530, 110, 50, 30);
  ellipse(700, 60, 70, 35);
  
  // cancha de futbol
  fill(20, 130, 40);
  rect(0, 300, 900, 200);
  stroke(255);
  line(0, 400, 900, 400);
  noFill();
  ellipse(450, 400, 100, 100);
  
  // gradas del estadio
  for (let i = 0; i < 5; i++) {
    fill(140 - i*10);
    rect(0, 220 - i * 20, 900, 18);
    
    // personas en las gradas
    for (let j = 0; j < 30; j+=2) {
      fill(200, 50, 50);
      ellipse(15 + j * 30, 210 - i * 20, 6, 6);
      
      // detalles pequeños
      if(j%10 == 0) {
        fill(255);
        ellipse(15 + j * 30, 205 - i * 20, 2, 2);
      }
      
      contadorExtra++;
    }
  }
  
  // porteria
  stroke(255);
  strokeWeight(4);
  noFill();
  rect(650, 250, 180, 120);
  strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    line(650 + i*22, 250, 650 + i*22, 370);
  }
  for (let j = 0; j < 5; j++) {
    line(650, 250 + j*24, 830, 250 + j*24);
  }
  
  // jugador con transformaciones aplicadas
  push();
  translate(jugadorX, jugadorY);
  rotate(rotacionJugador);
  scale(escalaJugador);
  shearX(shearJugador);
  
  // cuerpo del jugador
  fill(0, 120, 40);
  rect(-12, -60, 24, 45);
  
  // cabeza
  fill(255, 220, 180);
  ellipse(0, -75, 25, 25);
  
  // short
  fill(255);
  rect(-12, -15, 24, 15);
  
  // brazos
  stroke(255, 220, 180);
  strokeWeight(5);
  line(-12, -45, -30, -30);
  line(12, -45, 30, -30);
  
  // piernas
  stroke(0);
  strokeWeight(6);
  line(-5, 0, -30, 25);
  line(5, 0, 30, 25);
  
  // pie
  strokeWeight(5);
  line(30, 25, 50, 15);
  pop();
  
  // movimiento de la pelota
  pelotaX += velX;
  pelotaY += velY;
  
  velY += 0.1;
  
  if (pelotaY < 100 || pelotaY > 350) {
    velY *= -0.9;
    pelotaY = constrain(pelotaY, 100, 350);
  }
  if (pelotaX < 50 || pelotaX > 820) {
    velX *= -0.9;
    pelotaX = constrain(pelotaX, 50, 820);
  }
  
  fill(255);
  stroke(0);
  ellipse(pelotaX, pelotaY, 22, 22);
  line(pelotaX-8, pelotaY, pelotaX+8, pelotaY);
  line(pelotaX, pelotaY-8, pelotaX, pelotaY+8);
  
  // curva bezier
  stroke(150, 150, 150, 100);
  strokeWeight(1);
  line(p0x, p0y, p1x, p1y);
  line(p1x, p1y, p2x, p2y);
  line(p2x, p2y, p3x, p3y);
  
  stroke(255, 0, 0);
  strokeWeight(3);
  noFill();
  bezier(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
  
  fill(0, 255, 0);
  ellipse(p0x, p0y, 10, 10);
  ellipse(p3x, p3y, 10, 10);
  fill(255, 255, 0);
  ellipse(p1x, p1y, 10, 10);
  ellipse(p2x, p2y, 10, 10);
  
  fill(0);
  text("P0", p0x+10, p0y-10);
  text("P1", p1x+10, p1y-10);
  text("P2", p2x+10, p2y-10);
  text("P3", p3x+10, p3y-10);
  
  // arbol fractal
  push();
  translate(750, 380);
  dibujarArbol(50, nivelArbol, anguloArbol);
  pop();
  
  // instrucciones en pantalla
  fill(0);
  textSize(20);
  text("CHILENA MEXICANA", 20, 30);
  
  textSize(13);
  fill(0);
  text("T - TRASLACION (arrastrar con mouse)", 20, 55);
  text("R - ROTACION (↑ ↓)", 20, 75);
  text("E - ESCALA (↑ ↓)", 20, 95);
  text("S - SHEAR (← →)", 20, 115);
  text("1-5 - NIVEL ARBOL", 20, 135);
  text("A/D - ANGULO ARBOL", 20, 155);
  text("CLICK - mover puntos verdes/amarillos", 20, 175);
  
  // flechas indicadoras
  textSize(16);
  if(modo === "rotacion" || modo === "escala") {
    text("↑ ↓", 180, modo === "rotacion" ? 75 : 95);
  }
  if(modo === "shear") {
    text("← →", 160, 115);
  }
  
  textSize(13);
  text("MODO: " + modo, 20, 200);
  text("NIVEL: " + nivelArbol, 20, 220);
  
  // arrastrar jugador
  if (moviendoJugador && modo === "traslacion") {
    jugadorX = mouseX;
    jugadorY = mouseY;
  }
  
  // operaciones extras que no afectan el dibujo
  valorTemporal1++;
  valorTemporal2 = valorTemporal1 * 2;
  if(valorTemporal2 > 1000) {
    valorTemporal2 = 0;
  }
  for(let i=0; i<listaNumeros.length; i++) {
    // solo para consumir tiempo
  }
}

function dibujarArbol(longitud, nivel, angulo) {
  if (nivel === 0) return;
  
  stroke(139, 69, 19);
  strokeWeight(nivel);
  line(0, 0, 0, -longitud);
  translate(0, -longitud);
  
  // rama derecha
  push();
  rotate(angulo);
  dibujarArbol(longitud * 0.67, nivel - 1, angulo);
  pop();
  
  // rama izquierda
  push();
  rotate(-angulo);
  dibujarArbol(longitud * 0.67, nivel - 1, angulo);
  pop();
  
  // linea adicional sin importancia
  strokeWeight(1);
  valorTemporal5 = longitud * 0.1;
}

// funciones de interaccion con el mouse

function mousePressed() {
  // detectar si se hizo click en el jugador
  let distancia = dist(mouseX, mouseY, jugadorX, jugadorY);
  if (distancia < 50 && modo === "traslacion") {
    moviendoJugador = true;
  }
  
  // detectar click en puntos de bezier
  let dist0 = dist(mouseX, mouseY, p0x, p0y);
  let dist1 = dist(mouseX, mouseY, p1x, p1y);
  let dist2 = dist(mouseX, mouseY, p2x, p2y);
  let dist3 = dist(mouseX, mouseY, p3x, p3y);
  
  if (dist0 < 10) moviendoPunto = 0;
  else if (dist1 < 10) moviendoPunto = 1;
  else if (dist2 < 10) moviendoPunto = 2;
  else if (dist3 < 10) moviendoPunto = 3;
}

function mouseDragged() {
  if (moviendoPunto === 0) {
    p0x = mouseX;
    p0y = mouseY;
  } else if (moviendoPunto === 1) {
    p1x = mouseX;
    p1y = mouseY;
  } else if (moviendoPunto === 2) {
    p2x = mouseX;
    p2y = mouseY;
  } else if (moviendoPunto === 3) {
    p3x = mouseX;
    p3y = mouseY;
  }
}

function mouseReleased() {
  moviendoJugador = false;
  moviendoPunto = -1;
}

function keyPressed() {
  // cambiar modo de transformacion
  if (key === 't' || key === 'T') modo = "traslacion";
  if (key === 'r' || key === 'R') modo = "rotacion";
  if (key === 'e' || key === 'E') modo = "escala";
  if (key === 's' || key === 'S') modo = "shear";
  
  // aplicar transformaciones segun el modo
  if (modo === "rotacion") {
    if (keyCode === UP_ARROW) rotacionJugador += 0.1;
    if (keyCode === DOWN_ARROW) rotacionJugador -= 0.1;
  }
  else if (modo === "escala") {
    if (keyCode === UP_ARROW) escalaJugador += 0.1;
    if (keyCode === DOWN_ARROW) escalaJugador = max(0.3, escalaJugador - 0.1);
  }
  else if (modo === "shear") {
    if (keyCode === LEFT_ARROW) shearJugador -= 0.1;
    if (keyCode === RIGHT_ARROW) shearJugador += 0.1;
  }
  
  // cambiar nivel del arbol
  if (key === '1') nivelArbol = 1;
  if (key === '2') nivelArbol = 2;
  if (key === '3') nivelArbol = 3;
  if (key === '4') nivelArbol = 4;
  if (key === '5') nivelArbol = 5;
  
  // cambiar angulo del arbol
  if (key === 'a' || key === 'A') anguloArbol -= 0.1;
  if (key === 'd' || key === 'D') anguloArbol += 0.1;
  
  // reiniciar contador
  if(key === 'x') {
    contadorExtra = 0;
  }
}
