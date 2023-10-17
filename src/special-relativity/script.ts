const screenDiv = <HTMLDivElement>document.getElementById('screen');
const controlDownDiv = <HTMLDivElement>document.getElementById('control-down');
const controlRightDiv = <HTMLDivElement>(
  document.getElementById('control-right')
);
const observerControlDiv = <HTMLDivElement>(
  document.getElementById('observer-control')
);
const objectControlDiv = <HTMLDivElement>(
  document.getElementById('object-control')
);

interface Point {
  x: number;
  y: number;
  lorentzFactor: number;
  [key: string]: any;
}

class Point {
  /**
   * Basic object with base properties and methods
   */
  private _vx!: number;
  x: number;
  y: number;
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
    this.html.addEventListener('click', () => {
      selectedObject = this;
      updateRightControl();
    });
    screenDiv.appendChild(this.html);
  }

  updateLorentzFactor() {
    const relVx = (this.vx - observerVx) / (1 - this.vx * observerVx);
    this.lorentzFactor = (1 - relVx ** 2) ** -0.5;
  }

  public set vx(v: number) {
    this._vx = validateVelocity(v);
  }

  public get vx(): number {
    return this._vx;
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

let selectedObject: string | Point | null = null;
let playStatus: boolean = false;
let playSpeed: number = 1;
let observerVx = 0;
let gamma: number = 1;
let xOffset: number = 0;
let tOffset: number = 0;

function validateVelocity(velocity: number) {
  if (velocity >= 1) {
    return 0.99;
  } else if (velocity <= -1) {
    return -0.99;
  } else if (isNaN(velocity)) {
    return 0;
  } else {
    return velocity;
  }
}

function getObjectHTML(objectName: string) {
  return document.querySelector(
    '#objects > .' + objectName.toKebabCase()
  ) as HTMLElement;
}

let playInterval: number;
function setObserver() {
  objectControlDiv.style.display = 'none';
  observerControlDiv.style.display = '';

  gamma = 1 / (1 - observerVx ** 2) ** 0.5;

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

function initScreen() {
  screenDiv.addEventListener('mousedown', (e) => {
    let newObject: any;
    const x = e.clientX / pixelInLightSecond;
    const y = e.clientY / pixelInLightSecond;
    if (typeof selectedObject === 'string' || selectedObject instanceof String)
      switch (selectedObject) {
        case 'spaceship':
          newObject = new Spaceship(x, y, 0.5);
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
          selectedObject = null;
          updateRightControl();
          console.error('Unkwonw object name: ' + selectedObject);
      }
    if (newObject) {
      objectList.push(newObject);
      selectedObject = newObject;
      updateRightControl();
    }
  });
}

function initRightControl() {
  const objectControlNames = ['x', 'y', 'vx'];
  const observerControlNames = ['observer-vx', 'x-offset', 't-offset'];
  objectControlNames.forEach((controlName) => {
    const p = document.createElement('p');
    p.innerText = controlName + ': ';
    const input = document.createElement('input');
    input.type = 'number';
    input.id = controlName + '-input';
    input.addEventListener('input', () => {
      if (
        selectedObject === null ||
        typeof selectedObject === 'string' ||
        selectedObject instanceof String ||
        !(controlName in selectedObject)
      ) {
        return;
      }

      selectedObject[controlName] = validateVelocity(
        Number.parseFloat(input.value)
      );
      render(0);
    });
    p.appendChild(input);
    objectControlDiv.appendChild(p);
  });
  observerControlNames.forEach((controlName) => {
    const p = document.createElement('p');
    p.innerText = controlName + ': ';
    const input = document.createElement('input');
    input.type = 'number';
    input.id = controlName + '-input';
    switch (controlName) {
      case 'observer-vx':
        input.value = observerVx.toString();
        input.addEventListener('input', () => {
          observerVx = validateVelocity(Number.parseFloat(input.value));
          render(0);
        });
        break;
      case 'x-offset':
        input.value = xOffset.toString();
        input.addEventListener('input', () => {
          xOffset = Number.parseFloat(input.value) ?? 0;
          render(0);
        });
        break;
      case 't-offset':
        input.value = tOffset.toString();
        input.addEventListener('input', () => {
          tOffset = Number.parseFloat(input.value) ?? 0;
          render(0);
        });
        break;
    }

    p.appendChild(input);
    observerControlDiv.appendChild(p);
  });
  updateRightControl();
}

function initDownControl() {
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
        updateRightControl();
        alert('개발 중...');
      });
      return;
    }

    if (index < 5) {
      button.addEventListener('click', () => {
        selectedObject = buttonName.toCamelCase();
        updateRightControl();
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
      updateRightControl();
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

function updateRightControl() {
  if (
    selectedObject === null ||
    typeof selectedObject === 'string' ||
    selectedObject instanceof String
  ) {
    objectControlDiv.style.display = 'none';
    observerControlDiv.style.display = 'none';
    return;
  }

  observerControlDiv.style.display = 'none';
  objectControlDiv.style.display = '';

  // Fix selectedObject to avoid type errors
  const _selectedObject = selectedObject;

  const controlNames = ['x', 'y', 'vx'];
  controlNames.forEach((controlName) => {
    if (controlName in _selectedObject) {
      const input = document.getElementById(
        controlName + '-input'
      ) as HTMLInputElement;
      input.value = _selectedObject[controlName].toString();
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

function init() {
  objectNameList.forEach((name) => {
    objectTypes[name.toCamelCase()] = { name, html: getObjectHTML(name) };
  });
  Object.keys(objectTypes).forEach((key) => {
    objectTypes[key].html.addEventListener('click', () => {
      selectedObject = objectTypes[key].name;
      updateRightControl();
    });
  });
  initRightControl();
  initDownControl();
  initScreen();
}

function main() {
  init();
}

main();

export {};
