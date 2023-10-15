const screenDiv = <HTMLDivElement>document.getElementById('screen');
const controlDownDiv = <HTMLDivElement>document.getElementById('control-down');
const controlRightDiv = <HTMLDivElement>(
  document.getElementById('control-right')
);

class Point {
  /**
   * Basic object with base properties and methods
   */
  x: number;
  y: number;
  vx: number;
  lorentzFactor!: number;
  html: HTMLElement;
  objectName: string;
  constructor(x: number, y: number, vx: number, objectName: string = 'point') {
    this.objectName = objectName;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.updateLorentzFactor();
    this.html = objectTypes[objectName].html.cloneNode(true) as HTMLElement;
    this.html.style.left = `${x * pixelInLightSecond}px`;
    this.html.style.top = `${y * pixelInLightSecond}px`;
    screenDiv.appendChild(this.html);
  }

  updateLorentzFactor() {
    const relVx = (this.vx - observerVx) / (1 - this.vx * observerVx);
    this.lorentzFactor = (1 - relVx ** 2) ** -0.5;
  }
}

class Spaceship extends Point {
  restM: number;
  length: number;
  observer: Boolean;
  constructor(x: number, y: number, vx: number) {
    super(x, y, vx, 'spaceship');
    this.restM = 1;
    this.length = 1;
    this.observer = false;
  }

  public get m(): number {
    return this.lorentzFactor * this.restM;
  }
}

class LightSource extends Point {
  direction: number;
  constructor(x: number, y: number, vx: number) {
    super(x, y, vx, 'light source');
    this.direction = 0;
  }
}

class LightDetector extends Point {
  constructor(x: number, y: number, vx: number) {
    super(x, y, vx, 'light detector');
  }
}

class Clock extends Point {
  constructor(x: number, y: number, vx: number) {
    super(x, y, vx, 'clock');
  }
}

const objectNameList = [
  'spaceship',
  'point',
  'light source',
  'light detector',
  'clock',
];
const objectTypes: {
  [key: string]: { name: string; html: HTMLElement };
} = {};
const objectList: Point[] = [];
const pixelInLightSecond = 150;

let selectedObject: any = null;
let playStatus: boolean = false;
let playSpeed: number = 1;
let observerVx = 0;
let gamma: number = 1;
let xOffset: number = 0;
let tOffset: number = 0;

function getObjectHTML(objectName: string) {
  return document.querySelector(
    '#objects > .' + objectName.toKebabCase()
  ) as HTMLElement;
}

let playInterval: number;
function setObserver() {
  let vx = Number.parseFloat(
    prompt('observer velocity', observerVx.toString()) ?? '0.5'
  );
  if (isNaN(vx)) {
    vx = 0.5;
  }
  vx = vx >= 1 ? 0.99 : vx <= -1 ? -0.99 : vx;
  observerVx = vx;
  xOffset = Number.parseFloat(prompt('x offset', xOffset.toString()) ?? '0');
  if (isNaN(xOffset)) xOffset = 0;
  tOffset = Number.parseFloat(prompt('t offset', tOffset.toString()) ?? '0');
  if (isNaN(tOffset)) tOffset = 0;

  gamma = 1 / (1 - vx ** 2) ** 0.5;

  objectList.forEach((object) => {
    object.updateLorentzFactor();
    render(0);
  });
}
function playPause() {
  if (playStatus) {
    playStatus = false;
    clearInterval(playInterval);
  } else {
    playStatus = true;
    const startTime = performance.now();
    playInterval = setInterval(() => {
      render((performance.now() - startTime) / 1000);
    }, 1000 / 60);
  }
}
function slower() {}
function faster() {}
function reset() {
  if (playStatus) {
    playPause();
  }
  render(0);
}
function clearAll() {
  objectList.forEach((object) => {
    object.html.remove();
  });
  objectList.length = 0;
}

function initControls() {
  const buttonNames = objectNameList.concat([
    'set observer',
    'play/pause',
    'slower',
    'faster',
    'reset',
    'clear all',
  ]);
  buttonNames.forEach((buttonName, index) => {
    const button = document.createElement('button');
    button.innerText = buttonName;
    controlDownDiv.appendChild(button);
    // TODO remove after implementation
    if ([2, 3, 4, 7, 8].includes(index)) {
      button.addEventListener('click', () => {
        selectedObject = null;
        alert('개발 중...');
      });
      return;
    }

    if (index < 5) {
      button.addEventListener('click', () => {
        selectedObject = buttonName.toCamelCase();
      });
      return;
    }
    let controlFunction: () => any;
    switch (buttonName) {
      case 'set observer':
        controlFunction = setObserver;
        break;
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
    const x = e.clientX / pixelInLightSecond;
    const y = e.clientY / pixelInLightSecond;
    switch (selectedObject) {
      case 'spaceship':
        let vx = Number.parseFloat(prompt() ?? '0.5');
        if (isNaN(vx)) vx = 0.5;
        vx = vx >= 1 ? 0.99 : vx <= -1 ? -0.99 : vx;
        newObject = new Spaceship(x, y, vx);
        break;
      case 'point':
        newObject = new Point(x, y, 0);
        break;
      case 'light source':
        newObject = new LightSource(x, y, 0);
        break;
      case 'light detector':
        newObject = new LightDetector(x, y, 0);
        break;
      case 'clock':
        newObject = new Clock(x, y, 0);
        break;
      default:
    }
    if (newObject) {
      objectList.push(newObject);
    }
  });
}

function render(t: number) {
  objectList.forEach((object) => {
    const originT =
      ((t + tOffset) / gamma + observerVx * object.x) /
      (1 - observerVx * object.vx);
    const x = gamma * (object.x + (object.vx - observerVx) * originT) + xOffset;
    object.html.style.left = `${x * pixelInLightSecond}px`;
    object.html.style.top = `${object.y * pixelInLightSecond}px`;
  });
}

function main() {
  objectNameList.forEach((name) => {
    objectTypes[name.toCamelCase()] = { name, html: getObjectHTML(name) };
  });
  Object.keys(objectTypes).forEach((key) => {
    objectTypes[key].html.addEventListener('click', () => {
      selectedObject = objectTypes[key].name;
    });
  });
  initControls();
  initScreen();
}

main();

export {};
