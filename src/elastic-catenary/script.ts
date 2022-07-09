// TODO Cleanup code

import { physicsInit, physicsUpdate, points } from './physics.js';

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const movementAvgP = document.getElementById('movement-avg') as HTMLElement;
const movementSumP = document.getElementById('movement-sum') as HTMLElement;
const pauseBtn = document.getElementById('pause') as HTMLElement;
const resumeBtn = document.getElementById('resume') as HTMLElement;

function resizeCvs() {
  canvas.setAttribute('width', `${window.innerWidth - 10}px`);
  canvas.setAttribute('height', `${window.innerHeight - 10}px`);
}

let interv: number;

// Physical constants
let springConstant = 1;
let initLen = 5; // Distance between two points when spring is undeformed
let gravityConstant = 1;
let friction = 0.2;
// If true, elastic force is applied only when the spring is extended (like a rubber band)
let toggleStretchOnly = false;

// Time constants
let dt = 0; // Timestep used in physics.js

// Points
let pointCnt = 50; // Total number of points
let pointDistance = 10; // Initial distance between two points

// Appearance
let toggleLine = true; // If true, draws lines between adjacent points
let toggleCircle = true; // If true, draws circle on the points
let toggleMovement = true; // If true, displays the sum of velocities

let movement; // Sum of the velocities

let updateSettings = true;

const settingInputs = document.querySelectorAll('#settings > div > input');

window.addEventListener('load', () => {
  window.onresize = resizeCvs;

  resizeCvs();
  reset();

  settingInputs.forEach((item) => {
    if (item.classList.contains('reset')) {
      item.addEventListener('change', () => {
        reset();
      });
    } else {
      item.addEventListener('change', () => {
        updateSettings = true;
      });
    }
  });

  const controlButtonElm = document.getElementById('control-button') as HTMLButtonElement;
  controlButtonElm.addEventListener('click', function () {
    toggleControl(this);
  });

  const toggleMovementElm = document.getElementById('toggle-movement') as HTMLInputElement;
  toggleMovementElm.addEventListener('change', function (this: HTMLInputElement) {
    if (this.checked) {
      (<HTMLElement>this.nextElementSibling!).style.display = '';
    } else {
      (<HTMLElement>this.nextElementSibling!).style.display = 'none';
    }
    toggleMovement = this.checked;
  });

  const puaseBtnElm = document.getElementById('pause') as HTMLButtonElement;
  pauseBtn.addEventListener('click', function () {
    clearInterval(interv);
    (<HTMLElement>this.nextElementSibling!).style.display = '';
    this.style.display = 'none';
  });

  const resumeBtnElm = document.getElementById('resume') as HTMLButtonElement;
  pauseBtn.addEventListener('click', function () {
    loop();
    (<HTMLElement>this.previousElementSibling!).style.display = '';
    this.style.display = 'none';
  });

  const exportBtnElm = document.getElementById('export') as HTMLButtonElement;
  exportBtnElm.addEventListener('click', () => {
    exportCoords();
  });
});

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

export {
  canvas,
  ctx,
  movementAvgP,
  movementSumP,
  pauseBtn,
  resumeBtn,
  reset,
  exportCoords,
  toggleControl,
  springConstant,
  initLen,
  gravityConstant,
  friction,
  toggleStretchOnly,
  dt,
  pointCnt,
  pointDistance,
  updateSettings,
};
