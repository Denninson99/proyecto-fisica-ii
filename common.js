function sci(x, digits = 3) {
  if (!isFinite(x)) return "No definido";
  if (x === 0) return "0";
  if (Math.abs(x) >= 1000 || Math.abs(x) < 0.01) {
    return x.toExponential(digits);
  }
  return x.toFixed(digits);
}

function flecha(p, x1, y1, x2, y2, col, grosor = 3) {
  p.stroke(col);
  p.strokeWeight(grosor);
  p.line(x1, y1, x2, y2);

  const ang = Math.atan2(y2 - y1, x2 - x1);
  const tam = 11;

  p.push();
  p.translate(x2, y2);
  p.rotate(ang);
  p.noStroke();
  p.fill(col);
  p.triangle(0, 0, -tam, -tam / 2, -tam, tam / 2);
  p.pop();
}
