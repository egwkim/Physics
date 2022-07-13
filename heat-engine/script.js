import { cvsHeight, clearCvs, renderIsotherm, drawLines } from './canvas.js';
setInterval(() => { }, 100);
// PV = kT
let k;
// dU = c * dT
let c;
let T_h;
let T_l;
let scale = 1 / 10;
let pointList = [];
let drawMode = 0; // 0 free draw, 1 isobaric, 2 isochoric, 3 isotherm, 4 adiabatic
let prevX;
let prevY;
let P;
let V;
let isMouseDown = 0;
let Q_in = 0;
let Q_out = 0;
let Q_total = 0;
let W_in = 0;
let W_out = 0;
let W_total = 0;
function loadSettings() {
    c = Number(document.getElementById('c').value);
    k = Number(document.getElementById('k').value);
    T_h = Number(document.getElementById('T_h').value);
    T_l = Number(document.getElementById('T_l').value);
    scale = Number(document.getElementById('scale').value);
}
function clear() {
    pointList = [];
    drawMode = 0;
    prevX = 0;
    prevY = 0;
    P = 0;
    V = 0;
    isMouseDown = 0;
    Q_out = 0;
    Q_total = 0;
    W_in = 0;
    W_out = 0;
    W_total = 0;
    Q_in = 0;
    clearCvs();
    renderIsotherm(T_h, '#ff0000aa');
    renderIsotherm(T_l, '#0000ffaa');
    textElement.innerText = '';
}
function reset() {
    document.getElementById('c').value = '3';
    document.getElementById('c-range').value = '3';
    document.getElementById('k').value = '2';
    document.getElementById('k-range').value = '2';
    document.getElementById('T_h').value = '10000';
    document.getElementById('T_h-range').value = '10000';
    document.getElementById('T_l').value = '0';
    document.getElementById('T_l-range').value = '0';
    document.getElementById('scale').value = '0.1';
    document.getElementById('scale-range').value = '0.1';
    loadSettings();
    clear();
}
window.addEventListener('load', () => {
    var _a, _b;
    document.querySelectorAll('#control > div > input').forEach((item) => {
        item.addEventListener('change', () => {
            loadSettings();
            clear();
        });
    });
    (_a = document.getElementById('clear')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        clear();
    });
    (_b = document.getElementById('reset')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        reset();
    });
    reset();
});
function calculate(V, P, dV, dP) {
    let W = (dV * (2 * P + dP)) / 2;
    let dT = ((V + dV) * (P + dP) - V * P) / k;
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
    if (pointList.length == 0) {
        prevX = event.pageX;
        prevY = event.pageY;
        P = prevX * scale;
        V = (cvsHeight - prevY) * scale;
        pointList.push({ x: prevX, y: prevY });
        clearCvs();
        drawLines();
        renderIsotherm((P * V) / k);
        renderIsotherm(T_h, '#ff0000aa');
        renderIsotherm(T_l, '#0000ffaa');
        updateText();
        return;
    }
    let newX, newY, newP, newV;
    switch (drawMode) {
        case 1:
            // isobaric
            newX = event.pageX;
            newY = prevY;
            newV = newX * scale;
            newP = (cvsHeight - newY) * scale;
            if (newP * newV > k * T_h) {
                newX = (k * T_h) / (newP * scale);
            }
            else if (newP * newV < k * T_l) {
                newX = (k * T_l) / (newP * scale);
            }
            break;
        case 2:
            // isochoric
            newX = prevX;
            newY = event.pageY;
            newV = newX * scale;
            newP = (cvsHeight - newY) * scale;
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
            newV = newX * scale;
            newP = (cvsHeight - newY) * scale;
            break;
    }
    newV = newX * scale;
    newP = (cvsHeight - newY) * scale;
    if (newP * newV > k * T_h) {
        newY = cvsHeight - (k * T_h) / (newV * scale);
    }
    else if (newP * newV < k * T_l) {
        newY = cvsHeight - (k * T_l) / (newV * scale);
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
    renderIsotherm(T_h, '#ff0000aa');
    renderIsotherm(T_l, '#0000ffaa');
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
        }
        else if (/^\d+$/.test(event.key) && 0 <= parseInt(event.key) && parseInt(event.key) <= 4) {
            drawMode = parseInt(event.key);
        }
    });
})();
const textElement = document.querySelector('#text-box > p');
function updateText() {
    textElement.innerText =
        `P: ${Math.round(P)}   V: ${Math.round(V)} T: ${Math.round((P * V) / k)}\n` +
            `Q in: ${Math.round(Q_in)}   Q out: ${Math.round(Q_out)}   Total Q: ${Math.round(Q_total)}\n` +
            `W in: ${Math.round(W_in)}   W out: ${Math.round(W_out)}   Total W: ${Math.round(W_total)}\n` +
            `e: ${Math.round((W_total / Q_in) * 1000) / 10}%`;
}
export { k, scale, pointList };
