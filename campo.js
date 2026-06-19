const kCampo = 8.99e9;
const qSlider = document.getElementById("qSlider");
const rSlider = document.getElementById("rSlider");
const valorQ = document.getElementById("valorQ");
const valorR = document.getElementById("valorR");

new p5(function(p) {
  p.setup = function() {
    const canvas = p.createCanvas(760, 470);
    canvas.parent("canvasCampo");
  };

  p.draw = function() {
    p.background(250);

    const q_nC = Number(qSlider.value);
    const r = Number(rSlider.value);
    valorQ.textContent = q_nC.toFixed(1);
    valorR.textContent = r.toFixed(1);

    const q = q_nC * 1e-9;
    const E = kCampo * Math.abs(q) / (r * r);

    p.fill(17, 24, 39);
    p.noStroke();
    p.textSize(24);
    p.text("Campo eléctrico de una carga puntual", 30, 40);

    p.textSize(16);
    p.text("q = " + q_nC.toFixed(1) + " nC", 30, 85);
    p.text("r = " + r.toFixed(2) + " m", 30, 110);
    p.text("E = " + sci(E, 3) + " N/C", 30, 135);

    const cx = 360;
    const cy = 250;
    const px = cx + r * 75;
    const py = cy;
    const pulso = 8 * Math.sin(p.frameCount * 0.06);

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      const dir = q_nC >= 0 ? 1 : -1;
      if (q_nC !== 0) {
        const x1 = cx + Math.cos(a) * (50 + pulso);
        const y1 = cy + Math.sin(a) * (50 + pulso);
        const x2 = cx + Math.cos(a) * (120 + pulso) * dir;
        const y2 = cy + Math.sin(a) * (120 + pulso) * dir;
        flecha(p, x1, y1, x2, y2, p.color(37, 99, 235, 130), 2);
      }
    }

    p.noStroke();
    p.fill(q_nC >= 0 ? "#ef4444" : "#2563eb");
    p.circle(cx, cy, 75);

    p.fill(255);
    p.textSize(40);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(q_nC >= 0 ? "+" : "-", cx, cy - 3);
    p.textAlign(p.LEFT, p.BASELINE);

    p.stroke(100);
    p.strokeWeight(2);
    p.line(cx, cy, px, py);

    p.noStroke();
    p.fill(17, 24, 39);
    p.circle(px, py, 12);
    p.text("P", px - 5, py - 25);
    p.text("Distancia r", (cx + px) / 2 - 35, cy - 12);

    const dir = q_nC >= 0 ? 1 : -1;
    const largo = Math.min(130, 25 + E / 20);

    if (Math.abs(q_nC) > 0.01) {
      flecha(p, px, py, px + dir * largo, py, p.color(239, 68, 68), 5);
      p.noStroke();
      p.fill(17, 24, 39);
      p.text("Vector E", px + dir * largo - 30, py - 18);
    }

    p.textSize(14);
    p.text("La intensidad baja rápido cuando aumenta la distancia porque E depende de 1/r².", 30, 430);
  };
});
