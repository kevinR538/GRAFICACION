function draw() {
 background(245);
 bezier(80,300, 180,80, 420,80, 520,300);
 let t = (frameCount % 200) / 200;
 let x = bezierPoint(80,180,420,520,t);
 let y = bezierPoint(300,80,80,300,t);
 fill(255,0,0);
 circle(x,y,15);
}