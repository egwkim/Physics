import { cvsHeight, clearCvs, renderIsotherm, drawLines } from './canvas.js';
setInterval(() => { }, 100);
// PV = kT
const k = 1;
// dU = c * dT
const c = 1;
const scale = 1 / 10;
let pointList = [];
let cursorX;
let cursorY;
let isMouseDown = 0;
let Q_in = 0;
let Q_out = 0;
let Q_total = 0;
let W_in = 0;
let W_out = 0;
let W_total = 0;
function calculate(V, P, dV, dP) {
    let W = (dV * (2 * P + dP)) / 2;
    let dT = (V + dV) * (P + dP) - V * P;
    let dU = c * dT;
    let Q = dU + W;
    W_total += W;
    if (W > 0) {
        W_out += W;
    }
    else {
        W_in -= W;
    }
    Q_total += Q;
    if (Q > 0) {
        Q_in += Q;
    }
    else {
        Q_out -= Q;
    }
}
function whileMouseDown(event) {
    let P = cursorX * scale;
    let V = cursorY * scale;
    if (pointList.length) {
        let dCursorX = event.pageX - cursorX;
        let dCursorY = cvsHeight - event.pageY - cursorY;
        calculate(P, V, dCursorX * scale, dCursorY * scale);
    }
    cursorX = event.pageX;
    cursorY = cvsHeight - event.pageY;
    pointList.push({ x: cursorX, y: cursorY });
    P = cursorX * scale;
    V = cursorY * scale;
    clearCvs();
    drawLines();
    if (isMouseDown) {
        renderIsotherm((P * V) / k);
    }
    updateText();
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
                pageY: cvsHeight - pointList[0].y,
            });
        }
    });
})();
const textID = document.getElementById('text-box');
function updateText() {
    textID.innerText =
        `P: ${Math.round(cursorY * scale)}   V: ${Math.round(cursorX * scale)}\n` +
            `Q in: ${Math.round(Q_in)}   Q out: ${Math.round(Q_out)}   Total Q: ${Math.round(Q_total)}\n` +
            `W in: ${Math.round(W_in)}   W out: ${Math.round(W_out)}   Total W: ${Math.round(W_total)}\n` +
            `e: ${Math.round((W_total / Q_in) * 1000) / 10}%`;
}
export { k, scale, pointList };
