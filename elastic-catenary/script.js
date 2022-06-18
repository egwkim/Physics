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
            if (toggleMovement)
                movement += Math.pow((Math.pow(points[i].vx, 2) + Math.pow(points[i].vy, 2)), 0.5);
        }
        // show total movement
        if (toggleMovement) {
            movementSumP.innerText = movement.toFixed(6);
            movementAvgP.innerText = (movement / pointCnt).toFixed(6);
        }
    }, 0);
}
function reset() {
    if (interv)
        clearInterval(interv);
    init();
    loop();
    pauseBtn.style.display = '';
    resumeBtn.style.display = 'none';
}
function clearFrame() {
    ctx.clearRect(0, 0, canvas.clientWidth + 1, canvas.clientHeight + 1);
}
function getInputValues() {
    pointCnt = Number(document.getElementById('point-cnt').value);
    pointDistance = Number(document.getElementById('distance').value);
    springConstant = Number(document.getElementById('spring-constant').value);
    gravityConstant = Number(document.getElementById('gravity-constant').value);
    initLen = Number(document.getElementById('initLen').value);
    friction = Number(document.getElementById('friction').value);
    dt = Number(document.getElementById('dt').value);
    toggleStretchOnly = document.getElementById('toggle-stretch-only').checked;
    toggleCircle = document.getElementById('toggle-circle').checked;
    toggleLine = document.getElementById('toggle-line').checked;
    toggleMovement = document.getElementById('toggle-movement').checked;
}
function exportCoords() {
    let coords = [];
    for (let i = 0; i < pointCnt; i++) {
        coords[i] = [points[i].x - 5, points[i].y - 5];
    }
    let downloadElement = document.createElement('a');
    downloadElement.style.display = 'none';
    downloadElement.href =
        'data:text/plain;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(coords));
    downloadElement.download = 'coords.json';
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
}
function toggleControl(e) {
    if (e.innerText == 'hide control') {
        e.innerText = 'show control';
        document.getElementById('control-panel').style.display = 'none';
    }
    else {
        e.innerText = 'hide control';
        document.getElementById('control-panel').style.display = '';
    }
}
