const C_LUZ = 3.0e8;
const FRECUENCIA = 5.0;

let uiOndas = {};

function setup() {
  const canvas = createCanvas(760, 540);
  canvas.parent('canvas-container-ondas');

  uiOndas.K = document.getElementById('constanteK');
  uiOndas.Km = document.getElementById('permeabilidadKm');

  uiOndas.valorK = document.getElementById('valorK');
  uiOndas.valorKm = document.getElementById('valorKm');
  uiOndas.datoVelocidad = document.getElementById('datoVelocidad');
  uiOndas.datoRelacion = document.getElementById('datoRelacion');
  uiOndas.datoIndice = document.getElementById('datoIndice');
  uiOndas.datoLambda = document.getElementById('datoLambda');
  uiOndas.casoOndas = document.getElementById('casoOndas');

  textFont('Arial');
}

function draw() {
  const estado = obtenerEstadoOndas();
  actualizarPanelOndas(estado);
  dibujarOndas(estado);
}

function obtenerEstadoOndas() {
  const K = Number(uiOndas.K.value);
  const Km = Number(uiOndas.Km.value);
  const indice = Math.sqrt(K * Km);
  const v = C_LUZ / indice;
  const relacion = v / C_LUZ;
  const lambda = v / FRECUENCIA;

  return { K, Km, indice, v, relacion, lambda };
}

function actualizarPanelOndas(e) {
  uiOndas.valorK.textContent = e.K.toFixed(1);
  uiOndas.valorKm.textContent = e.Km.toFixed(0);

  uiOndas.datoVelocidad.textContent = `${e.v.toExponential(3)} m/s`;
  uiOndas.datoRelacion.textContent = `${(e.relacion * 100).toFixed(3)} % de c`;
  uiOndas.datoIndice.textContent = `n = ${e.indice.toFixed(3)}`;
  uiOndas.datoLambda.textContent = `${e.lambda.toExponential(3)} m`;

  if (e.indice < 2) {
    uiOndas.casoOndas.textContent = 'Medio casi parecido al vacío: la onda viaja muy cerca de la velocidad de la luz.';
    uiOndas.casoOndas.style.background = '#ecfdf5';
    uiOndas.casoOndas.style.color = '#047857';
  } else if (e.indice > 100) {
    uiOndas.casoOndas.textContent = 'Medio muy lento: la velocidad disminuye mucho y la onda se comprime visualmente.';
    uiOndas.casoOndas.style.background = '#fff7ed';
    uiOndas.casoOndas.style.color = '#9a3412';
  } else {
    uiOndas.casoOndas.textContent = 'Medio intermedio: al aumentar K o Km, la velocidad baja y la longitud de onda disminuye.';
    uiOndas.casoOndas.style.background = '#eef6ff';
    uiOndas.casoOndas.style.color = '#075ecf';
  }
}

function dibujarOndas(e) {
  background(247, 251, 255);
  dibujarFondoOndas();
  dibujarMedioOndas(e);
  dibujarOndaElectromagnetica(e);
  dibujarPanelCanvasOndas(e);
}

function dibujarFondoOndas() {
  stroke(220, 232, 245);
  strokeWeight(1);
  for (let x = 0; x <= width; x += 40) line(x, 0, x, height);
  for (let y = 0; y <= height; y += 40) line(0, y, width, y);
}

function dibujarMedioOndas(e) {
  noStroke();
  fill(255);
  rect(32, 26, width - 64, 118, 18);

  fill(15, 23, 42);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(24);
  text('Propagación de ondas electromagnéticas', width / 2, 58);

  textStyle(NORMAL);
  textSize(14);
  fill(76, 91, 112);
  text('La onda se propaga más lento cuando aumenta K o Km del medio.', width / 2, 84);

  const barraX = 120;
  const barraY = 108;
  const barraW = width - 240;
  const porcentaje = constrain(map(Math.log(e.indice), 0, Math.log(Math.sqrt(100 * 2000)), 0, 1), 0, 1);

  noStroke();
  fill(232, 240, 250);
  rect(barraX, barraY, barraW, 16, 999);

  fill(11, 117, 255);
  rect(barraX, barraY, barraW * porcentaje, 16, 999);

  fill(15, 23, 42);
  textSize(12);
  textAlign(LEFT);
  text('Medio ligero', barraX, barraY + 34);
  textAlign(RIGHT);
  text('Medio más pesado electromagnéticamente', barraX + barraW, barraY + 34);
}

function dibujarOndaElectromagnetica(e) {
  const centroY = 285;
  const inicioX = 70;
  const finX = width - 70;
  const amplitud = 58;
  const maxIndice = Math.sqrt(100 * 2000);
  const compresion = map(Math.log(e.indice), 0, Math.log(maxIndice), 1, 5.5);
  const longitudPx = 230 / compresion;
  const avance = frameCount * map(e.relacion, 1 / maxIndice, 1, 0.012, 0.085);

  // Eje de propagación
  stroke(90, 100, 120);
  strokeWeight(2);
  line(inicioX - 20, centroY, finX + 20, centroY);
  dibujarFlechaOndas(finX + 20, centroY, 0, color(90, 100, 120));

  noStroke();
  fill(90, 100, 120);
  textAlign(RIGHT);
  textSize(13);
  text('dirección de propagación', finX + 20, centroY - 18);

  // Campo eléctrico E
  noFill();
  stroke(11, 117, 255);
  strokeWeight(4);
  beginShape();
  for (let x = inicioX; x <= finX; x += 3) {
    const y = centroY + amplitud * sin((TWO_PI * (x - inicioX)) / longitudPx - avance);
    vertex(x, y);
  }
  endShape();

  // Campo magnético B, dibujado desfasado verticalmente para que se vea claro
  stroke(20, 140, 80);
  strokeWeight(3);
  beginShape();
  for (let x = inicioX; x <= finX; x += 3) {
    const y = centroY + 92 + 34 * sin((TWO_PI * (x - inicioX)) / longitudPx - avance);
    vertex(x, y);
  }
  endShape();

  // Puntos y leyenda
  noStroke();
  fill(11, 117, 255);
  textStyle(BOLD);
  textSize(15);
  textAlign(LEFT);
  text('Campo eléctrico E', inicioX, centroY - 82);

  fill(20, 140, 80);
  text('Campo magnético B', inicioX, centroY + 144);

  fill(15, 23, 42);
  textStyle(NORMAL);
  textSize(13);
  text(`λ visual baja cuando v baja.  n = √(K·Km) = ${e.indice.toFixed(2)}`, inicioX, centroY + 176);

  // Indicador de velocidad
  const flechaLargo = map(e.relacion, 1 / maxIndice, 1, 52, 170);
  const yFlecha = 178;
  stroke(239, 68, 68);
  strokeWeight(5);
  line(inicioX, yFlecha, inicioX + flechaLargo, yFlecha);
  dibujarFlechaOndas(inicioX + flechaLargo, yFlecha, 0, color(239, 68, 68));

  noStroke();
  fill(239, 68, 68);
  textStyle(BOLD);
  textSize(14);
  textAlign(LEFT);
  text('rapidez de propagación', inicioX, yFlecha - 16);
}

function dibujarPanelCanvasOndas(e) {
  const x = 60;
  const y = 438;
  const w = width - 120;
  const h = 78;

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
  text('Lectura física', x + 22, y + 25);

  textStyle(NORMAL);
  textSize(13);
  fill(71, 85, 105);
  text(`K = ${e.K.toFixed(1)}   |   Km = ${e.Km.toFixed(0)}   |   v = ${e.v.toExponential(3)} m/s`, x + 22, y + 49);
  text(`Modelo: v = c / √(K·Km).  Si f = ${FRECUENCIA.toFixed(1)} Hz, λ = ${e.lambda.toExponential(3)} m`, x + 22, y + 68);
}

function dibujarFlechaOndas(x, y, ang, c) {
  push();
  translate(x, y);
  rotate(ang);
  noStroke();
  fill(c);
  triangle(0, 0, -13, -7, -13, 7);
  pop();
}
