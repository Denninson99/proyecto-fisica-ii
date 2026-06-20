const estadoKirchhoff = {
  V1: 12,
  V2: 9,
  R1: 5,
  R2: 8,
  R3: 1,
  R4: 1,
  R5: 10,
  I1: 0,
  I2: 0,
  I3: 0,
  error: ''
};

const uiKirchhoff = {};

function setup() {
  const canvas = createCanvas(760, 560);
  canvas.parent('canvas-container-kirchhoff');

  uiKirchhoff.V1 = document.getElementById('voltajeV1');
  uiKirchhoff.V2 = document.getElementById('voltajeV2');
  uiKirchhoff.R1 = document.getElementById('resistenciaR1');
  uiKirchhoff.R2 = document.getElementById('resistenciaR2');
  uiKirchhoff.R3 = document.getElementById('resistenciaR3');
  uiKirchhoff.R4 = document.getElementById('resistenciaR4');
  uiKirchhoff.R5 = document.getElementById('resistenciaR5');

  uiKirchhoff.btnResolver = document.getElementById('btnResolverKirchhoff');

  uiKirchhoff.datoI1 = document.getElementById('datoI1');
  uiKirchhoff.datoI2 = document.getElementById('datoI2');
  uiKirchhoff.datoI3 = document.getElementById('datoI3');
  uiKirchhoff.datoP1 = document.getElementById('datoP1');
  uiKirchhoff.datoP2 = document.getElementById('datoP2');
  uiKirchhoff.datoP3 = document.getElementById('datoP3');
  uiKirchhoff.datoP4 = document.getElementById('datoP4');
  uiKirchhoff.datoP5 = document.getElementById('datoP5');
  uiKirchhoff.datoBalance = document.getElementById('datoBalance');
  uiKirchhoff.caso = document.getElementById('casoKirchhoff');

  uiKirchhoff.btnResolver.addEventListener('click', resolverKirchhoff);
  for (const clave of ['V1', 'V2', 'R1', 'R2', 'R3', 'R4', 'R5']) {
    uiKirchhoff[clave].addEventListener('input', resolverKirchhoff);
  }

  textFont('Arial');
  resolverKirchhoff();
}

function draw() {
  background(18, 24, 38);
  dibujarCircuitoKirchhoff();
  dibujarPanelCanvasKirchhoff();
}

function resolverKirchhoff() {
  const V1 = Number(uiKirchhoff.V1.value);
  const V2 = Number(uiKirchhoff.V2.value);
  const R1 = Number(uiKirchhoff.R1.value);
  const R2 = Number(uiKirchhoff.R2.value);
  const R3 = Number(uiKirchhoff.R3.value);
  const R4 = Number(uiKirchhoff.R4.value);
  const R5 = Number(uiKirchhoff.R5.value);

  if ([V1, V2, R1, R2, R3, R4, R5].some(Number.isNaN)) {
    estadoKirchhoff.error = 'Revise los valores: todos deben ser numéricos.';
    actualizarPanelKirchhoff();
    return;
  }

  if ([R1, R2, R3, R4, R5].some(r => r <= 0)) {
    estadoKirchhoff.error = 'Las resistencias deben ser mayores que 0 Ω.';
    actualizarPanelKirchhoff();
    return;
  }

  estadoKirchhoff.V1 = V1;
  estadoKirchhoff.V2 = V2;
  estadoKirchhoff.R1 = R1;
  estadoKirchhoff.R2 = R2;
  estadoKirchhoff.R3 = R3;
  estadoKirchhoff.R4 = R4;
  estadoKirchhoff.R5 = R5;
  estadoKirchhoff.error = '';

  // Sistema de mallas usado:
  // (R1 + R3 + R5)·Ia - R5·Ib = V1
  // -R5·Ia + (R2 + R4 + R5)·Ib = -V2
  const M11 = R1 + R3 + R5;
  const M12 = -R5;
  const M21 = -R5;
  const M22 = R2 + R4 + R5;

  const det = M11 * M22 - M12 * M21;

  if (Math.abs(det) < 1e-9) {
    estadoKirchhoff.error = 'No se puede resolver: matriz de mallas singular.';
    actualizarPanelKirchhoff();
    return;
  }

  const Ia = (V1 * M22 - (-V2) * M12) / det;
  const Ib = (M11 * (-V2) - M21 * V1) / det;

  estadoKirchhoff.I2 = Ia;
  estadoKirchhoff.I1 = -Ib;
  estadoKirchhoff.I3 = Ia - Ib;

  actualizarPanelKirchhoff();
}

function actualizarPanelKirchhoff() {
  const e = estadoKirchhoff;

  if (e.error) {
    uiKirchhoff.datoI1.textContent = '---';
    uiKirchhoff.datoI2.textContent = '---';
    uiKirchhoff.datoI3.textContent = '---';
    uiKirchhoff.datoP1.textContent = '---';
    uiKirchhoff.datoP2.textContent = '---';
    uiKirchhoff.datoP3.textContent = '---';
    uiKirchhoff.datoP4.textContent = '---';
    uiKirchhoff.datoP5.textContent = '---';
    uiKirchhoff.datoBalance.textContent = '---';
    uiKirchhoff.caso.textContent = e.error;
    uiKirchhoff.caso.style.background = '#fef2f2';
    uiKirchhoff.caso.style.color = '#b91c1c';
    return;
  }

  const P = calcularPotenciasKirchhoff();

  uiKirchhoff.datoI1.textContent = `${e.I1.toFixed(3)} A`;
  uiKirchhoff.datoI2.textContent = `${e.I2.toFixed(3)} A`;
  uiKirchhoff.datoI3.textContent = `${e.I3.toFixed(3)} A`;
  uiKirchhoff.datoP1.textContent = `${P.P1.toFixed(3)} W`;
  uiKirchhoff.datoP2.textContent = `${P.P2.toFixed(3)} W`;
  uiKirchhoff.datoP3.textContent = `${P.P3.toFixed(3)} W`;
  uiKirchhoff.datoP4.textContent = `${P.P4.toFixed(3)} W`;
  uiKirchhoff.datoP5.textContent = `${P.P5.toFixed(3)} W`;
  uiKirchhoff.datoBalance.textContent = `${P.Ptotal.toFixed(3)} W disipados`;

  uiKirchhoff.caso.textContent = 'Caso actual: se resuelve el circuito por mallas y se calcula la potencia disipada P = I²R en cada resistor.';
  uiKirchhoff.caso.style.background = '#eef6ff';
  uiKirchhoff.caso.style.color = '#075ecf';
}

function calcularPotenciasKirchhoff() {
  const e = estadoKirchhoff;

  const P1 = sq(e.I2) * e.R1;
  const P2 = sq(e.I1) * e.R2;
  const P3 = sq(e.I2) * e.R3;
  const P4 = sq(e.I1) * e.R4;
  const P5 = sq(e.I3) * e.R5;
  const Ptotal = P1 + P2 + P3 + P4 + P5;

  return { P1, P2, P3, P4, P5, Ptotal };
}

function dibujarCircuitoKirchhoff() {
  const e = estadoKirchhoff;

  fill(15, 23, 42);
  noStroke();
  rect(0, 0, width, height, 16);

  fill(226, 232, 240);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(22);
  text('Leyes de Kirchhoff: circuito de dos mallas', width / 2, 32);

  textStyle(NORMAL);
  textSize(13);
  fill(148, 163, 184);
  text('Ajuste voltajes y resistencias para observar las corrientes de rama y la potencia disipada.', width / 2, 55);

  const cx = 120;
  const cy = 95;
  const w = 540;
  const h = 300;
  const midX = cx + w / 2;
  const midY = cy + h / 2;

  // Panel principal del circuito
  fill(30, 41, 59);
  noStroke();
  rect(34, 76, 692, 340, 18);

  // Cables
  stroke(100, 116, 139);
  strokeWeight(4);
  noFill();
  rect(cx, cy, w, h);
  line(cx, midY, cx + w, midY);
  line(midX, cy, midX, midY);

  // Nodos
  dibujarNodo(midX, cy);
  dibujarNodo(midX, midY);
  dibujarNodo(cx, midY);
  dibujarNodo(cx + w, midY);

  dibujarResistenciaKirchhoff(cx + w * 0.25, cy, `R1: ${e.R1.toFixed(2)} Ω`);
  dibujarResistenciaKirchhoff(cx + w * 0.75, cy, `R2: ${e.R2.toFixed(2)} Ω`);
  dibujarBateriaKirchhoff(cx + w * 0.12, midY, `V1: ${e.V1.toFixed(2)} V`, true);
  dibujarResistenciaKirchhoff(cx + w * 0.35, midY, `R3: ${e.R3.toFixed(2)} Ω`);
  dibujarResistenciaKirchhoff(cx + w * 0.65, midY, `R4: ${e.R4.toFixed(2)} Ω`);
  dibujarBateriaKirchhoff(cx + w * 0.88, midY, `V2: ${e.V2.toFixed(2)} V`, false);
  dibujarResistenciaKirchhoff(midX, cy + h, `R5: ${e.R5.toFixed(2)} Ω`);

  if (!e.error) {
    dibujarFlechaCorrienteKirchhoff(cx + w * 0.34, midY - 30, true, e.I2, 'I2', color(236, 64, 122));
    dibujarFlechaCorrienteKirchhoff(cx + w * 0.66, midY - 30, false, e.I1, 'I1', color(56, 189, 248));
    dibujarFlechaCorrienteKirchhoff(midX, cy + h - 30, false, e.I3, 'I3', color(74, 222, 128));
  }
}

function dibujarNodo(x, y) {
  fill(203, 213, 225);
  stroke(241, 245, 249);
  strokeWeight(1.5);
  circle(x, y, 8);
}

function dibujarResistenciaKirchhoff(x, y, texto) {
  push();
  translate(x, y);
  rectMode(CENTER);

  fill(30, 41, 59);
  noStroke();
  rect(0, 0, 46, 20);

  fill(218, 165, 32);
  stroke(101, 67, 33);
  strokeWeight(1.5);
  rect(0, 0, 34, 14, 3);

  noStroke();
  fill(139, 69, 19);
  rect(-9, 0, 3, 14);
  fill(239, 68, 68);
  rect(-2, 0, 3, 14);
  fill(234, 179, 8);
  rect(7, 0, 3, 14);

  fill(241, 245, 249);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);
  text(texto, 0, -13);
  pop();
}

function dibujarBateriaKirchhoff(x, y, texto, positivoIzquierda) {
  push();
  translate(x, y);
  rectMode(CENTER);

  fill(30, 41, 59);
  noStroke();
  rect(0, 0, 52, 24);

  fill(51, 65, 85);
  stroke(241, 245, 249);
  strokeWeight(1.5);
  rect(0, 0, 34, 16, 2);

  noStroke();
  fill(239, 68, 68);

  if (positivoIzquierda) {
    rect(-19, 0, 4, 10, 1);
    fill(255);
    textSize(11);
    text('+', -10, 4);
    text('-', 9, 4);
  } else {
    rect(19, 0, 4, 10, 1);
    fill(255);
    textSize(11);
    text('-', -10, 4);
    text('+', 9, 4);
  }

  fill(241, 245, 249);
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);
  text(texto, 0, -13);
  pop();
}

function dibujarFlechaCorrienteKirchhoff(x, y, haciaIzquierda, valor, etiqueta, col) {
  push();
  stroke(col);
  fill(col);
  strokeWeight(2.5);

  if (haciaIzquierda) {
    line(x + 20, y, x - 20, y);
    triangle(x - 20, y, x - 11, y - 6, x - 11, y + 6);
  } else {
    line(x - 20, y, x + 20, y);
    triangle(x + 20, y, x + 11, y - 6, x + 11, y + 6);
  }

  noStroke();
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);
  text(`${etiqueta} = ${valor.toFixed(2)} A`, x, y - 8);
  pop();
}

function dibujarPanelCanvasKirchhoff() {
  const e = estadoKirchhoff;
  const P = calcularPotenciasKirchhoff();

  fill(248, 250, 252);
  stroke(51, 65, 85);
  strokeWeight(1);
  rect(34, 430, 692, 106, 16);

  noStroke();
  fill(15, 23, 42);
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(16);
  text('Lectura del circuito', 56, 458);

  textStyle(NORMAL);
  textSize(13);

  if (e.error) {
    fill(185, 28, 28);
    text(e.error, 56, 485);
    return;
  }

  fill(51, 65, 85);
  text(`Corrientes: I1 = ${e.I1.toFixed(3)} A   |   I2 = ${e.I2.toFixed(3)} A   |   I3 = ${e.I3.toFixed(3)} A`, 56, 485);
  text(`Potencia total disipada: ${P.Ptotal.toFixed(3)} W`, 56, 508);

  fill(100, 116, 139);
  text('Modelo: se aplican ecuaciones de malla y luego P = I²R para cada resistencia.', 56, 528);
}
