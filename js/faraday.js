const NSlider = document.getElementById("NSlider");
const BSlider = document.getElementById("BSlider");
const ASliderFaraday = document.getElementById("ASlider");
const wSlider = document.getElementById("wSlider");
const thetaSlider = document.getElementById("thetaSlider");

const valorN = document.getElementById("valorN");
const valorB = document.getElementById("valorB");
const valorAFaraday = document.getElementById("valorA");
const valorW = document.getElementById("valorW");
const valorTheta = document.getElementById("valorTheta");

new p5(function(p) {
  p.setup = function() {
    const canvas = p.createCanvas(780, 520);
    canvas.parent("canvasFaraday");
  };

  p.draw = function() {
    p.background(250);

    const N = Number(NSlider.value);
    const B0 = Number(BSlider.value);
    const A = Number(ASliderFaraday.value);
    const w = Number(wSlider.value);
    const thetaDeg = Number(thetaSlider.value);
    const theta = p.radians(thetaDeg);
    const t = p.frameCount / 30;

    valorN.textContent = N.toFixed(0);
    valorB.textContent = B0.toFixed(1);
    valorAFaraday.textContent = A.toFixed(2);
    valorW.textContent = w.toFixed(1);
    valorTheta.textContent = thetaDeg.toFixed(0);

    const Bactual = B0 * Math.sin(w * t);
    const phi = B0 * A * Math.cos(theta) * Math.sin(w * t);
    const fem = -N * B0 * A * w * Math.cos(theta) * Math.cos(w * t);

    p.fill(17, 24, 39);
    p.noStroke();
    p.textSize(24);
    p.text("Inducción electromagnética: Ley de Faraday", 30, 40);

    p.textSize(16);
    p.text("N = " + N, 30, 85);
    p.text("B₀ = " + B0.toFixed(1) + " T", 30, 110);
    p.text("A = " + A.toFixed(2) + " m²", 30, 135);
    p.text("ω = " + w.toFixed(1) + " rad/s", 30, 160);
    p.text("θ = " + thetaDeg + "°", 30, 185);

    p.text("B(t) = " + Bactual.toFixed(3) + " T", 30, 230);
    p.text("ΦB = " + phi.toFixed(4) + " Wb", 30, 255);
    p.text("ε = " + fem.toFixed(4) + " V", 30, 280);

    const cx = 300;
    const cy = 375;
    const colorCampo = Bactual >= 0 ? p.color(37, 99, 235) : p.color(239, 68, 68);

    for (let x = 200; x <= 400; x += 40) {
      if (Bactual >= 0) {
        flecha(p, x, 295, x, 450, colorCampo, 2);
      } else {
        flecha(p, x, 450, x, 295, colorCampo, 2);
      }
    }

    p.noStroke();
    p.fill(colorCampo);
    p.text("Campo magnético variable", 205, 275);

    p.stroke(17, 24, 39);
    p.strokeWeight(4);
    p.noFill();
    p.ellipse(cx, cy, 180, 100);

    flecha(p, cx, cy, cx + 75 * Math.cos(theta), cy - 75 * Math.sin(theta), p.color(17, 24, 39), 2);

    p.noStroke();
    p.fill(17, 24, 39);
    p.text("Espira", cx - 25, cy + 78);
    p.text("Normal", cx + 60, cy - 55);

    const gx = 470;
    const gy = 390;
    const gw = 280;
    const gh = 240;

    p.stroke(17, 24, 39);
    p.strokeWeight(2);
    p.line(gx, gy, gx + gw, gy);
    p.line(gx, gy - gh / 2, gx + gw, gy - gh / 2);
    p.line(gx, gy - gh, gx + gw, gy - gh);
    p.line(gx, gy, gx, gy - gh);

    p.noStroke();
    p.fill(17, 24, 39);
    p.text("Gráfica de ε(t)", gx + 80, gy - gh - 15);

    const maxFem = Math.max(0.001, Math.abs(N * B0 * A * w * Math.cos(theta)));

    p.stroke(239, 68, 68);
    p.strokeWeight(3);
    p.noFill();
    p.beginShape();

    for (let i = 0; i <= gw; i++) {
      const tt = t - 4 + i / 30;
      const femi = -N * B0 * A * w * Math.cos(theta) * Math.cos(w * tt);
      const y = gy - gh / 2 - (femi / maxFem) * (gh / 2 - 12);
      p.vertex(gx + i, y);
    }

    p.endShape();

    p.noStroke();
    p.fill(17, 24, 39);
    p.text("La fem aparece porque cambia el flujo.", 470, 440);
    p.text("Si el flujo no cambia, ε = 0.", 470, 465);
  };
});
