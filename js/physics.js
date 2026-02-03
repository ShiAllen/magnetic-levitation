function getFieldAt(x, y, objects, exclude = null) {
    let bx = 0, by = 0;
    
    objects.forEach(obj => {
        if (obj === exclude || obj.isIron) return;
        const poles = obj.getPoles();
        poles.forEach(p => {
            const dx = x - p.x, dy = y - p.y;
            const softeningFactor = 400; // 20px * 20px
            const r2 = dx*dx + dy*dy + softeningFactor;
            const invR3 = 1 / (r2 * Math.sqrt(r2));
            
            const forceMag = (p.type === 'N' ? 1 : -1) * obj.strength;
            
            bx += forceMag * dx * invR3;
            by += forceMag * dy * invR3;
        });
    });
    
    return { bx, by, m: Math.sqrt(bx*bx + by*by) };
}

function applyForces(objects, mouse, selected, useGravity, dt) {
    const fScale = parseFloat(document.getElementById('forceScale').value);
    const gravity = 0.15;

    objects.forEach(obj => {
        if (mouse.down && selected === obj) {
            obj.vx = obj.vy = obj.vAng = 0;
            return;
        }

        let totalFx = 0, totalFy = 0, totalTorque = 0;

        if (!obj.isIron) {
            const poles = obj.getPoles();
            poles.forEach(p => {
                const field = getFieldAt(p.x, p.y, objects, obj);
                const sign = (p.type === 'N' ? 1 : -1);
                const fx = field.bx * sign * fScale;
                const fy = field.by * sign * fScale;
                
                totalFx += fx;
                totalFy += fy;
                
                const rx = p.x - obj.x, ry = p.y - obj.y;
                totalTorque += (rx * fy - ry * fx);
            });
        } else {
            const f = getFieldAt(obj.x, obj.y, objects);
            totalFx += f.bx * 0.5 * fScale; 
            totalFy += f.by * 0.5 * fScale;
        }

        if (useGravity) totalFy += gravity * obj.mass;

        obj.vx += (totalFx / obj.mass) * dt;
        obj.vy += (totalFy / obj.mass) * dt;
        obj.vAng += (totalTorque * 0.001 / obj.mass) * dt;
    });
}

function integrate(objects, width, height, dt) {
    const friction = parseFloat(document.getElementById('frictionRange').value);
    const angularFriction = 0.95;

    objects.forEach(obj => {
        obj.vx *= friction;
        obj.vy *= friction;
        obj.vAng *= angularFriction;

        obj.x += obj.vx * dt * 100;
        obj.y += obj.vy * dt * 100;
        obj.angle += obj.vAng * dt * 100;

        handleBoundaries(obj, width, height);
    });
}

function handleBoundaries(obj, width, height) {
    const restitution = 0.2;
    const hw = obj.w / 2, hh = obj.h / 2;
    const cos = Math.cos(obj.angle), sin = Math.sin(obj.angle);
    const boundW = Math.abs(hw * cos) + Math.abs(hh * sin);
    const boundH = Math.abs(hw * sin) + Math.abs(hh * cos);

    if (obj.y + boundH > height) { obj.y = height - boundH; obj.vy *= -restitution; }
    if (obj.y - boundH < 0) { obj.y = boundH; obj.vy *= -restitution; }
    if (obj.x + boundW > width) { obj.x = width - boundW; obj.vx *= -restitution; }
    if (obj.x - boundW < 0) { obj.x = boundW; obj.vx *= -restitution; }
}

function solveCollisions(objects) {
    for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
            checkAndResolveCollision(objects[i], objects[j]);
        }
    }
}

function checkAndResolveCollision(obj1, obj2) {
    const vertices1 = getVertices(obj1);
    const vertices2 = getVertices(obj2);
    const axes = getAxes(vertices1).concat(getAxes(vertices2));

    let minOverlap = Infinity;
    let smallestAxis = null;

    for (let i = 0; i < axes.length; i++) {
        const axis = axes[i];
        const p1 = project(vertices1, axis);
        const p2 = project(vertices2, axis);

        const overlap = Math.min(p1.max, p2.max) - Math.max(p1.min, p2.min);
        if (overlap < 0) {
            return;
        }

        if (overlap < minOverlap) {
            minOverlap = overlap;
            smallestAxis = axis;
        }
    }

    const mtv = smallestAxis;
    const centerVec = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
    if (dot(centerVec, mtv) < 0) {
        mtv.x = -mtv.x;
        mtv.y = -mtv.y;
    }
    
    const pushX = mtv.x * minOverlap * 0.5;
    const pushY = mtv.y * minOverlap * 0.5;
    
    obj1.x -= pushX;
    obj1.y -= pushY;
    obj2.x += pushX;
    obj2.y += pushY;

    const restitution = 0.1;
    const totalMass = obj1.mass + obj2.mass;
    const vdx = obj2.vx - obj1.vx;
    const vdy = obj2.vy - obj1.vy;
    const impulse = (vdx * mtv.x + vdy * mtv.y) * 1.1;

    if (impulse > 0) {
         const impulseX = mtv.x * impulse;
         const impulseY = mtv.y * impulse;
         obj1.vx += impulseX * (obj2.mass / totalMass) * restitution;
         obj1.vy += impulseY * (obj2.mass / totalMass) * restitution;
         obj2.vx -= impulseX * (obj1.mass / totalMass) * restitution;
         obj2.vy -= impulseY * (obj1.mass / totalMass) * restitution;
    }
}

function getVertices(obj) {
    const hw = obj.w / 2;
    const hh = obj.h / 2;
    const cos = Math.cos(obj.angle);
    const sin = Math.sin(obj.angle);
    
    const corners = [
        { x: -hw, y: -hh }, { x: hw, y: -hh },
        { x: hw, y: hh },   { x: -hw, y: hh }
    ];

    return corners.map(p => ({
        x: obj.x + p.x * cos - p.y * sin,
        y: obj.y + p.x * sin + p.y * cos
    }));
}

function getAxes(vertices) {
    const axes = [];
    for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[i + 1 === vertices.length ? 0 : i + 1];
        const edge = { x: p1.x - p2.x, y: p1.y - p2.y };
        const normal = { x: -edge.y, y: edge.x };
        axes.push(normalize(normal));
    }
    return axes;
}

function project(vertices, axis) {
    let min = dot(vertices[0], axis);
    let max = min;
    for (let i = 1; i < vertices.length; i++) {
        const p = dot(vertices[i], axis);
        if (p < min) {
            min = p;
        } else if (p > max) {
            max = p;
        }
    }
    return { min, max };
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function normalize(v) {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    if (len === 0) return {x: 0, y: 0};
    return { x: v.x / len, y: v.y / len };
}

function updatePhysics(isSimulating, objects, mouse, selected, useGravity, width, height) {
    if (!isSimulating) return;

    const timeStep = 1 / 60;
    const subSteps = 10;
    const subTimeStep = timeStep / subSteps;

    for (let i = 0; i < subSteps; i++) {
        applyForces(objects, mouse, selected, useGravity, subTimeStep);
        integrate(objects, width, height, subTimeStep);
        solveCollisions(objects);
    }
}

export { getFieldAt, updatePhysics };
