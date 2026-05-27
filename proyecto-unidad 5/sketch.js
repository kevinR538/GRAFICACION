// ============================================================
//  PROYECTO INTEGRADOR — ESCENA ANIMADA INTERACTIVA 3D v2
//  Tema: FC Barcelona — Camp Nou Experience
//  Tecnología: p5.js WEBGL
//  CAMBIOS v2:
//    - Controles corregidos: flechas mueven el balón, W/S ajustan velocidad
//    - Modelos de jugadores mejorados: zapatillas, espinilleras, pantalón,
//      camiseta con franja, brazos articulados (brazo+codo+antebrazo+mano),
//      cabeza con pelo, ojos y boca
//    - Jugadores se orientan hacia el balón (rotateY)
//    - Separación de colisiones entre jugadores (algoritmo de repulsión)
// ============================================================

// ─── VARIABLES GLOBALES ──────────────────────────────────────
let ball, players=[], particles=[], trailPos=[], stars=[];
let camFree=false, scored=false, scoredTimer=0;
let speed=3, frameN=0, goals=0;
let kickActive=false, kickVY=0;
let keys={};   // mapa continuo de teclas presionadas

const P_RAD=30; // radio de separación entre jugadores

// ─── SETUP ───────────────────────────────────────────────────
function setup(){
  createCanvas(800,500,WEBGL);
  frameRate(60);

  ball={x:0,y:0,z:0,vx:0,vy:0,vz:0,r:18};

  // 3 jugadores posicionados en triángulo para no solaparse
  players=[
    {x:-130,y:0,z:-70, col:[0,77,152],   trim:[252,191,0],  num:'10', phase:0,   vx:0,vz:0},
    {x: 130,y:0,z:-70, col:[165,0,68],   trim:[255,255,255],num:'9',  phase:1.2, vx:0,vz:0},
    {x:   0,y:0,z: 90, col:[0,77,152],   trim:[165,0,68],   num:'7',  phase:2.4, vx:0,vz:0},
  ];

  for(let i=0;i<130;i++) stars.push({
    x:random(-800,800),y:random(-700,-120),z:random(-700,-200),
    s:random(1,3),ph:random(TWO_PI)
  });
}

// ─── DRAW ────────────────────────────────────────────────────
function draw(){
  frameN=frameCount;
  background(8,8,22);

  ambientLight(55,55,75);
  pointLight(255,240,180, 0,-420,320);
  pointLight(80,120,255, -320,-200,100);
  directionalLight(200,210,255, 0.3,0.5,-1);

  if(camFree){
    orbitControl(2,2,0.05);
  } else {
    let cx=lerp(0,-ball.x*0.22,0.5);
    camera(cx,-210,520, cx*0.3,0,0, 0,1,0);
  }

  drawStars();
  drawStadium();
  drawField();
  drawGoal(-330);
  drawGoal( 330);

  processInput();
  updateBall();
  drawTrail();
  drawBall();
  updatePlayers();
  drawPlayers();
  updateParticles();
  drawParticles();

  if(scored&&--scoredTimer<=0) scored=false;
}

// ─── INPUT ───────────────────────────────────────────────────
// Se usa un mapa de teclas para input continuo (flechas) y
// keyPressed/keyReleased para detectar eventos discretos.

function keyPressed(){
  keys[keyCode]=true;
  if(key) keys[key.toLowerCase()]=true;

  if(keyCode===32 && !kickActive && ball.y>=0){  // ESPACIO → disparo
    kickActive=true; kickVY=-10;
    ball.vx+=random(-1.5,1.5); ball.vz-=4;
    return false;
  }
  if(key==='c'||key==='C'){ camFree=!camFree; return false; }
  if(key==='r'||key==='R'){
    ball.x=ball.y=ball.z=ball.vx=ball.vy=ball.vz=0;
    trailPos=[]; particles=[]; kickActive=false;
    return false;
  }
  return false;
}

function keyReleased(){
  keys[keyCode]=false;
  if(key) keys[key.toLowerCase()]=false;
  return false;
}

function processInput(){
  // Flechas mueven el balón
  if(keys[LEFT_ARROW]  || keys[37]) ball.vx=lerp(ball.vx,-speed,0.18);
  if(keys[RIGHT_ARROW] || keys[39]) ball.vx=lerp(ball.vx, speed,0.18);
  if(keys[UP_ARROW]    || keys[38]) ball.vz=lerp(ball.vz,-speed,0.18);
  if(keys[DOWN_ARROW]  || keys[40]) ball.vz=lerp(ball.vz, speed,0.18);
  // W/S ajustan velocidad máxima
  if(keys['w']) speed=min(speed+0.04,9);
  if(keys['s']) speed=max(speed-0.04,1);
}

// ─── BALÓN ───────────────────────────────────────────────────
function updateBall(){
  ball.vx*=0.87; ball.vz*=0.87;

  if(kickActive){
    ball.vy+=kickVY; ball.y+=ball.vy; ball.vy+=0.55;
    if(ball.y>=0){ball.y=0;ball.vy=0;kickActive=false;}
  }
  ball.x+=ball.vx; ball.z+=ball.vz;

  if(ball.x> 330){ball.x= 330;ball.vx*=-0.6;}
  if(ball.x<-330){ball.x=-330;ball.vx*=-0.6;}
  if(ball.z> 270){ball.z= 270;ball.vz*=-0.6;}
  if(ball.z<-270){ball.z=-270;ball.vz*=-0.6;}

  if(ball.x<=-315 && abs(ball.z)<55 && !scored) registrarGol();

  if(frameN%2===0) trailPos.push({x:ball.x,y:ball.y,z:ball.z,life:28});
  trailPos=trailPos.filter(t=>t.life-->0);
}

function drawBall(){
  push();
  translate(ball.x, ball.y-ball.r, ball.z);
  rotateY(frameN*0.05*Math.sign(ball.vx||1));
  rotateX(frameN*0.04*Math.sign(ball.vz||1));
  specularMaterial(245,245,245); shininess(90);
  sphere(ball.r,20,14);
  noStroke(); fill(10,10,10);
  let dirs=[[0,1,0],[0,-1,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]];
  for(let d of dirs){
    push();
    translate(d[0]*ball.r*.84,d[1]*ball.r*.84,d[2]*ball.r*.84);
    sphere(5.5); pop();
  }
  pop();
}

function drawTrail(){
  noStroke();
  for(let t of trailPos){
    let a=map(t.life,0,28,0,160);
    let s=map(t.life,0,28,2,13);
    push();
    translate(t.x,t.y-ball.r+4,t.z);
    fill(252,191,0,a); sphere(s); pop();
  }
}

// ─── JUGADORES ───────────────────────────────────────────────
function updatePlayers(){
  for(let pl of players){
    pl.phase+=0.05;
    let dx=ball.x-pl.x, dz=ball.z-pl.z;
    let dist=Math.sqrt(dx*dx+dz*dz);
    if(dist>P_RAD){
      pl.vx=lerp(pl.vx,(dx/dist)*speed*0.6,0.028);
      pl.vz=lerp(pl.vz,(dz/dist)*speed*0.6,0.028);
    } else {
      pl.vx*=0.85; pl.vz*=0.85;
    }
    pl.x+=pl.vx; pl.z+=pl.vz;
    pl.x=constrain(pl.x,-320,320);
    pl.z=constrain(pl.z,-260,260);
  }

  // Separación de colisiones entre jugadores
  for(let i=0;i<players.length;i++){
    for(let j=i+1;j<players.length;j++){
      let a=players[i], b=players[j];
      let dx=b.x-a.x, dz=b.z-a.z;
      let d=Math.sqrt(dx*dx+dz*dz);
      if(d<P_RAD && d>0.01){
        let push_=(P_RAD-d)/2;
        let nx=dx/d, nz=dz/d;
        a.x-=nx*push_; a.z-=nz*push_;
        b.x+=nx*push_; b.z+=nz*push_;
      }
    }
  }
}

function drawPlayers(){
  for(let pl of players){
    push();
    translate(pl.x, 0, pl.z);
    let bob=Math.sin(pl.phase)*3.5;
    let legSwing=Math.sin(pl.phase)*0.55;
    let armSwing=Math.sin(pl.phase)*0.45;
    let c=pl.col, tr=pl.trim;

    // Orientar hacia el balón
    let ang=Math.atan2(ball.x-pl.x, ball.z-pl.z);
    rotateY(ang);

    noStroke();

    // Sombra
    push(); translate(0,1,0); rotateX(HALF_PI);
    fill(0,0,0,55); ellipse(0,0,30,16); pop();

    drawShoe( 8,-8+bob, 14, legSwing, c);
    drawShoe(-8,-8+bob,-14,-legSwing, c);
    drawShin( 8,-26+bob, legSwing);
    drawShin(-8,-26+bob,-legSwing);

    // Pantalón
    push(); translate(0,-46+bob,0); fill(20,20,20);
    cylinder(14,18,8,1); pop();

    drawBody(0,-65+bob, c, tr, pl.num);

    // Cuello
    push(); translate(0,-83+bob,0); fill(210,170,130);
    cylinder(5,10,6,1); pop();

    drawHead(0,-100+bob);
    drawArm(-18,-68+bob, -0.45-armSwing, c);
    drawArm( 18,-68+bob,  0.45+armSwing, c);
    pop();
  }
}

function drawShoe(x,y,zOff,swing,c){
  push(); translate(x,y,zOff); rotateX(swing);
  fill(20,20,20);
  push(); translate(0,4,3); scale(1,0.6,1.4); sphere(7,8,6); pop();
  fill(255,255,255);
  push(); translate(0,-4,0); cylinder(5,14,6,1); pop();
  pop();
}

function drawShin(x,y,swing){
  push(); translate(x,y,0); rotateX(swing);
  fill(255,255,255,200);
  push(); translate(0,0,-6); scale(1,1,0.4); box(7,20,8); pop();
  fill(200,195,190);
  cylinder(5.5,22,6,1);
  pop();
}

function drawBody(x,y,c,tr,num){
  push(); translate(x,y,0);
  ambientMaterial(c[0],c[1],c[2]);
  specularMaterial(c[0]*.6,c[1]*.6,c[2]*.6); shininess(25);
  push(); scale(1,1,0.75); cylinder(13,34,8,1); pop();
  fill(tr[0],tr[1],tr[2]);
  push(); translate(0,0,-9.8); scale(0.35,1,0.3); cylinder(13,34,8,1); pop();
  push(); translate(0,0,-10.5);
  fill(255); textSize(8); textAlign(CENTER,CENTER); text(num,0,0); pop();
  fill(c[0],c[1],c[2]);
  push(); translate(0,-16,0); cylinder(6,6,6,1); pop();
  pop();
}

function drawHead(x,y){
  push(); translate(x,y,0);
  fill(210,170,130);
  push(); translate(0,8,0); cylinder(4.5,8,6,1); pop();
  ambientMaterial(210,170,130); sphere(13,12,10);
  fill(40,25,10);
  push(); translate(0,-9,0); scale(1,0.55,1); sphere(13,10,8); pop();
  fill(20,20,20);
  push(); translate(-4,-1,12); sphere(1.5); pop();
  push(); translate( 4,-1,12); sphere(1.5); pop();
  fill(180,80,80);
  push(); translate(0,-4,12.5); scale(1.6,0.5,0.3); sphere(2); pop();
  pop();
}

function drawArm(x,y,angle,c){
  push(); translate(x,y,0); rotateZ(angle);
  fill(c[0],c[1],c[2]);
  push(); translate(0,-10,0); cylinder(4.5,20,6,1); pop();
  fill(210,170,130);
  push(); translate(0,-22,0); sphere(5,8,6); pop();
  push(); translate(0,-33,0); cylinder(3.8,18,6,1); pop();
  fill(200,160,120);
  push(); translate(0,-43,0); sphere(5,8,6); pop();
  pop();
}

// ─── PARTÍCULAS ──────────────────────────────────────────────
function spawnParticles(x,y,z){
  for(let i=0;i<90;i++) particles.push({
    x,y,z,
    vx:random(-9,9),vy:random(-13,-2),vz:random(-9,9),
    life:random(45,95),maxLife:95,size:random(4,15),
    col:random()>.5?[252,191,0]:[random()*255,random()*100,random()*255]
  });
}
function updateParticles(){
  for(let pt of particles){pt.x+=pt.vx;pt.y+=pt.vy;pt.z+=pt.vz;pt.vy+=0.32;pt.life--;}
  particles=particles.filter(pt=>pt.life>0);
}
function drawParticles(){
  noStroke();
  for(let pt of particles){
    let a=map(pt.life,0,pt.maxLife,0,220);
    push(); translate(pt.x,pt.y,pt.z);
    fill(pt.col[0],pt.col[1],pt.col[2],a);
    sphere(pt.size*(pt.life/pt.maxLife)); pop();
  }
}

// ─── GOL ─────────────────────────────────────────────────────
function registrarGol(){
  scored=true; scoredTimer=200; goals++;
  spawnParticles(ball.x,ball.y-ball.r,ball.z);
  ball.x=ball.y=ball.z=ball.vx=ball.vy=ball.vz=0;
  trailPos=[]; kickActive=false;
}

// ─── ESCENARIO ───────────────────────────────────────────────
function drawStars(){
  noStroke();
  for(let s of stars){
    let f=200+Math.sin(frameN*.05+s.ph)*55;
    fill(f,f,f*1.1);
    push(); translate(s.x,s.y,s.z); sphere(s.s); pop();
  }
}

function drawStadium(){
  for(let ring=0;ring<5;ring++){
    push();
    translate(0,-55-ring*42,0);
    scale((500+ring*32)/200,1,(320+ring*20)/200);
    fill(18+ring*5,28+ring*8,48+ring*10,185);
    stroke(38,78,140,75); strokeWeight(0.5);
    cylinder(200,8,32,1,false,false);
    pop();
  }
  let foci=[[-360,-125,260],[360,-125,260],[-360,-125,-260],[360,-125,-260]];
  for(let f of foci){
    push(); translate(f[0],f[1],f[2]);
    ambientMaterial(255,255,200); noStroke(); sphere(9); pop();
    push(); translate(f[0],f[1]+60,f[2]);
    fill(255,250,180,18); noStroke(); cylinder(4,130,4,1); pop();
  }
}

function drawField(){
  push(); translate(0,2,0); rotateX(HALF_PI);
  fill(20,118,38); stroke(14,98,28); strokeWeight(0.5); plane(700,560);
  noStroke();
  for(let i=-3;i<=3;i++){
    if(i%2===0){fill(24,128,44,170);push();translate(i*50,0,.5);plane(50,560);pop();}
  }
  stroke(255,255,255,200); strokeWeight(1.5); noFill();
  rect(-330,-265,660,530); line(0,-265,0,265); circle(0,0,120);
  fill(255); noStroke(); circle(0,0,6);
  noFill(); stroke(255,255,255,160); strokeWeight(1);
  rect(-330,-80,100,160); rect(230,-80,100,160);
  pop();
}

function drawGoal(xPos){
  push(); translate(xPos,0,0);
  ambientMaterial(225,225,225); stroke(200,200,200); strokeWeight(1);
  let hw=60,h=68;
  push();translate(-hw,-h/2,-30);box(4,h,4);pop();
  push();translate( hw,-h/2,-30);box(4,h,4);pop();
  push();translate(-hw,-h/2, 30);box(4,h,4);pop();
  push();translate( hw,-h/2, 30);box(4,h,4);pop();
  push();translate(0,-h,-30);box(hw*2+4,4,4);pop();
  push();translate(0,-h, 30);box(hw*2+4,4,4);pop();
  push();translate(-hw,-h,0);box(4,4,64);pop();
  push();translate( hw,-h,0);box(4,4,64);pop();
  stroke(255,255,255,55); strokeWeight(0.5); noFill();
  for(let i=-hw;i<=hw;i+=14){
    line(i,0,-30,i,-h,-30); line(i,0,30,i,-h,30);
  }
  for(let j=0;j>=-h;j-=12){
    line(-hw,j,-30,hw,j,-30); line(-hw,j,30,hw,j,30);
  }
  pop();
}