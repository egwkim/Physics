import { cvsHeight, clearCvs, renderIsotherm, drawLines } from './canvas.js';

setInterval(() => {}, 100);

// PV = kT
const k = 1;

// dU = c * dT
const c = 2;

const scale = 1 / 10;

let pointList: { x: number; y: number }[] = [];

let drawMode = 0; // 0 free draw, 1 isobaric, 2 isochoric, 3 isotherm, 4 adiabatic

let prevX: number;
let prevY: number;

let P: number;
let V: number;

let isMouseDown = 0;

let Q_in = 0;
let Q_out = 0;
let Q_total = 0;
let W_in = 0;
let W_out = 0;
let W_total = 0;

function calculate(V: number, P: number, dV: number, dP: number) {
  let W = (dV * (2 * P + dP)) / 2;
  let dT = ((V + dV) * (P + dP) - V * P) / k;
  let dU = c * dT;
  let Q = dU + W;

  W_total += W;
  if (W > 0) {
    W_out += W;
  } else {
    W_in -= W;
  }

  Q_total += Q;
  if (Q > 0) {
    Q_in += Q;
  } else {
    Q_out -= Q;
  }
}

function whileMouseDown(event: { pageX: number; pageY: number }) {
  if (pointList.length == 0) {
    prevX = event.pageX;
    prevY = event.pageY;

    P = prevX * scale;
    V = (cvsHeight - prevY) * scale;

    pointList.push({ x: prevX, y: prevY });

    clearCvs();
    drawLines();
    renderIsotherm((P * V) / k);
    updateText();

    return;
  }

  let newX: number, newY: number;
  switch (drawMode) {
    case 1:
      // isobaric
      newX = event.pageX;
      newY = prevY;
      break;
    case 2:
      // isochoric
      newX = prevX;
      newY = event.pageY;
      break;
    case 3:
      // isotherm
      newX = event.pageX;
      newY = cvsHeight - (P * V) / (newX * scale * scale);
      break;
    case 4:
      // adiabatic
      newX = event.pageX;
      newY =
        cvsHeight -
        ((cvsHeight - prevY) * ((-prevX + newX) / 2 - (c / k) * prevX)) / ((prevX - newX) / 2 - (c / k) * newX);
      break;
    default:
      // free draw
      newX = event.pageX;
      newY = event.pageY;
      break;
  }

  let dV = (newX - prevX) * scale;
  let dP = (-newY + prevY) * scale;
  calculate(P, V, dV, dP);

  pointList.push({ x: newX, y: newY });

  P = newX * scale;
  V = (cvsHeight - newY) * scale;

  clearCvs();
  drawLines();
  renderIsotherm((P * V) / k);
  updateText();

  prevX = newX;
  prevY = newY;
}

(() => {
  addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      whileMouseDown(event);
    }
  });

  addEventListener('mousedown', (event) => {
    isMouseDown = 1;
    whileMouseDown(event);
  });

  addEventListener('mouseup', () => {
    isMouseDown = 0;
  });

  addEventListener('keypress', (event) => {
    if (event.code == 'Enter') {
      whileMouseDown({
        pageX: pointList[0].x,
        pageY: pointList[0].y,
      });
    } else if (/^\d+$/.test(event.key) && 0 <= parseInt(event.key) && parseInt(event.key) <= 4) {
      drawMode = parseInt(event.key);
    }
  });
})();

const textElement = document.getElementById('text-box') as HTMLElement;
function updateText() {
  textElement.innerText =
    `P: ${Math.round(prevY * scale)}   V: ${Math.round(prevX * scale)}\n` +
    `Q in: ${Math.round(Q_in)}   Q out: ${Math.round(Q_out)}   Total Q: ${Math.round(Q_total)}\n` +
    `W in: ${Math.round(W_in)}   W out: ${Math.round(W_out)}   Total W: ${Math.round(W_total)}\n` +
    `e: ${Math.round((W_total / Q_in) * 1000) / 10}%`;
}

export { k, scale, pointList };
