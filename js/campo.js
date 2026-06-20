const mu0 = 4 * Math.PI * 1e-7;

let uiCampo = {};

function setup() {
  let canvas = createCanvas(780, 640);
  canvas.parent("canvas-container-campo");

  uiCampo.espiras = document.getElementById("espiras");
  uiCampo.corriente = document.getElementById("corriente");
  uiCampo.radioBobina = document.getElementById("radioBobina");
  uiCampo.posicionX = document.getElementById("posicionX");

  uiCampo.valorN = document.getElementById("valorN");
  uiCampo.valorI = document.getElementById("valorI");
  uiCampo.valorA = document.getElementById("valorA");
  uiCampo.valorX = document.getElementById("valorX");

  uiCampo.datoB = document.getElementById("datoB");
  uiCampo.datoB0 = document.getElementById("datoB0");
  uiCampo.casoCampo = document.getElementById("casoCampo");
}

function draw() {
  const e = obtenerEstadoCampo();

  background(255);
  dibujarFondoCampo();
  dibujarBobina(e);
  dibujarGraficaCampo(e);
  actualizarPanelCampo(e);
}

function obtenerEstadoCampo() {
  const N = Number(uiCampo.espiras.value);
  const I = Number(uiCampo.corriente.value);
  const a = Number(uiCampo.radioBobina.value);
  const x = Number(uiCampo.posicionX.value);

  const B = calcularB(N, I, a, x);
  const B0 = calcularB(N, I, a, 0);

  return { N, I, a, x, B, B0 };
}

function calcularB(N, I, a, x) {
  return (mu0 * N * I * Math.pow(a, 2)) /
    (2 * Math.pow(Math.pow(x, 2) + Math.pow(a, 2), 1.5));
}

function dibujarFondoCampo() {
  noStroke();

  fill(248, 250, 252);
  rect(0, 0, width, height, 16);

  fill(255);
  rect(18, 18, 455, 604, 16);

  fill(255);
  rect(492, 18, 270, 604, 16);

  stroke(226, 232, 240);
  strokeWeight(1);
  line(482, 35, 482, 605);
}

function dibujarBobina(e) {
  const cx = 245;
  const cy = 325;

  fill(20);
  noStroke();
  textAlign(CENTER);
  textSize(20);
  text("Bobina circular y eje central", cx, 52);

  // Eje x
  stroke(160);
  strokeWeight(2);
  line(cx - 185, cy, cx + 185, cy);
  dibujarPuntaFlechaCampo(cx + 185, cy, 0, color(120));

  noStroke();
  fill(70);
  textSize(14);
  text("eje x", cx + 205, cy + 5);

  // Bobina: se dibuja como una elipse para sugerir profundidad
  const radioPx = map(e.a, 0.1, 1.0, 38, 130);

  noFill();
  stroke(0, 100, 255);
  strokeWeight(5);
  ellipse(cx, cy, radioPx * 0.72, radioPx * 2);

  stroke(80, 150, 255, 120);
  strokeWeight(2);
  ellipse(cx - 9, cy, radioPx * 0.72, radioPx * 2);
  ellipse(cx + 9, cy, radioPx * 0.72, radioPx * 2);

  // Flechas de corriente en la bobina
  noStroke();
  fill(0, 90, 210);
  triangle(cx + radioPx * 0.36, cy - 44, cx + radioPx * 0.36 - 10, cy - 28, cx + radioPx * 0.36 + 10, cy - 28);
  triangle(cx - radioPx * 0.36, cy + 44, cx - radioPx * 0.36 - 10, cy + 28, cx - radioPx * 0.36 + 10, cy + 28);

  textSize(13);
  fill(0, 90, 210);
  text("corriente I", cx, cy - radioPx - 20);

  // Punto actual sobre el eje
  const px = map(e.x, -1, 1, cx - 150, cx + 150);
  fill(255, 60, 60);
  noStroke();
  circle(px, cy, 14);

  fill(40);
  textSize(13);
  text("x = " + e.x.toFixed(2) + " m", px, cy + 28);

  // Vector B proporcional al valor actual
  const largo = constrain(map(e.B, 0, e.B0, 0, 80), 8, 80);
  stroke(20, 140, 80);
  strokeWeight(4);
  line(px, cy - 22, px + largo, cy - 22);
  dibujarPuntaFlechaCampo(px + largo, cy - 22, 0, color(20, 140, 80));

  noStroke();
  fill(20, 120, 70);
  textSize(15);
  text("Bₓ", px + largo + 18, cy - 17);

  // Indicador de intensidad alrededor del punto
  noFill();
  stroke(20, 140, 80, 120);
  strokeWeight(2);
  const halo = map(e.B, 0, e.B0, 16, 42);
  circle(px, cy, halo);

  // Caja de explicación
  noStroke();
  fill(255, 255, 255, 242);
  rect(55, 520, 380, 78, 12);

  fill(55);
  textAlign(CENTER);
  textSize(13);
  text("Al mover el punto rojo sobre el eje, cambia la distancia x.", cx, 542);
  text("El campo es mayor cerca del centro de la bobina.", cx, 566);
  text("Aumenta si suben N o I.", cx, 590);
}

function dibujarGraficaCampo(e) {
  const gx = 520;
  const gy = 325;
  const gw = 220;
  const gh = 210;

  noStroke();
  fill(20);
  textAlign(CENTER);
  textSize(18);
  text("Gráfica de Bₓ contra x", gx + gw / 2, 52);

  stroke(40);
  strokeWeight(1.5);
  line(gx, gy, gx, gy - gh);
  line(gx, gy, gx + gw, gy);

  noStroke();
  fill(40);
  textSize(13);
  text("Bₓ", gx - 18, gy - gh - 4);
  text("x", gx + gw + 12, gy + 4);

  let maxB = calcularB(e.N, e.I, e.a, 0);
  if (maxB === 0) maxB = 1;

  noFill();
  stroke(20, 140, 80);
  strokeWeight(3);

  beginShape();
  for (let i = 0; i <= 240; i++) {
    const x = map(i, 0, 240, -1, 1);
    const B = calcularB(e.N, e.I, e.a, x);

    const px = map(x, -1, 1, gx, gx + gw);
    const py = map(B, 0, maxB, gy, gy - gh + 10);
    vertex(px, py);
  }
  endShape();

  // Línea del centro
  const xCentro = map(0, -1, 1, gx, gx + gw);
  stroke(0, 110, 255);
  strokeWeight(2);
  drawingContext.setLineDash([6, 6]);
  line(xCentro, gy, xCentro, gy - gh);
  drawingContext.setLineDash([]);

  noStroke();
  fill(0, 110, 255);
  textSize(12);
  text("x = 0", xCentro, gy + 18);

  // Punto actual en la gráfica
  const xActual = map(e.x, -1, 1, gx, gx + gw);
  const yActual = map(e.B, 0, maxB, gy, gy - gh + 10);

  fill(255, 60, 60);
  noStroke();
  circle(xActual, yActual, 9);

  // Fórmula resumida
  fill(60);
  textAlign(LEFT);
  textSize(13);
  text("Bx = μ0 N I a²", gx, 430);
  text("     2(x² + a²)^(3/2)", gx, 450);
  text("Máximo cuando x = 0", gx, 486);
  text("Simétrico para x positivo y negativo", gx, 508);
}

function actualizarPanelCampo(e) {
  uiCampo.valorN.textContent = e.N.toFixed(0);
  uiCampo.valorI.textContent = e.I.toFixed(1) + " A";
  uiCampo.valorA.textContent = e.a.toFixed(2) + " m";
  uiCampo.valorX.textContent = e.x.toFixed(2) + " m";

  uiCampo.datoB.textContent = cientificoCampo(e.B) + " T";
  uiCampo.datoB0.textContent = cientificoCampo(e.B0) + " T";

  const porcentaje = e.B0 > 0 ? (e.B / e.B0) * 100 : 0;

  if (Math.abs(e.x) < 0.05) {
    uiCampo.casoCampo.textContent = "Caso actual: el punto está cerca del centro; Bₓ está casi en su valor máximo.";
    uiCampo.casoCampo.style.background = "#ecfdf5";
    uiCampo.casoCampo.style.color = "#047857";
  } else {
    uiCampo.casoCampo.textContent = "Caso actual: al alejarse del centro, Bₓ baja. Valor actual ≈ " + porcentaje.toFixed(1) + "% de B0.";
    uiCampo.casoCampo.style.background = "#eef6ff";
    uiCampo.casoCampo.style.color = "#075ecf";
  }
}

function dibujarPuntaFlechaCampo(x, y, ang, c) {
  push();
  translate(x, y);
  rotate(ang);
  noStroke();
  fill(c);
  triangle(0, 0, -12, -5, -12, 5);
  pop();
}

function cientificoCampo(numero) {
  if (Math.abs(numero) < 1e-20) return "0";
  return numero.toExponential(3);
}
