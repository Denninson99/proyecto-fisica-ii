const C_LUZ = 3.0e8;

const CASOS_ONDAS = {
  diamante: {
    nombre: 'Diamante: luz amarilla de sodio',
    frecuencia: 5.09e14,
    K: 5.84,
    Km: 1,
    esperado: {
      lambdaVacio: 5.89e-7,
      velocidad: 1.24e8,
      lambdaMaterial: 2.44e-7
    },
    resumen: 'Según el ejemplo 32.2: λ₀ = 589 nm, v = 1.24 × 10⁸ m/s y λ = 244 nm.'
  },
  ferrita: {
    nombre: 'Ferrita: onda de radio FM',
    frecuencia: 90.0e6,
    K: 10,
    Km: 1000,
    esperado: {
      lambdaVacio: 3.33,
      velocidad: 3.00e6,
      lambdaMaterial: 3.33e-2
    },
    resumen: 'Según el ejemplo 32.2: λ₀ = 3.33 m, v = 3.00 × 10⁶ m/s y λ = 3.33 cm.'
  }
};

let uiOndas = {};
let bloqueandoEvento = false;

function setup() {
  const canvas = createCanvas(760, 540);
  canvas.parent('canvas-container-ondas');

  uiOndas.caso = document.getElementById('casoValidacionOndas');
  uiOndas.frecuencia = document.getElementById('frecuenciaOndas');
  uiOndas.K = document.getElementById('constanteK');
  uiOndas.Km = document.getElementById('permeabilidadKm');

  uiOndas.valorK = document.getElementById('valorK');
  uiOndas.valorKm = document.getElementById('valorKm');
  uiOndas.datoLambdaVacio = document.getElementById('datoLambdaVacio');
  uiOndas.datoVelocidad = document.getElementById('datoVelocidad');
  uiOndas.datoLambdaMaterial = document.getElementById('datoLambdaMaterial');
  uiOndas.datoRelacion = document.getElementById('datoRelacion');
  uiOndas.datoIndice = document.getElementById('datoIndice');
  uiOndas.datoRelacionEB = document.getElementById('datoRelacionEB');
  uiOndas.validacion = document.getElementById('validacionOndas');

  uiOndas.caso.addEventListener('change', aplicarCasoOndas);
  uiOndas.frecuencia.addEventListener('input', marcarPersonalizado);
  uiOndas.K.addEventListener('input', marcarPersonalizado);
  uiOndas.Km.addEventListener('input', marcarPersonalizado);

  aplicarCasoOndas();
  textFont('Arial');
}

function aplicarCasoOndas() {
  const caso = CASOS_ONDAS[uiOndas.caso.value];
  if (!caso) return;

  bloqueandoEvento = true;
  uiOndas.frecuencia.value = caso.frecuencia;
  uiOndas.K.value = caso.K;
  uiOndas.Km.value = caso.Km;
  bloqueandoEvento = false;
}

function marcarPersonalizado() {
  if (!bloqueandoEvento && uiOndas.caso.value !== 'personalizado') {
    uiOndas.caso.value = 'personalizado';
  }
}

function draw() {
  const estado = obtenerEstadoOndas();
  actualizarPanelOndas(estado);
  dibujarOndas(estado);
}

function obtenerEstadoOndas() {
  const frecuencia = Math.max(Number(uiOndas.frecuencia.value), 1);
  const K = Math.max(Number(uiOndas.K.value), 1);
  const Km = Math.max(Number(uiOndas.Km.value), 1);
  const indice = Math.sqrt(K * Km);
  const v = C_LUZ / indice;
  const relacion = v / C_LUZ;
  const lambdaVacio = C_LUZ / frecuencia;
  const lambdaMaterial = v / frecuencia;
  const relacionEB = v;
  const caso = CASOS_ONDAS[uiOndas.caso.value] || null;

  return { frecuencia, K, Km, indice, v, relacion, lambdaVacio, lambdaMaterial, relacionEB, caso };
}

function actualizarPanelOndas(e) {
  uiOndas.valorK.textContent = e.K.toFixed(2);
  uiOndas.valorKm.textContent = e.Km.toFixed(0);

  uiOndas.datoLambdaVacio.textContent = formatearLongitud(e.lambdaVacio);
  uiOndas.datoVelocidad.textContent = `${e.v.toExponential(3)} m/s`;
  uiOndas.datoLambdaMaterial.textContent = formatearLongitud(e.lambdaMaterial);
  uiOndas.datoRelacion.textContent = `${e.relacion.toFixed(4)} c`;
  uiOndas.datoIndice.textContent = `n = √(K·Km) = ${e.indice.toFixed(3)}`;
  uiOndas.datoRelacionEB.textContent = `B = E / v`;

  if (e.caso) {
    const errV = errorRelativo(e.v, e.caso.esperado.velocidad);
    const errL0 = errorRelativo(e.lambdaVacio, e.caso.esperado.lambdaVacio);
    const errLm = errorRelativo(e.lambdaMaterial, e.caso.esperado.lambdaMaterial);

    uiOndas.validacion.innerHTML =
      `<strong>Validación con el libro:</strong><br>` +
      `${e.caso.resumen}<br>` +
      `Error por redondeo: λ₀ ${errL0.toFixed(2)}%, v ${errV.toFixed(2)}%, λ ${errLm.toFixed(2)}%.`;
    uiOndas.validacion.style.background = '#ecfdf5';
    uiOndas.validacion.style.color = '#047857';
  } else {
    uiOndas.validacion.textContent =
      'Modo personalizado: use K, Km y f para comparar cómo cambia la velocidad y la longitud de onda.';
    uiOndas.validacion.style.background = '#eef6ff';
    uiOndas.validacion.style.color = '#075ecf';
  }
}

function dibujarOndas(e) {
  background(247, 251, 255);
  dibujarFondoOndas();
  dibujarEncabezadoCanvas(e);
  dibujarComparacionOndas(e);
  dibujarPanelCanvasOndas(e);
}

function dibujarFondoOndas() {
  stroke(220, 232, 245);
  strokeWeight(1);
  for (let x = 0; x <= width; x += 40) line(x, 0, x, height);
  for (let y = 0; y <= height; y += 40) line(0, y, width, y);
}

function dibujarEncabezadoCanvas(e) {
  noStroke();
  fill(255);
  rect(32, 26, width - 64, 118, 18);

  fill(15, 23, 42);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(23);
  text('Validación: ondas electromagnéticas en materiales', width / 2, 58);

  textStyle(NORMAL);
  textSize(14);
  fill(76, 91, 112);
  text('Se compara la onda en vacío con la onda dentro del material. La frecuencia permanece constante.', width / 2, 84);

  const barraX = 120;
  const barraY = 108;
  const barraW = width - 240;
  const maxIndice = Math.sqrt(100 * 2000);
  const porcentaje = constrain(map(Math.log(e.indice), 0, Math.log(maxIndice), 0, 1), 0, 1);

  noStroke();
  fill(232, 240, 250);
  rect(barraX, barraY, barraW, 16, 999);

  fill(11, 117, 255);
  rect(barraX, barraY, barraW * porcentaje, 16, 999);

  fill(15, 23, 42);
  textSize(12);
  textAlign(LEFT);
  text('v cerca de c', barraX, barraY + 34);
  textAlign(RIGHT);
  text('v mucho menor que c', barraX + barraW, barraY + 34);
}

function dibujarComparacionOndas(e) {
  const inicioX = 70;
  const finX = width - 70;
  const centroVacio = 220;
  const centroMaterial = 340;
  const amplitudE = 38;
  const amplitudB = 20;
  const maxIndice = Math.sqrt(100 * 2000);
  const lambdaVacioPx = 230;
  const lambdaMaterialPx = constrain(lambdaVacioPx / e.indice, 18, lambdaVacioPx);
  const avance = frameCount * map(e.relacion, 1 / maxIndice, 1, 0.012, 0.085);

  dibujarEje(inicioX, finX, centroVacio, 'Vacío: λ₀ = c / f');
  dibujarEje(inicioX, finX, centroMaterial, 'Material: λ = v / f');

  dibujarOnda(inicioX, finX, centroVacio, lambdaVacioPx, amplitudE, avance, color(11, 117, 255), 4);
  dibujarOnda(inicioX, finX, centroVacio + 48, lambdaVacioPx, amplitudB, avance, color(20, 140, 80), 3);

  dibujarOnda(inicioX, finX, centroMaterial, lambdaMaterialPx, amplitudE, avance, color(11, 117, 255), 4);
  dibujarOnda(inicioX, finX, centroMaterial + 48, lambdaMaterialPx, amplitudB, avance, color(20, 140, 80), 3);

  noStroke();
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(13);
  fill(11, 117, 255);
  text('E', inicioX, centroVacio - 48);
  text('E', inicioX, centroMaterial - 48);

  fill(20, 140, 80);
  text('B', inicioX, centroVacio + 82);
  text('B', inicioX, centroMaterial + 82);

  fill(239, 68, 68);
  textStyle(BOLD);
  textSize(14);
  text('Dirección de propagación →', width - 250, 178);

  fill(15, 23, 42);
  textStyle(NORMAL);
  textSize(12);
  textAlign(CENTER);
  text('Las dos ondas E y B están en fase. En el material se comprime la longitud de onda porque v disminuye.', width / 2, 432);
}

function dibujarEje(inicioX, finX, y, etiqueta) {
  stroke(90, 100, 120);
  strokeWeight(2);
  line(inicioX - 20, y, finX + 20, y);
  dibujarFlechaOndas(finX + 20, y, 0, color(90, 100, 120));

  noStroke();
  fill(15, 23, 42);
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(14);
  text(etiqueta, inicioX - 20, y - 50);
}

function dibujarOnda(inicioX, finX, centroY, lambdaPx, amplitud, avance, col, peso) {
  noFill();
  stroke(col);
  strokeWeight(peso);
  beginShape();
  for (let x = inicioX; x <= finX; x += 3) {
    const y = centroY + amplitud * sin((TWO_PI * (x - inicioX)) / lambdaPx - avance);
    vertex(x, y);
  }
  endShape();
}

function dibujarPanelCanvasOndas(e) {
  const x = 60;
  const y = 452;
  const w = width - 120;
  const h = 68;

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
  textSize(15);
  text('Cálculo actual', x + 22, y + 24);

  textStyle(NORMAL);
  textSize(12);
  fill(71, 85, 105);
  text(`f = ${e.frecuencia.toExponential(3)} Hz | K = ${e.K.toFixed(2)} | Km = ${e.Km.toFixed(0)} | v = ${e.v.toExponential(3)} m/s`, x + 22, y + 45);
  text(`λ₀ = ${formatearLongitud(e.lambdaVacio)} | λ material = ${formatearLongitud(e.lambdaMaterial)} | E = vB`, x + 22, y + 62);
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

function formatearLongitud(valor) {
  if (!Number.isFinite(valor) || valor <= 0) return '---';
  if (valor >= 1) return `${valor.toFixed(3)} m`;
  if (valor >= 1e-2) return `${(valor * 100).toFixed(2)} cm`;
  if (valor >= 1e-3) return `${(valor * 1000).toFixed(2)} mm`;
  if (valor >= 1e-9) return `${(valor * 1e9).toFixed(1)} nm`;
  return `${valor.toExponential(3)} m`;
}

function errorRelativo(calculado, esperado) {
  return Math.abs((calculado - esperado) / esperado) * 100;
}
