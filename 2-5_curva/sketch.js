function rama(len) {
 line(0, 0, 0, -len);
 translate(0, -len);
 if (len > 8) {
 push();
 rotate(PI/6);
 rama(len * 0.67);
 pop();
 push();
 rotate(-PI/6);
 rama(len * 0.67);
 pop();
 }
}