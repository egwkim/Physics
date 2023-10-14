const screenDiv = <HTMLDivElement>document.getElementById('screen');
const controlDownDiv = <HTMLDivElement>document.getElementById('control-down');
const controlRightDiv = <HTMLDivElement>(
  document.getElementById('control-right')
);

class Spaceship {
  x: number;
  y: number;
  vx: number;
  m: number;
  observer: Boolean;
  html: HTMLElement;
  constructor(x: number, y: number, vx: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.m = 1;
    this.observer = false;
    this.html = objects.spaceship.html.cloneNode(true) as HTMLElement;
    this.html.style.left = `${x}px`;
    this.html.style.top = `${y}px`;
    screenDiv.appendChild(this.html);
  }
}

class Point {
  x: number;
  y: number;
  vx: number;
  html: HTMLElement;
  constructor(x: number, y: number, vx: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.html = objects.point.html.cloneNode(true) as HTMLElement;
    this.html.style.left = `${x}px`;
    this.html.style.top = `${y}px`;
    screenDiv.appendChild(this.html);
  }
}

class LightSource {
  x: number;
  y: number;
  vx: number;
  direction: number;
  constructor(x: number, y: number, vx: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.direction = 0;
  }
}

class LightDetector {
  x: number;
  y: number;
  vx: number;
  constructor(x: number, y: number, vx: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
  }
}

class Clock {
  x: number;
  y: number;
  vx: number;
  constructor(x: number, y: number, vx: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
  }
}

const objectNameList = [
  'spaceship',
  'point',
  'light source',
  'light detector',
  'clock',
];
const objects: { [key: string]: any } = {
  spaceship: { name: 'spaceship', class: Spaceship },
  point: { name: 'point', class: Point },
  lightSource: { name: 'light source', class: LightSource },
  lightDetector: { name: 'light detector', class: LightDetector },
  clock: { name: 'clock', class: Clock },
};

let selectedObject: any = null;
let playStatus: boolean = false;

// TODO
function playPause() {}
function slower() {}
function faster() {}
function reset() {}
function clearAll() {}

function initControls() {
  const button_names = objectNameList.concat([
    'play/pause',
    'slower',
    'faster',
    'reset',
    'clear all',
  ]);
  button_names.forEach((button_name, index) => {
    const button = document.createElement('button');
    button.innerText = button_name;
    controlDownDiv.appendChild(button);
    if (index < 5) {
      button.addEventListener('click', () => {
        selectedObject = button_name;
      });
      return;
    }
    let controlFunction: () => any;
    switch (button_name) {
      case 'play/pause':
        controlFunction = playPause;
        break;
      case 'slower':
        controlFunction = slower;
        break;
      case 'faster':
        controlFunction = faster;
        break;
      case 'reset':
        controlFunction = reset;
        break;
      case 'clear all':
        controlFunction = clearAll;
        break;
      default:
    }
    button.addEventListener('click', () => {
      selectedObject = null;
      controlFunction();
    });
  });
  controlDownDiv.appendChild(document.createElement('br'));
  const mousePos = controlDownDiv.appendChild(document.createElement('p'));
  mousePos.style.color = 'white';
  screenDiv.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    mousePos.innerText = `x: ${x}px, y: ${y}px`;
  });
}

function initScreen() {
  screenDiv.addEventListener('mousedown', (e) => {
    let newObject: any;
    switch (selectedObject) {
      case 'spaceship':
        newObject = new Spaceship(e.clientX, e.clientY, 0);
        break;
      case 'point':
        newObject = new Point(e.clientX, e.clientY, 0);
        break;
      case 'light source':
        newObject = new LightSource(e.clientX, e.clientY, 0);
        break;
      case 'light detector':
        newObject = new LightDetector(e.clientX, e.clientY, 0);
        break;
      case 'clock':
        newObject = new Clock(e.clientX, e.clientY, 0);
        break;
      default:
    }
  });
}

function addObject() {}

function main() {
  Object.keys(objects).forEach((key) => {
    objects[key].html = document.querySelector(
      '#objects > .' + objects[key].name.replace(/ /g, '-')
    ) as HTMLElement;
  });
  initControls();
  initScreen();
}

main();
