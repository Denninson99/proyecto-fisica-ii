const VSliderOhm = document.getElementById("VSlider");
const RSliderOhm = document.getElementById("RSlider");
const valorVOhm = document.getElementById("valorV");
const valorROhm = document.getElementById("valorR");

new p5(function(p) {
  p.setup = function() {
    const canvas = p.createCanvas(780, 500);
    canvas.parent("canvasOhm");
  };

  p.draw = function() {
    p.background(250);

    const V = Number(VSliderOhm.value);
    const R = Number(RSliderOhm.value);
    const I = V / R;
    const P = V * I;

    valorVOhm.textContent = V.toFixed(0);
    valorROhm.textContent = R.toFixed(0);

    p.fill(17, 24, 39);
    p.noStroke();
    p.textSize(24);
    p.text("Corriente eléctrica: Ley de Ohm", 30, 40);

    p.textSize(16);
    p.text("V = " + V + " V", 30, 85);
    p.text("R = " + R + " Ω", 30, 110);
    p.text("I = " + I.toFixed(3) + " A", 30, 135);
    p.text("P = " + P.toFixed(3) + " W", 30, 160);

    p.text("I = V/R", 30, 210);
    p.text("P = VI", 30, 235);

    const left = 360;
    const right = 690;
    const top = 130;
    const bottom = 350;

    p.stroke(17, 24, 39);
    p.strokeWeight(4);
    p.noFill();
    p.line(left, top, right, top);
    p.line(right, top, right, bottom);
    p.line(right, bottom, left, bottom);
    p.line(left, bottom, left, top);

    p.fill(255);
    p.rect(485, 95, 120, 70, 8);

    p.noStroke();
    p.fill(17, 24, 39);
    p.text("Resistencia", 498, 88);
    p.text("R", 535, 138);

    p.stroke(17, 24, 39);
    p.strokeWeight(4);
    p.line(340, 210, 380, 210);
    p.line(352, 245, 368, 245);

    p.noStroke();
    p.fill(17, 24, 39);
    p.text("Batería", 315, 275);

    const speed = Math.min(8, 1 + I * 3);
    p.noStroke();
    p.fill(37, 99, 235);

    for (let i = 0; i < 9; i++) {
      const offset = (p.frameCount * speed + i * 65) % 900;
      let x = left;
      let y = bottom;

      if (offset < 330) {
        x = left + offset;
        y = bottom;
      } else if (offset < 550) {
        x = right;
        y = bottom - (offset - 330);
      } else if (offset < 880) {
        x = right - (offset - 550);
        y = top;
      } else {
        x = left;
        y = top + (offset - 880);
      }

      p.circle(x, y, 9);
    }

    flecha(p, 410, bottom, 530, bottom, p.color(239, 68, 68), 5);
    p.noStroke();
    p.fill(17, 24, 39);
    p.text("Flecha roja: sentido convencional de la corriente", 400, 410);
    p.text("Los puntos azules representan movimiento de cargas.", 400, 435);
  };
});
