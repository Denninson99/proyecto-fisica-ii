const kGauss = 8.99e9;
const QSlider = document.getElementById("QSlider");
const RSlider = document.getElementById("RSlider");
const rSliderGauss = document.getElementById("rSlider");
const valorQGauss = document.getElementById("valorQ");
const valorRadio = document.getElementById("valorRadio");
const valorDistancia = document.getElementById("valorDistancia");

function campoGauss(Q, R, r) {
  if (r === 0) return 0;
  if (r < R) return kGauss * Q * r / Math.pow(R, 3);
  return kGauss * Q / (r * r);
}

new p5(function(p) {
  p.setup = function() {
    const canvas = p.createCanvas(780, 500);
    canvas.parent("canvasGauss");
  };

  p.draw = function() {
    p.background(250);

    const QnC = Number(QSlider.value);
    const Q = QnC * 1e-9;
    const R = Number(RSlider.value);
    const r = Number(rSliderGauss.value);
    const E = campoGauss(Q, R, r);

    valorQGauss.textContent = QnC.toFixed(0);
    valorRadio.textContent = R.toFixed(1);
    valorDistancia.textContent = r.toFixed(1);

    p.fill(17, 24, 39);
    p.noStroke();
    p.textSize(24);
    p.text("Ley de Gauss: esfera aislante cargada", 30, 40);

    p.textSize(16);
    p.text("Q = " + QnC + " nC", 30, 85);
    p.text("R = " + R.toFixed(1) + " m", 30, 110);
    p.text("r = " + r.toFixed(1) + " m", 30, 135);
    p.text("E = " + sci(E, 3) + " N/C", 30, 160);

    const cx = 230;
    const cy = 330;
    const escala = 38;
    const radioPix = R * escala;
    const rPix = r * escala;

    p.stroke(37, 99, 235);
    p.strokeWeight(3);
    p.fill(219, 234, 254);
    p.circle(cx, cy, radioPix * 2);

    p.noStroke();
    p.fill(37, 99, 235, 120);
    for (let i = 0; i < 20; i++) {
      const ang = i * 2.4 + p.frameCount * 0.003;
      const rr = radioPix * 0.8 * ((i % 5 + 1) / 5);
      p.circle(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr, 7);
    }

    p.stroke(239, 68, 68);
    p.strokeWeight(3);
    p.line(cx, cy, cx + rPix, cy);
    p.noStroke();
    p.fill(239, 68, 68);
    p.circle(cx + rPix, cy, 12);

    p.fill(17, 24, 39);
    p.text("Esfera aislante", cx - 55, cy - radioPix - 15);
    p.text("r", cx + rPix + 12, cy - 8);

    const gx = 420;
    const gy = 380;
    const gw = 320;
    const gh = 250;

    p.stroke(17, 24, 39);
    p.strokeWeight(2);
    p.line(gx, gy, gx + gw, gy);
    p.line(gx, gy, gx, gy - gh);

    p.noStroke();
    p.fill(17, 24, 39);
    p.text("Gráfica E vs r", gx + 90, gy - gh - 16);

    let maxE = 0;
    for (let i = 0; i <= 120; i++) {
      const rr = (i / 120) * 8;
      maxE = Math.max(maxE, campoGauss(Q, R, rr));
    }

    p.stroke(37, 99, 235);
    p.strokeWeight(3);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= 120; i++) {
      const rr = (i / 120) * 8;
      const EE = campoGauss(Q, R, rr);
      const x = gx + (rr / 8) * gw;
      const y = gy - (EE / maxE) * gh;
      p.vertex(x, y);
    }
    p.endShape();

    const px = gx + (r / 8) * gw;
    const py = gy - (E / maxE) * gh;
    p.noStroke();
    p.fill(239, 68, 68);
    p.circle(px, py, 10);

    const rx = gx + (R / 8) * gw;
    p.stroke(100);
    p.drawingContext.setLineDash([5, 5]);
    p.line(rx, gy, rx, gy - gh);
    p.drawingContext.setLineDash([]);
    p.noStroke();
    p.fill(17, 24, 39);
    p.text("R", rx - 5, gy + 20);
    p.text("Dentro: E aumenta linealmente", gx, 430);
    p.text("Fuera: E disminuye como 1/r²", gx, 455);
  };
});
