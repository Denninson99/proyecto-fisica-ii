const eps0Cap = 8.854e-12;
const ASlider = document.getElementById("ASlider");
const dSlider = document.getElementById("dSlider");
const VSliderCap = document.getElementById("VSlider");
const erSlider = document.getElementById("erSlider");
const valorA = document.getElementById("valorA");
const valorD = document.getElementById("valorD");
const valorVCap = document.getElementById("valorV");
const valorEr = document.getElementById("valorEr");

new p5(function(p) {
  p.setup = function() {
    const canvas = p.createCanvas(780, 500);
    canvas.parent("canvasCapacitor");
  };

  p.draw = function() {
    p.background(250);

    const A = Number(ASlider.value);
    const dmm = Number(dSlider.value);
    const d = dmm / 1000;
    const V = Number(VSliderCap.value);
    const er = Number(erSlider.value);

    valorA.textContent = A.toFixed(2);
    valorD.textContent = dmm.toFixed(0);
    valorVCap.textContent = V.toFixed(0);
    valorEr.textContent = er.toFixed(1);

    const C = eps0Cap * er * A / d;
    const Q = C * V;
    const E = V / d;
    const U = 0.5 * C * V * V;

    p.fill(17, 24, 39);
    p.noStroke();
    p.textSize(24);
    p.text("Capacitor de placas paralelas", 30, 40);

    p.textSize(16);
    p.text("A = " + A.toFixed(2) + " m²", 30, 85);
    p.text("d = " + dmm.toFixed(0) + " mm", 30, 110);
    p.text("V = " + V.toFixed(0) + " V", 30, 135);
    p.text("εr = " + er.toFixed(1), 30, 160);

    p.text("C = " + sci(C, 3) + " F", 30, 210);
    p.text("Q = " + sci(Q, 3) + " C", 30, 235);
    p.text("E = " + sci(E, 3) + " V/m", 30, 260);
    p.text("U = " + sci(U, 3) + " J", 30, 285);

    const x1 = 450;
    const gap = dmm * 4;
    const x2 = x1 + gap;
    const h = Math.min(260, 110 + A * 150);
    const y1 = 270 - h / 2;
    const y2 = 270 + h / 2;

    p.noStroke();
    p.fill(254, 243, 199, 130);
    p.rect(x1 + 8, y1, x2 - x1 - 16, h, 12);

    p.stroke(17, 24, 39);
    p.strokeWeight(8);
    p.line(x1, y1, x1, y2);
    p.line(x2, y1, x2, y2);

    p.noStroke();
    p.fill(239, 68, 68);
    for (let y = y1 + 22; y <= y2 - 20; y += 28) p.text("+", x1 - 35, y);

    p.fill(37, 99, 235);
    for (let y = y1 + 22; y <= y2 - 20; y += 28) p.text("-", x2 + 22, y);

    for (let y = y1 + 30; y <= y2 - 30; y += 38) {
      flecha(p, x1 + 25, y, x2 - 25, y, p.color(37, 99, 235), 2);
    }

    p.noStroke();
    p.fill(17, 24, 39);
    p.text("Campo eléctrico entre placas", 450, 430);
    p.text("Si d aumenta, C disminuye", 450, 455);
  };
});
