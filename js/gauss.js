const epsilon0 = 8.854e-12;
const k = 1 / (4 * Math.PI * epsilon0);

let ui = {};
let signoCarga = 1;
let mostrarLineas = true;
let mostrarFormulas = true;

const escala = 85;

function setup() {
  let canvas = createCanvas(780, 680);
  canvas.parent("canvas-container");

  ui.tipoDistribucion = document.getElementById("tipoDistribucion");

  ui.radioEsfera = document.getElementById("radioEsfera");
  ui.cargaTotal = document.getElementById("cargaTotal");
  ui.radioGauss = document.getElementById("radioGauss");

  ui.valorR = document.getElementById("valorR");
  ui.valorQ = document.getElementById("valorQ");
  ui.valorr = document.getElementById("valorr");

  ui.datoDistribucion = document.getElementById("datoDistribucion");
  ui.datoQenc = document.getElementById("datoQenc");
  ui.datoE = document.getElementById("datoE");
  ui.datoFlujo = document.getElementById("datoFlujo");
  ui.casoActual = document.getElementById("casoActual");

  ui.btnSigno = document.getElementById("btnSigno");
  ui.btnLineas = document.getElementById("btnLineas");
  ui.btnFormulas = document.getElementById("btnFormulas");
  ui.bloqueFormulas = document.getElementById("bloqueFormulas");
  ui.formulaDinamica = document.getElementById("formulaDinamica");

  ui.btnSigno.addEventListener("click", function () {
    signoCarga *= -1;
  });

  ui.btnLineas.addEventListener("click", function () {
    mostrarLineas = !mostrarLineas;
  });

  ui.btnFormulas.addEventListener("click", function () {
    mostrarFormulas = !mostrarFormulas;
    ui.bloqueFormulas.style.display = mostrarFormulas ? "block" : "none";
  });
}

function draw() {
  const estado = obtenerEstado();

  background(255);

  dibujarFondoCanvas();
  dibujarSimulacion(estado);
  dibujarGrafica(estado);
  actualizarPanel(estado);
}

function obtenerEstado() {
  const tipo = ui.tipoDistribucion.value;

  const R = Number(ui.radioEsfera.value);
  const r = Number(ui.radioGauss.value);
  const Qmicro = signoCarga * Number(ui.cargaTotal.value);
  const Q = Qmicro * 1e-6;

  let Qenc;
  let E;

  if (r === 0) {
    Qenc = 0;
    E = 0;
  } else if (r < R) {
    if (tipo === "uniforme") {
      Qenc = Q * Math.pow(r / R, 3);
      E = k * Q * r / Math.pow(R, 3);
    } else {
      Qenc = Q * Math.pow(r / R, 4);
      E = k * Q * Math.pow(r, 2) / Math.pow(R, 4);
    }
  } else {
    Qenc = Q;
    E = k * Q / Math.pow(r, 2);
  }

  const flujo = Qenc / epsilon0;

  return {
    tipo: tipo,
    R: R,
    r: r,
    Qmicro: Qmicro,
    Q: Q,
    Qenc: Qenc,
    E: E,
    flujo: flujo,
    Rpx: R * escala,
    rpx: r * escala
  };
}

function dibujarFondoCanvas() {
  noStroke();

  fill(248, 250, 252);
  rect(0, 0, width, height, 16);

  fill(255);
  rect(18, 18, 455, 644, 16);

  fill(255);
  rect(492, 18, 270, 644, 16);

  stroke(226, 232, 240);
  strokeWeight(1);
  line(482, 35, 482, 645);
}

function dibujarSimulacion(e) {
  const cx = 245;
  const cy = 330;

  fill(20);
  noStroke();
  textAlign(CENTER);
  textSize(20);
  text("Esfera aislante y superficie gaussiana", cx, 52);

  dibujarLineasCampo(cx, cy, e);
  dibujarEsfera(cx, cy, e);
  dibujarSuperficieGaussiana(cx, cy, e);
  dibujarVectorCampo(cx, cy, e);
  dibujarEtiquetas(cx, e);
}

function dibujarEsfera(cx, cy, e) {
  noStroke();

  if (e.Q >= 0) {
    fill(255, 110, 90, 145);
  } else {
    fill(80, 145, 255, 145);
  }

  circle(cx, cy, e.Rpx * 2);

  stroke(255, 255, 255, 130);
  strokeWeight(1);

  for (let x = -e.Rpx; x <= e.Rpx; x += 22) {
    const h = Math.sqrt(Math.max(0, e.Rpx * e.Rpx - x * x));
    line(cx + x, cy - h, cx + x, cy + h);
  }

  dibujarCargas(cx, cy, e);
}

function dibujarCargas(cx, cy, e) {
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(15);

  const n = 75;

  for (let i = 0; i < n; i++) {
    const ang = radians(i * 137.5);
    let radio;

    if (e.tipo === "uniforme") {
      radio = Math.sqrt((i + 0.5) / n) * e.Rpx * 0.88;
    } else {
      radio = Math.pow((i + 0.5) / n, 0.28) * e.Rpx * 0.9;
    }

    const x = cx + radio * cos(ang);
    const y = cy + radio * sin(ang);

    if (e.Q >= 0) {
      fill(170, 35, 25);
      text("+", x, y);
    } else {
      fill(25, 80, 180);
      text("-", x, y);
    }
  }
}

function dibujarSuperficieGaussiana(cx, cy, e) {
  noFill();
  stroke(20, 150, 80);
  strokeWeight(3);
  drawingContext.setLineDash([8, 8]);
  circle(cx, cy, e.rpx * 2);
  drawingContext.setLineDash([]);

  noStroke();
  fill(20, 130, 70);
  textAlign(CENTER);
  textSize(14);

  if (e.rpx > 28) {
    let yEtiqueta = cy - e.rpx - 12;

    if (yEtiqueta < 78) {
      yEtiqueta = 78;
    }

    text("Superficie gaussiana", cx, yEtiqueta);
  } else {
    text("r = 0", cx, cy - 18);
  }
}

function dibujarLineasCampo(cx, cy, e) {
  if (!mostrarLineas) return;

  const cantidad = 24;
  const radioInicial = 22;
  const radioFinal = 220;

  for (let i = 0; i < cantidad; i++) {
    const ang = (TWO_PI / cantidad) * i;
    const x1 = cx + cos(ang) * radioInicial;
    const y1 = cy + sin(ang) * radioInicial;
    const x2 = cx + cos(ang) * radioFinal;
    const y2 = cy + sin(ang) * radioFinal;

    if (e.Q >= 0) {
      stroke(240, 95, 80, 115);
      strokeWeight(2);
      line(x1, y1, x2, y2);
      dibujarPuntaFlecha(x2, y2, ang, color(240, 95, 80, 150));
    } else {
      stroke(70, 130, 240, 115);
      strokeWeight(2);
      line(x2, y2, x1, y1);
      dibujarPuntaFlecha(x1, y1, ang + PI, color(70, 130, 240, 150));
    }
  }
}

function dibujarVectorCampo(cx, cy, e) {
  const ang = -PI / 5;

  const px = cx + cos(ang) * e.rpx;
  const py = cy + sin(ang) * e.rpx;

  fill(20);
  noStroke();
  circle(px, py, 7);

  const Emax = k * Math.abs(e.Q) / Math.pow(e.R, 2);
  let largo = 0;

  if (Emax > 0) {
    largo = constrain((Math.abs(e.E) / Emax) * 60, 0, 60);
  }

  if (largo < 2) return;

  const direccion = e.Q >= 0 ? 1 : -1;

  const x2 = px + cos(ang) * largo * direccion;
  const y2 = py + sin(ang) * largo * direccion;

  stroke(20);
  strokeWeight(3);
  line(px, py, x2, y2);

  dibujarPuntaFlecha(
    x2,
    y2,
    ang + (direccion === 1 ? 0 : PI),
    color(20)
  );

  noStroke();
  fill(20);
  textSize(15);
  textAlign(CENTER);
  text("E", x2 + 14, y2 - 10);
}

function dibujarEtiquetas(cx, e) {
  const cajaX = 55;
  const cajaY = 555;
  const cajaW = 380;
  const cajaH = 90;

  noStroke();
  fill(255, 255, 255, 240);
  rect(cajaX, cajaY, cajaW, cajaH, 12);

  fill(45);
  textAlign(CENTER);
  textSize(12.5);

  if (e.tipo === "uniforme") {
    text("Carga uniforme: misma densidad en todo el volumen", cx, cajaY + 20);
  } else {
    text("Carga no uniforme radial: mayor densidad hacia la superficie", cx, cajaY + 20);
  }

  text("Esfera aislante: la carga está dentro del material", cx, cajaY + 42);

  fill(20, 130, 70);
  textSize(13);

  if (e.r < e.R) {
    text("La superficie gaussiana encierra parte de la carga", cx, cajaY + 68);
  } else {
    text("La superficie gaussiana encierra toda la carga Q", cx, cajaY + 68);
  }
}

function dibujarGrafica(e) {
  const gx = 520;
  const gy = 330;
  const gw = 220;
  const gh = 210;

  noStroke();
  fill(20);
  textAlign(CENTER);
  textSize(18);

  if (e.tipo === "uniforme") {
    text("Gráfica de |E|: carga uniforme", gx + gw / 2, 52);
  } else {
    text("Gráfica de |E|: carga no uniforme", gx + gw / 2, 52);
  }

  stroke(40);
  strokeWeight(1.5);
  line(gx, gy, gx, gy - gh);
  line(gx, gy, gx + gw, gy);

  noStroke();
  fill(40);
  textSize(13);
  text("E", gx - 14, gy - gh - 4);
  text("r", gx + gw + 12, gy + 4);

  const rMax = 3.0;
  let maxE = 0;

  for (let i = 0; i <= 300; i++) {
    const r = (i / 300) * rMax;
    const Etemp = calcularMagnitudE(r, e.R, e.Q, e.tipo);
    if (Etemp > maxE) maxE = Etemp;
  }

  if (maxE === 0) maxE = 1;

  noFill();
  stroke(235, 70, 45);
  strokeWeight(3);

  beginShape();

  for (let i = 0; i <= 300; i++) {
    const r = (i / 300) * rMax;
    const Etemp = calcularMagnitudE(r, e.R, e.Q, e.tipo);

    const x = map(r, 0, rMax, gx, gx + gw);
    const y = map(Etemp, 0, maxE, gy, gy - gh + 10);

    vertex(x, y);
  }

  endShape();

  const xR = map(e.R, 0, rMax, gx, gx + gw);

  stroke(0, 110, 255);
  strokeWeight(2);
  drawingContext.setLineDash([6, 6]);
  line(xR, gy, xR, gy - gh);
  drawingContext.setLineDash([]);

  noStroke();
  fill(0, 110, 255);
  textSize(12);
  textAlign(CENTER);
  text("r = R", xR, gy + 18);

  const xActual = map(e.r, 0, rMax, gx, gx + gw);
  const yActual = map(Math.abs(e.E), 0, maxE, gy, gy - gh + 10);

  fill(0, 110, 255);
  noStroke();
  circle(xActual, yActual, 9);

  fill(60);
  textAlign(LEFT);
  textSize(13);

  if (e.tipo === "uniforme") {
    text("Dentro: |E| aumenta linealmente", gx, 410);
    text("Fuera: |E| disminuye como 1/r^2", gx, 432);
  } else {
    text("Dentro: |E| aumenta como r^2", gx, 410);
    text("Fuera: |E| disminuye como 1/r^2", gx, 432);
  }

  dibujarMiniEcuaciones(gx, 465, e.tipo);
}

function dibujarMiniEcuaciones(x, y, tipo) {
  noStroke();
  fill(35);
  textAlign(LEFT);
  textSize(13);

  if (tipo === "uniforme") {
    text("Qenc = Q(r^3/R^3)", x, y);
    text("E = kQr/R^3       si r < R", x, y + 22);
  } else {
    text("Qenc = Q(r^4/R^4)", x, y);
    text("E = kQr^2/R^4     si r < R", x, y + 22);
  }

  text("E = kQ/r^2        si r >= R", x, y + 44);
}

function calcularMagnitudE(r, R, Q, tipo) {
  if (r === 0) return 0;

  if (r < R) {
    if (tipo === "uniforme") {
      return Math.abs(k * Q * r / Math.pow(R, 3));
    }

    return Math.abs(k * Q * Math.pow(r, 2) / Math.pow(R, 4));
  }

  return Math.abs(k * Q / Math.pow(r, 2));
}

function dibujarPuntaFlecha(x, y, ang, c) {
  push();
  translate(x, y);
  rotate(ang);
  noStroke();
  fill(c);
  triangle(0, 0, -12, -5, -12, 5);
  pop();
}

function actualizarPanel(e) {
  ui.valorR.textContent = e.R.toFixed(2) + " m";
  ui.valorQ.textContent = (e.Qmicro >= 0 ? "+" : "") + e.Qmicro.toFixed(1) + " μC";
  ui.valorr.textContent = e.r.toFixed(2) + " m";

  if (e.tipo === "uniforme") {
    ui.datoDistribucion.textContent = "Uniforme";
    ui.formulaDinamica.innerHTML =
      "Carga uniforme:<br>" +
      "ρ = constante<br><br>" +
      "Si r &lt; R:<br>" +
      "Qenc = Q(r^3/R^3)<br>" +
      "E = kQr/R^3<br><br>" +
      "Si r >= R:<br>" +
      "Qenc = Q<br>" +
      "E = kQ/r^2";
  } else {
    ui.datoDistribucion.textContent = "No uniforme radial";
    ui.formulaDinamica.innerHTML =
      "Carga no uniforme radial:<br>" +
      "ρ(r) = (Q/πR^4)r<br><br>" +
      "Si r &lt; R:<br>" +
      "Qenc = Q(r^4/R^4)<br>" +
      "E = kQr^2/R^4<br><br>" +
      "Si r >= R:<br>" +
      "Qenc = Q<br>" +
      "E = kQ/r^2";
  }

  ui.datoQenc.textContent = cientifico(e.Qenc) + " C";
  ui.datoE.textContent = cientifico(e.E) + " N/C";
  ui.datoFlujo.textContent = cientifico(e.flujo) + " N·m²/C";

  if (e.r < e.R) {
    ui.casoActual.textContent = "Caso actual: r < R, la superficie está dentro de la esfera.";
    ui.casoActual.style.background = "#fff7ed";
    ui.casoActual.style.color = "#c2410c";
  } else {
    ui.casoActual.textContent = "Caso actual: r >= R, la superficie encierra toda la carga.";
    ui.casoActual.style.background = "#ecfdf5";
    ui.casoActual.style.color = "#047857";
  }
}

function cientifico(numero) {
  if (Math.abs(numero) < 1e-20) return "0";
  return numero.toExponential(3);
}
