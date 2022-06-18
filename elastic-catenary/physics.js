class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.m = 1;
    }
    static distance(a, b) {
        return Math.pow((Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)), 0.5);
    }
    static tan(a, b) {
        return (a.y - b.y) / (a.x - b.x);
    }
    static sin(a, b) {
        return (b.y - a.y) / Point.distance(a, b);
    }
    static cos(a, b) {
        return (b.x - a.x) / Point.distance(a, b);
    }
    static applyElasticForce(a, b) {
        let F = springConstant * (Point.distance(a, b) - initLen);
        if (toggleStretchOnly)
            F = Math.max(F, 0);
        let Fx = Point.cos(a, b) * F;
        let Fy = Point.sin(a, b) * F;
        a.applyForce(Fx, Fy);
        b.applyForce(-Fx, -Fy);
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    lineTo(point) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    }
    applyForce(xForce, yForce) {
        this.vx += (xForce * dt) / this.m;
        this.vy += (yForce * dt) / this.m;
    }
    updatePos() {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }
    applyFriction() {
        this.applyForce(this.vx * -friction, this.vy * -friction);
    }
    applyGravity() {
        this.applyForce(0, this.m * gravityConstant);
    }
}
function physicsInit() {
    points = [];
    for (let i = 0; i < pointCnt; i++) {
        points[i] = new Point(i * pointDistance + 5, 5);
    }
    points[0].m = Infinity;
    points[pointCnt - 1].m = Infinity;
}
function physicsUpdate() {
    for (let i = 0; i < pointCnt - 1; i++) {
        Point.applyElasticForce(points[i], points[i + 1]);
        if (!(i == 0 || i == pointCnt - 1)) {
            points[i].applyGravity();
            points[i].applyFriction();
        }
    }
    for (let i = 0; i < pointCnt; i++) {
        points[i].updatePos();
    }
}
