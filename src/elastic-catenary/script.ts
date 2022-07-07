function init() {
  getInputValues();
  physicsInit();
}

function loop() {
  interv = setInterval(function () {
    if (updateSettings) {
      getInputValues();
      updateSettings = false;
    }

    physicsUpdate();

    clearFrame();
    let movement = 0;
    for (let i = 0; i < pointCnt; i++) {
      // draw lines and dots
      if (toggleLine && i != 0) {
        points[i].lineTo(points[i - 1]);
      }
      if (toggleCircle) {
        points[i].draw();
      }

      // calculate total movement
      if (toggleMovement) movement += (points[i].vx ** 2 + points[i].vy ** 2) ** 0.5;
    }
    // show total movement
    if (toggleMovement) {
      movementSumP.innerText = movement.toFixed(6);
      movementAvgP.innerText = (movement / pointCnt).toFixed(6);
    }
  }, 0);
}

function reset() {
  if (interv) clearInterval(interv);
  init();
  loop();
  pauseBtn.style.display = '';
  resumeBtn.style.display = 'none';
}

function clearFrame() {
  ctx.clearRect(0, 0, canvas.clientWidth + 1, canvas.clientHeight + 1);
}

function getInputValues() {
  pointCnt = Number((<HTMLInputElement>document.getElementById('point-cnt')).value);
  pointDistance = Number((<HTMLInputElement>document.getElementById('distance')).value);
  springConstant = Number((<HTMLInputElement>document.getElementById('spring-constant')).value);
  gravityConstant = Number((<HTMLInputElement>document.getElementById('gravity-constant')).value);
  initLen = Number((<HTMLInputElement>document.getElementById('initLen')).value);
  friction = Number((<HTMLInputElement>document.getElementById('friction')).value);
  dt = Number((<HTMLInputElement>document.getElementById('dt')).value);
  toggleStretchOnly = (<HTMLInputElement>document.getElementById('toggle-stretch-only')).checked;
  toggleCircle = (<HTMLInputElement>document.getElementById('toggle-circle')).checked;
  toggleLine = (<HTMLInputElement>document.getElementById('toggle-line')).checked;
  toggleMovement = (<HTMLInputElement>document.getElementById('toggle-movement')).checked;
}

function exportCoords() {
  let coords = [];
  for (let i = 0; i < pointCnt; i++) {
    coords[i] = [points[i].x - 5, points[i].y - 5];
  }
  let downloadElement = document.createElement('a');

  downloadElement.style.display = 'none';

  downloadElement.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(coords));
  downloadElement.download = 'coords.json';

  document.body.appendChild(downloadElement);
  downloadElement.click();

  document.body.removeChild(downloadElement);
}

function toggleControl(e: HTMLElement) {
  if (e.innerText == 'hide control') {
    e.innerText = 'show control';
    document.getElementById('control-panel')!.style.display = 'none';
  } else {
    e.innerText = 'hide control';
    document.getElementById('control-panel')!.style.display = '';
  }
}
