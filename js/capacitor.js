const EPSILON_0 = 8.85e-12;

let controlArea;
let controlDistancia;
let controlVoltaje;

let valorArea;
let valorDistancia;
let valorVoltaje;
let datoC;
let datoQ;
let datoEcap;
let datoU;
let casoCapacitor;

function setup() {
  const canvas = createCanvas(760, 540);
  canvas.parent('canvas-container-capacitor');

  controlArea = document.getElementById('areaPlacas');
  controlDistancia = document.getElementById('distanciaPlacas');
  controlVoltaje = document.getElementById('voltaje');

  valorArea = document.getElementById('valorArea');
  valorDistancia = document.getElementById('valorDistancia');
  valorVoltaje = document.getElementById('valorVoltaje');

  datoC = document.getElementById('datoC');
  datoQ = document.getElementById('datoQ');
  datoEcap = document.getElementById('datoEcap');
  datoU = document.getElementById('datoU');
  casoCapacitor = document.getElementById('casoCapacitor');

  textFont('Arial');
}

function draw() {
  const A = Number(controlArea.value);
  const d = Number(controlDistancia.value);
  const V = Number(controlVoltaje.value);

  const C = (EPSILON_0 * A) / d;
  const Q = C * V;
  const E = V / d;
  const U = 0.5 * C * V * V;

  actualizarPanel(A, d, V, C, Q, E, U);
  dibujarSimulacion(A, d, V, C, Q, E, U);
}

function actualizarPanel(A, d, V, C, Q, E, U) {
  valorArea.textContent = `${A.toFixed(1)} m²`;
  valorDistancia.textContent = `${d.toFixed(3)} m`;
  valorVoltaje.textContent = `${V.toFixed(0)} V`;

  datoC.textContent = `${(C * 1e9).toFixed(3)} nF`;
  datoQ.textContent = `${Q.toExponential(3)} C`;
  datoEcap.textContent = `${E.toExponential(3)} N/C`;
  datoU.textContent = `${U.toExponential(3)} J`;

  if (d < 0.008) {
    casoCapacitor.textContent = 'Placas muy cercanas: aumenta la capacitancia y el campo eléctrico es más intenso.';
  } else if (d > 0.035) {
    casoCapacitor.textContent = 'Placas más separadas: disminuye la capacitancia y se almacena menos carga con el mismo voltaje.';
  } else {
    casoCapacitor.textContent = 'Caso intermedio: se observa el equilibrio entre separación, carga almacenada y campo eléctrico.';
  }
}

function dibujarSimulacion(A, d, V, C, Q, E, U) {
  background(247, 251, 255);
  dibujarFondo();

  fill(15, 23, 42);
  noStroke();
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(24);
  text('Capacitor de placas paralelas', width / 2, 38);

  textStyle(NORMAL);
  textSize(14);
  fill(76, 91, 112);
  text('La separación d controla la capacitancia: si d aumenta, C disminuye.', width / 2, 64);

  const centroX = width / 2;
  const placaAncho = map(A, 1, 10, 170, 360);
  const placaAlto = 18;
  const separacionPx = map(d, 0.001, 0.05, 60, 220);
  const ySuperior = 180;
  const yInferior = ySuperior + separacionPx;

  dibujarCampoEntrePlacas(centroX, ySuperior, yInferior, placaAncho, E);
  dibujarPlacas(centroX, ySuperior, yInferior, placaAncho, placaAlto, V);
  dibujarDimension(centroX, ySuperior, yInferior, d);
  dibujarMedidor(centroX, ySuperior, yInferior, V);
  dibujarResultadosCanvas(A, d, V, C, Q, E, U);
}

function dibujarFondo() {
  stroke(220, 232, 245);
  strokeWeight(1);
  for (let x = 0; x <= width; x += 40) line(x, 0, x, height);
  for (let y = 0; y <= height; y += 40) line(0, y, width, y);
}

function dibujarCampoEntrePlacas(cx, y1, y2, placaAncho, E) {
  const intensidad = constrain(map(E, 2e4, 2e7, 60, 230), 60, 230);
  stroke(11, 117, 255, intensidad);
  strokeWeight(3);

  const margen = 30;
  const xInicio = cx - placaAncho / 2 + margen;
  const xFin = cx + placaAncho / 2 - margen;
  const cantidad = 7;

  for (let i = 0; i < cantidad; i++) {
    const x = map(i, 0, cantidad - 1, xInicio, xFin);
    line(x, y1 + 24, x, y2 - 12);
    dibujarFlecha(x, y2 - 16, 'abajo');
  }
}

function dibujarPlacas(cx, y1, y2, placaAncho, placaAlto, V) {
  rectMode(CORNER);

  fill(239, 68, 68);
  stroke(130, 25, 25);
  strokeWeight(1.5);
  rect(cx - placaAncho / 2, y1, placaAncho, placaAlto, 8);

  fill(37, 99, 235);
  stroke(25, 55, 130);
  rect(cx - placaAncho / 2, y2, placaAncho, placaAlto, 8);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(18);
  text('+', cx - placaAncho / 2 + 22, y1 + placaAlto / 2);
  text('−', cx - placaAncho / 2 + 22, y2 + placaAlto / 2);

  fill(15, 23, 42);
  textSize(13);
  textStyle(NORMAL);
  text('Placa positiva', cx, y1 - 16);
  text('Placa negativa', cx, y2 + placaAlto + 18);

  fill(11, 94, 207);
  textStyle(BOLD);
  text(`V = ${(V / 1000).toFixed(1)} kV`, cx + placaAncho / 2 + 78, (y1 + y2) / 2);
}

function dibujarDimension(cx, y1, y2, d) {
  const x = cx + 245;
  stroke(120, 130, 150);
  strokeWeight(2);
  line(x, y1, x, y2);
  line(x - 10, y1, x + 10, y1);
  line(x - 10, y2, x + 10, y2);

  noStroke();
  fill(15, 23, 42);
  textAlign(LEFT, CENTER);
  textSize(13);
  text(`d = ${d.toFixed(3)} m`, x + 16, (y1 + y2) / 2);
}

function dibujarMedidor(cx, y1, y2, V) {
  const x = cx - 250;
  const y = (y1 + y2) / 2;

  noFill();
  stroke(15, 23, 42);
  strokeWeight(2);
  rect(x - 45, y - 28, 90, 56, 12);

  noStroke();
  fill(15, 23, 42);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(13);
  text('Fuente', x, y - 8);
  text(`${Math.round(V)} V`, x, y + 12);

  stroke(15, 23, 42);
  strokeWeight(2);
  line(x + 45, y - 14, cx - 180, y1 + 9);
  line(x + 45, y + 14, cx - 180, y2 + 9);
}

function dibujarResultadosCanvas(A, d, V, C, Q, E, U) {
  const x = 60;
  const y = 420;
  const w = width - 120;
  const h = 88;

  noStroke();
  fill(255);
  rect(x, y, w, h, 18);
  stroke(220, 232, 245);
  noFill();
  rect(x, y, w, h, 18);

  noStroke();
  fill(15, 23, 42);
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(16);
  text('Lectura física', x + 22, y + 26);

  textStyle(NORMAL);
  textSize(13);
  fill(71, 85, 105);
  text(`A = ${A.toFixed(1)} m²   |   d = ${d.toFixed(3)} m   |   C = ${(C * 1e9).toFixed(3)} nF`, x + 22, y + 52);
  text(`Q = ${Q.toExponential(3)} C   |   E = ${E.toExponential(3)} N/C   |   U = ${U.toExponential(3)} J`, x + 22, y + 72);
}

function dibujarFlecha(x, y, direccion) {
  noStroke();
  fill(11, 117, 255, 180);
  if (direccion === 'abajo') {
    triangle(x - 6, y - 8, x + 6, y - 8, x, y + 4);
  }
}
