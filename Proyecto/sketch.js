let ang = 0;

let pelotaX = 420;
let pelotaY = 260;

let velX = 4;
let velY = -3;

function setup(){

createCanvas(900,500);

}

function draw(){

background(90,170,255);

dibujarGradas();

dibujarCancha();

dibujarPorteria();

dibujarJugador(420,330);

dibujarPelota();

texto();

}



function dibujarCancha(){

fill(20,130,40);

rect(0,300,900,200);

stroke(255);

line(0,300,900,300);

}



function dibujarGradas(){

for(let i=0;i<6;i++){

fill(140-i*12);

rect(0,220-i*20,900,20);

for(let j=0;j<35;j++){

fill(200,50+random(100),50);

ellipse(15+j*25,210-i*20,6,6);

}

}

}



function dibujarPorteria(){

stroke(255);

strokeWeight(4);

rect(650,250,180,120);

strokeWeight(1);

// red vertical

for(let i=0;i<10;i++){

line(650+i*18,250,650+i*18,370);

}

// red horizontal

for(let j=0;j<6;j++){

line(650,250+j*20,830,250+j*20);

}

}



function dibujarJugador(x,y){

push();

translate(x,y);

rotate(radians(ang));


// cabeza

fill(255,220,180);

ellipse(0,-70,28,28);


// cuerpo (verde México)

fill(0,120,40);

rect(-12,-65,24,45);


// short

fill(255);

rect(-12,-20,24,15);


// brazos

stroke(255,220,180);

strokeWeight(6);

line(-12,-50,-35,-30);

line(12,-50,35,-30);


// piernas

stroke(0);

strokeWeight(8);

line(-5,-5,-35,25);

line(5,-5,35,25);


// pie que golpea

strokeWeight(6);

line(35,25,55,10);


pop();

ang += 1.2;

}



function dibujarPelota(){

pelotaX += velX;

pelotaY += velY;


// rebote arriba

if(pelotaY < 100){

velY *= -1;

}


// rebote abajo

if(pelotaY > 350){

velY *= -1;

}


// rebote izquierda

if(pelotaX < 50){

velX *= -1;

}


// rebote porteria / derecha

if(pelotaX > 820){

velX *= -1;

}


// gravedad ligera

velY += 0.1;


// balón

fill(255);

ellipse(pelotaX,pelotaY,22,22);


// detalles

stroke(0);

line(pelotaX-5,pelotaY,pelotaX+5,pelotaY);

line(pelotaX,pelotaY-5,pelotaX,pelotaY+5);

}



function texto(){

fill(0);

textSize(18);

text("Seleccion Mexicana - Chilena",10,20);

}