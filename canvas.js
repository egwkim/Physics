const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let cvsHeight;

function resizeCvs() {
  canvas.setAttribute('width', window.innerWidth);
  canvas.setAttribute('height', window.innerHeight);
  cvsHeight = canvas.clientHeight;
  cvsWidth = canvas.clientWidth;
  try {
    drawLines();
  } catch (error) {}
}

window.onresize = resizeCvs;

resizeCvs();

ctx.strokeStyle = 'black';
ctx.lineCap = 'round';
ctx.lineWidth = '5px';

function renderIsotherm(T) {
  ctx.beginPath();
  for (let y = 0; y < cvsHeight; y++) {
    x = (k * T) / (scale * scale * (cvsHeight - y));
    if (cvsWidth < x) {
      break;
    }
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#22aa66aa';
  ctx.stroke();
}

function drawLines() {
  if (!pointList.length) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(pointList[0].x, cvsHeight - pointList[0].y);
  for (let i = 0; i < pointList.length; i++) {
    ctx.lineTo(pointList[i].x, cvsHeight - pointList[i].y);
  }
  ctx.strokeStyle = '#000000';
  ctx.stroke();
}

function clearCvs() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}
