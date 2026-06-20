const C_LUZ = 3.0e8;

const CASOS_ONDAS = {
  diamante: {
    nombre: 'Diamante',
    descripcion: 'Luz amarilla de sodio en diamante',
    frecuencia: 5.09e14,
    K: 5.84,
    Km: 1,
    esperado: {
      lambdaVacio: 5.89e-7,
      velocidad: 1.24e8,
      lambdaMaterial: 2.44e-7
    },
    resumen: 'Libro: λ₀ = 589 nm, v = 1.24 × 10⁸ m/s y λ = 244 nm.'
  },
  ferrita: {
    nombre: 'Ferrita',
    descripcion: 'Onda de radio FM en ferrita aislante',
    frecuencia: 90.0e6,
    K: 10,
    Km: 1000,
    esperado: {
      lambdaVacio: 3.33,
      velocidad: 3.00e6,
      lambdaMaterial: 3.33e-2
    },
    resumen: 'Libro: λ₀ = 3.33 m, v = 3.00 × 10⁶ m/s y λ = 3.33 cm.'
  },
  vacio: {
    nombre: 'Vacío / aire',
    descripcion: 'Referencia: la onda viaja aproximadamente con rapidez c',
    frecuencia: 90.0e6,
    K: 1,
    Km: 1,
    resumen: 'En vacío o aire aproximado: K = 1, Km = 1, por eso v = c.'
  },
  agua: {
    nombre: 'Agua',
    descripcion: 'Aproximación para luz visible',
    frecuencia: 5.09e14,
    K: 1.80,
    Km: 1,
    resumen: 'Agua para luz visible aprox.: K ≈ 1.80 y Km ≈ 1; la rapidez queda cerca de 0.75c.'
  },
  vidrio: {
    nombre: 'Vidrio',
    descripcion: 'Aproximación óptica de vidrio común',
    frecuencia: 5.09e14,
    K: 2.25,
    Km: 1,
    resumen: 'Vidrio común aprox.: K ≈ 2.25 y Km ≈ 1; equivale a un índice n ≈ 1.50.'
  }
};

let uiOndas = {};
let bloqueandoEvento = false;
let errorInicializacion = '';

function setup() {
  const canvas = createCanvas(760, 650);
  const contenedor = document.getElementById('canvas-container-ondas');
  if (contenedor) canvas.parent(contenedor);

  uiOndas = {
    caso: document.getElementById('casoValidacionOndas'),
    frecuencia: document.getElementById('frecuenciaOndas'),
    K: document.getElementById('constanteK'),
    Km: document.getElementById('permeabilidadKm'),
    datoLambdaVacio: document.getElementById('datoLambdaVacio'),
    datoVelocidad: document.getElementById('datoVelocidad'),
    datoLambdaMaterial: document.getElementById('datoLambdaMaterial'),
    datoRelacion: document.getElementById('datoRelacion'),
    datoIndice: document.getElementById('datoIndice'),
    datoRelacionEB: document.getElementById('datoRelacionEB'),
    validacion: document.getElementById('validacionOndas')
  };

  const faltantes = Object.entries(uiOndas)
    .filter(([, elemento]) => !elemento)
    .map(([nombre]) => nombre);

  if (faltantes.length > 0) {
    errorInicializacion = 'Faltan elementos HTML: ' + faltantes.join(', ');
    console.error(errorInicializacion);
    return;
  }

  uiOndas.caso.addEventListener('change', aplicarCasoOndas);
  uiOndas.frecuencia.addEventListener('input', marcarPersonalizado);
  uiOndas.K.addEventListener('input', marcarPersonalizado);
  uiOndas.Km.addEventListener('input', marcarPersonalizado);

  aplicarCasoOndas();
  textFont('Arial');
}

function aplicarCasoOndas() {
  if (!uiOndas.caso) return;
  const caso = CASOS_ONDAS[uiOndas.caso.value];
  if (!caso) return;

  bloqueandoEvento = true;
  uiOndas.frecuencia.value = formatearFrecuenciaInput(caso.frecuencia);
  uiOndas.K.value = caso.K;
  uiOndas.Km.value = caso.Km;
  bloqueandoEvento = false;
}

function marcarPersonalizado() {
  if (!bloqueandoEvento && uiOndas.caso && uiOndas.caso.value !== 'personalizado') {
    uiOndas.caso.value = 'personalizado';
  }
}

function draw() {
  if (errorInicializacion) {
    background(255);
    fill(180, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Error de carga en ondas.js', width / 2, height / 2 - 12);
    textSize(12);
    text(errorInicializacion, width / 2, height / 2 + 16);
    return;
  }

  const estado = obtenerEstadoOndas();
  actualizarPanelOndas(estado);
  dibujarOndas(estado);
}

function obtenerEstadoOndas() {
  const frecuencia = Math.max(parsearFrecuencia(uiOndas.frecuencia.value), 1);
  const K = constrain(Number(uiOndas.K.value) || 1, 1, 100);
  const Km = constrain(Number(uiOndas.Km.value) || 1, 1, 2000);
  const indice = Math.sqrt(K * Km);
  const v = C_LUZ / indice;
  const relacion = v / C_LUZ;
  const lambdaVacio = C_LUZ / frecuencia;
  const lambdaMaterial = v / frecuencia;
  const caso = CASOS_ONDAS[uiOndas.caso.value] || null;

  return { frecuencia, K, Km, indice, v, relacion, lambdaVacio, lambdaMaterial, caso };
}

function actualizarPanelOndas(e) {
  uiOndas.datoLambdaVacio.textContent = formatearLongitud(e.lambdaVacio);
  uiOndas.datoVelocidad.textContent = `${e.v.toExponential(3)} m/s`;
  uiOndas.datoLambdaMaterial.textContent = formatearLongitud(e.lambdaMaterial);
  uiOndas.datoRelacion.textContent = `${e.relacion.toFixed(4)}`;
  uiOndas.datoIndice.textContent = `n = √(K·Km) = ${e.indice.toFixed(3)}`;
  uiOndas.datoRelacionEB.textContent = 'E = vB; B = E/v';

  if (e.caso && e.caso.esperado) {
    const errV = errorRelativo(e.v, e.caso.esperado.velocidad);
    const errL0 = errorRelativo(e.lambdaVacio, e.caso.esperado.lambdaVacio);
    const errLm = errorRelativo(e.lambdaMaterial, e.caso.esperado.lambdaMaterial);

    uiOndas.validacion.innerHTML =
      `<strong>Validación con el libro:</strong><br>` +
      `${e.caso.resumen}<br>` +
      `Error por redondeo: λ₀ ${errL0.toFixed(2)}%, v ${errV.toFixed(2)}%, λ ${errLm.toFixed(2)}%.`;
    uiOndas.validacion.style.background = '#ecfdf5';
    uiOndas.validacion.style.color = '#047857';
  } else if (e.caso) {
    uiOndas.validacion.innerHTML = `<strong>${e.caso.nombre}:</strong><br>${e.caso.resumen}`;
    uiOndas.validacion.style.background = '#eef6ff';
    uiOndas.validacion.style.color = '#075ecf';
  } else {
    uiOndas.validacion.textContent =
      'Modo personalizado: cambie f, K y Km para comparar cómo cambia la rapidez y la longitud de onda.';
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
  rect(32, 24, width - 64, 112, 18);

  fill(15, 23, 42);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(23);
  text('Ondas electromagnéticas en vacío y materiales', width / 2, 55);

  textStyle(NORMAL);
  textSize(13);
  fill(76, 91, 112);
  text('Se compara la onda en vacío con la onda dentro del material. La frecuencia permanece constante.', width / 2, 80);

  const material = e.caso ? e.caso.nombre : 'Personalizado';
  const detalle = e.caso ? e.caso.descripcion : 'Valores definidos por el usuario';

  dibujarMiniDato(78, 100, 150, 'Material', material);
  dibujarMiniDato(245, 100, 160, 'Frecuencia', formatearFrecuencia(e.frecuencia));
  dibujarMiniDato(422, 100, 110, 'v/c', e.relacion.toFixed(4));
  dibujarMiniDato(548, 100, 135, 'n', e.indice.toFixed(3));

  fill(100, 116, 139);
  textSize(11);
  textAlign(CENTER);
  text(detalle, width / 2, 128);
}

function dibujarMiniDato(x, y, w, etiqueta, valor) {
  noStroke();
  fill(240, 247, 255);
  rect(x, y - 18, w, 34, 12);

  fill(71, 85, 105);
  textAlign(LEFT);
  textSize(10);
  textStyle(NORMAL);
  text(etiqueta, x + 10, y - 5);

  fill(11, 95, 190);
  textStyle(BOLD);
  textSize(12);
  text(valor, x + 10, y + 10);
}

function dibujarComparacionOndas(e) {
  const inicioX = 110;
  const finX = width - 88;
  const vacioY = 230;
  const materialY = 415;
  const maxIndice = Math.sqrt(100 * 2000);
  const lambdaVacioPx = 245;
  const lambdaMaterialPx = constrain(lambdaVacioPx / e.indice, 58, lambdaVacioPx);
  const avance = frameCount * map(e.relacion, 1 / maxIndice, 1, 0.012, 0.070);

  dibujarBloqueMedio(54, 160, width - 108, 150, 'Vacío', 'λ₀ = c / f', formatearLongitud(e.lambdaVacio));
  dibujarBloqueMedio(54, 345, width - 108, 150, 'Material', 'λ = v / f', formatearLongitud(e.lambdaMaterial));

  dibujarEje(inicioX, finX, vacioY, 'Dirección de propagación →');
  dibujarEje(inicioX, finX, materialY, 'Dirección de propagación →');

  dibujarOnda(inicioX, finX, vacioY, lambdaVacioPx, 32, avance, color(11, 117, 255), 4);
  dibujarOnda(inicioX, finX, vacioY + 58, lambdaVacioPx, 20, avance, color(20, 140, 80), 3);
  dibujarOnda(inicioX, finX, materialY, lambdaMaterialPx, 32, avance, color(11, 117, 255), 4);
  dibujarOnda(inicioX, finX, materialY + 58, lambdaMaterialPx, 20, avance, color(20, 140, 80), 3);

  dibujarEtiquetaCampo(inicioX - 58, vacioY, 'E', color(11, 117, 255));
  dibujarEtiquetaCampo(inicioX - 58, vacioY + 58, 'B', color(20, 140, 80));
  dibujarEtiquetaCampo(inicioX - 58, materialY, 'E', color(11, 117, 255));
  dibujarEtiquetaCampo(inicioX - 58, materialY + 58, 'B', color(20, 140, 80));

  noStroke();
  textAlign(CENTER);
  textStyle(NORMAL);
  textSize(12);
  fill(51, 65, 85);
  text('E y B están en fase. Al entrar al material, la rapidez baja y la longitud de onda se reduce.', width / 2, 520);
}

function dibujarBloqueMedio(x, y, w, h, titulo, formula, lambdaTexto) {
  noStroke();
  fill(255, 255, 255, 210);
  rect(x, y, w, h, 18);
  stroke(220, 232, 245);
  noFill();
  rect(x, y, w, h, 18);

  noStroke();
  fill(15, 23, 42);
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(15);
  text(titulo, x + 18, y + 28);

  fill(71, 85, 105);
  textStyle(NORMAL);
  textSize(12);
  text(`${formula}   →   ${lambdaTexto}`, x + 18, y + 48);
}

function dibujarEje(inicioX, finX, y, etiqueta) {
  stroke(90, 100, 120);
  strokeWeight(2);
  line(inicioX - 12, y, finX + 12, y);
  dibujarFlechaOndas(finX + 12, y, 0, color(90, 100, 120));

  noStroke();
  fill(239, 68, 68);
  textAlign(RIGHT);
  textStyle(BOLD);
  textSize(12);
  text(etiqueta, finX + 8, y - 32);
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

function dibujarEtiquetaCampo(x, y, texto, col) {
  noStroke();
  fill(255);
  circle(x, y, 28);
  fill(col);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(15);
  text(texto, x, y + 1);
}

function dibujarPanelCanvasOndas(e) {
  const x = 60;
  const y = 548;
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
  textSize(15);
  text('Cálculo actual', x + 22, y + 25);

  textStyle(NORMAL);
  textSize(12);
  fill(71, 85, 105);
  text(`f = ${formatearFrecuencia(e.frecuencia)}   |   K = ${e.K.toFixed(2)}   |   Km = ${formatearNumero(e.Km)}   |   v = ${e.v.toExponential(3)} m/s`, x + 22, y + 47);
  text(`λ₀ = ${formatearLongitud(e.lambdaVacio)}   |   λ material = ${formatearLongitud(e.lambdaMaterial)}   |   E = vB`, x + 22, y + 65);
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

function parsearFrecuencia(valor) {
  const limpio = String(valor).trim().replace(',', '.');
  const numero = Number(limpio);
  return Number.isFinite(numero) && numero > 0 ? numero : 1;
}

function formatearFrecuenciaInput(valor) {
  if (!Number.isFinite(valor) || valor <= 0) return '1';
  const exp = valor.toExponential(3).replace('e+', 'e').replace('e0', 'e');
  return exp.replace(/\.0+(?=e)/, '').replace(/(\.\d*?)0+(?=e)/, '$1');
}

function superindiceEntero(n) {
  const mapa = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(n).split('').map(c => mapa[c] || c).join('');
}

function formatearFrecuencia(valor) {
  if (!Number.isFinite(valor) || valor <= 0) return '---';
  if (valor >= 1e9 || valor < 1e-2) {
    const exp = Math.floor(Math.log10(valor));
    const mantisa = valor / Math.pow(10, exp);
    return `${mantisa.toFixed(2)} × 10${superindiceEntero(exp)} Hz`;
  }
  if (valor >= 1e6) return `${(valor / 1e6).toFixed(2)} MHz`;
  if (valor >= 1e3) return `${(valor / 1e3).toFixed(2)} kHz`;
  return `${valor.toFixed(2)} Hz`;
}

function formatearLongitud(valor) {
  if (!Number.isFinite(valor) || valor <= 0) return '---';
  if (valor >= 1) return `${valor.toFixed(3)} m`;
  if (valor >= 1e-2) return `${(valor * 100).toFixed(2)} cm`;
  if (valor >= 1e-3) return `${(valor * 1000).toFixed(2)} mm`;
  if (valor >= 1e-9) return `${(valor * 1e9).toFixed(1)} nm`;
  return `${valor.toExponential(3)} m`;
}

function formatearNumero(valor) {
  if (!Number.isFinite(valor)) return '---';
  if (Math.abs(valor - Math.round(valor)) < 1e-9) return String(Math.round(valor));
  return valor.toFixed(2);
}

function errorRelativo(calculado, esperado) {
  return Math.abs((calculado - esperado) / esperado) * 100;
}
